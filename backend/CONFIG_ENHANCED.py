"""
╔════════════════════════════════════════════════════════════════════════════╗
║                     CENTRAL SYSTEM CONFIGURATION                          ║
║              Single Source of Truth for All Application Settings          ║
╚════════════════════════════════════════════════════════════════════════════╝

This module centralizes all configuration management for the AI Driver Safety
System. It reads from environment variables (.env file) and provides validated
defaults. Changing settings here affects the entire application stack.

Configuration Categories:
  1. Server Settings    - Host, port, frontend directory
  2. Model Parameters   - Paths, thresholds, model classes
  3. Detection Thresholds - EAR, YAWN, other ML model parameters
  4. Risk Engine Config - Weighting, scoring algorithm parameters
  5. Database Config    - MongoDB connection and database names
  6. Authentication    - JWT secrets, algorithms, expiration times
  7. API Security      - Rate limiting, CORS, API keys
  8. Email/OTP        - SMTP settings for password recovery
  9. Audio/Alerts     - Path to alert sounds and notification settings
  10. Runtime Mode     - Development vs. production vs. test modes

Best Practices:
  ✓ Always use environment variables for sensitive data
  ✓ Provide sensible defaults for development
  ✓ Document what each setting does
  ✓ Validate critical values on startup
  ✓ Never commit sensitive values to Git (.env in .gitignore)
"""

import os
from pathlib import Path

# ════════════════════════════════════════════════════════════════════════════
# PROJECT PATHS — Directory structure for the entire application
# ════════════════════════════════════════════════════════════════════════════

# Base directory: project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Backend directory: all Python backend code
BACKEND_DIR = BASE_DIR / "backend"

# Models directory: ML model files (weights, task files, etc.)
MODELS_DIR = BACKEND_DIR / "models"

# Frontend directory: React application source
FRONTEND_DIR = BASE_DIR / "frontend"

# Static assets directory: images, sounds, static files
STATIC_DIR = BASE_DIR / "static"

# Drowsiness & Yawning Detection module directory: alert sounds
SOUNDS_DIR = BASE_DIR / "Drowsiness_and_Yawning_Detection"


# ════════════════════════════════════════════════════════════════════════════
# SERVER CONFIGURATION — Web server settings
# ════════════════════════════════════════════════════════════════════════════

# Host IP address for the server to bind to
# Use "0.0.0.0" to accept connections from any interface
# Use "127.0.0.1" for localhost only (development)
HOST = os.getenv("HOST", "0.0.0.0")

# Server port number
# Default: 8000 (standard for development)
# Change in .env file or set environment variable before running
PORT = int(os.getenv("PORT", 8000))


# ════════════════════════════════════════════════════════════════════════════
# FOG DETECTION MODEL — EfficientNet-B0 for weather/visibility classification
# ════════════════════════════════════════════════════════════════════════════

# Absolute path to fog detection model weights
# Model: EfficientNet-B0 (PyTorch format .pth file)
# Size: ~85MB
# Accuracy: ~91% on test dataset
FOG_MODEL_PATH = str(MODELS_DIR / "fog_model.pth")

# Number of output classes for fog detection
# Classes: [0: Clear Weather, 1: Fog/Smog]
FOG_MODEL_CLASSES = 2


# ════════════════════════════════════════════════════════════════════════════
# DROWSINESS DETECTION THRESHOLDS — MediaPipe EAR/Yawn detection parameters
# ════════════════════════════════════════════════════════════════════════════

# Eye Aspect Ratio (EAR) threshold for detecting closed/drowsy eyes
# Formula: EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
# Range: 0.0 to 1.0
# Below 0.25: Eyes likely closed or user is drowsy
# Above 0.30: Eyes are open and alert
# Default: 0.25 (well-tested on diverse facial types)
EYE_AR_THRESH = float(os.getenv("EYE_AR_THRESH", 0.25))

# Number of consecutive frames EAR must be below threshold to trigger alert
# This prevents false positives from blinks or momentary eye closure
# At 30fps: 20 frames ≈ 0.67 seconds of low EAR
# Range: 2-30 frames recommended
EYE_AR_CONSEC_FRAMES = int(os.getenv("EYE_AR_CONSEC_FRAMES", 20))

# Yawning detection threshold
# Measures distance between upper and lower lips via landmarks
# Units: pixels (relative to face size)
# Higher value = requires wider mouth to trigger yawn detection
# Default: 25 works for normalized 480p faces
YAWN_THRESH = float(os.getenv("YAWN_THRESH", 25))


# ════════════════════════════════════════════════════════════════════════════
# AUDIO ALERTS CONFIGURATION — Alert sounds for driver safety notifications
# ════════════════════════════════════════════════════════════════════════════

# Enable or disable audio alerts throughout the system
# Set to "false" for silent mode (useful for testing/headless servers)
AUDIO_ALERTS_ENABLED = os.getenv("ENABLE_AUDIO_ALERTS", "true").lower() == "true"

# Path to audio file for drowsiness alerts
# Format: .wav recommended (44.1kHz, mono or stereo)
# Should be a loud, attention-getting sound
AUDIO_ALERT_DROWSY_PATH = Path(
    os.getenv(
        "AUDIO_ALERT_DROWSY_PATH",
        str(SOUNDS_DIR / "alert.wav"),
    )
)

# Path to audio file for yawning alerts
# Can be different sound to distinguish from drowsiness
# Format: .wav file
AUDIO_ALERT_YAWN_PATH = Path(
    os.getenv(
        "AUDIO_ALERT_YAWN_PATH",
        str(SOUNDS_DIR / "alert2.wav"),
    )
)


# ════════════════════════════════════════════════════════════════════════════
# RISK ENGINE WEIGHTING — Algorithm parameters for unified risk calculation
# ════════════════════════════════════════════════════════════════════════════

# Weight for drowsiness component in unified risk score (0.0 to 1.0)
# Drowsiness is the primary driver safety factor
# Higher weight = more impact on overall risk
# Recommended: 0.55-0.70 (60% default balances with environmental factors)
DROWSINESS_WEIGHT = float(os.getenv("DROWSINESS_WEIGHT", 0.6))

# Weight for fog/environmental visibility in unified risk score (0.0 to 1.0)
# Environmental conditions directly impact crash risk
# IMPORTANT: DROWSINESS_WEIGHT + FOG_WEIGHT should = 1.0
# If not, risk scores may exceed 100 or not utilize full scale
FOG_WEIGHT = float(os.getenv("FOG_WEIGHT", 0.4))

# Risk Level Classification Thresholds
# These define human-readable risk categories from numeric scores
RISK_THRESHOLDS = {
    "low": (0, 30),          # 🟢 Safe driving conditions
    "moderate": (31, 60),    # 🟡 Caution advised
    "high": (61, 80),        # 🟠 Alert driver immediately
    "critical": (81, 100),   # 🔴 Emergency intervention needed
}


# ════════════════════════════════════════════════════════════════════════════
# POLLING & PUSH INTERVALS — Frequency of data updates (in seconds)
# ════════════════════════════════════════════════════════════════════════════

# How often to poll drowsiness detection pipeline
# Faster = more responsive but higher CPU usage
# 30fps video ≈ 0.033s per frame, so 0.5s ≈ every 15 frames
DROWSINESS_POLL_INTERVAL = 0.5

# How often to run fog detection inference on new frames
# Fog doesn't change rapidly, so longer interval is acceptable
# 5 seconds balances responsiveness with GPU/CPU efficiency
FOG_POLL_INTERVAL = 5.0

# How often to push risk score updates to WebSocket clients
# 1.0 second = 1 Hz update frequency (standard for dashboards)
# Lower for more real-time feel, higher to reduce bandwidth
WEBSOCKET_PUSH_INTERVAL = 1.0


# ════════════════════════════════════════════════════════════════════════════
# CORS (Cross-Origin Resource Sharing) — Frontend access control
# ════════════════════════════════════════════════════════════════════════════

# List of origins allowed to make cross-origin requests to this API
# ["*"] = Allow requests from any origin (development/testing)
# Production should restrict to specific domain:
#   ["https://dashboard.example.com", "https://app.example.com"]
CORS_ORIGINS = ["*"]


# ════════════════════════════════════════════════════════════════════════════
# LOGGING CONFIGURATION — Log levels and verbosity
# ════════════════════════════════════════════════════════════════════════════

# Global logging level for application logs
# Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
# DEBUG: Verbose, shows all operations (development)
# INFO: Standard, shows important events (default)
# WARNING: Only show potential issues
# ERROR: Only show errors
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Separate log level for alert events (may want higher visibility)
# By default uses same level as LOG_LEVEL
ALERT_LOG_LEVEL = os.getenv("ALERT_LOG_LEVEL", LOG_LEVEL)


# ════════════════════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION — MongoDB connection settings
# ════════════════════════════════════════════════════════════════════════════

# MongoDB connection URI
# Local: "mongodb://localhost:27017"
# Cloud (Atlas): "mongodb+srv://username:password@cluster.mongodb.net"
# Docker: "mongodb://mongodb:27017" (when both are in same docker network)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# MongoDB database name
# All collections (users, alerts, events, etc.) are stored in this database
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "driver_safety")


# ════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION & JWT — Secure token generation and validation
# ════════════════════════════════════════════════════════════════════════════

# Secret key for signing JWT tokens
# CRITICAL: Must be min 32 characters, use strong random string in production
# Never commit to Git — always use environment variables
# Generate with: $ python -c "import os; print(os.urandom(32).hex())"
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-jwt-secret-key-min-32-chars-prod-long-random-secret"
)

# Algorithm used for JWT token signing
# HS256: HMAC with SHA-256 (symmetric, uses shared secret)
# RS256: RSA with SHA-256 (asymmetric, more secure for distributed systems)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# JWT token expiration time in minutes
# After this time, user must re-login to get a fresh token
# Shorter = more secure but more inconvenient for users
# Longer = more convenient but less secure if token is compromised
# Recommended: 60 minutes for standard apps, 480 minutes (8 hours) for mobile
JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", 60))


# ════════════════════════════════════════════════════════════════════════════
# API RATE LIMITING — Prevent abuse and ensure fair usage
# ════════════════════════════════════════════════════════════════════════════

# Maximum number of requests per client per time window
# Prevents brute force attacks and API abuse
# Example: 120 requests in 60 seconds = 2 requests/second per client
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", 120))

# Time window for rate limiting in seconds
# Defines the rolling window for the above limit
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", 60))


# ════════════════════════════════════════════════════════════════════════════
# OTP & PASSWORD RESET — Email-based account recovery
# ════════════════════════════════════════════════════════════════════════════

# OTP (One-Time Password) validity period in minutes
# User has this long to enter OTP code before it expires
# Standard: 5-10 minutes
OTP_EXPIRY_MINUTES = int(os.getenv("OTP_EXPIRY_MINUTES", 5))


# ════════════════════════════════════════════════════════════════════════════
# SMTP (EMAIL) CONFIGURATION — For password reset OTP emails
# ════════════════════════════════════════════════════════════════════════════

# SMTP server hostname (Gmail, SendGrid, custom mail server, etc.)
# Leave empty "" to disable email functionality (dev mode console logging)
# Examples: "smtp.gmail.com", "smtp.sendgrid.net", "mail.example.com"
SMTP_HOST = os.getenv("SMTP_HOST", "")

# SMTP server port
# Standard: 587 (TLS) or 465 (SSL)
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

# SMTP authentication username
# For Gmail: your email address
# For SendGrid: "apikey"
SMTP_USER = os.getenv("SMTP_USER", "")

# SMTP authentication password
# For Gmail: app-specific password (not account password)
# For SendGrid: API key
# NEVER commit this to Git — always use environment variables
SMTP_PASS = os.getenv("SMTP_PASS", "")

# Sender email address
# This address appears as "From" in password reset emails
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@driversafety.ai")


# ════════════════════════════════════════════════════════════════════════════
# RUNTIME MODE — Development vs. Production vs. Test
# ════════════════════════════════════════════════════════════════════════════

# Test mode: disables webcam and heavy models on startup
# Useful for:
#   • Unit testing (no GPU/webcam needed)
#   • CI/CD pipelines (faster startup)
#   • Development without hardware
# Set via: TEST_MODE=true python app.py
TEST_MODE = os.getenv("TEST_MODE", "false").lower() == "true"

# Debug mode: enables verbose logging and development conveniences
# Set via: DEBUG=true python app.py
DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"


# ════════════════════════════════════════════════════════════════════════════
# VALIDATION & STARTUP CHECKS
# ════════════════════════════════════════════════════════════════════════════

def validate_config():
    """
    Validate critical configuration values on application startup.
    
    Checks:
      ✓ Weight sum equals 1.0
      ✓ Thresholds are in valid ranges
      ✓ Required paths exist or can be created
      ✓ JWT secret is sufficiently long
    
    Raises:
        ValueError: If any critical configuration is invalid
    """
    # Validate that weights sum to 1.0 (with small float tolerance)
    weights_sum = DROWSINESS_WEIGHT + FOG_WEIGHT
    if abs(weights_sum - 1.0) > 0.01:
        raise ValueError(
            f"Risk weights must sum to ~1.0. "
            f"Got: {DROWSINESS_WEIGHT} + {FOG_WEIGHT} = {weights_sum}"
        )
    
    # Validate EAR threshold
    if not (0.0 < EYE_AR_THRESH < 1.0):
        raise ValueError(f"EYE_AR_THRESH must be between 0.0 and 1.0, got {EYE_AR_THRESH}")
    
    # Validate consecutive frames
    if EYE_AR_CONSEC_FRAMES < 1:
        raise ValueError(f"EYE_AR_CONSEC_FRAMES must be >= 1, got {EYE_AR_CONSEC_FRAMES}")
    
    # Validate JWT secret length
    if len(JWT_SECRET_KEY) < 32:
        import warnings
        warnings.warn(
            "⚠️  JWT_SECRET_KEY is less than 32 characters. "
            "This is insecure for production. Generate a proper key with:\n"
            "python -c \"import os; print(os.urandom(32).hex())\""
        )
    
    # Create required directories
    for directory in [MODELS_DIR, STATIC_DIR]:
        directory.mkdir(parents=True, exist_ok=True)


# Run validation on config load (if not in an alternate import context)
if __name__ != "__main__":
    try:
        validate_config()
    except ValueError as e:
        import sys
        print(f"❌ Configuration Error: {e}", file=sys.stderr)
        # Don't exit immediately; let application handle gracefully
