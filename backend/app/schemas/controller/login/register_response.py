from pydantic import BaseModel
from uuid import UUID


class RegisterResponse(BaseModel):
    """Schema for register response"""
    id: UUID
    email: str
    is_active: bool
    is_superuser: bool