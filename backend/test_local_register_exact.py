import requests
response = requests.post("http://localhost:8000/api/v1/auth/register", json={
    "email": "test2@example.com",
    "password": "password123",
    "full_name": "Test User 2",
    "role": "employee"
})
print(response.status_code)
print(response.text)
