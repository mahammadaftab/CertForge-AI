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

async def init_db():
    """
    Initializes the MongoDB Atlas connection and Beanie ODM.
    """
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
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
