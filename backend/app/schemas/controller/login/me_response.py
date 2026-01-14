from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class MeResponse(BaseModel):
    """Schema for current user info response"""
    id: UUID
    email: str
    is_superuser: bool
    is_active: bool
    last_connected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True