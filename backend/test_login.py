from fastapi.testclient import TestClient
from app.main import app

def test_login_no_db():
    client = TestClient(app)
    # Simulate login without DB initialized
    response = client.post(
        "/api/v1/auth/login/access-token",
        data={"username": "test@example.com", "password": "password"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_login_no_db()
