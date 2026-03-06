import os

os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient

from app import app
from backend.services.auth_service import get_current_user


client = TestClient(app)


def test_analytics_summary_endpoint(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: {"id": "u123", "email": "a@a.com"}

    def fake_generate_summary(user_id: str):
        return {
            "drowsiness_today": 5,
            "yawning_events": 3,
            "fog_alerts": 2,
            "safety_score": 72,
        }

    monkeypatch.setattr("backend.routes.api.generate_summary", fake_generate_summary)

    resp = client.get("/api/analytics/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["drowsiness_today"] == 5
    assert data["yawning_events"] == 3
    assert data["fog_alerts"] == 2
    assert data["safety_score"] == 72

    app.dependency_overrides = {}
