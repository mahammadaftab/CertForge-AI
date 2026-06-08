import asyncio
from fastapi.testclient import TestClient
from app.main import app

def test_live_feed():
    client = TestClient(app)
    # The startup event will run, which calls init_db
    response = client.get("/api/v1/command-center/live-feed")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_live_feed()
