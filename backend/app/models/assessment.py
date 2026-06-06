from typing import List, Any
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.certification import Certification

class Assessment(BaseDocument):
    title: str
    certification: Link[Certification]
    questions: List[Any]

    class Settings:
        name = "assessments"
