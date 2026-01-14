from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Literal

from app.core.database import get_db
from app.core.config import API_VERSION, SERVICE_NAME

health_router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: Literal["healthy", "unhealthy"]
    service: str
    version: str
    database: Literal["connected", "disconnected"]


@health_router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    """Health check endpoint with database connectivity verification"""
    db_status: Literal["connected", "disconnected"] = "disconnected"

    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass

    status: Literal["healthy", "unhealthy"] = "healthy" if db_status == "connected" else "unhealthy"

    return HealthResponse(
        status=status,
        service=SERVICE_NAME,
        version=API_VERSION,
        database=db_status
    )
