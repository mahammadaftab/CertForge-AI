from sqlalchemy import Column, String, ForeignKey, UUID, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class AuditLog(BaseModel):
    __tablename__ = "audit_log"

    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    action = Column(String, nullable=False) # e.g., "LOGIN", "CREATE_CERT", "TAKE_ASSESSMENT"
    details = Column(JSON) # Additional context

    user = relationship("User", back_populates="audit_logs")
