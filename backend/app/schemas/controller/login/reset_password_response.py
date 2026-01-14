from pydantic import BaseModel


class ResetPasswordResponse(BaseModel):
    """Schema for password reset response"""
    message: str
    success: bool