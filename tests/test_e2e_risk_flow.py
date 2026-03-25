import os

os.environ["TEST_MODE"] = "true"

from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app import app


client = TestClient(app)


def test_e2e_login_predict_and_history(monkeypatch):
    users_by_email = {}
    users_by_id = {}
    analytics_rows = []

    def fake_get_user_by_email(email):
        return users_by_email.get(email)

    def fake_create_user(name, email, hashed_password):
        user = {
            "id": "507f1f77bcf86cd799439011",
            "name": name,
            "email": email,
            "hashed_password": hashed_password,
            "created_at": "2026-03-05T00:00:00+00:00",
        }
        users_by_email[email] = user
        users_by_id[user["id"]] = user
        return user

    def fake_get_user_by_id(user_id):
        return users_by_id.get(user_id)

    def fake_log_analytics_prediction(user_id, risk_score, accident_probability, signals=None):
        analytics_rows.append(
            {
                "id": f"a-{len(analytics_rows) + 1}",
                "user_id": str(user_id),
                "risk_score": float(risk_score),
                "accident_probability": float(accident_probability),
                "signals": signals or [],
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
        return analytics_rows[-1]["id"]

    def fake_get_analytics_history(user_id, limit=500):
        rows = [row for row in analytics_rows if row["user_id"] == str(user_id)]
        return list(reversed(rows))[:limit]

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)
    monkeypatch.setattr("backend.services.auth_service.get_user_by_id", fake_get_user_by_id)

    monkeypatch.setattr("backend.routes.api.log_analytics_prediction", fake_log_analytics_prediction)
    monkeypatch.setattr("backend.routes.api.get_analytics_history", fake_get_analytics_history)
    monkeypatch.setattr("backend.routes.api.log_alert", lambda *args, **kwargs: "alert-1")

    register_resp = client.post(
        "/api/auth/register",
        json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
    )
    assert register_resp.status_code == 200

    login_resp = client.post(
        "/api/auth/login",
        json={"email": "aman@example.com", "password": "StrongPass123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    risk_resp = client.post(
        "/api/risk/predict",
        json={"speed": 88, "visibility": 42, "driver_state": "drowsy"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert risk_resp.status_code == 200
    risk_body = risk_resp.json()
    assert "riskScore" in risk_body
    assert "accidentProbability" in risk_body
    assert len(analytics_rows) == 1

    history_resp = client.get(
        "/api/analytics/history",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert history_resp.status_code == 200
    history = history_resp.json()["history"]
    assert len(history) == 1
    assert history[0]["riskScore"] == analytics_rows[0]["risk_score"]
