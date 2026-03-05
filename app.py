"""
╔══════════════════════════════════════════════════════════════════════╗
║       AI-based Driver Safety & Risk Prediction System               ║
║       Unified Application Server (Single Entry Point)               ║
╚══════════════════════════════════════════════════════════════════════╝

Run with:
    python app.py

This starts EVERYTHING:
  • Drowsiness detection (webcam, background thread)
  • Fog detection model (loaded once into memory)
  • Risk engine (computes unified score)
  • REST API (all endpoints)
  • WebSocket (real-time push to dashboard)
  • Static file serving (React dashboard build)

Single port: 8000 (configurable via PORT env var)
"""

import sys
import os
from pathlib import Path
from contextlib import asynccontextmanager

# Ensure project root is on sys.path for clean imports
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import HOST, PORT, CORS_ORIGINS, FRONTEND_DIR, STATIC_DIR
from backend.services import drowsiness_service, fog_service, accident_service
from backend.routes import api, ws
from backend.utils.logger import get_logger

logger = get_logger("app")


# ── App Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load models, start detection. Shutdown: stop cleanly."""
    logger.info("=" * 60)
    logger.info("  Driver Safety System — Starting up")
    logger.info("=" * 60)

    # 1. Load fog detection model (once)
    fog_service.load_model()

    # 2. Load accident prediction model (once)
    accident_service.load_model()

    # 3. Start drowsiness detection background thread
    drowsiness_service.start()

    logger.info(f"Server running at http://{HOST}:{PORT}")
    logger.info(f"Dashboard:  http://localhost:{PORT}")
    logger.info(f"API docs:   http://localhost:{PORT}/docs")
    logger.info(f"WebSocket:  ws://localhost:{PORT}/ws/risk")
    logger.info("=" * 60)

    yield  # App is running

    # Shutdown
    logger.info("Shutting down…")
    drowsiness_service.stop()
    logger.info("All services stopped.")


# ── FastAPI App ──────────────────────────────────────────────────────
app = FastAPI(
    title="AI-based Driver Safety & Risk Prediction System",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(api.router)
app.include_router(ws.router)

# Serve static files if build exists
_dist_dir = FRONTEND_DIR / "dist"
if _dist_dir.is_dir():
    app.mount("/", StaticFiles(directory=str(_dist_dir), html=True), name="frontend")
    logger.info(f"Serving frontend from {_dist_dir}")


# ── Run ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=HOST, port=PORT, reload=False)
