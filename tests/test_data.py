"""
Test data and fixtures for the AI Driver Safety System.

Use these sample data to test endpoints without a real camera/ML models.
"""

# ────────────────────────────────────────────────────────────────────

# USER REGISTRATION/LOGIN TEST DATA
TEST_USER = {
    "name": "John Driver",
    "email": "driver@example.com",
    "password": "SafePassword123!",
}

# VALID ACCIDENT PREDICTION TEST CASE
TEST_ACCIDENT_INPUT = {
    "State": "California",
    "City": "Los Angeles",
    "No_of_Vehicles": 2,
    "Road_Type": "Highway",
    "Road_Surface": "Asphalt",
    "Light_Condition": "Day",
    "Weather": "Clear",
    "Casualty_Class": "Driver",
    "Casualty_Sex": "M",
    "Casualty_Age": 35,
    "Vehicle_Type": "Car",
}

# MOCK DROWSINESS DETECTION STATE
MOCK_DROWSINESS_STATE = {
    "active": True,
    "drowsy": False,
    "yawning": False,
    "ear": 0.32,
    "consecutive_frames": 5,
    "timestamp": 1694000000,
}

# MOCK FOG DETECTION STATE
MOCK_FOG_STATE = {
    "active": True,
    "prediction": "Clear",
    "confidence": 92.5,
    "timestamp": 1694000000,
}

# MOCK UNIFIED RISK RESPONSE
MOCK_RISK_RESPONSE = {
    "overall_score": 25.5,
    "risk_level": "low",
    "drowsiness": {
        "active": True,
        "risk_score": 15.0,
        "drowsy": False,
        "yawning": False,
        "ear": 0.32,
    },
    "fog": {
        "active": True,
        "risk_score": 7.5,
        "prediction": "Clear",
        "confidence": 92.5,
    },
    "active_modules": 2,
    "weights": {
        "drowsiness": 0.6,
        "fog": 0.4,
    },
    "timestamp": 1694000000,
}

# ANALYTICS SUMMARY TEST DATA
MOCK_ANALYTICS_SUMMARY = {
    "user_id": "user_123",
    "safety_score": 85,
    "total_events": 245,
    "drowsiness_events": 18,
    "fog_events": 5,
    "critical_alerts": 2,
    "average_risk": 35.2,
    "peak_risk": 92.0,
    "last_active": 1694000000,
    "driving_sessions": 42,
    "total_drive_time_hours": 156.5,
    "timestamp": 1694000000,
}

# ALERT HISTORY TEST DATA
MOCK_ALERTS = [
    {
        "id": "alert_001",
        "user_id": "user_123",
        "alert_type": "drowsiness_alert",
        "severity": "high",
        "message": "Driver is drowsy - take immediate action",
        "timestamp": 1694000000,
        "acknowledged": False,
    },
    {
        "id": "alert_002",
        "user_id": "user_123",
        "alert_type": "fog",
        "severity": "medium",
        "message": "Reduced visibility detected - reduce speed",
        "timestamp": 1693999000,
        "acknowledged": True,
    },
]

# DROWSINESS EVENTS LOG
MOCK_DROWSINESS_EVENTS = [
    {
        "id": "event_001",
        "user_id": "user_123",
        "event_type": "drowsiness_alert",
        "ear_value": 0.18,
        "consecutive_frames": 22,
        "timestamp": 1694000000,
    },
    {
        "id": "event_002",
        "user_id": "user_123",
        "event_type": "yawning_alert",
        "ear_value": 0.28,
        "consecutive_frames": 2,
        "timestamp": 1693999500,
    },
]

# HTTP STATUS CODES AND COMMON RESPONSES
HTTP_RESPONSES = {
    "200_ok": {
        "status": "success",
        "data": {},
        "message": "Request successful",
    },
    "201_created": {
        "status": "success",
        "data": {"id": "new_resource_id"},
        "message": "Resource created",
    },
    "400_bad_request": {
        "error": "validation_error",
        "message": "Invalid request parameters",
        "status_code": 400,
    },
    "401_unauthorized": {
        "error": "unauthorized",
        "message": "Invalid or missing authentication token",
        "status_code": 401,
    },
    "404_not_found": {
        "error": "not_found",
        "message": "Requested resource does not exist",
        "status_code": 404,
    },
    "422_unprocessable": {
        "error": "validation_error",
        "message": "Request validation failed",
        "status_code": 422,
        "details": [
            {
                "field": "email",
                "error": "Invalid email format",
                "type": "value_error",
            }
        ],
    },
    "500_server_error": {
        "error": "internal_server_error",
        "message": "An unexpected error occurred",
        "status_code": 500,
    },
    "503_unavailable": {
        "error": "service_unavailable",
        "message": "Service is temporarily unavailable",
        "status_code": 503,
    },
}
