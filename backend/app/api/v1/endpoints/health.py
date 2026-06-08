from fastapi import APIRouter
from app.db import database

router = APIRouter()

@router.get("/")
async def health_check():
    """
    Health check endpoint with DB status.
    """
    return {
        "status": "ok" if database.db_initialized else "degraded",
        "database": "connected" if database.db_initialized else "disconnected",
        "message": "CertForge AI API is running." if database.db_initialized else "CertForge AI API is running but MongoDB Atlas is disconnected."
    }
