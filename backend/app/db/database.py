import certifi
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from beanie.exceptions import CollectionWasNotInitialized
from app.core.config import settings
from app.models.user import User
from app.models.employee import Employee
from app.models.manager import Manager
from app.models.team import Team
from app.models.certification import Certification
from app.models.learning_path import LearningPath
from app.models.study_plan import StudyPlan
from app.models.assessment import Assessment
from app.models.assessment_result import AssessmentResult
from app.models.readiness_score import ReadinessScore
from app.models.notification import Notification
from app.models.audit_log import AuditLog

logger = logging.getLogger(__name__)

db_initialized = False

async def init_db():
    """
    Initializes the MongoDB Atlas connection and Beanie ODM.
    """
    global db_initialized
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
        )
        
        await init_beanie(
            database=client[settings.MONGODB_DB_NAME],
            document_models=[
                User,
                Employee,
                Manager,
                Team,
                Certification,
                LearningPath,
                StudyPlan,
                Assessment,
                AssessmentResult,
                ReadinessScore,
                Notification,
                AuditLog
            ]
        )
        db_initialized = True
        logger.info("MongoDB Atlas connected and Beanie initialized.")
    except Exception as e:
        db_initialized = False
        logger.error(
            f"Failed to connect to MongoDB Atlas: {e}\n"
            "Please check:\n"
            "  1. Is your MongoDB Atlas cluster running (not paused)?\n"
            "  2. Is your IP whitelisted in Atlas Network Access?\n"
            "  3. Is your MONGODB_URL in .env correct?"
        )
