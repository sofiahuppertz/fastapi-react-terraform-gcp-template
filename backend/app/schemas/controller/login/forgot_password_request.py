from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    """Schema for forgot password request"""
    email: EmailStr