from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.api import deps
from app.models.production import Certification, LearningPath, ActivityLog
from app.models.user import UserRole
from datetime import datetime

router = APIRouter()

class CertificationCreate(BaseModel):
    name: str
    provider: str
    code: str
    description: str
    level: str

class EnrollmentIn(BaseModel):
    certification_id: str

@router.get("/", response_model=List[Certification])
async def list_certifications(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Retrieve all available certifications from the catalog.
    """
    return await Certification.find_all().to_list()

@router.post("/", response_model=Certification)
async def create_certification(
    cert_in: CertificationCreate, 
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Create a new certification entry. Restricted to Root Admin.
    """
    if current_user.role != UserRole.ROOT_ADMIN:
        raise HTTPException(status_code=403, detail="Clearance insufficient for protocol registration")
    
    existing = await Certification.find_one(Certification.code == cert_in.code)
    if existing:
        raise HTTPException(status_code=400, detail="Certification with this code already exists")

    cert = Certification(**cert_in.dict())
    await cert.insert()
    
    # Log Activity
    log = ActivityLog(
        user_id=str(current_user.id),
        action=f"REGISTERED_PROTOCOL_{cert.code}",
        module="CERT_CATALOG",
        details=f"Admin registered {cert.name}"
    )
    await log.insert()
    
    return cert

@router.post("/enroll", response_model=LearningPath)
async def enroll_certification(
    enroll_in: EnrollmentIn,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Enrolls the current user in a certification and creates a learning path.
    """
    cert = await Certification.get(enroll_in.certification_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certification protocol not found")
        
    # Check if already enrolled
    existing = await LearningPath.find_one(
        LearningPath.user_id == str(current_user.id),
        LearningPath.certification_id == str(cert.id)
    )
    if existing:
        return existing
        
    path = LearningPath(
        user_id=str(current_user.id),
        certification_id=str(cert.id),
        title=cert.name,
        current_module="Introduction",
        status="enrolled",
        progress=0,
        milestones=[
            {"title": "Foundational discovery", "completed": False},
            {"title": "Blueprint synthesis", "completed": False},
            {"title": "Assessments", "completed": False}
        ]
    )
    await path.insert()
    
    # Log Activity
    log = ActivityLog(
        user_id=str(current_user.id),
        action=f"ENROLLED_{cert.code}",
        module="CERT_CATALOG"
    )
    await log.insert()
    
    return path

@router.get("/progress", response_model=List[LearningPath])
async def get_progress(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Retrieves all active learning paths for the user.
    """
    return await LearningPath.find(LearningPath.user_id == str(current_user.id)).to_list()

from app.services.ai.agents.learning_agent import learning_agent

@router.post("/start-learning/{path_id}", response_model=LearningPath)
async def start_learning(
    path_id: str,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Initializes a learning session for a specific path.
    """
    path = await LearningPath.get(path_id)
    if not path or path.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Learning trajectory not found")
        
    # Invoke Learning Agent to generate roadmap and goals
    await learning_agent.initialize_session(str(current_user.id), str(path.certification_id))
    
    path.status = "active"
    path.updated_at = datetime.utcnow()
    await path.save()
    
    return path
