import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.db import database

# Setup custom logging
setup_logging()
logger = logging.getLogger(__name__)

DB_INIT_MAX_RETRIES = 3
DB_INIT_RETRY_DELAY_SECONDS = 2

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.API_VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set all CORS enabled origins
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Include routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.on_event("startup")
    async def startup_event():
        logger.info(f"Starting {settings.PROJECT_NAME} API...")
        for attempt in range(1, DB_INIT_MAX_RETRIES + 1):
            await database.init_db()
            if database.db_initialized:
                logger.info("MongoDB Atlas connected and Beanie initialized.")
                return
            logger.warning(
                f"MongoDB connection attempt {attempt}/{DB_INIT_MAX_RETRIES} failed. "
                f"Retrying in {DB_INIT_RETRY_DELAY_SECONDS}s..."
            )
            await asyncio.sleep(DB_INIT_RETRY_DELAY_SECONDS)
        logger.error(
            "All MongoDB connection attempts failed. "
            "API will start but DB-dependent routes will return 503."
        )

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info(f"Shutting down {settings.PROJECT_NAME} API...")

    return app

app = create_app()
