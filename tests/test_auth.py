import os

os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient

from app import app


client = TestClient(app)


def test_register_user(monkeypatch):
    users = {}

    def fake_get_user_by_email(email):
        return users.get(email)

    def fake_create_user(name, email, hashed_password):
        user = {
            "id": "507f1f77bcf86cd799439011",
            "name": name,
            "email": email,
            "hashed_password": hashed_password,
            "created_at": "2026-03-05T00:00:00+00:00",
        }
        users[email] = user
        return user

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

    resp = client.post(
        "/api/auth/register",
        json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["message"] == "User registered successfully"
    assert body["user"]["email"] == "aman@example.com"


def test_login_user(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("StrongPass123")

    def fake_get_user_by_email(email):
        return {
            "id": "507f1f77bcf86cd799439011",
            "name": "Aman",
            "email": email,
            "hashed_password": hashed,
            "created_at": "2026-03-05T00:00:00+00:00",
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post(
        "/api/auth/login",
        json={"email": "aman@example.com", "password": "StrongPass123"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_invalid_password(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("CorrectPassword123")

    def fake_get_user_by_email(email):
        return {
            "id": "507f1f77bcf86cd799439011",
            "name": "Aman",
            "email": email,
            "hashed_password": hashed,
            "created_at": "2026-03-05T00:00:00+00:00",
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post(
        "/api/auth/login",
        json={"email": "aman@example.com", "password": "WrongPassword"},
    )
    assert resp.status_code == 401
    assert "error" in resp.json()


# ── OTP flow tests ────────────────────────────────────────────────────

def test_forgot_password_unknown_email(monkeypatch):
    """Unknown emails still return 200 to prevent email enumeration."""
    monkeypatch.setattr("backend.routes.auth.get_user_by_email", lambda email: None)

    resp = client.post("/api/auth/forgot-password", json={"email": "ghost@nowhere.com"})
    assert resp.status_code == 200
    assert "message" in resp.json()


def test_forgot_password_known_email(monkeypatch):
    """Known email triggers OTP generation."""
    monkeypatch.setattr(
        "backend.routes.auth.get_user_by_email",
        lambda email: {"id": "u1", "email": email},
    )
    monkeypatch.setattr(
        "backend.routes.auth.request_otp",
        lambda email: {"sent": False, "dev_otp": "123456"},
    )

    resp = client.post("/api/auth/forgot-password", json={"email": "aman@example.com"})
    assert resp.status_code == 200
    body = resp.json()
    # Dev mode returns the OTP in the response
    assert body.get("dev_otp") == "123456"


def test_verify_otp_valid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)

    resp = client.post(
        "/api/auth/verify-otp",
        json={"email": "aman@example.com", "otp_code": "123456"},
    )
    assert resp.status_code == 200
    assert resp.json()["valid"] is True


def test_verify_otp_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

    resp = client.post(
        "/api/auth/verify-otp",
        json={"email": "aman@example.com", "otp_code": "000000"},
    )
    assert resp.status_code == 400


def test_reset_password_success(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)
    monkeypatch.setattr("backend.routes.auth.update_user_password", lambda email, pw: True)
    monkeypatch.setattr("backend.routes.auth.consume_otp", lambda email: None)

    resp = client.post(
        "/api/auth/reset-password",
        json={
            "email": "aman@example.com",
            "otp_code": "123456",
            "new_password": "NewStrongPass123",
        },
    )
    assert resp.status_code == 200
    assert "successfully" in resp.json()["message"].lower()


def test_reset_password_invalid_otp(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

    resp = client.post(
        "/api/auth/reset-password",
        json={
            "email": "aman@example.com",
            "otp_code": "000000",
            "new_password": "NewStrongPass123",
        },
    )
    assert resp.status_code == 400
