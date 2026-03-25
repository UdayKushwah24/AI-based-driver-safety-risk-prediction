"""Authentication routes: register, login, forgot/reset password via OTP."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from backend.database.mongo import get_user_by_email, update_user_password
from backend.models.user import TokenResponse, UserCreate, UserLogin
from backend.services.auth_service import login_user, register_user
from backend.services.otp_service import consume_otp, request_otp, verify_otp
from backend.utils.password_hash import hash_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ── Pydantic models for OTP flow ──────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(min_length=6, max_length=6)


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=8, max_length=128)


# ── Routes ────────────────────────────────────────────────────────────

@router.post("/register")
def register(payload: UserCreate):
    user = register_user(payload)
    return {"message": "User registered successfully", "user": user.model_dump()}


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    token, user = login_user(payload.email, payload.password)
    return TokenResponse(access_token=token, user=user)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    """
    Trigger OTP generation for password reset.

    Always returns 200 to avoid leaking whether the email exists.
    The OTP is emailed (or logged to console in dev mode).
    """
    # Only send OTP if user exists — but never reveal non-existence to caller.
    user = get_user_by_email(payload.email)
    if user:
        result = request_otp(payload.email)
        # In dev mode (no SMTP), expose the OTP in the response for easy testing
        if result.get("dev_otp"):
            return {
                "message": "OTP generated (SMTP not configured — dev mode)",
                "dev_otp": result["dev_otp"],
            }
    return {"message": "If that email is registered, an OTP has been sent."}


@router.post("/verify-otp")
def verify_otp_endpoint(payload: VerifyOTPRequest):
    """Verify that the submitted OTP is valid and unexpired."""
    valid = verify_otp(payload.email, payload.otp_code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )
    return {"message": "OTP verified successfully", "valid": True}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    """Reset the user password after OTP verification."""
    valid = verify_otp(payload.email, payload.otp_code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    updated = update_user_password(payload.email, hash_password(payload.new_password))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or database unavailable",
        )

    consume_otp(payload.email)
    return {"message": "Password reset successfully"}
