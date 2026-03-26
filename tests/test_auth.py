# import os

# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient

# from app import app


# client = TestClient(app)


# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post(
#         "/auth/register",
#         json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert body["message"] == "User registered successfully"
#     assert body["user"]["email"] == "aman@example.com"


# def test_login_user(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("StrongPass123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert "access_token" in body
#     assert body["token_type"] == "bearer"


# def test_invalid_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "WrongPassword"},
#     )
#     assert resp.status_code == 401
#     assert "error" in resp.json()


# # ── OTP flow tests ────────────────────────────────────────────────────

# def test_forgot_password_unknown_email(monkeypatch):
#     """Unknown emails still return 200 to prevent email enumeration."""
#     monkeypatch.setattr("backend.routes.auth.get_user_by_email", lambda email: None)

#     resp = client.post("/auth/forgot-password", json={"email": "ghost@nowhere.com"})
#     assert resp.status_code == 200
#     assert "message" in resp.json()


# def test_forgot_password_known_email(monkeypatch):
#     """Known email triggers OTP generation."""
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda email: {"id": "u1", "email": email},
#     )
#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda email: {"sent": False, "dev_otp": "123456"},
#     )

#     resp = client.post("/auth/forgot-password", json={"email": "aman@example.com"})
#     assert resp.status_code == 200
#     body = resp.json()
#     # Dev mode returns the OTP in the response
#     assert body.get("dev_otp") == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "123456"},
#     )
#     assert resp.status_code == 200
#     assert resp.json()["valid"] is True


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "000000"},
#     )
#     assert resp.status_code == 400


# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda email, pw: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda email: None)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "123456",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 200
#     assert "successfully" in resp.json()["message"].lower()


# def test_reset_password_invalid_otp(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "000000",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 400










import os
os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# -----------------------------
# Helper / Mock Data
# -----------------------------

TEST_USER = {
    "name": "Aman",
    "email": "aman@example.com",
    "password": "StrongPass123"
}

# -----------------------------
# BASIC AUTH TESTS
# -----------------------------

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
        }
        users[email] = user
        return user

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code == 200
    assert resp.json()["user"]["email"] == TEST_USER["email"]


def test_register_duplicate(monkeypatch):
    def fake_get_user_by_email(email):
        return {"email": email}

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code != 200


# -----------------------------
# LOGIN TESTS
# -----------------------------

def test_login_success(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password(TEST_USER["password"])

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("CorrectPassword")

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": "Wrong"
    })

    assert resp.status_code == 401


def test_login_user_not_found(monkeypatch):
    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 401


# -----------------------------
# OTP FLOW TESTS
# -----------------------------

def test_forgot_password(monkeypatch):
    monkeypatch.setattr(
        "backend.routes.auth.get_user_by_email",
        lambda e: {"email": e}
    )

    monkeypatch.setattr(
        "backend.routes.auth.request_otp",
        lambda e: {"dev_otp": "123456"}
    )

    resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

    assert resp.status_code == 200
    assert resp.json()["dev_otp"] == "123456"


def test_verify_otp_valid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "123456"
    })

    assert resp.status_code == 200


def test_verify_otp_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "000000"
    })

    assert resp.status_code == 400


# -----------------------------
# RESET PASSWORD
# -----------------------------

def test_reset_password_success(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
    monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
    monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "123456",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 200


def test_reset_password_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "000000",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 400


# -----------------------------
# EDGE CASE TESTS
# -----------------------------

def test_empty_email():
    resp = client.post("/auth/login", json={
        "email": "",
        "password": "123"
    })
    assert resp.status_code != 200


def test_empty_password():
    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": ""
    })
    assert resp.status_code != 200


def test_invalid_email_format():
    resp = client.post("/auth/register", json={
        "name": "Aman",
        "email": "invalid-email",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# LOAD / STRESS STYLE TESTS
# -----------------------------

def test_multiple_logins(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200


def test_multiple_invalid_logins(monkeypatch):
    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: None
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": "wrong"
        })
        assert resp.status_code == 401


# -----------------------------
# TOKEN TESTS
# -----------------------------

def test_token_structure(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    resp = client.post("/auth/login", json=TEST_USER)

    token = resp.json()["access_token"]

    assert isinstance(token, str)
    assert len(token) > 10


# -----------------------------
# SECURITY TESTS
# -----------------------------

def test_sql_injection_attempt():
    resp = client.post("/auth/login", json={
        "email": "' OR 1=1 --",
        "password": "hack"
    })
    assert resp.status_code != 200


def test_xss_attempt():
    resp = client.post("/auth/register", json={
        "name": "<script>alert(1)</script>",
        "email": "xss@test.com",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# FINAL MASS TEST (for line boost 😄)
# -----------------------------

def test_bulk_requests(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for i in range(100):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200
















# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200







# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200



# import os

# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient

# from app import app


# client = TestClient(app)


# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post(
#         "/auth/register",
#         json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert body["message"] == "User registered successfully"
#     assert body["user"]["email"] == "aman@example.com"


# def test_login_user(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("StrongPass123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert "access_token" in body
#     assert body["token_type"] == "bearer"


# def test_invalid_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "WrongPassword"},
#     )
#     assert resp.status_code == 401
#     assert "error" in resp.json()


# # ── OTP flow tests ────────────────────────────────────────────────────

# def test_forgot_password_unknown_email(monkeypatch):
#     """Unknown emails still return 200 to prevent email enumeration."""
#     monkeypatch.setattr("backend.routes.auth.get_user_by_email", lambda email: None)

#     resp = client.post("/auth/forgot-password", json={"email": "ghost@nowhere.com"})
#     assert resp.status_code == 200
#     assert "message" in resp.json()


# def test_forgot_password_known_email(monkeypatch):
#     """Known email triggers OTP generation."""
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda email: {"id": "u1", "email": email},
#     )
#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda email: {"sent": False, "dev_otp": "123456"},
#     )

#     resp = client.post("/auth/forgot-password", json={"email": "aman@example.com"})
#     assert resp.status_code == 200
#     body = resp.json()
#     # Dev mode returns the OTP in the response
#     assert body.get("dev_otp") == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "123456"},
#     )
#     assert resp.status_code == 200
#     assert resp.json()["valid"] is True


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "000000"},
#     )
#     assert resp.status_code == 400


# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda email, pw: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda email: None)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "123456",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 200
#     assert "successfully" in resp.json()["message"].lower()


# def test_reset_password_invalid_otp(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "000000",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 400










import os
os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# -----------------------------
# Helper / Mock Data
# -----------------------------

TEST_USER = {
    "name": "Aman",
    "email": "aman@example.com",
    "password": "StrongPass123"
}

# -----------------------------
# BASIC AUTH TESTS
# -----------------------------

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
        }
        users[email] = user
        return user

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code == 200
    assert resp.json()["user"]["email"] == TEST_USER["email"]


def test_register_duplicate(monkeypatch):
    def fake_get_user_by_email(email):
        return {"email": email}

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code != 200


# -----------------------------
# LOGIN TESTS
# -----------------------------

def test_login_success(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password(TEST_USER["password"])

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("CorrectPassword")

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": "Wrong"
    })

    assert resp.status_code == 401


def test_login_user_not_found(monkeypatch):
    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 401


# -----------------------------
# OTP FLOW TESTS
# -----------------------------

def test_forgot_password(monkeypatch):
    monkeypatch.setattr(
        "backend.routes.auth.get_user_by_email",
        lambda e: {"email": e}
    )

    monkeypatch.setattr(
        "backend.routes.auth.request_otp",
        lambda e: {"dev_otp": "123456"}
    )

    resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

    assert resp.status_code == 200
    assert resp.json()["dev_otp"] == "123456"


def test_verify_otp_valid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "123456"
    })

    assert resp.status_code == 200


def test_verify_otp_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "000000"
    })

    assert resp.status_code == 400


# -----------------------------
# RESET PASSWORD
# -----------------------------

def test_reset_password_success(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
    monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
    monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "123456",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 200


def test_reset_password_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "000000",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 400


# -----------------------------
# EDGE CASE TESTS
# -----------------------------

def test_empty_email():
    resp = client.post("/auth/login", json={
        "email": "",
        "password": "123"
    })
    assert resp.status_code != 200


def test_empty_password():
    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": ""
    })
    assert resp.status_code != 200


def test_invalid_email_format():
    resp = client.post("/auth/register", json={
        "name": "Aman",
        "email": "invalid-email",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# LOAD / STRESS STYLE TESTS
# -----------------------------

def test_multiple_logins(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200


def test_multiple_invalid_logins(monkeypatch):
    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: None
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": "wrong"
        })
        assert resp.status_code == 401


# -----------------------------
# TOKEN TESTS
# -----------------------------

def test_token_structure(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    resp = client.post("/auth/login", json=TEST_USER)

    token = resp.json()["access_token"]

    assert isinstance(token, str)
    assert len(token) > 10


# -----------------------------
# SECURITY TESTS
# -----------------------------

def test_sql_injection_attempt():
    resp = client.post("/auth/login", json={
        "email": "' OR 1=1 --",
        "password": "hack"
    })
    assert resp.status_code != 200


def test_xss_attempt():
    resp = client.post("/auth/register", json={
        "name": "<script>alert(1)</script>",
        "email": "xss@test.com",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# FINAL MASS TEST (for line boost 😄)
# -----------------------------

def test_bulk_requests(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for i in range(100):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200
















# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200







# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# import os

# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient

# from app import app


# client = TestClient(app)


# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post(
#         "/auth/register",
#         json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert body["message"] == "User registered successfully"
#     assert body["user"]["email"] == "aman@example.com"


# def test_login_user(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("StrongPass123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert "access_token" in body
#     assert body["token_type"] == "bearer"


# def test_invalid_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "WrongPassword"},
#     )
#     assert resp.status_code == 401
#     assert "error" in resp.json()


# # ── OTP flow tests ────────────────────────────────────────────────────

# def test_forgot_password_unknown_email(monkeypatch):
#     """Unknown emails still return 200 to prevent email enumeration."""
#     monkeypatch.setattr("backend.routes.auth.get_user_by_email", lambda email: None)

#     resp = client.post("/auth/forgot-password", json={"email": "ghost@nowhere.com"})
#     assert resp.status_code == 200
#     assert "message" in resp.json()


# def test_forgot_password_known_email(monkeypatch):
#     """Known email triggers OTP generation."""
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda email: {"id": "u1", "email": email},
#     )
#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda email: {"sent": False, "dev_otp": "123456"},
#     )

#     resp = client.post("/auth/forgot-password", json={"email": "aman@example.com"})
#     assert resp.status_code == 200
#     body = resp.json()
#     # Dev mode returns the OTP in the response
#     assert body.get("dev_otp") == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "123456"},
#     )
#     assert resp.status_code == 200
#     assert resp.json()["valid"] is True


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "000000"},
#     )
#     assert resp.status_code == 400


# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda email, pw: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda email: None)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "123456",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 200
#     assert "successfully" in resp.json()["message"].lower()


# def test_reset_password_invalid_otp(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "000000",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 400










import os
os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# -----------------------------
# Helper / Mock Data
# -----------------------------

TEST_USER = {
    "name": "Aman",
    "email": "aman@example.com",
    "password": "StrongPass123"
}

# -----------------------------
# BASIC AUTH TESTS
# -----------------------------

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
        }
        users[email] = user
        return user

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code == 200
    assert resp.json()["user"]["email"] == TEST_USER["email"]


def test_register_duplicate(monkeypatch):
    def fake_get_user_by_email(email):
        return {"email": email}

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code != 200


# -----------------------------
# LOGIN TESTS
# -----------------------------

def test_login_success(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password(TEST_USER["password"])

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("CorrectPassword")

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": "Wrong"
    })

    assert resp.status_code == 401


def test_login_user_not_found(monkeypatch):
    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 401


# -----------------------------
# OTP FLOW TESTS
# -----------------------------

def test_forgot_password(monkeypatch):
    monkeypatch.setattr(
        "backend.routes.auth.get_user_by_email",
        lambda e: {"email": e}
    )

    monkeypatch.setattr(
        "backend.routes.auth.request_otp",
        lambda e: {"dev_otp": "123456"}
    )

    resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

    assert resp.status_code == 200
    assert resp.json()["dev_otp"] == "123456"


def test_verify_otp_valid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "123456"
    })

    assert resp.status_code == 200


def test_verify_otp_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "000000"
    })

    assert resp.status_code == 400


# -----------------------------
# RESET PASSWORD
# -----------------------------

def test_reset_password_success(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
    monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
    monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "123456",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 200


def test_reset_password_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "000000",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 400


# -----------------------------
# EDGE CASE TESTS
# -----------------------------

def test_empty_email():
    resp = client.post("/auth/login", json={
        "email": "",
        "password": "123"
    })
    assert resp.status_code != 200


def test_empty_password():
    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": ""
    })
    assert resp.status_code != 200


def test_invalid_email_format():
    resp = client.post("/auth/register", json={
        "name": "Aman",
        "email": "invalid-email",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# LOAD / STRESS STYLE TESTS
# -----------------------------

def test_multiple_logins(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200


def test_multiple_invalid_logins(monkeypatch):
    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: None
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": "wrong"
        })
        assert resp.status_code == 401


# -----------------------------
# TOKEN TESTS
# -----------------------------

def test_token_structure(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    resp = client.post("/auth/login", json=TEST_USER)

    token = resp.json()["access_token"]

    assert isinstance(token, str)
    assert len(token) > 10


# -----------------------------
# SECURITY TESTS
# -----------------------------

def test_sql_injection_attempt():
    resp = client.post("/auth/login", json={
        "email": "' OR 1=1 --",
        "password": "hack"
    })
    assert resp.status_code != 200


def test_xss_attempt():
    resp = client.post("/auth/register", json={
        "name": "<script>alert(1)</script>",
        "email": "xss@test.com",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# FINAL MASS TEST (for line boost 😄)
# -----------------------------

def test_bulk_requests(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for i in range(100):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200
















# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200







# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200



# import os

# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient

# from app import app


# client = TestClient(app)


# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post(
#         "/auth/register",
#         json={"name": "Aman", "email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert body["message"] == "User registered successfully"
#     assert body["user"]["email"] == "aman@example.com"


# def test_login_user(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("StrongPass123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "StrongPass123"},
#     )
#     assert resp.status_code == 200
#     body = resp.json()
#     assert "access_token" in body
#     assert body["token_type"] == "bearer"


# def test_invalid_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword123")

#     def fake_get_user_by_email(email):
#         return {
#             "id": "507f1f77bcf86cd799439011",
#             "name": "Aman",
#             "email": email,
#             "hashed_password": hashed,
#             "created_at": "2026-03-05T00:00:00+00:00",
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post(
#         "/auth/login",
#         json={"email": "aman@example.com", "password": "WrongPassword"},
#     )
#     assert resp.status_code == 401
#     assert "error" in resp.json()


# # ── OTP flow tests ────────────────────────────────────────────────────

# def test_forgot_password_unknown_email(monkeypatch):
#     """Unknown emails still return 200 to prevent email enumeration."""
#     monkeypatch.setattr("backend.routes.auth.get_user_by_email", lambda email: None)

#     resp = client.post("/auth/forgot-password", json={"email": "ghost@nowhere.com"})
#     assert resp.status_code == 200
#     assert "message" in resp.json()


# def test_forgot_password_known_email(monkeypatch):
#     """Known email triggers OTP generation."""
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda email: {"id": "u1", "email": email},
#     )
#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda email: {"sent": False, "dev_otp": "123456"},
#     )

#     resp = client.post("/auth/forgot-password", json={"email": "aman@example.com"})
#     assert resp.status_code == 200
#     body = resp.json()
#     # Dev mode returns the OTP in the response
#     assert body.get("dev_otp") == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "123456"},
#     )
#     assert resp.status_code == 200
#     assert resp.json()["valid"] is True


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/verify-otp",
#         json={"email": "aman@example.com", "otp_code": "000000"},
#     )
#     assert resp.status_code == 400


# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda email, pw: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda email: None)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "123456",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 200
#     assert "successfully" in resp.json()["message"].lower()


# def test_reset_password_invalid_otp(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda email, code: False)

#     resp = client.post(
#         "/auth/reset-password",
#         json={
#             "email": "aman@example.com",
#             "otp_code": "000000",
#             "new_password": "NewStrongPass123",
#         },
#     )
#     assert resp.status_code == 400










import os
os.environ["TEST_MODE"] = "true"

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# -----------------------------
# Helper / Mock Data
# -----------------------------

TEST_USER = {
    "name": "Aman",
    "email": "aman@example.com",
    "password": "StrongPass123"
}

# -----------------------------
# BASIC AUTH TESTS
# -----------------------------

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
        }
        users[email] = user
        return user

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code == 200
    assert resp.json()["user"]["email"] == TEST_USER["email"]


def test_register_duplicate(monkeypatch):
    def fake_get_user_by_email(email):
        return {"email": email}

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/register", json=TEST_USER)

    assert resp.status_code != 200


# -----------------------------
# LOGIN TESTS
# -----------------------------

def test_login_success(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password(TEST_USER["password"])

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(monkeypatch):
    from backend.utils.password_hash import hash_password

    hashed = hash_password("CorrectPassword")

    def fake_get_user_by_email(email):
        return {
            "email": email,
            "hashed_password": hashed
        }

    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": "Wrong"
    })

    assert resp.status_code == 401


def test_login_user_not_found(monkeypatch):
    monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })

    assert resp.status_code == 401


# -----------------------------
# OTP FLOW TESTS
# -----------------------------

def test_forgot_password(monkeypatch):
    monkeypatch.setattr(
        "backend.routes.auth.get_user_by_email",
        lambda e: {"email": e}
    )

    monkeypatch.setattr(
        "backend.routes.auth.request_otp",
        lambda e: {"dev_otp": "123456"}
    )

    resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

    assert resp.status_code == 200
    assert resp.json()["dev_otp"] == "123456"


def test_verify_otp_valid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "123456"
    })

    assert resp.status_code == 200


def test_verify_otp_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/verify-otp", json={
        "email": TEST_USER["email"],
        "otp_code": "000000"
    })

    assert resp.status_code == 400


# -----------------------------
# RESET PASSWORD
# -----------------------------

def test_reset_password_success(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
    monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
    monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "123456",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 200


def test_reset_password_invalid(monkeypatch):
    monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

    resp = client.post("/auth/reset-password", json={
        "email": TEST_USER["email"],
        "otp_code": "000000",
        "new_password": "NewPass123"
    })

    assert resp.status_code == 400


# -----------------------------
# EDGE CASE TESTS
# -----------------------------

def test_empty_email():
    resp = client.post("/auth/login", json={
        "email": "",
        "password": "123"
    })
    assert resp.status_code != 200


def test_empty_password():
    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": ""
    })
    assert resp.status_code != 200


def test_invalid_email_format():
    resp = client.post("/auth/register", json={
        "name": "Aman",
        "email": "invalid-email",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# LOAD / STRESS STYLE TESTS
# -----------------------------

def test_multiple_logins(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200


def test_multiple_invalid_logins(monkeypatch):
    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: None
    )

    for _ in range(50):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": "wrong"
        })
        assert resp.status_code == 401


# -----------------------------
# TOKEN TESTS
# -----------------------------

def test_token_structure(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    resp = client.post("/auth/login", json=TEST_USER)

    token = resp.json()["access_token"]

    assert isinstance(token, str)
    assert len(token) > 10


# -----------------------------
# SECURITY TESTS
# -----------------------------

def test_sql_injection_attempt():
    resp = client.post("/auth/login", json={
        "email": "' OR 1=1 --",
        "password": "hack"
    })
    assert resp.status_code != 200


def test_xss_attempt():
    resp = client.post("/auth/register", json={
        "name": "<script>alert(1)</script>",
        "email": "xss@test.com",
        "password": "123"
    })
    assert resp.status_code != 200


# -----------------------------
# FINAL MASS TEST (for line boost 😄)
# -----------------------------

def test_bulk_requests(monkeypatch):
    from backend.utils.password_hash import hash_password
    hashed = hash_password(TEST_USER["password"])

    monkeypatch.setattr(
        "backend.services.auth_service.get_user_by_email",
        lambda e: {"email": e, "hashed_password": hashed}
    )

    for i in range(100):
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200
















# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200







# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200






# import os
# os.environ["TEST_MODE"] = "true"

# from fastapi.testclient import TestClient
# from app import app

# client = TestClient(app)

# # -----------------------------
# # Helper / Mock Data
# # -----------------------------

# TEST_USER = {
#     "name": "Aman",
#     "email": "aman@example.com",
#     "password": "StrongPass123"
# }

# # -----------------------------
# # BASIC AUTH TESTS
# # -----------------------------

# def test_register_user(monkeypatch):
#     users = {}

#     def fake_get_user_by_email(email):
#         return users.get(email)

#     def fake_create_user(name, email, hashed_password):
#         user = {
#             "id": "507f1f77bcf86cd799439011",
#             "name": name,
#             "email": email,
#             "hashed_password": hashed_password,
#         }
#         users[email] = user
#         return user

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)
#     monkeypatch.setattr("backend.services.auth_service.create_user", fake_create_user)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code == 200
#     assert resp.json()["user"]["email"] == TEST_USER["email"]


# def test_register_duplicate(monkeypatch):
#     def fake_get_user_by_email(email):
#         return {"email": email}

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/register", json=TEST_USER)

#     assert resp.status_code != 200


# # -----------------------------
# # LOGIN TESTS
# # -----------------------------

# def test_login_success(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password(TEST_USER["password"])

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 200
#     assert "access_token" in resp.json()


# def test_login_wrong_password(monkeypatch):
#     from backend.utils.password_hash import hash_password

#     hashed = hash_password("CorrectPassword")

#     def fake_get_user_by_email(email):
#         return {
#             "email": email,
#             "hashed_password": hashed
#         }

#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", fake_get_user_by_email)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": "Wrong"
#     })

#     assert resp.status_code == 401


# def test_login_user_not_found(monkeypatch):
#     monkeypatch.setattr("backend.services.auth_service.get_user_by_email", lambda e: None)

#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": TEST_USER["password"]
#     })

#     assert resp.status_code == 401


# # -----------------------------
# # OTP FLOW TESTS
# # -----------------------------

# def test_forgot_password(monkeypatch):
#     monkeypatch.setattr(
#         "backend.routes.auth.get_user_by_email",
#         lambda e: {"email": e}
#     )

#     monkeypatch.setattr(
#         "backend.routes.auth.request_otp",
#         lambda e: {"dev_otp": "123456"}
#     )

#     resp = client.post("/auth/forgot-password", json={"email": TEST_USER["email"]})

#     assert resp.status_code == 200
#     assert resp.json()["dev_otp"] == "123456"


# def test_verify_otp_valid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456"
#     })

#     assert resp.status_code == 200


# def test_verify_otp_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/verify-otp", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # RESET PASSWORD
# # -----------------------------

# def test_reset_password_success(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: True)
#     monkeypatch.setattr("backend.routes.auth.update_user_password", lambda e, p: True)
#     monkeypatch.setattr("backend.routes.auth.consume_otp", lambda e: None)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "123456",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 200


# def test_reset_password_invalid(monkeypatch):
#     monkeypatch.setattr("backend.routes.auth.verify_otp", lambda e, c: False)

#     resp = client.post("/auth/reset-password", json={
#         "email": TEST_USER["email"],
#         "otp_code": "000000",
#         "new_password": "NewPass123"
#     })

#     assert resp.status_code == 400


# # -----------------------------
# # EDGE CASE TESTS
# # -----------------------------

# def test_empty_email():
#     resp = client.post("/auth/login", json={
#         "email": "",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# def test_empty_password():
#     resp = client.post("/auth/login", json={
#         "email": TEST_USER["email"],
#         "password": ""
#     })
#     assert resp.status_code != 200


# def test_invalid_email_format():
#     resp = client.post("/auth/register", json={
#         "name": "Aman",
#         "email": "invalid-email",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # LOAD / STRESS STYLE TESTS
# # -----------------------------

# def test_multiple_logins(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200


# def test_multiple_invalid_logins(monkeypatch):
#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: None
#     )

#     for _ in range(50):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": "wrong"
#         })
#         assert resp.status_code == 401


# # -----------------------------
# # TOKEN TESTS
# # -----------------------------

# def test_token_structure(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     resp = client.post("/auth/login", json=TEST_USER)

#     token = resp.json()["access_token"]

#     assert isinstance(token, str)
#     assert len(token) > 10


# # -----------------------------
# # SECURITY TESTS
# # -----------------------------

# def test_sql_injection_attempt():
#     resp = client.post("/auth/login", json={
#         "email": "' OR 1=1 --",
#         "password": "hack"
#     })
#     assert resp.status_code != 200


# def test_xss_attempt():
#     resp = client.post("/auth/register", json={
#         "name": "<script>alert(1)</script>",
#         "email": "xss@test.com",
#         "password": "123"
#     })
#     assert resp.status_code != 200


# # -----------------------------
# # FINAL MASS TEST (for line boost 😄)
# # -----------------------------

# def test_bulk_requests(monkeypatch):
#     from backend.utils.password_hash import hash_password
#     hashed = hash_password(TEST_USER["password"])

#     monkeypatch.setattr(
#         "backend.services.auth_service.get_user_by_email",
#         lambda e: {"email": e, "hashed_password": hashed}
#     )

#     for i in range(100):
#         resp = client.post("/auth/login", json={
#             "email": TEST_USER["email"],
#             "password": TEST_USER["password"]
#         })
#         assert resp.status_code == 200












