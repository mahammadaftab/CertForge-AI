from typing import Any, List
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.team import Team
from app.models.user import UserRole

router = APIRouter()

@router.get("/")
async def list_teams(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
    """
    Retrieves all teams from MongoDB, including linked manager data.
    """
    teams = await Team.find_all(fetch_links=True).to_list()
    return teams
