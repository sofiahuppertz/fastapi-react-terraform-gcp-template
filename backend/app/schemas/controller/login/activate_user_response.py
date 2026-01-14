from pydantic import BaseModel


class ActivateUserResponse(BaseModel):
    """Schema for account activation response"""
    message: str
    success: bool