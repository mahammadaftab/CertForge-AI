import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    try:
        client = AsyncIOMotorClient(
            "mongodb+srv://mdaftabeditz360_db_user:8ZQg11BdrnxA22tQ@cluster0.eozpm70.mongodb.net/?appName=Cluster0",
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
        )
        info = await client.server_info()
        print("SUCCESS - MongoDB Atlas is reachable")
        print(f"Server version: {info.get('version')}")
    except Exception as e:
        print(f"FAILED - {type(e).__name__}: {e}")

asyncio.run(test())
