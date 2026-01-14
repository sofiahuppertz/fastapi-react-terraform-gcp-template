from pydantic import BaseModel, EmailStr


class ActivateUserRequest(BaseModel):
    """Schema for account activation request"""
    email: EmailStr
    activation_code: str