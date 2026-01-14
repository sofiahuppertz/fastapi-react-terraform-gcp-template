from sqlalchemy import Column, String, Boolean, DateTime

from app.models.base import BaseModel


class User(BaseModel):
    """User model for storing user information"""
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_superuser = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    activation_code = Column(String, nullable=True)
    reset_password_code = Column(String, nullable=True)
    last_connected_at = Column(DateTime(timezone=True), nullable=True)

