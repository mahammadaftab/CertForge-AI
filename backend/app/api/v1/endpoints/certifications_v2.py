from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.production import Certification
from app.models.user import UserRole
from app.api import deps
from app.db.repository import BaseRepository

router = APIRouter()
cert_repo = BaseRepository(Certification)

@router.post("/", response_model=Certification)
async def create_certification(
    cert: Certification,
    current_user = Depends(deps.get_current_active_user)
):
    if current_user.role != UserRole.ROOT_ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await cert_repo.create(cert)

@router.get("/", response_model=List[Certification])
async def list_certifications():
    return await cert_repo.get_all()

@router.get("/{id}", response_model=Certification)
async def get_certification(id: str):
    cert = await cert_repo.get(id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return cert

@router.put("/{id}", response_model=Certification)
async def update_certification(
    id: str,
    update_data: dict,
    current_user = Depends(deps.get_current_active_user)
):
    if current_user.role != UserRole.ROOT_ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await cert_repo.update(id, update_data)

@router.delete("/{id}")
async def delete_certification(
    id: str,
    current_user = Depends(deps.get_current_active_user)
):
    if current_user.role != UserRole.ROOT_ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    success = await cert_repo.delete(id)
    if not success:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"status": "success"}
