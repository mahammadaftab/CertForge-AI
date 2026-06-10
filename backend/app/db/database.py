import certifi
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.production import (
    Role, Certification, LearningPath, Assessment,
    ReadinessScore, Prediction, AgentLog, ActivityLog, Notification, StudyPlan, AssessmentResult
)

logger = logging.getLogger(__name__)

db_initialized = False

async def init_db():
    global db_initialized
    if not settings.MONGODB_URL:
        logger.error("MONGODB_URL is not set in environment variables.")
        db_initialized = False
        return

    # Filter out redundant models if they are imported from multiple places
    document_models = [
        User,
        Role,
        Certification,
        LearningPath,
        Assessment,
        AssessmentResult,
        ReadinessScore,
        Prediction,
        AgentLog,
        ActivityLog,
        Notification,
        StudyPlan
    ]

    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
            uuidRepresentation='standard'
        )
        await client.server_info()
        
        await init_beanie(
            database=client[settings.MONGODB_DB_NAME],
            document_models=document_models
        )
        logger.info("Production MongoDB Architecture Initialized with Beanie.")
        db_initialized = True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        db_initialized = False
