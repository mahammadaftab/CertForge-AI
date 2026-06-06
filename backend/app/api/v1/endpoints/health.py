from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db

router = APIRouter()

@router.get("/")
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint.
    """
    return {
        "status": "ok",
        "message": "CertForge AI API is running properly."
    }
