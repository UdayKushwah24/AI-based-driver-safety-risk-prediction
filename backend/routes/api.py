"""
API Routes — REST endpoints for the unified system.
"""

import io
import time

_start_time = time.time()

from fastapi import APIRouter, UploadFile, File, Response
from pydantic import BaseModel

from backend.services import drowsiness_service, fog_service
from backend.services import accident_service
from backend.services.risk_engine import compute_unified_risk
from backend.utils.logger import get_logger

logger = get_logger("routes.api")
router = APIRouter(prefix="/api")


@router.get("/status")
def get_status():
    """System health — reports status of all modules."""
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


@router.get("/risk")
def get_risk():
    """Unified risk assessment from all modules."""
    d_state = drowsiness_service.get_state()
    f_state = fog_service.get_state()
    result = compute_unified_risk(d_state, f_state)
    result["timestamp"] = time.time()
    return result


@router.get("/drowsiness")
def get_drowsiness():
    """Current drowsiness/yawn detection state."""
    return drowsiness_service.get_state()


@router.get("/fog")
def get_fog():
    """Current fog detection state."""
    return fog_service.get_state()


@router.get("/frame")
def get_frame():
    """Latest webcam frame as JPEG (for testing / fog forwarding)."""
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
    result = accident_service.predict(data.model_dump())
    return result


@router.get("/accident/status")
def accident_status():
    """Check if accident prediction model is loaded."""
    return {"loaded": accident_service.is_loaded()}
