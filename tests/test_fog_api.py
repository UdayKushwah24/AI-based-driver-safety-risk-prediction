import os

os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient

from app import app
from backend.services.auth_service import get_current_user


client = TestClient(app)


def test_fog_prediction_api_response(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: {"id": "u123", "email": "a@a.com"}

    def fake_predict(image_bytes, user_id="system", image_name="camera_frame.jpg"):
        return {
            "active": True,
            "prediction": "Fog/Smog",
            "confidence": 92.4,
            "fog_probability": 0.92,
        }

    monkeypatch.setattr("backend.routes.api.fog_service.predict", fake_predict)

    resp = client.post(
        "/api/fog/upload",
        files={"file": ("sample.jpg", b"fake-image-bytes", "image/jpeg")},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["active"] is True
    assert body["prediction"] in ["Fog/Smog", "Clear"]
    assert "confidence" in body

    app.dependency_overrides = {}
