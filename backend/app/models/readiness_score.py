from sqlalchemy import Column, Float, ForeignKey, UUID, String
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class ReadinessScore(BaseModel):
    __tablename__ = "readiness_score"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("employee.id"))
    certification_id = Column(UUID(as_uuid=True), ForeignKey("certification.id"))
    score = Column(Float) # 0 to 100
    ai_feedback = Column(String)

    employee = relationship("Employee", back_populates="readiness_scores")
    certification = relationship("Certification", back_populates="readiness_scores")
