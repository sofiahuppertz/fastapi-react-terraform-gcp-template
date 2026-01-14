import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.auth import Auth
from app.core.database import get_db
from app.exceptions import AuthError
from app.schemas.core.jwt_payload import JWTPayload
from app.schemas.controller.login.login_response import LoginResponse
from app.schemas.controller.login.refresh_response import RefreshResponse
from app.schemas.controller.login.register_response import RegisterResponse
from app.schemas.controller.login.activate_user_request import ActivateUserRequest
from app.schemas.controller.login.activate_user_response import ActivateUserResponse
from app.schemas.controller.login.forgot_password_request import ForgotPasswordRequest
from app.schemas.controller.login.forgot_password_response import ForgotPasswordResponse
from app.schemas.controller.login.reset_password_request import ResetPasswordRequest
from app.schemas.controller.login.reset_password_response import ResetPasswordResponse
from app.schemas.controller.login.password_update_request import PasswordUpdateRequest
from app.schemas.controller.login.password_update_response import PasswordUpdateResponse
from app.schemas.controller.login.me_response import MeResponse
from app.schemas.model.user.user_create import UserCreate
from app.services.auth.auth import AuthService

logger = logging.getLogger(__name__)

auth_router = APIRouter()
auth_service = AuthService()


@auth_router.post("/register", response_model=RegisterResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user account."""
    try:
        logger.info(f"Registering user: {user_data.email}")
        user = auth_service.register_user(db, user_data)
        return RegisterResponse(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            is_superuser=user.is_superuser
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@auth_router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access and refresh tokens."""
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise AuthError("Incorrect email or password")
    response = auth_service.create_tokens(db, user.id)
    return response


@auth_router.post("/refresh", response_model=RefreshResponse)
async def refresh_access_token(
    user_data: JWTPayload = Depends(auth_service.auth.get_user_from_refresh_token),
    db: Session = Depends(get_db)
):
    """Get a new access token using a refresh token."""
    try:
        return auth_service.refresh_access_token(db, user_data.sub)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in refresh token endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during token refresh",
            headers={"WWW-Authenticate": "Bearer"},
        )


@auth_router.get("/me", response_model=MeResponse)
async def get_current_user_info(
    current_user: JWTPayload = Depends(auth_service.auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information."""
    user = auth_service.get_user_by_id(db, UUID(current_user.sub))
    return MeResponse(
        id=user.id,
        email=user.email,
        is_superuser=user.is_superuser,
        is_active=user.is_active,
        last_connected_at=user.last_connected_at,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@auth_router.post("/activate", response_model=ActivateUserResponse)
async def activate_user(
    request: ActivateUserRequest,
    db: Session = Depends(get_db)
):
    """Activate user account with activation code."""
    try:
        auth_service.activate_user(db, request.email, request.activation_code)
        return ActivateUserResponse(message="Account activated successfully", success=True)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@auth_router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Request password reset email."""
    auth_service.request_password_reset(db, request.email)
    return ForgotPasswordResponse(message="If the email exists, a password reset link has been sent")


@auth_router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset password with code."""
    try:
        auth_service.reset_password(db, request.code, request.new_password)
        return ResetPasswordResponse(message="Password reset successfully", success=True)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@auth_router.put("/password", response_model=PasswordUpdateResponse)
async def change_password(
    password_data: PasswordUpdateRequest,
    current_user: JWTPayload = Depends(Auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's password."""
    auth_service.update_password(
        db,
        UUID(current_user.sub),
        password_data.current_password,
        password_data.new_password
    )
    return PasswordUpdateResponse(message="Password updated successfully", success=True)

