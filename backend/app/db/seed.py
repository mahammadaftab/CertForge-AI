import logging
import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.production import (
    Certification, 
    LearningPath, 
    StudyPlan, 
    Assessment, 
    AssessmentResult, 
    ReadinessScore, 
    Notification, 
    AgentLog, 
    ActivityLog
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    logger.info("Initializing enterprise-tier seed sequence...")
    client = AsyncIOMotorClient(settings.MONGODB_URL, uuidRepresentation='standard')
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[
            User, Certification, LearningPath, StudyPlan, 
            Assessment, AssessmentResult, ReadinessScore, 
            Notification, AgentLog, ActivityLog
        ]
    )

    # 1. Create Root Admin
    admin_email = "admin@certforge.ai"
    admin_user = await User.find_one(User.email == admin_email)
    if not admin_user:
        admin_user = User(
            email=admin_email,
            hashed_password=get_password_hash("adminPass"),
            full_name="Root Administrator",
            role=UserRole.ROOT_ADMIN
        )
        await admin_user.insert()
    logger.info("Root Admin online.")

    # 2. Create 10 Certifications
    certs = []
    blueprints = [
        {"name": "Azure Solutions Architect Expert", "code": "AZ-305", "level": "Expert"},
        {"name": "Azure Administrator Associate", "code": "AZ-104", "level": "Intermediate"},
        {"name": "Azure Security Engineer Associate", "code": "AZ-500", "level": "Intermediate"},
        {"name": "Azure Fundamentals", "code": "AZ-900", "level": "Beginner"},
        {"name": "Azure Developer Associate", "code": "AZ-204", "level": "Intermediate"},
        {"name": "Azure AI Engineer Associate", "code": "AI-102", "level": "Intermediate"},
        {"name": "Azure Data Engineer Associate", "code": "DP-203", "level": "Intermediate"},
        {"name": "Azure Network Engineer Associate", "code": "AZ-700", "level": "Intermediate"},
        {"name": "Azure DevOps Engineer Expert", "code": "AZ-400", "level": "Expert"},
        {"name": "Fabric Analytics Engineer Associate", "code": "DP-600", "level": "Intermediate"}
    ]
    
    for bp in blueprints:
        cert = await Certification.find_one(Certification.code == bp["code"])
        if not cert:
            cert = Certification(
                name=bp["name"],
                provider="Microsoft",
                code=bp["code"],
                description=f"Official production protocol for {bp['name']}. Validated skill mesh.",
                level=bp["level"]
            )
            await cert.insert()
        certs.append(cert)
    logger.info("10 Enterprise Certifications verified.")

    # 3. Create Controllers and Associates
    titles = ["Cloud Architect", "Security Analyst", "Systems Engineer", "Data Scientist", "DevOps Lead"]
    depts = ["Cloud Ops", "Security", "AI/ML", "DevOps", "Infrastructure"]
    
    # Controllers
    for i in range(1, 4):
        c_email = f"controller{i}@certforge.ai"
        c_user = await User.find_one(User.email == c_email)
        if not c_user:
            c_user = User(
                email=c_email,
                hashed_password=get_password_hash("securepass"),
                full_name=f"Controller {i}",
                role=UserRole.CONTROLLER
            )
            await c_user.insert()
            
            # Audit log
            await ActivityLog(
                user_id=str(c_user.id), 
                action="CONTROLLER_REGISTRY_SYNC", 
                module="AUTH",
                details=f"Assigned to {random.choice(depts)} unit"
            ).insert()
            
    # Associates
    for i in range(1, 15):
        a_email = f"associate{i}@certforge.ai"
        a_user = await User.find_one(User.email == a_email)
        if not a_user:
            a_user = User(
                email=a_email,
                hashed_password=get_password_hash("associatePass"),
                full_name=f"Associate {i}",
                role=UserRole.ASSOCIATE
            )
            await a_user.insert()
            
            # Random readiness for a random cert
            target_cert = random.choice(certs)
            readiness = ReadinessScore(
                user_id=str(a_user.id),
                certification_id=str(target_cert.id),
                score=float(random.randint(40, 95)),
                dimensions={"Knowledge": 70, "Practical": 60, "Velocity": 80},
                strengths=["理論 Mastery"],
                weaknesses=["Implementation Latency"],
                recommendations=["Initialize Focus Cycle"],
                verification_status="Partial" if i % 2 == 0 else "Verified"
            )
            await readiness.insert()

    logger.info("Full enterprise workforce mesh successfully mapped to Atlas.")

if __name__ == "__main__":
    asyncio.run(seed_data())
