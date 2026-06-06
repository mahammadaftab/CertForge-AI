from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, intelligence, semantic, assessment, predictor

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])
api_router.include_router(semantic.router, prefix="/semantic", tags=["semantic"])
api_router.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
api_router.include_router(predictor.router, prefix="/predictor", tags=["predictor"])
