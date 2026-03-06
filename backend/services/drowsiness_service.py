"""
Drowsiness & Yawn Detection Service.

Runs webcam capture + MediaPipe FaceLandmarker (Tasks API) in a
background thread.  Exposes detection state via get_state() — no HTTP
overhead internally.

Detection logic mirrors the original
Drowsiness_and_Yawning_Detection/drowsiness_yawn.py:
  - Same EAR formula
  - Same landmark indices (33/160/158/133/153/144, 362/385/387/263/373/380)
  - Same thresholds
  - Same yawn detection via landmark 13 & 14

Uses the new MediaPipe Tasks Vision API (mediapipe >= 0.10.14):
    mp.tasks.vision.FaceLandmarker + face_landmarker.task model
"""

import threading
import time
import math
from pathlib import Path
from typing import Optional

from backend.config import (
    EYE_AR_THRESH, EYE_AR_CONSEC_FRAMES, YAWN_THRESH, MODELS_DIR,
)
from backend.database.mongo import log_alert, log_drowsiness_event
from backend.utils.logger import get_logger

logger = get_logger("drowsiness_service")

# Path to the downloaded FaceLandmarker model
_FACE_LANDMARKER_MODEL = str(MODELS_DIR / "face_landmarker.task")

# ── Thread-safe shared state ─────────────────────────────────────────
_lock = threading.Lock()
_state: dict = {
    "active": False,
    "drowsy": False,
    "yawning": False,
    "ear": 0.0,
    "counter": 0,
    "timestamp": 0,
}
_latest_frame_jpeg: Optional[bytes] = None
_running = False
_last_event_log_ts = 0.0
_last_drowsy_alert_ts = 0.0
_last_yawn_alert_ts = 0.0


# ── Core EAR calculation — identical to original ─────────────────────
def eye_aspect_ratio(eye):
    def _euclidean(p1, p2):
        return math.hypot((p1[0] - p2[0]), (p1[1] - p2[1]))

    A = _euclidean(eye[1], eye[5])
    B = _euclidean(eye[2], eye[4])
    C = _euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)


# ── Background detection loop ───────────────────────────────────────
def _detection_loop():
    global _state, _latest_frame_jpeg, _running
    global _last_event_log_ts, _last_drowsy_alert_ts, _last_yawn_alert_ts

    try:
        import cv2
        import mediapipe as mp
    except Exception as exc:
        logger.error(f"CV dependencies unavailable, drowsiness service disabled: {exc}")
        with _lock:
            _state["active"] = False
        return

    # ── Create FaceLandmarker with the Tasks API ──
    BaseOptions = mp.tasks.BaseOptions
    FaceLandmarker = mp.tasks.vision.FaceLandmarker
    FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
    VisionRunningMode = mp.tasks.vision.RunningMode

    options = FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=_FACE_LANDMARKER_MODEL),
        running_mode=VisionRunningMode.VIDEO,
        num_faces=1,
        output_face_blendshapes=False,
        output_facial_transformation_matrixes=False,
    )

    landmarker = FaceLandmarker.create_from_options(options)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        logger.error("Cannot open webcam — drowsiness detection disabled")
        with _lock:
            _state["active"] = False
        landmarker.close()
        return

    counter = 0
    with _lock:
        _state["active"] = True
    logger.info("Webcam opened — drowsiness detection running")

    frame_ts = 0  # monotonic frame timestamp in ms for VIDEO mode

    try:
        while _running:
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.1)
                continue

            frame = cv2.resize(frame, (640, 480))
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Convert to MediaPipe Image
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            frame_ts += 33  # ~30 FPS
            results = landmarker.detect_for_video(mp_image, frame_ts)

            drowsy = False
            yawning = False
            ear_val = 0.0

            if results.face_landmarks:
                for face_lm in results.face_landmarks:
                    h, w, _ = frame.shape

                    # Eye landmarks — same indices as original
                    left_eye_idx = [33, 160, 158, 133, 153, 144]
                    right_eye_idx = [362, 385, 387, 263, 373, 380]

                    left_eye = [
                        (int(face_lm[i].x * w), int(face_lm[i].y * h))
                        for i in left_eye_idx
                    ]
                    right_eye = [
                        (int(face_lm[i].x * w), int(face_lm[i].y * h))
                        for i in right_eye_idx
                    ]

                    ear_val = (eye_aspect_ratio(left_eye) +
                               eye_aspect_ratio(right_eye)) / 2.0

                    if ear_val < EYE_AR_THRESH:
                        counter += 1
                        if counter >= EYE_AR_CONSEC_FRAMES:
                            drowsy = True
                    else:
                        counter = 0

                    # Yawn check — same logic as original
                    top = face_lm[13]
                    bottom = face_lm[14]
                    distance = abs((top.y - bottom.y) * h)
                    if distance > YAWN_THRESH:
                        yawning = True

            _, jpeg = cv2.imencode(".jpg", frame)

            with _lock:
                _state.update({
                    "active": True,
                    "drowsy": drowsy,
                    "yawning": yawning,
                    "ear": round(ear_val, 4),
                    "counter": counter,
                    "timestamp": time.time(),
                })
                _latest_frame_jpeg = jpeg.tobytes()

            now = time.time()
            if drowsy or yawning:
                if now - _last_event_log_ts >= 5:
                    log_drowsiness_event(ear_score=ear_val, yawning_detected=yawning)
                    _last_event_log_ts = now

                if drowsy and now - _last_drowsy_alert_ts >= 15:
                    log_alert(user_id="system", alert_type="drowsiness", severity="high")
                    _last_drowsy_alert_ts = now

                if yawning and now - _last_yawn_alert_ts >= 15:
                    log_alert(user_id="system", alert_type="yawning", severity="medium")
                    _last_yawn_alert_ts = now

            time.sleep(0.03)  # ~30 FPS cap
    except Exception as e:
        logger.error(f"Detection loop error: {e}")
    finally:
        cap.release()
        landmarker.close()
        with _lock:
            _state["active"] = False
        logger.info("Webcam released — detection stopped")


# ── Public API ───────────────────────────────────────────────────────
def start():
    """Start the background detection thread."""
    global _running
    _running = True
    thread = threading.Thread(target=_detection_loop, daemon=True)
    thread.start()
    logger.info("Drowsiness detection thread started")


def stop():
    """Signal the detection loop to stop."""
    global _running
    _running = False
    logger.info("Drowsiness detection stopping…")


def get_state() -> dict:
    """Return a snapshot of the current detection state."""
    with _lock:
        return _state.copy()


def get_frame() -> Optional[bytes]:
    """Return the latest webcam frame as JPEG bytes."""
    with _lock:
        return _latest_frame_jpeg
