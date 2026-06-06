from sqlalchemy import Column, String, ForeignKey, UUID, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Notification(BaseModel):
    __tablename__ = "notification"

    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

    user = relationship("User", back_populates="notifications")
