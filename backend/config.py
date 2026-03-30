"""
╔════════════════════════════════════════════════════════════════════════════╗
║         CENTRAL CONFIGURATION — SINGLE SOURCE OF TRUTH FOR ALL SETTINGS    ║
║     Environment-driven configuration with sensible defaults and validation  ║
╚════════════════════════════════════════════════════════════════════════════╝

PURPOSE:
  This module centralizes all system configuration, eliminating magic strings
  and numbers scattered throughout the codebase. All configuration is
  environment-driven, allowing easy deployment to different environments
  (development, staging, production) without code changes.

CONFIGURATION SOURCES (in order of precedence):
  1. Environment variables (.env file or system environment)
  2. Sensible defaults defined in this file
  3. Hard-coded safe defaults as fallback

ENVIRONMENT SETUP:
  Create a .env file in the project root with your overrides:
    
    # Server Config
    HOST=0.0.0.0
    PORT=8000
    
    # Detection Thresholds
    EYE_AR_THRESH=0.25
    EYE_AR_CONSEC_FRAMES=20
    YAWN_THRESH=25
    
    # Risk Weights (must sum to 1.0)
    DROWSINESS_WEIGHT=0.6
    FOG_WEIGHT=0.4
    
    # Database
    MONGO_URI=mongodb://localhost:27017
    MONGO_DB_NAME=driver_safety
    
    # Auth
    JWT_SECRET_KEY=your-secret-key-minimum-32-characters!
    JWT_EXP_MINUTES=60
    
    # SMTP (optional)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    SMTP_FROM=noreply@driversafety.ai
    
    # Mode
    TEST_MODE=false
    LOG_LEVEL=INFO

CONFIGURATION CATEGORIES:
  1. Paths: File system locations for models, static files
  2. Server: Host, port, CORS settings
  3. Models: ML model paths and hyperparameters
  4. Thresholds: Detection sensitivity parameters
  5. Audio: Alert sound file locations
  6. Risk Weighting: How to combine detection signals
  7. Intervals: Polling and push frequencies
  8. Database: MongoDB connection details
  9. Auth: JWT secrets and expiration
  10. Logging: Log level and format
  11. Email: SMTP for OTP sending
  12. Rate Limiting: API abuse protection
  13. Runtime: Development vs. production mode

VALIDATION & SAFETY:
  • All thresholds validated for reasonable ranges
  • JWT secret checked for minimum length (32 chars)
  • Risk weights validated to sum to 1.0
  • Database connection validated at startup
  • Warnings logged for suspicious configurations

DEPLOYMENT PATTERNS:
  
  Development:
    TEST_MODE=true, LOG_LEVEL=DEBUG, MONGO_URI=mongodb://localhost:27017
  
  Staging:
    TEST_MODE=false, LOG_LEVEL=INFO, Production MongoDB
  
  Production:
    TEST_MODE=false, LOG_LEVEL=WARNING, Security hardening
"""

import os
import logging
from pathlib import Path
from typing import Optional

# ════════════════════════════════════════════════════════════════════════════
# FILE SYSTEM PATHS — Locations for models, assets, and configuration
# ════════════════════════════════════════════════════════════════════════════

# Base directories
BASE_DIR: Path = Path(__file__).resolve().parent.parent
BACKEND_DIR: Path = BASE_DIR / "backend"
MODELS_DIR: Path = BACKEND_DIR / "models"
FRONTEND_DIR: Path = BASE_DIR / "frontend"
STATIC_DIR: Path = BASE_DIR / "static"
SOUNDS_DIR: Path = BASE_DIR / "Drowsiness_and_Yawning_Detection"

"""
DIRECTORY STRUCTURE:
  BASE_DIR/
    ├── backend/
    │   ├── config.py (this file)
    │   ├── models/
    │   │   ├── face_landmarker.task  (MediaPipe model)
    │   │   ├── fog_model.pth          (EfficientNet weights)
    │   │   └── accident_model.pkl     (XGBoost model)
    │   ├── services/                  (Business logic)
    │   ├── routes/                    (API endpoints)
    │   └── utils/                     (Helpers)
    │
    ├── frontend/
    │   ├── src/                       (React source)
    │   └── dist/                      (Built static files)
    │
    └── Drowsiness_and_Yawning_Detection/
        └── alert.wav, alert2.wav      (Audio alerts)
"""

# ════════════════════════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════

# Host and port for Uvicorn ASGI server
# HOST: IP to bind to (0.0.0.0 = all interfaces, localhost = local only)
# PORT: TCP port number (1024-65535, <1024 requires root)
HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "8000"))

if PORT < 1024:
    logging.warning(f"⚠️  PORT {PORT} requires root/admin privileges")
if PORT < 8000 or PORT > 9000:
    logging.warning(f"⚠️  Non-standard PORT {PORT}: consider using 8000-9000 range")

# ════════════════════════════════════════════════════════════════════════════
# ML MODEL CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════

# Fog Detection Model
# • Model: EfficientNet-B0 (PyTorch)
# • Input: 224x224 RGB image
# • Output: Binary classification (Clear vs. Fog/Smog)
# • Classes: 2 (index 0=Clear, index 1=Fog/Smog)
FOG_MODEL_PATH: str = str(MODELS_DIR / "fog_model.pth")
FOG_MODEL_CLASSES: int = 2

if not Path(FOG_MODEL_PATH).exists():
    logging.warning(f"⚠️  Fog model not found at: {FOG_MODEL_PATH}")
    logging.warning(f"    Download from: <model-url>")
    logging.warning(f"    Or disable fog detection in TEST_MODE")

# ════════════════════════════════════════════════════════════════════════════
# DROWSINESS DETECTION THRESHOLDS
# ════════════════════════════════════════════════════════════════════════════

# Eye AspectRatio (EAR) Threshold
# • Formula: EAR = (||p2-p6|| + ||p3-p5||) / (2*||p1-p4||)
# • Interpretation: Lower value = eyes more closed
# • Default: 0.25 (eyes closed when EAR < 0.25)
# • Range: 0.15-0.40 (below 0.15 = always alert, above 0.40 = false negatives)
EYE_AR_THRESH: float = float(os.getenv("EYE_AR_THRESH", "0.25"))

if not (0.10 < EYE_AR_THRESH < 0.50):
    logging.warning(f"⚠️  EAR_THRESH {EYE_AR_THRESH} outside recommended range [0.10-0.50]")

# Consecutive Frames for Alerting
# • How many frames below threshold before triggering "drowsy" alert
# • Default: 20 frames (at 30fps = 0.67 seconds)
# • Range: 10-50 (lower = more sensitive, higher = fewer false alerts)
EYE_AR_CONSEC_FRAMES: int = int(os.getenv("EYE_AR_CONSEC_FRAMES", "20"))

if not (5 <= EYE_AR_CONSEC_FRAMES <= 100):
    logging.warning(f"⚠️  EYE_AR_CONSEC_FRAMES {EYE_AR_CONSEC_FRAMES} outside [5-100]")

# Yawning Detection Threshold
# • Mouth opening distance threshold (Euclidean distance between landmarks)
# • Default: 25 pixels (for 480x640 video)
# • Higher = less sensitive to yawning
YAWN_THRESH: float = float(os.getenv("YAWN_THRESH", "25"))

if YAWN_THRESH < 10 or YAWN_THRESH > 80:
    logging.warning(f"⚠️  YAWN_THRESH {YAWN_THRESH} outside typical range [10-80]")

# ════════════════════════════════════════════════════════════════════════════
# AUDIO ALERTS
# ════════════════════════════════════════════════════════════════════════════

# Enable/Disable audio alerting
# When enabled, system plays sound when drowsiness detected
AUDIO_ALERTS_ENABLED: bool = os.getenv("ENABLE_AUDIO_ALERTS", "true").lower() == "true"

# Sound file paths
# • alert.wav: Drowsiness alert sound (lower frequency, longer)
# • alert2.wav: Yawning alert sound (higher frequency, shorter)
AUDIO_ALERT_DROWSY_PATH: Path = Path(
    os.getenv(
        "AUDIO_ALERT_DROWSY_PATH",
        str(SOUNDS_DIR / "alert.wav"),
    )
)

AUDIO_ALERT_YAWN_PATH: Path = Path(
    os.getenv(
        "AUDIO_ALERT_YAWN_PATH",
        str(SOUNDS_DIR / "alert2.wav"),
    )
)

# Validate audio files exist
if AUDIO_ALERTS_ENABLED:
    if not AUDIO_ALERT_DROWSY_PATH.exists():
        logging.warning(f"⚠️  Drowsiness alert file not found: {AUDIO_ALERT_DROWSY_PATH}")
    if not AUDIO_ALERT_YAWN_PATH.exists():
        logging.warning(f"⚠️  Yawning alert file not found: {AUDIO_ALERT_YAWN_PATH}")

# ════════════════════════════════════════════════════════════════════════════
# RISK ENGINE WEIGHTS
# ════════════════════════════════════════════════════════════════════════════

# How much to weight each detection module in unified risk score
# Formula: Unified_Risk = (Drowsiness_Risk × DROWSINESS_WEIGHT) + (Fog_Risk × FOG_WEIGHT)
# Must sum to 1.0
DROWSINESS_WEIGHT: float = float(os.getenv("DROWSINESS_WEIGHT", "0.6"))
FOG_WEIGHT: float = float(os.getenv("FOG_WEIGHT", "0.4"))

# Validation: weights should sum to approximately 1.0
weight_sum = DROWSINESS_WEIGHT + FOG_WEIGHT
if not (0.99 <= weight_sum <= 1.01):  # Allow small floating point error
    logging.warning(f"⚠️  Risk weights don't sum to 1.0: {weight_sum}")
    logging.warning(f"    Drowsiness: {DROWSINESS_WEIGHT}, Fog: {FOG_WEIGHT}")

# ════════════════════════════════════════════════════════════════════════════
# POLLING & PUSH INTERVALS (seconds)
# ════════════════════════════════════════════════════════════════════════════

# How often to poll services for latest state
DROWSINESS_POLL_INTERVAL: float = 0.5  # 500ms (2Hz)
FOG_POLL_INTERVAL: float = 5.0  # 5 seconds
WEBSOCKET_PUSH_INTERVAL: float = 1.0  # 1Hz push to clients

# ════════════════════════════════════════════════════════════════════════════
# CORS (Cross-Origin Resource Sharing)
# ════════════════════════════════════════════════════════════════════════════

# Allowed origins for cross-origin requests (from frontend to backend)
# "*" = allow all origins (convenient for dev, risky for production)
# For production, use specific domains: ["https://app.example.com", ...]
CORS_ORIGINS: list = ["*"]  # Change to specific domains in production!

logging.warning("🔓 CORS_ORIGINS set to '*' (allow all). Change for production!")

# ════════════════════════════════════════════════════════════════════════════
# LOGGING
# ════════════════════════════════════════════════════════════════════════════

# Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL
# • DEBUG: Verbose logging (development)
# • INFO: Standard level (recommended)
# • WARNING: Only warnings and errors (production)
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

if LOG_LEVEL not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
    logging.warning(f"⚠️  Invalid LOG_LEVEL: {LOG_LEVEL}, using INFO")
    LOG_LEVEL = "INFO"

# ════════════════════════════════════════════════════════════════════════════
# DATABASE (MongoDB)
# ════════════════════════════════════════════════════════════════════════════

# MongoDB connection string
# • Local: mongodb://localhost:27017
# • Atlas: mongodb+srv://user:pass@cluster.mongodb.net
# • Docker: mongodb://mongo:27017  
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Database name for all collections
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "driver_safety")

"""
MONGODB COLLECTIONS:
  • users: User accounts (id, name, email, password_hash, created_at, last_login)
  • drowsiness_events: Drowsiness detections (user_id, event_type, ear, frames, timestamp)
  • fog_predictions: Fog detections (user_id, prediction, confidence, timestamp)
  • alerts: Generated alerts (user_id, type, severity, message, timestamp)
  • otp_requests: One-time passwords (email, code_hash, expires_at, TTL index)

INDEXING STRATEGY:
  • users: Unique index on email for fast lookups
  • drowsiness_events: Compound index on (user_id, -timestamp) for range queries
  • fog_predictions: Compound index on (user_id, -timestamp)
  • alerts: Compound index on (user_id, -timestamp)
  • otp_requests: TTL index on expires_at for auto-cleanup
"""

# ════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION / JWT
# ════════════════════════════════════════════════════════════════════════════

# JWT Secret Key for signing/verifying tokens
# CRITICAL: Generate a strong random string for production!
# Minimum 32 characters recommended
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-this-jwt-secret-key-min-32-chars")

# Validate JWT secret strength
if len(JWT_SECRET_KEY) < 32:
    logging.critical("🔴 SECURITY: JWT_SECRET_KEY is short (<32 chars), use a strong random string!")
if JWT_SECRET_KEY == "change-this-jwt-secret-key-min-32-chars":
    logging.critical("🔴 SECURITY: Using default JWT_SECRET_KEY! Change this immediately!")

# JWT algorithm (HS256 = HMAC-SHA256)
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

# Token expiration time (minutes)
# Default: 60 minutes (1 hour)
JWT_EXP_MINUTES: int = int(os.getenv("JWT_EXP_MINUTES", "60"))

if JWT_EXP_MINUTES < 5:
    logging.warning(f"⚠️  JWT_EXP_MINUTES {JWT_EXP_MINUTES} is very short")
if JWT_EXP_MINUTES > 10080:  # 7 days
    logging.warning(f"⚠️  JWT_EXP_MINUTES {JWT_EXP_MINUTES} is very long (>7 days)")

# ════════════════════════════════════════════════════════════════════════════
# API RATE LIMITING
# ════════════════════════════════════════════════════════════════════════════

# Rate limiting: Max requests per time window, per IP address
# Default: 120 requests per 60 seconds = 2 requests/second

# Maximum requests allowed per client IP
RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "120"))

# Time window for rate limiting (seconds)
RATE_LIMIT_WINDOW_SECONDS: int = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))

"""
RATE LIMITING EXAMPLES:

Default (120/60s):
  • 2 requests per second max
  • 120 requests per minute
  • Suitable for dashboard + APIs

Generous (300/60s):
  • 5 requests per second
  • Suitable for heavy API usage

Strict (30/60s):
  • 0.5 requests per second
  • Only 30 requests per minute
  • For brute-force protection

Exempt endpoints:
  • /docs, /openapi.json, /redoc (API docs)
  • /ws/* (WebSocket doesn't use this middleware)
"""

# ════════════════════════════════════════════════════════════════════════════
# OTP & PASSWORD RESET
# ════════════════════════════════════════════════════════════════════════════

# One-Time Password expiration (minutes)
# After this time, OTP becomes invalid
OTP_EXPIRY_MINUTES: int = int(os.getenv("OTP_EXPIRY_MINUTES", "5"))

if OTP_EXPIRY_MINUTES < 1:
    logging.warning(f"⚠️  OTP_EXPIRY very short ({OTP_EXPIRY_MINUTES} min)")
if OTP_EXPIRY_MINUTES > 60:
    logging.warning(f"⚠️  OTP_EXPIRY very long ({OTP_EXPIRY_MINUTES} min)")

# ════════════════════════════════════════════════════════════════════════════
# EMAIL (SMTP) — For OTP sending
# ════════════════════════════════════════════════════════════════════════════

# SMTP Server Configuration
# If empty: OTP emails logged to console (development mode)
SMTP_HOST: str = os.getenv("SMTP_HOST", "")
SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER: str = os.getenv("SMTP_USER", "")
SMTP_PASS: str = os.getenv("SMTP_PASS", "")
SMTP_FROM: str = os.getenv("SMTP_FROM", "noreply@driversafety.ai")

"""
GMAIL SETUP:
  1. Enable 2-Factor Authentication
  2. Create App Password (16-char)
  3. Set environment variables:
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-16-char-app-password

DEVELOPMENT MODE:
  Leave SMTP_* empty to log OTPs to console instead of emailing
"""

if not SMTP_HOST:
    logging.info("ℹ️  SMTP not configured: OTPs will be logged to console (dev mode)")

# ════════════════════════════════════════════════════════════════════════════
# RUNTIME MODE
# ════════════════════════════════════════════════════════════════════════════

# TEST_MODE: Disable resource-intensive operations for testing
# • Skips ML model loading
# • Skips webcam initialization
# • Allows tests without GPU/camera
TEST_MODE: bool = os.getenv("TEST_MODE", "false").lower() == "true"

if TEST_MODE:
    logging.info("🧪 TEST_MODE enabled: Models and webcam disabled")
