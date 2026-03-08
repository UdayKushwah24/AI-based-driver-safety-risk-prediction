"""
API Routes — REST endpoints for the unified system.
"""

import io
import time

_start_time = time.time()

<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, Response
from pydantic import BaseModel

from backend.services import drowsiness_service, fog_service
from backend.services import accident_service
=======
from fastapi import APIRouter, UploadFile, File, Response, Depends
from pydantic import BaseModel

from backend.database.mongo import get_alerts, get_drowsiness_events
from backend.services.auth_service import get_current_user
from backend.services import drowsiness_service, fog_service
from backend.services import accident_service
from backend.services.analytics_service import generate_summary
>>>>>>> origin/Aman
from backend.services.risk_engine import compute_unified_risk
from backend.utils.logger import get_logger

logger = get_logger("routes.api")
router = APIRouter(prefix="/api")


@router.get("/status")
def get_status():
    """System health — reports status of all modules."""
<<<<<<< HEAD
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
=======
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
        return {"error": str(e)}
>>>>>>> origin/Aman


@router.get("/risk")
def get_risk():
    """Unified risk assessment from all modules."""
<<<<<<< HEAD
    d_state = drowsiness_service.get_state()
    f_state = fog_service.get_state()
    result = compute_unified_risk(d_state, f_state)
    result["timestamp"] = time.time()
    return result
=======
    try:
        d_state = drowsiness_service.get_state()
        f_state = fog_service.get_state()
        result = compute_unified_risk(d_state, f_state)
        result["timestamp"] = time.time()
        return result
    except Exception as e:
        logger.error(f"Risk endpoint error: {e}")
        return {"error": str(e)}
>>>>>>> origin/Aman


@router.get("/drowsiness")
def get_drowsiness():
    """Current drowsiness/yawn detection state."""
<<<<<<< HEAD
    return drowsiness_service.get_state()


@router.get("/fog")
def get_fog():
    """Current fog detection state."""
    return fog_service.get_state()
=======
    try:
        return drowsiness_service.get_state()
    except Exception as e:
        logger.error(f"Drowsiness endpoint error: {e}")
        return {"error": str(e)}


@router.get("/drowsiness/logs")
def get_drowsiness_logs(user: dict = Depends(get_current_user)):
    """Protected endpoint to fetch drowsiness events log."""
    try:
        return {"events": get_drowsiness_events(limit=200)}
    except Exception as e:
        logger.error(f"Drowsiness logs error: {e}")
        return {"error": str(e)}


@router.get("/fog")
def get_fog(user: dict = Depends(get_current_user)):
    """Current fog detection state."""
    try:
        return fog_service.get_state()
    except Exception as e:
        logger.error(f"Fog endpoint error: {e}")
        return {"error": str(e)}
>>>>>>> origin/Aman


@router.get("/frame")
def get_frame():
    """Latest webcam frame as JPEG (for testing / fog forwarding)."""
<<<<<<< HEAD
    frame = drowsiness_service.get_frame()
    if frame is None:
        return Response(status_code=503, content="No frame available")
    return Response(content=frame, media_type="image/jpeg")


@router.post("/fog/upload")
async def upload_fog_image(file: UploadFile = File(...)):
    """Upload an image for fog detection (manual / testing)."""
    try:
        contents = await file.read()
        result = fog_service.predict(contents)
        return result
    except Exception as e:
        logger.error(f"Fog upload error: {e}")
        return {"error": str(e), "active": False}


@router.post("/fog/predict-frame")
async def predict_from_camera():
    """Grab the latest camera frame and run fog detection on it."""
    frame = drowsiness_service.get_frame()
    if frame is None:
        return {"active": False, "error": "No camera frame available"}
    return fog_service.predict(frame)
=======
    try:
        frame = drowsiness_service.get_frame()
        if frame is None:
            return Response(status_code=503, content='{"error":"No frame available"}', media_type="application/json")
        return Response(content=frame, media_type="image/jpeg")
    except Exception as e:
        logger.error(f"Frame endpoint error: {e}")
        return {"error": str(e)}


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
        return {"error": str(e)}


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
        return {"error": str(e)}


@router.get("/alerts")
def get_alert_history(user: dict = Depends(get_current_user)):
    """Protected endpoint for alert history table data."""
    try:
        alerts = get_alerts(user_id=user["id"], limit=200)
        return {"alerts": alerts}
    except Exception as e:
        logger.error(f"Alert history error: {e}")
        return {"error": str(e)}


@router.get("/analytics/summary")
def analytics_summary(user: dict = Depends(get_current_user)):
    """Protected endpoint for analytics summary and safety score."""
    try:
        return generate_summary(user_id=user["id"])
    except Exception as e:
        logger.error(f"Analytics summary error: {e}")
        return {"error": str(e)}
>>>>>>> origin/Aman


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
def predict_accident(data: AccidentInput):
    """Predict road accident severity using the XGBoost model."""
<<<<<<< HEAD
    result = accident_service.predict(data.model_dump())
    return result
=======
    try:
        result = accident_service.predict(data.model_dump())
        return result
    except Exception as e:
        logger.error(f"Accident prediction error: {e}")
        return {"error": str(e)}
>>>>>>> origin/Aman


@router.get("/accident/status")
def accident_status():
    """Check if accident prediction model is loaded."""
<<<<<<< HEAD
    return {"loaded": accident_service.is_loaded()}
=======
    try:
        return {"loaded": accident_service.is_loaded()}
    except Exception as e:
        logger.error(f"Accident status error: {e}")
        return {"error": str(e)}
>>>>>>> origin/Aman
