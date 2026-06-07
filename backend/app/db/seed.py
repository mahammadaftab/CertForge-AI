import logging
import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole
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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    logger.info("Initializing industrial-strength seed sequence...")
    client = AsyncIOMotorClient(settings.MONGODB_URL, uuidRepresentation='standard')
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[User, Employee, Manager, Team, Certification, LearningPath, StudyPlan, Assessment, AssessmentResult, ReadinessScore, Notification, AuditLog, Report]
    )

    # Clean existing data for fresh seed (Optional, remove in production)
    # logger.info("Clearing existing data...")
    # await User.find_all().delete()
    # await Employee.find_all().delete()
    # ... etc

    # 1. Create 20 Certifications
    certs = []
    providers = ["Microsoft", "AWS", "Google", "Cisco", "HashiCorp"]
    levels = ["Beginner", "Intermediate", "Expert"]
    
    for i in range(1, 21):
        provider = random.choice(providers)
        code = f"{provider[:2]}-{100 + i}"
        name = f"{provider} Professional {i}"
        
        cert = await Certification.find_one(Certification.code == code)
        if not cert:
            cert = Certification(
                name=name,
                provider=provider,
                code=code,
                description=f"Industrial blueprint for {name}. High-fidelity curriculum.",
                level=random.choice(levels)
            )
            await cert.insert()
        certs.append(cert)
    logger.info("20 Certifications verified.")

    # 2. Create 10 Teams and Managers
    teams = []
    departments = ["Cloud Ops", "Security", "AI/ML", "DevOps", "Infrastructure", "FinOps", "Data Eng"]
    
    for i in range(1, 11):
        m_email = f"manager{i}@certforge.ai"
        m_user = await User.find_one(User.email == m_email)
        if not m_user:
            m_user = User(
                email=m_email,
                hashed_password=get_password_hash("securepass"),
                full_name=f"Manager {i}",
                role=UserRole.MANAGER
            )
            await m_user.insert()
            
            manager = Manager(user=m_user, department=random.choice(departments))
            await manager.insert()
            
            team = Team(name=f"Squad {i} — {manager.department}", description=f"Strategic cluster {i}", manager=manager)
            await team.insert()
            teams.append(team)
        else:
            team = await Team.find_one({"name": {"$regex": f"Squad {i}"}})
            if team: teams.append(team)
    logger.info("10 Teams and Managers online.")

    # 3. Create 100 Employees
    titles = ["Cloud Engineer", "Security Analyst", "Systems Architect", "Data Scientist", "DevOps Specialist"]
    
    for i in range(1, 101):
        email = f"employee{i}@certforge.ai"
        user = await User.find_one(User.email == email)
        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash("employeePass"),
                full_name=f"Employee {i}",
                role=UserRole.EMPLOYEE
            )
            await user.insert()
            
            target_team = random.choice(teams)
            emp = Employee(
                user=user,
                job_title=random.choice(titles),
                team_id=target_team.name
            )
            await emp.insert()
            
            # Generate Real Artifacts for each employee
            # Random readiness for a random cert
            target_cert = random.choice(certs)
            readiness = ReadinessScore(
                employee=emp,
                certification=target_cert,
                score=float(random.randint(40, 98)),
                ai_feedback="Cognitive trajectory aligned with blueprint targets."
            )
            await readiness.insert()
            
            # Audit log for session start
            await AuditLog(user=user, action="NEURAL_SYNC", details={"type": "initialization"}).insert()

    logger.info("100 Employees and workforce signals successfully mapped to Atlas.")

if __name__ == "__main__":
    asyncio.run(seed_data())
