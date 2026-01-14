from pydantic import BaseModel


class ForgotPasswordResponse(BaseModel):
    """Schema for forgot password response"""
    message: str