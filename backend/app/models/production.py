from typing import Optional, List
from datetime import datetime
from beanie import Document
from pydantic import Field, EmailStr
from app.db.base_class import BaseDocument
from app.models.user import UserRole, User
import enum

# --- ENUMS ---

class LogStatus(str, enum.Enum):
    INFO = "info"
    ACTION = "action"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"

# --- MODELS ---

class Role(BaseDocument):
    name: str
    permissions: List[str] = []
    
    class Settings:
        name = "roles"

class Certification(BaseDocument):
    name: str
    code: str
    provider: str = "Microsoft"
    level: str = "Beginner"
    description: str
    requirements: List[str] = []

    class Settings:
        name = "certifications"

class LearningPath(BaseDocument):
    user_id: str
    certification_id: str
    title: str
    progress: int = 0
    status: str = "active"
    current_module: str
    milestones: List[dict] = []

    class Settings:
        name = "learning_paths"

class Assessment(BaseDocument):
    certification_id: str
    difficulty: str = "Adaptive"
    questions: List[dict] = []

    class Settings:
        name = "assessments"

class AssessmentResult(BaseDocument):
    user_id: str
    assessment_id: str
    certification_id: str
    score: float
    responses: List[dict] = []
    evaluation: dict = {}

    class Settings:
        name = "assessment_results"

class ReadinessScore(BaseDocument):
    user_id: str
    certification_id: str
    score: float
    dimensions: dict = {}
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    verification_status: str = "Pending"

    class Settings:
        name = "readiness_scores"

class Prediction(BaseDocument):
    user_id: str
    certification_target: str
    pass_probability: float
    risk_score: float
    risk_level: str = "Low"
    readiness_score: float
    confidence_score: float = 0.0
    recommendations: str
    dimensions: dict = {}

    class Settings:
        name = "predictions"

class AgentLog(BaseDocument):
    agent_name: str
    action: str
    status: LogStatus = LogStatus.INFO
    details: Optional[str] = None
    workflow_id: Optional[str] = None

    class Settings:
        name = "agent_logs"

class ActivityLog(BaseDocument):
    user_id: str
    action: str
    module: str
    details: Optional[str] = None
    ip_address: Optional[str] = None

    class Settings:
        name = "activity_logs"

class Notification(BaseDocument):
    user_id: str
    title: str
    message: str
    type: str = "info"
    is_read: bool = False

    class Settings:
        name = "notifications"

class StudyPlan(BaseDocument):
    user_id: str
    certification_id: str
    roadmap: List[dict] = []
    weekly_goals: List[dict] = []
    timeline: List[dict] = []

    class Settings:
        name = "study_plans"
