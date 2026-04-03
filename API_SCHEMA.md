"""
API Schema Documentation & Quick Reference

Complete specification of all endpoints, request/response formats.
"""

# ════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION ENDPOINTS
# ════════════════════════════════════════════════════════════════════════════

ENDPOINTS = {
    # ── AUTH ──
    "POST /auth/register": {
        "desc": "Register a new user account",
        "protected": False,
        "request": {
            "name": "John Driver",
            "email": "driver@example.com",
            "password": "SecurePass123!",
        },
        "response_200": {
            "message": "User registered successfully",
            "user": {
                "id": "user_id",
                "name": "John Driver",
                "email": "driver@example.com",
            },
        },
        "response_409": {
            "error": "http_exception",
            "message": "Email already registered",
        },
    },
    
    "POST /auth/login": {
        "desc": "Login and receive JWT access token",
        "protected": False,
        "request": {
            "email": "driver@example.com",
            "password": "SecurePass123!",
        },
        "response_200": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "user": {
                "id": "user_id",
                "name": "John Driver",
                "email": "driver@example.com",
            },
        },
        "response_401": {
            "error": "http_exception",
            "message": "Invalid email or password",
        },
    },
    
    "POST /auth/forgot-password": {
        "desc": "Request OTP for password reset",
        "protected": False,
        "request": {
            "email": "driver@example.com",
        },
        "response_200": {
            "message": "If that email is registered, an OTP has been sent.",
        },
    },
    
    "POST /auth/verify-otp": {
        "desc": "Verify OTP code validity",
        "protected": False,
        "request": {
            "email": "driver@example.com",
            "otp_code": "123456",
        },
        "response_200": {
            "message": "OTP verified successfully",
            "valid": True,
        },
    },
    
    "POST /auth/reset-password": {
        "desc": "Reset password using verified OTP",
        "protected": False,
        "request": {
            "email": "driver@example.com",
            "otp_code": "123456",
            "new_password": "NewSecurePass456!",
        },
        "response_200": {
            "message": "Password reset successfully",
        },
    },
    
    # ── HEALTH & STATUS ──
    "GET /api/status": {
        "desc": "System health check",
        "protected": False,
        "response_200": {
            "service": "driver-safety-system",
            "status": "online",
            "version": "2.0.0",
            "uptime_seconds": 3600,
            "modules": {
                "drowsiness": {"active": True, "status": "running"},
                "fog": {"active": True, "status": "ready"},
                "database": {"status": "connected"},
            },
            "risk_score": 35.5,
            "risk_level": "moderate",
        },
    },
    
    # ── REAL-TIME RISK ──
    "GET /api/risk": {
        "desc": "Get unified driver risk assessment",
        "protected": False,
        "response_200": {
            "overall_score": 65.5,
            "risk_level": "high",
            "drowsiness": {
                "active": True,
                "risk_score": 45.0,
                "drowsy": False,
                "yawning": False,
                "ear": 0.28,
            },
            "fog": {
                "active": True,
                "risk_score": 85.0,
                "prediction": "Fog/Smog",
                "confidence": 92.5,
            },
            "active_modules": 2,
            "weights": {
                "drowsiness": 0.6,
                "fog": 0.4,
            },
        },
    },
    
    "GET /api/drowsiness": {
        "desc": "Get current drowsiness detection state",
        "protected": False,
        "response_200": {
            "active": True,
            "drowsy": False,
            "yawning": False,
            "ear": 0.28,
            "consecutive_frames": 5,
        },
    },
    
    "GET /api/fog": {
        "desc": "Get current fog detection state",
        "protected": True,
        "response_200": {
            "active": True,
            "prediction": "Clear",
            "confidence": 92.5,
        },
    },
    
    "GET /api/frame": {
        "desc": "Get latest webcam frame as JPEG",
        "protected": False,
        "response_200": "Binary JPEG image data",
        "response_content_type": "image/jpeg",
    },
    
    # ── FOG DETECTION ──
    "POST /api/fog/upload": {
        "desc": "Upload image for fog detection",
        "protected": True,
        "request": "multipart/form-data: file (image)",
        "response_200": {
            "prediction": "Clear",
            "confidence": 87.3,
            "user_id": "user123",
            "filename": "image.jpg",
        },
    },
    
    "POST /api/fog/predict-frame": {
        "desc": "Run fog detection on current camera frame",
        "protected": True,
        "response_200": {
            "prediction": "Clear",
            "confidence": 91.2,
            "user_id": "user123",
            "filename": "camera_frame.jpg",
        },
    },
    
    # ── HISTORY ──
    "GET /api/drowsiness/logs": {
        "desc": "Get drowsiness event history",
        "protected": True,
        "query_params": {
            "limit": "Number of events (1-1000, default 200)",
        },
        "response_200": {
            "events": [
                {
                    "user_id": "user123",
                    "event_type": "drowsiness_alert",
                    "ear_value": 0.18,
                    "consecutive_frames": 22,
                    "timestamp": 1234567890.5,
                },
            ],
            "count": 150,
        },
    },
    
    "GET /api/alerts": {
        "desc": "Get alert history",
        "protected": True,
        "query_params": {
            "limit": "Number of alerts (1-1000, default 200)",
        },
        "response_200": {
            "alerts": [
                {
                    "user_id": "user123",
                    "alert_type": "critical_drowsiness",
                    "severity": "high",
                    "message": "Driver is drowsy...",
                    "timestamp": 1234567890.5,
                    "acknowledged": False,
                },
            ],
            "count": 15,
            "unacknowledged_count": 3,
        },
    },
    
    # ── ANALYTICS ──
    "GET /api/analytics/summary": {
        "desc": "Get safety analytics summary",
        "protected": True,
        "response_200": {
            "user_id": "user123",
            "safety_score": 85.5,
            "total_events": 245,
            "drowsiness_events": 18,
            "fog_events": 5,
            "critical_alerts": 2,
            "average_risk": 35.2,
            "peak_risk": 92.0,
        },
    },
    
    # ── ACCIDENT PREDICTION ──
    "POST /api/accident/predict": {
        "desc": "Predict road accident severity",
        "protected": False,
        "request": {
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
        },
        "response_200": {
            "prediction": "Serious",
            "probability": 0.92,
            "confidence": "high",
            "risk_level": "high",
        },
    },
    
    "GET /api/accident/status": {
        "desc": "Check if accident model is loaded",
        "protected": False,
        "response_200": {
            "loaded": True,
            "model_type": "XGBoost",
            "version": "1.0.0",
        },
    },
}

# ════════════════════════════════════════════════════════════════════════════
# WEBSOCKET ENDPOINTS
# ════════════════════════════════════════════════════════════════════════════

WEBSOCKETS = {
    "WS /ws/risk": {
        "desc": "Real-time risk data stream",
        "push_frequency": "1 Hz (every 1 second)",
        "message_format": {
            "overall_score": 65.5,
            "risk_level": "high",
            "drowsiness": {
                "active": True,
                "risk_score": 45.0,
                "drowsy": False,
                "yawning": False,
                "ear": 0.28,
            },
            "fog": {
                "active": True,
                "risk_score": 85.0,
                "prediction": "Fog/Smog",
                "confidence": 92.5,
            },
            "timestamp": 1694000000,
        },
    },
}

# ════════════════════════════════════════════════════════════════════════════
# ERROR RESPONSES (COMMON)
# ════════════════════════════════════════════════════════════════════════════

ERROR_RESPONSES = {
    "400_bad_request": {
        "error": "validation_error",
        "message": "Request validation failed",
        "status_code": 400,
    },
    "401_unauthorized": {
        "error": "unauthorized",
        "message": "Invalid or missing authentication token",
        "status_code": 401,
    },
    "403_forbidden": {
        "error": "forbidden",
        "message": "You don't have permission to access this resource",
        "status_code": 403,
    },
    "404_not_found": {
        "error": "not_found",
        "message": "Requested resource not found",
        "status_code": 404,
    },
    "422_validation_error": {
        "error": "validation_error",
        "message": "Request validation failed",
        "details": [
            {
                "field": "email",
                "error": "Invalid email format",
                "type": "value_error",
            },
        ],
        "status_code": 422,
    },
    "429_rate_limit": {
        "error": "rate_limit_exceeded",
        "message": "Too many requests",
        "retry_after": 60,
        "status_code": 429,
    },
    "500_server_error": {
        "error": "internal_server_error",
        "message": "An unexpected error occurred",
        "status_code": 500,
    },
}

print(__doc__)
print("\nTotal Endpoints:", len(ENDPOINTS))
print("WebSocket Connections:", len(WEBSOCKETS))
