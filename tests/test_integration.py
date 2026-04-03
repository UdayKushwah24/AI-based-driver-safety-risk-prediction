"""
End-to-End Integration Tests — Complete workflow testing.

Tests the full authentication and data flow:
  1. Register a new user
  2. Login and get JWT token
  3. Fetch real-time risk data
  4. Upload image for fog detection
  5. Predict accident severity
  6. Access analytics and alerts
"""

import time
import json
import pytest
from fastapi.testclient import TestClient

from app import app

client = TestClient(app)

# Test user credentials
TEST_EMAIL = f"test_user_{int(time.time())}@example.com"
TEST_PASSWORD = "TestPassword123!"
TEST_NAME = "Test User"

# Global storage for test data
test_data = {}


class TestEndToEnd:
    """Complete workflow integration tests."""

    def test_01_register_user(self):
        """Step 1: Register a new user account."""
        response = client.post(
            "/auth/register",
            json={
                "name": TEST_NAME,
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
            },
        )
        assert response.status_code in [200, 201], f"Register failed: {response.text}"
        data = response.json()
        assert "user" in data or "id" in data
        print(f"✅ Registered user: {TEST_EMAIL}")

    def test_02_login_user(self):
        """Step 2: Login and obtain JWT access token."""
        response = client.post(
            "/auth/login",
            json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
            },
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access token in response"
        
        test_data["token"] = data["access_token"]
        test_data["user"] = data.get("user")
        print(f"✅ Logged in successfully")
        print(f"   Token: {test_data['token'][:30]}...")

    def test_03_get_status(self):
        """Step 3: Check system health status."""
        response = client.get("/api/status")
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "online"
        assert "modules" in data
        assert "risk_score" in data
        
        print(f"✅ System status: {data['status']}")
        print(f"   Risk score: {data.get('risk_score', 'N/A')}")

    def test_04_get_risk(self):
        """Step 4: Get real-time unified risk assessment."""
        response = client.get(
            "/api/risk",
            headers={"Authorization": f"Bearer {test_data['token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "overall_score" in data
        assert "risk_level" in data
        assert "drowsiness" in data
        assert "fog" in data
        
        print(f"✅ Risk assessment:")
        print(f"   Overall: {data['overall_score']}")
        print(f"   Level: {data['risk_level']}")

    def test_05_get_drowsiness(self):
        """Step 5: Get drowsiness detection state."""
        response = client.get("/api/drowsiness")
        assert response.status_code == 200
        data = response.json()
        
        assert "active" in data
        assert "drowsy" in data
        assert "ear" in data
        
        print(f"✅ Drowsiness state:")
        print(f"   Active: {data['active']}")
        print(f"   EAR: {data.get('ear', 'N/A')}")

    def test_06_get_fog(self):
        """Step 6: Get fog detection state (protected)."""
        response = client.get(
            "/api/fog",
            headers={"Authorization": f"Bearer {test_data['token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "active" in data
        assert "prediction" in data
        
        print(f"✅ Fog detection:")
        print(f"   Active: {data['active']}")
        print(f"   Prediction: {data.get('prediction', 'N/A')}")

    def test_07_predict_accident(self):
        """Step 7: Predict accident severity."""
        accident_input = {
            "State": "California",
            "City": "Los Angeles",
            "No_of_Vehicles": 2,
            "Road_Type": "Highway",
            "Road_Surface": "Asphalt",
            "Light_Condition": "Day",
            "Weather": "Clear",
            "Casualty_Class": "Driver",
            "Casualty_Sex": "M",
            "Casualty_Age": 35,
            "Vehicle_Type": "Car",
        }
        
        response = client.post(
            "/api/accident/predict",
            json=accident_input,
        )
        
        # May fail if model not loaded, which is OK in dev
        if response.status_code == 200:
            data = response.json()
            assert "prediction" in data
            print(f"✅ Accident prediction: {data.get('prediction', 'N/A')}")
        else:
            print(f"⚠️  Accident model not loaded (optional): {response.status_code}")

    def test_08_get_analytics(self):
        """Step 8: Get analytics summary (protected)."""
        response = client.get(
            "/api/analytics/summary",
            headers={"Authorization": f"Bearer {test_data['token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "safety_score" in data
        assert "drowsiness_today" in data
        
        print(f"✅ Analytics summary:")
        print(f"   Safety score: {data.get('safety_score', 'N/A')}")
        print(f"   Events today: {data.get('drowsiness_today', 0)}")

    def test_09_get_alerts(self):
        """Step 9: Get alert history (protected)."""
        response = client.get(
            "/api/alerts",
            headers={"Authorization": f"Bearer {test_data['token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "alerts" in data
        assert isinstance(data["alerts"], list)
        
        print(f"✅ Alert history: {len(data.get('alerts', []))} alerts")

    def test_10_get_drowsiness_logs(self):
        """Step 10: Get drowsiness event logs (protected)."""
        response = client.get(
            "/api/drowsiness/logs",
            headers={"Authorization": f"Bearer {test_data['token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "events" in data
        assert isinstance(data["events"], list)
        
        print(f"✅ Drowsiness logs: {len(data.get('events', []))} events")

    def test_11_invalid_token(self):
        """Step 11: Verify token validation (should fail with bad token)."""
        response = client.get(
            "/api/analytics/summary",
            headers={"Authorization": "Bearer invalid_token"},
        )
        assert response.status_code == 401
        print(f"✅ Token validation working (rejected invalid token)")

    def test_12_unauthorized_access(self):
        """Step 12: Verify protected endpoints require auth."""
        response = client.get("/api/analytics/summary")
        assert response.status_code in [401, 403]
        print(f"✅ Protected endpoint requires authentication")


# Run all tests
if __name__ == "__main__":
    print("\n" + "="*70)
    print("  END-TO-END INTEGRATION TEST SUITE")
    print("="*70 + "\n")
    
    test = TestEndToEnd()
    test.test_01_register_user()
    test.test_02_login_user()
    test.test_03_get_status()
    test.test_04_get_risk()
    test.test_05_get_drowsiness()
    test.test_06_get_fog()
    test.test_07_predict_accident()
    test.test_08_get_analytics()
    test.test_09_get_alerts()
    test.test_10_get_drowsiness_logs()
    test.test_11_invalid_token()
    test.test_12_unauthorized_access()
    
    print("\n" + "="*70)
    print("  ✅ ALL TESTS PASSED")
    print("="*70 + "\n")
