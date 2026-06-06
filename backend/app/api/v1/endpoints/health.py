from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "ok",
        "message": "CertForge AI API is running properly with MongoDB Atlas."
    }
