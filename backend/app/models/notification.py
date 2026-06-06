from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class Notification(BaseDocument):
    user: Link[User]
    title: str
    message: str
    is_read: bool = False

    class Settings:
        name = "notifications"
