import certifi
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
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
from app.models.report import Report

logger = logging.getLogger(__name__)

db_initialized = False

async def init_db():
    global db_initialized
    """
    Initializes the MongoDB Atlas connection and Beanie ODM.
    """
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
            uuidRepresentation='standard'
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
                AuditLog,
                Report
            ]
        )
        logger.info("MongoDB Atlas connected and Beanie initialized.")
        db_initialized = True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB Atlas: {e}")
        db_initialized = False
