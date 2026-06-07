from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api import deps
from app.models.certification import Certification

router = APIRouter()

class CertificationCreate(BaseModel):
    name: str
    provider: str
    code: str
    description: str
    level: str

@router.get("/", response_model=List[Any])
async def list_certifications(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Retrieve all available certifications from the catalog.
    """
    certs = await Certification.find_all().to_list()
    return certs

@router.post("/", response_model=Any)
async def create_certification(
    cert_in: CertificationCreate, 
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Create a new certification entry. Restricted to managers and admins.
    """
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough privileges to create certifications")
    
    existing = await Certification.find_one(Certification.code == cert_in.code)
    if existing:
        raise HTTPException(status_code=400, detail="Certification with this code already exists")

    cert = Certification(
        name=cert_in.name,
        provider=cert_in.provider,
        code=cert_in.code,
        description=cert_in.description,
        level=cert_in.level
    )
    await cert.insert()
    return cert
