from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import logging
from app.core.logging import logger
from app.core.config import API_VERSION, SERVICE_NAME

# Import middleware
from app.middleware import correlation_id_middleware

# Import routers
from app.routes.public import public_router
from app.routes.private import private_router
from app.routes.health import health_router

app = FastAPI(
    title=SERVICE_NAME,
    version=API_VERSION,
)

# Setup middleware
app.middleware("http")(correlation_id_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(public_router)
app.include_router(private_router)
app.include_router(health_router)


@app.get("/", include_in_schema=False)
async def root():
    return {"status": "ok", "service": SERVICE_NAME, "version": API_VERSION}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
