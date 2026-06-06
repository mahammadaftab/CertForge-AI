import logging
from app.db.database import SessionLocal
from app.models.user import User, UserRole
from app.models.certification import Certification
from app.db.base_class import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    db = SessionLocal()
    try:
        # Create Admin User
        admin_user = db.query(User).filter(User.email == "admin@certforge.ai").first()
        if not admin_user:
            logger.info("Creating admin user...")
            admin_user = User(
                email="admin@certforge.ai",
                hashed_password="hashed_secure_password", # Use passlib in production
                full_name="System Admin",
                role=UserRole.ADMIN
            )
            db.add(admin_user)

        # Create Sample Certifications
        az900 = db.query(Certification).filter(Certification.code == "AZ-900").first()
        if not az900:
            logger.info("Creating sample certification AZ-900...")
            az900 = Certification(
                name="Microsoft Azure Fundamentals",
                provider="Microsoft",
                code="AZ-900",
                description="Foundational level knowledge of cloud services and how those services are provided with Microsoft Azure.",
                level="Beginner"
            )
            db.add(az900)

        db.commit()
        logger.info("Seed data completed successfully.")
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
