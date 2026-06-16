import requests
response = requests.post("http://localhost:8000/api/v1/auth/register", json={
    "email": "testlocal@example.com",
    "password": "password123",
    "full_name": "Test Local",
    "role": "associate"
})
print(response.status_code)
print(response.text)
