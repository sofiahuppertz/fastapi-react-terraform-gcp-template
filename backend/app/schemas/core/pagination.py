from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Generic paginated response schema.

    Usage example with UserResponse:

        from app.schemas.core.pagination import PaginatedResponse, PaginationParams
        from app.schemas.model.user import UserResponse

        @router.get("/users", response_model=PaginatedResponse[UserResponse])
        def list_users(
            page: int = Query(1, ge=1),
            page_size: int = Query(20, ge=1, le=100),
            db: Session = Depends(get_db)
        ):
            pagination = PaginationParams(page=page, page_size=page_size)

            total = db.query(User).count()
            users = db.query(User).offset(pagination.offset).limit(pagination.limit).all()

            return PaginatedResponse[UserResponse].create(
                items=users,
                total=total,
                page=pagination.page,
                page_size=pagination.page_size
            )
    """
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(cls, items: List[T], total: int, page: int, page_size: int) -> "PaginatedResponse[T]":
        """Factory method to create a paginated response"""
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class PaginationParams(BaseModel):
    """Query parameters for pagination"""
    page: int = 1
    page_size: int = 20

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size