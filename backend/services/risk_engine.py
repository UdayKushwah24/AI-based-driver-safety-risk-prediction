"""
Unified Driver Risk Score Engine.

Combines outputs from drowsiness detection and fog detection
into a single risk assessment.

Risk Levels:
    0–30   → Low      (Green)
   31–60   → Moderate (Yellow)
   61–80   → High     (Orange)
   81–100  → Critical (Red)

Weighting:
    60% drowsiness (immediate driver safety)
    40% fog        (environmental hazard)
"""

from backend.config import DROWSINESS_WEIGHT, FOG_WEIGHT, EYE_AR_THRESH
from backend.utils.logger import get_logger

logger = get_logger("risk_engine")


def calculate_drowsiness_risk(state: dict) -> float:
    """Risk score (0–100) from drowsiness detection state."""
    if not state or not state.get("active"):
        return 0.0
    if state.get("drowsy"):
        return 90.0
    if state.get("yawning"):
        return 55.0
    ear = state.get("ear", 0.30)
    if ear > 0 and ear < 0.30:
        return min(45.0, 25.0 + (0.30 - ear) * 400)
    return 10.0


def calculate_fog_risk(state: dict) -> float:
    """Risk score (0–100) from fog detection state."""
    if not state or not state.get("active"):
        return 0.0
    if state.get("prediction") == "Fog/Smog":
        return min(95.0, state.get("confidence", 50.0))
    else:
        return max(5.0, 100.0 - state.get("confidence", 50.0))


def get_risk_level(score: float) -> str:
    """Classify numeric risk into named level."""
    if score >= 80:
        return "critical"
    if score >= 60:
        return "high"
    if score >= 35:
        return "moderate"
    return "low"


def compute_unified_risk(drowsiness_state: dict, fog_state: dict) -> dict:
    """
    Compute the unified Driver Risk Score.
    
    Returns comprehensive risk assessment dict.
    """
    d_risk = calculate_drowsiness_risk(drowsiness_state)
    f_risk = calculate_fog_risk(fog_state)

    d_active = bool(drowsiness_state and drowsiness_state.get("active"))
    f_active = bool(fog_state and fog_state.get("active"))

    if d_active and f_active:
        unified = d_risk * DROWSINESS_WEIGHT + f_risk * FOG_WEIGHT
    elif d_active:
        unified = d_risk
    elif f_active:
        unified = f_risk
    else:
        unified = 0.0

    unified = min(100.0, unified)

    return {
        "overall_score": round(unified, 1),
        "risk_level": get_risk_level(unified),
        "drowsiness": {
            "active": d_active,
            "risk_score": round(d_risk, 1),
            "drowsy": drowsiness_state.get("drowsy", False) if d_active else False,
            "yawning": drowsiness_state.get("yawning", False) if d_active else False,
            "ear": drowsiness_state.get("ear", 0) if d_active else None,
        },
        "fog": {
            "active": f_active,
            "risk_score": round(f_risk, 1),
            "prediction": fog_state.get("prediction", "N/A") if f_active else "N/A",
            "confidence": fog_state.get("confidence", 0) if f_active else None,
        },
        "active_modules": int(d_active) + int(f_active),
    }
