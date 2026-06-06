from typing import Optional
from app.db.base_class import BaseDocument

class Certification(BaseDocument):
    name: str
    provider: str
    code: str
    description: Optional[str] = None
    level: str

    class Settings:
        name = "certifications"
        indexes = ["code"]
