"""
API Routes — REST endpoints for the unified system.
"""

import io
import time

_start_time = time.time()

from fastapi import APIRouter, UploadFile, File, Response, Depends
from pydantic import BaseModel

from backend.database.mongo import (
    get_alerts,
    get_analytics_history,
    get_drowsiness_events,
    log_alert,
    log_analytics_prediction,
)
from backend.models.risk import AnalyticsHistoryResponse, RiskPredictRequest, RiskPredictResponse
from backend.services.auth_service import get_current_user
from backend.services import drowsiness_service, fog_service
from backend.services import accident_service
from backend.services.analytics_service import generate_summary
from backend.services.risk_service import predict_risk
from backend.services.risk_engine import compute_unified_risk
from backend.utils.logger import get_logger

logger = get_logger("routes.api")
router = APIRouter(prefix="/api")


@router.get("/status")
def get_status():
    """System health — reports status of all modules."""
    try:
        d_state = drowsiness_service.get_state()
        f_state = fog_service.get_state()
        risk = compute_unified_risk(d_state, f_state)
        return {
            "service": "driver-safety-system",
            "status": "online",
            "version": "2.0.0",
            "timestamp": time.time(),
            "uptime": time.time() - _start_time,
            "modules": {
                "drowsiness": {"active": d_state.get("active", False)},
                "fog": {"active": f_state.get("active", False)},
            },
            "risk_score": risk.get("overall_score", 0),
            "risk_level": risk.get("risk_level", "low"),
        }
    except Exception as e:
        logger.error(f"Status error: {e}")
        raise


@router.get("/risk")
def get_risk(user: dict = Depends(get_current_user)):
    """Unified risk assessment from all modules."""
    try:
        d_state = drowsiness_service.get_state()
        f_state = fog_service.get_state()
        result = compute_unified_risk(d_state, f_state)
        result["timestamp"] = time.time()
        return result
    except Exception as e:
        logger.error(f"Risk endpoint error: {e}")
        raise


@router.post("/risk/predict", response_model=RiskPredictResponse)
def predict_driver_risk(payload: RiskPredictRequest, user: dict = Depends(get_current_user)):
    """Predict driver risk from structured driving telemetry and persist analytics."""
    risk_score, accident_probability, signals = predict_risk(payload)

    signal_dicts = [signal.model_dump() for signal in signals]
    log_analytics_prediction(
        user_id=user["id"],
        risk_score=risk_score,
        accident_probability=accident_probability,
        signals=signal_dicts,
    )

    if risk_score >= 65:
        log_alert(
            user_id=user["id"],
            alert_type="risk",
            severity="high" if risk_score >= 80 else "medium",
            metadata={
                "risk_score": risk_score,
                "accident_probability": accident_probability,
                "signals": signal_dicts,
            },
        )

    return RiskPredictResponse(
        riskScore=risk_score,
        accidentProbability=accident_probability,
        signals=signals,
    )


@router.get("/drowsiness")
def get_drowsiness(user: dict = Depends(get_current_user)):
    """Current drowsiness/yawn detection state."""
    try:
        return drowsiness_service.get_state()
    except Exception as e:
        logger.error(f"Drowsiness endpoint error: {e}")
        raise


@router.get("/drowsiness/logs")
def get_drowsiness_logs(user: dict = Depends(get_current_user)):
    """Protected endpoint to fetch drowsiness events log."""
    try:
        return {"events": get_drowsiness_events(limit=200)}
    except Exception as e:
        logger.error(f"Drowsiness logs error: {e}")
        raise


@router.get("/fog")
def get_fog(user: dict = Depends(get_current_user)):
    """Current fog detection state."""
    try:
        return fog_service.get_state()
    except Exception as e:
        logger.error(f"Fog endpoint error: {e}")
        raise


@router.get("/frame")
def get_frame(user: dict = Depends(get_current_user)):
    """Latest webcam frame as JPEG (for testing / fog forwarding)."""
    try:
        frame = drowsiness_service.get_frame()
        if frame is None:
            return Response(status_code=503, content='{"error":"No frame available"}', media_type="application/json")
        return Response(content=frame, media_type="image/jpeg")
    except Exception as e:
        logger.error(f"Frame endpoint error: {e}")
        raise


@router.post("/fog/upload")
async def upload_fog_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    """Upload an image for fog detection (manual / testing)."""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            return {"error": "Invalid image format"}
        contents = await file.read()
        result = fog_service.predict(contents, user_id=user["id"], image_name=file.filename or "upload.jpg")
        return result
    except Exception as e:
        logger.error(f"Fog upload error: {e}")
        raise


@router.post("/fog/predict-frame")
async def predict_from_camera(user: dict = Depends(get_current_user)):
    """Grab the latest camera frame and run fog detection on it."""
    try:
        frame = drowsiness_service.get_frame()
        if frame is None:
            return {"error": "No camera frame available"}
        return fog_service.predict(frame, user_id=user["id"], image_name="camera_frame.jpg")
    except Exception as e:
        logger.error(f"Fog predict-frame error: {e}")
        raise


@router.get("/alerts")
def get_alert_history(user: dict = Depends(get_current_user)):
    """Protected endpoint for alert history table data."""
    try:
        alerts = get_alerts(user_id=user["id"], limit=200)
        return {"alerts": alerts}
    except Exception as e:
        logger.error(f"Alert history error: {e}")
        raise


@router.get("/analytics/summary")
def analytics_summary(user: dict = Depends(get_current_user)):
    """Protected endpoint for analytics summary and safety score."""
    try:
        return generate_summary(user_id=user["id"])
    except Exception as e:
        logger.error(f"Analytics summary error: {e}")
        raise


@router.get("/analytics/history", response_model=AnalyticsHistoryResponse)
def analytics_history(user: dict = Depends(get_current_user)):
    rows = get_analytics_history(user_id=user["id"], limit=500)
    history = [
        {
            "id": row["id"],
            "userId": row["user_id"],
            "riskScore": row.get("risk_score", 0.0),
            "accidentProbability": row.get("accident_probability", 0.0),
            "signals": row.get("signals", []),
            "timestamp": row.get("timestamp", ""),
        }
        for row in rows
    ]
    return AnalyticsHistoryResponse(history=history)


# ── Accident Severity Prediction ─────────────────────────────────────

class AccidentInput(BaseModel):
    State: str
    City: str
    No_of_Vehicles: int
    Road_Type: str
    Road_Surface: str
    Light_Condition: str
    Weather: str
    Casualty_Class: str
    Casualty_Sex: str
    Casualty_Age: int
    Vehicle_Type: str


@router.post("/accident/predict")
def predict_accident(data: AccidentInput, user: dict = Depends(get_current_user)):
    """Predict road accident severity using the XGBoost model."""
    try:
        result = accident_service.predict(data.model_dump())
        return result
    except Exception as e:
        logger.error(f"Accident prediction error: {e}")
        raise


@router.get("/accident/status")
def accident_status(user: dict = Depends(get_current_user)):
    """Check if accident prediction model is loaded."""
    try:
        return {"loaded": accident_service.is_loaded()}
    except Exception as e:
        logger.error(f"Accident status error: {e}")
        raise
