from pydantic import BaseModel, field_validator


class ResetPasswordRequest(BaseModel):
    """Schema for password reset request"""
    code: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v