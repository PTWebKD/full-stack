from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    phone: Optional[str] = None
    referred_by: Optional[int] = None  # legacy: raw internal user_id, kept for backward compat
    referral_code: Optional[str] = None  # UC-11: shareable code, e.g. "FIT00042"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class OTPRequestIn(BaseModel):
    phone: str


class OTPVerifyIn(BaseModel):
    phone: str
    otp_code: str
