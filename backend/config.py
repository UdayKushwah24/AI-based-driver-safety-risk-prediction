"""
Central Configuration — Single source of truth for all settings.
"""
import os
from pathlib import Path

# ── Project Paths ────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
MODELS_DIR = BACKEND_DIR / "models"
FRONTEND_DIR = BASE_DIR / "frontend"
STATIC_DIR = BASE_DIR / "static"

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

# ── Risk Engine Weights ─────────────────────────────────────────────
DROWSINESS_WEIGHT = float(os.getenv("DROWSINESS_WEIGHT", 0.6))
FOG_WEIGHT = float(os.getenv("FOG_WEIGHT", 0.4))

# ── Polling / Push Intervals (seconds) ──────────────────────────────
DROWSINESS_POLL_INTERVAL = 0.5
FOG_POLL_INTERVAL = 5.0
WEBSOCKET_PUSH_INTERVAL = 1.0

# ── CORS ─────────────────────────────────────────────────────────────
CORS_ORIGINS = ["*"]

# ── Logging ──────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
