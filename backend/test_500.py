import requests
import time

BASE_URL = "http://127.0.0.1:5000/api"

# Login
auth_data = {'username': 'test_user_verify', 'password': 'password_verify_123'}
login_resp = requests.post(f"{BASE_URL}/auth/login", json=auth_data)
if login_resp.status_code == 200:
    token = login_resp.json().get('token')
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    scenarios = [
        {"name": "Valid Payload", "data": {
            "room_number": f"V{int(time.time())}",
            "room_type": "single",
            "capacity": 2,
            "base_rate": 100.0
        }},
        {"name": "Missing room_type", "data": {
            "room_number": f"M{int(time.time())}",
            "capacity": 2,
            "base_rate": 100.0
        }},
        {"name": "Null room_number", "data": {
            "room_number": None,
            "room_type": "single",
            "capacity": 2,
            "base_rate": 100.0
        }},
        {"name": "Duplicate room_number", "data": {
            "room_number": "101",
            "room_type": "single",
            "capacity": 2,
            "base_rate": 100.0
        }}
    ]
    
    for s in scenarios:
        print(f"--- Scenario: {s['name']} ---")
        resp = requests.post(f"{BASE_URL}/rooms", json=s['data'], headers=headers)
        print("STATUS:", resp.status_code)
        try:
            print("JSON:", resp.json())
        except:
            print("TEXT:", resp.text)
else:
    print("Failed to login", login_resp.text)
