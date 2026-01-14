import logging
import secrets
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.auth import Auth
from app.core.email_service import EmailService
from app.models.user import User

from app.exceptions.database import ConflictError, NotFoundError
from app.exceptions.auth import AuthError
from app.repositories.user import UserRepo
from app.schemas.model.user.user_create import UserCreate
from app.schemas.controller.login.login_response import LoginResponse
from app.schemas.controller.login.refresh_response import RefreshResponse

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self):
        self.auth = Auth()
        self.email_service = None
        try:
            self.email_service = EmailService()
        except ValueError as e:
            logger.warning(f"EmailService not initialized: {e}. Emails will not be sent.")

    @staticmethod
    def _generate_code(length: int = 6) -> str:
        """Generate a random numeric code."""
        return ''.join([str(secrets.randbelow(10)) for _ in range(length)])

    def refresh_access_token(self, db: Session, user_id: str) -> RefreshResponse:
        """Create a new access token using a refresh token."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=UUID(user_id))
        if not user:
            raise NotFoundError("User", str(user_id))
        access_token = self.auth.create_access_token(UUID(user_id))
        return RefreshResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=self.auth.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    def create_tokens(self, db: Session, user_id: UUID) -> LoginResponse:
        """Create both access and refresh tokens for the user."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        access_token = self.auth.create_access_token(user_id)
        refresh_token = self.auth.create_refresh_token(user_id)
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=self.auth.ACCESS_TOKEN_EXPIRE_MINUTES,
            is_superuser=user.is_superuser
        )

    def authenticate_user(self, db: Session, email: str, password: str) -> User | None:
        """Authenticate user by email and password. Returns user or None."""
        user_repo = UserRepo(db)
        user = user_repo.get(email=email)
        if not user or not self.auth.verify_password(password, user.password):
            return None
        if not user.is_active:
            raise AuthError("Account is not activated. Please check your email for the activation code.")
        user_repo.update(user.id, last_connected_at=datetime.now())
        return user

    def register_user(self, db: Session, user_data: UserCreate) -> User:
        """Register a new user with activation code."""
        user_repo = UserRepo(db)
        existing_user = user_repo.get(email=user_data.email)
        if existing_user:
            raise ConflictError("Email", "already registered")

        hashed_password = self.auth.get_password_hash(user_data.password)
        activation_code = self._generate_code()

        user = User(
            email=user_data.email,
            password=hashed_password,
            is_superuser=user_data.is_superuser if user_data.is_superuser else False,
            is_active=False,
            activation_code=activation_code
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Send activation email
        if self.email_service:
            email_sent = self.email_service.send_activation_email(user.email, activation_code)
            if not email_sent:
                logger.error(f"Failed to send activation email to {user.email}")
        else:
            logger.warning(f"Email service not available. Activation code for {user.email}: {activation_code}")

        return user

    def activate_user(self, db: Session, email: str, activation_code: str) -> User:
        """Activate a user account with the provided activation code."""
        user_repo = UserRepo(db)
        user = user_repo.get(email=email)

        if not user:
            raise NotFoundError("User", email)

        if user.is_active:
            raise HTTPException(status_code=400, detail="Account is already activated")

        if user.activation_code != activation_code:
            raise HTTPException(status_code=400, detail="Invalid activation code")

        return user_repo.update(user.id, is_active=True, activation_code=None)

    def request_password_reset(self, db: Session, email: str) -> None:
        """Request a password reset. Generates reset code if user exists."""
        user_repo = UserRepo(db)
        user = user_repo.get(email=email)

        # Always return success to prevent email enumeration
        if not user:
            return

        reset_code = self._generate_code()
        user_repo.update(user.id, reset_password_code=reset_code)

        # Send password reset email
        if self.email_service:
            email_sent = self.email_service.send_password_reset_email(user.email, reset_code)
            if not email_sent:
                logger.error(f"Failed to send password reset email to {user.email}")
        else:
            logger.warning(f"Email service not available. Password reset code for {user.email}: {reset_code}")

    def reset_password(self, db: Session, code: str, new_password: str) -> User:
        """Reset password using the reset code."""
        user_repo = UserRepo(db)
        user = user_repo.get(reset_password_code=code)

        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired reset code")

        hashed_password = self.auth.get_password_hash(new_password)
        return user_repo.update(user.id, password=hashed_password, reset_password_code=None)

    def get_user_by_id(self, db: Session, user_id: UUID) -> User:
        """Get user by ID."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        return user

    def create_user(self, db: Session, user_data: UserCreate) -> User:
        """Create a new user (only superusers can do this)."""
        user_repo = UserRepo(db)
        existing_user = user_repo.get(email=user_data.email)
        if existing_user:
            raise ConflictError("Email", "already registered")
        hashed_password = self.auth.get_password_hash(user_data.password)
        return user_repo.create(user_data.email, hashed_password, user_data.is_superuser)

    def delete_user(self, db: Session, user_id: UUID, admin_user_id: UUID) -> None:
        """Delete a user (only superusers can do this)."""
        if user_id == admin_user_id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        user_repo = UserRepo(db)
        user_repo.delete(user_id)  # Raises NotFoundError if user doesn't exist

    def update_password(self, db: Session, user_id: UUID, current_password: str, new_password: str) -> User:
        """Update user's password after verifying current password."""
        user_repo = UserRepo(db)
        user = user_repo.get(id=user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        if not self.auth.verify_password(current_password, user.password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        if self.auth.verify_password(new_password, user.password):
            raise HTTPException(status_code=400, detail="New password must be different from current password")
        new_hashed_password = self.auth.get_password_hash(new_password)
        return user_repo.update(user_id, password=new_hashed_password)