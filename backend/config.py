"""
Central Configuration — Single source of truth for all settings.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# ── Project Paths ────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
MODELS_DIR = BACKEND_DIR / "models"
FRONTEND_DIR = BASE_DIR / "frontend"
STATIC_DIR = BASE_DIR / "static"
SOUNDS_DIR = BASE_DIR / "Drowsiness_and_Yawning_Detection"

# ── Server ───────────────────────────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# ── Fog Detection Model ─────────────────────────────────────────────
FOG_MODEL_PATH = str(MODELS_DIR / "fog_model.pth")
FOG_MODEL_CLASSES = 2

# ── Drowsiness Detection Thresholds ─────────────────────────────────
EYE_AR_THRESH = float(os.getenv("EYE_AR_THRESH", 0.25))
EYE_AR_CONSEC_FRAMES = int(os.getenv("EYE_AR_CONSEC_FRAMES", 20))
YAWN_THRESH = float(os.getenv("YAWN_THRESH", 25))

# ── Audio Alerts ─────────────────────────────────────────────────────────
AUDIO_ALERTS_ENABLED = os.getenv("ENABLE_AUDIO_ALERTS", "true").lower() == "true"
AUDIO_ALERT_DROWSY_PATH = Path(
	os.getenv(
		"AUDIO_ALERT_DROWSY_PATH",
		str(SOUNDS_DIR / "alert.wav"),
	)
)
AUDIO_ALERT_YAWN_PATH = Path(
	os.getenv(
		"AUDIO_ALERT_YAWN_PATH",
		str(SOUNDS_DIR / "alert2.wav"),
	)
)

# ── Risk Engine Weights ─────────────────────────────────────────────
DROWSINESS_WEIGHT = float(os.getenv("DROWSINESS_WEIGHT", 0.6))
FOG_WEIGHT = float(os.getenv("FOG_WEIGHT", 0.4))

# ── Polling / Push Intervals (seconds) ──────────────────────────────
DROWSINESS_POLL_INTERVAL = 0.5
FOG_POLL_INTERVAL = 5.0
WEBSOCKET_PUSH_INTERVAL = 1.0

# ── CORS ─────────────────────────────────────────────────────────────
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
CORS_ORIGINS = [origin.strip() for origin in _cors_origins.split(",") if origin.strip()]

# ── Logging ──────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
ALERT_LOG_LEVEL = os.getenv("ALERT_LOG_LEVEL", LOG_LEVEL)

# ── Database ────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "driver_safety")

# ── Auth / JWT ──────────────────────────────────────────────────────
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-jwt-secret-key-min-32-chars")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", 60))

# ── API Rate Limiting ───────────────────────────────────────────────
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", 120))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", 60))

# ── OTP / Password Reset ────────────────────────────────────────────
OTP_EXPIRY_MINUTES = int(os.getenv("OTP_EXPIRY_MINUTES", 5))

# ── SMTP (optional — used for OTP emails) ───────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@driversafety.ai")

# ── Runtime Mode ────────────────────────────────────────────────────
TEST_MODE = os.getenv("TEST_MODE", "false").lower() == "true"
