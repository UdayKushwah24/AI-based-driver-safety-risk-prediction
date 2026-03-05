"""
Fog / Visibility Detection Service.

Loads the EfficientNet-B0 fog detection model ONCE at startup
and provides a predict() function for inference.

Model logic is identical to the original fog_detection/app.py:
  - Same model architecture (timm efficientnet_b0, 2 classes)
  - Same transforms (Resize 224, ToTensor, Normalize)
  - Same prediction logic

The model weights file (fog_model.pth) is stored in backend/models/.
"""

from typing import Optional
import io

from PIL import Image
import torch
import timm
from torchvision import transforms

from backend.config import FOG_MODEL_PATH, FOG_MODEL_CLASSES
from backend.utils.logger import get_logger

logger = get_logger("fog_service")

# ── Model (loaded once) ─────────────────────────────────────────────
_device = torch.device("cpu")
_model = None
_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5]),
])

# ── Track last prediction for state queries ──────────────────────────
_last_state: dict = {"active": False}


def load_model():
    """Load the fog detection model into memory. Call once at startup."""
    global _model
    try:
        _model = timm.create_model(
            "efficientnet_b0", pretrained=False, num_classes=FOG_MODEL_CLASSES
        )
        _model.load_state_dict(torch.load(FOG_MODEL_PATH, map_location=_device))
        _model.eval()
        logger.info(f"Fog detection model loaded from {FOG_MODEL_PATH}")
    except Exception as e:
        logger.error(f"Failed to load fog model: {e}")
        _model = None


def predict(image_bytes: bytes) -> dict:
    """
    Run fog/visibility prediction on raw image bytes.
    Returns dict with prediction, confidence, and active status.
    """
    global _last_state

    if _model is None:
        _last_state = {"active": False, "error": "Model not loaded"}
        return _last_state

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_tensor = _transform(image).unsqueeze(0)

        with torch.no_grad():
            output = _model(img_tensor)
            prob = torch.softmax(output, dim=1)
            confidence = prob.max().item()
            _, pred = torch.max(output, 1)

        label = "Clear" if pred.item() == 0 else "Fog/Smog"
        _last_state = {
            "active": True,
            "prediction": label,
            "confidence": round(confidence * 100, 2),
        }
        return _last_state

    except Exception as e:
        logger.error(f"Fog prediction error: {e}")
        _last_state = {"active": False, "error": str(e)}
        return _last_state


def get_state() -> dict:
    """Return the last prediction state."""
    return _last_state.copy()
