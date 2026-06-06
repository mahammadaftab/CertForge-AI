from sqlalchemy import Column, String, ForeignKey, UUID, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Assessment(BaseModel):
    __tablename__ = "assessment"

    title = Column(String, nullable=False)
    certification_id = Column(UUID(as_uuid=True), ForeignKey("certification.id"))
    questions = Column(JSON) # JSON structure of questions

    certification = relationship("Certification", back_populates="assessments")
    results = relationship("AssessmentResult", back_populates="assessment")
