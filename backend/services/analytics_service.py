"""Analytics service for safety summary and scoring."""

from datetime import datetime, timezone

from backend.database.mongo import get_db


def _start_of_day_utc() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def generate_summary(user_id: str) -> dict:
    db = get_db()
    if db is None:
        return {
            "drowsiness_today": 0,
            "yawning_events": 0,
            "fog_alerts": 0,
            "safety_score": 100,
        }

    start_of_day = _start_of_day_utc()

    drowsiness_today = db["drowsiness_events"].count_documents({"timestamp": {"$gte": start_of_day}})
    yawning_events = db["drowsiness_events"].count_documents(
        {"timestamp": {"$gte": start_of_day}, "yawning_detected": True}
    )
    fog_alerts = db["alerts"].count_documents(
        {"timestamp": {"$gte": start_of_day}, "alert_type": "fog", "user_id": str(user_id)}
    )

    fog_cursor = db["fog_predictions"].find({"timestamp": {"$gte": start_of_day}}, {"fog_probability": 1})
    fog_probs = [float(row.get("fog_probability", 0.0)) for row in fog_cursor]
    avg_fog_prob = sum(fog_probs) / len(fog_probs) if fog_probs else 0.0

    risk_score = (drowsiness_today * 5) + (yawning_events * 3) + (avg_fog_prob * 10)
    safety_score = int(round(_clamp(100 - risk_score, 0, 100)))

    return {
        "drowsiness_today": int(drowsiness_today),
        "yawning_events": int(yawning_events),
        "fog_alerts": int(fog_alerts),
        "safety_score": safety_score,
    }
