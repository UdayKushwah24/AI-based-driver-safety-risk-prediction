"""
WebSocket Routes — Real-time risk data push to Dashboard.
"""

import asyncio
import time

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.database.mongo import log_alert, log_analytics_prediction
from backend.services import drowsiness_service, fog_service
from backend.services.risk_engine import compute_unified_risk
from backend.utils.jwt_handler import decode_access_token
from backend.config import WEBSOCKET_PUSH_INTERVAL, FOG_POLL_INTERVAL
from backend.utils.logger import get_logger

logger = get_logger("routes.ws")
router = APIRouter()

_clients: dict[WebSocket, str] = {}
_last_alert_by_user: dict[str, float] = {}


def _extract_token(ws: WebSocket) -> str | None:
    token = ws.query_params.get("token")
    if token:
        return token

    authorization = ws.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        return authorization.split(" ", 1)[1]
    return None


def _build_signals(d_state: dict, f_state: dict) -> list[dict]:
    return [
        {
            "type": "drowsiness",
            "severity": "high" if d_state.get("drowsy") else ("medium" if d_state.get("yawning") else "low"),
            "value": bool(d_state.get("drowsy") or d_state.get("yawning")),
        },
        {
            "type": "visibility",
            "severity": "high" if f_state.get("prediction") == "Fog/Smog" else "low",
            "value": f_state.get("prediction", "unknown"),
        },
    ]


@router.websocket("/ws/live-risk")
async def websocket_risk(ws: WebSocket):
    """
    Real-time risk data stream.
    Pushes unified risk JSON to the dashboard every WEBSOCKET_PUSH_INTERVAL.
    Also periodically runs fog detection on camera frames.
    """
    token = _extract_token(ws)
    if not token:
        await ws.close(code=1008, reason="Missing auth token")
        return

    try:
        payload = decode_access_token(token)
    except Exception:
        await ws.close(code=1008, reason="Invalid auth token")
        return

    user_id = str(payload.get("sub", ""))
    if not user_id:
        await ws.close(code=1008, reason="Invalid auth token")
        return

    await ws.accept()
    _clients[ws] = user_id
    logger.info(f"WebSocket client connected user={user_id} ({len(_clients)} total)")

    fog_timer = 0.0

    try:
        while True:
            # Run fog detection on camera frame periodically
            now = time.time()
            if now - fog_timer >= FOG_POLL_INTERVAL:
                frame = drowsiness_service.get_frame()
                if frame:
                    fog_service.predict(frame, user_id="system", image_name="ws_frame.jpg")
                fog_timer = now

            # Compute unified risk
            d_state = drowsiness_service.get_state()
            f_state = fog_service.get_state()
            risk = compute_unified_risk(d_state, f_state)
            now_ts = int(time.time())
            risk_score = float(risk.get("overall_score", 0.0))
            accident_probability = round(min(0.99, max(0.01, risk_score / 100.0)), 4)
            signals = _build_signals(d_state, f_state)

            ws_message = {
                "userId": user_id,
                "riskScore": risk_score,
                "timestamp": now_ts,
                "signals": signals,
            }

            try:
                await ws.send_json(ws_message)
            except Exception:
                break

            log_analytics_prediction(
                user_id=user_id,
                risk_score=risk_score,
                accident_probability=accident_probability,
                signals=signals,
            )

            last_alert_ts = _last_alert_by_user.get(user_id, 0.0)
            if risk_score >= 80 and (time.time() - last_alert_ts) >= 15:
                log_alert(
                    user_id=user_id,
                    alert_type="risk",
                    severity="high",
                    metadata={
                        "risk_score": risk_score,
                        "accident_probability": accident_probability,
                        "signals": signals,
                    },
                )
                _last_alert_by_user[user_id] = time.time()

            await asyncio.sleep(WEBSOCKET_PUSH_INTERVAL)
    except WebSocketDisconnect:
        pass
    finally:
        if ws in _clients:
            _clients.pop(ws)
        logger.info(f"WebSocket client disconnected user={user_id} ({len(_clients)} remaining)")


@router.websocket("/ws/risk")
async def websocket_risk_legacy(ws: WebSocket):
    """Backward-compatible websocket route that forwards to the live risk handler."""
    await websocket_risk(ws)
