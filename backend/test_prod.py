import requests
response = requests.get("https://certforge-ai.onrender.com/api/v1/command-center/live-feed")
print("live-feed:", response.status_code)

response2 = requests.get("https://certforge-ai.onrender.com/api/v1/command-center/graph-data")
print("graph-data:", response2.status_code)
