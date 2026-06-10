import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def migrate_roles():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URL, uuidRepresentation='standard')
    db = client[settings.MONGODB_DB_NAME]
    
    # admin -> root_admin
    res_admin = await db.users.update_many(
        {"role": "admin"},
        {"$set": {"role": "root_admin"}}
    )
    print(f"Updated {res_admin.modified_count} 'admin' roles to 'root_admin'")
    
    # manager -> controller
    res_manager = await db.users.update_many(
        {"role": "manager"},
        {"$set": {"role": "controller"}}
    )
    print(f"Updated {res_manager.modified_count} 'manager' roles to 'controller'")
    
    # employee -> associate
    res_employee = await db.users.update_many(
        {"role": "employee"},
        {"$set": {"role": "associate"}}
    )
    print(f"Updated {res_employee.modified_count} 'employee' roles to 'associate'")

if __name__ == "__main__":
    asyncio.run(migrate_roles())
