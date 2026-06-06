from sqlalchemy import Column, Float, ForeignKey, UUID, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class AssessmentResult(BaseModel):
    __tablename__ = "assessment_result"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("employee.id"))
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessment.id"))
    score = Column(Float)
    answers = Column(JSON) # Employee's submitted answers

    employee = relationship("Employee", back_populates="assessment_results")
    assessment = relationship("Assessment", back_populates="results")
