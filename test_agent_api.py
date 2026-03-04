import requests
import json

url = "http://localhost:5002/chat"
headers = {"Content-Type": "application/json"}
data = {
    "query": "What is a hash table?",
    "userId": "test_user_ai"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Connection failed: {e}")
