from typing import Optional, List, Any
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.certification import Certification

class LearningPath(BaseDocument):
    name: str
    description: Optional[str] = None
    certification: Link[Certification]
    modules: List[Any]

    class Settings:
        name = "learning_paths"
