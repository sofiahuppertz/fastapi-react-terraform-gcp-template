import uuid
from fastapi import Request, Response

from app.core.context import set_correlation_id

CORRELATION_ID_HEADER = "X-Request-ID"


async def correlation_id_middleware(request: Request, call_next) -> Response:
    """
    Middleware that handles request correlation IDs for tracing.

    - Extracts existing correlation ID from X-Request-ID header
    - Generates a new UUID if none provided
    - Sets the ID in context for use in logging
    - Returns the ID in response headers
    """
    correlation_id = request.headers.get(CORRELATION_ID_HEADER) or str(uuid.uuid4())

    set_correlation_id(correlation_id)

    response: Response = await call_next(request)
    response.headers[CORRELATION_ID_HEADER] = correlation_id

    return response
