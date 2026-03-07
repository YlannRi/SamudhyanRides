"""
test_incidents.py — Tests for /incidents/ endpoints

Endpoints tested:
  POST /incidents/    → report an incident for a ride
  GET  /incidents/me  → get my reported incidents
"""

import pytest
from unittest.mock import patch
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "user-abc-123", "email": "user@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# POST /incidents/
# ---------------------------------------------------------------------------

class TestReportIncident:

    def test_reports_incident_successfully(self, client):
        fake_incident = {
            "ride_id": "ride-1",
            "reporter_id": FAKE_PROFILE_ID,
            "description": "Driver was speeding",
            "status": "open"
        }

        with patch("app.routers.incidents.supabase") as mock_sb:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # insert incident
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_incident]

            response = client.post("/incidents/", params={
                "ride_id": "ride-1",
                "description": "Driver was speeding"
            })

        assert response.status_code == 200
        assert response.json()["message"] == "Incident reported"
        assert response.json()["incident"]["status"] == "open"

    def test_returns_404_when_profile_not_found(self, client):
        with patch("app.routers.incidents.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/incidents/", params={
                "ride_id": "ride-1",
                "description": "Something went wrong"
            })

        assert response.status_code == 404


# ---------------------------------------------------------------------------
# GET /incidents/me
# ---------------------------------------------------------------------------

class TestGetMyIncidents:

    def test_returns_my_incidents(self, client):
        fake_incidents = [
            {"id": "inc-1", "description": "Speeding", "status": "open"},
            {"id": "inc-2", "description": "Rude driver", "status": "resolved"},
        ]

        from unittest.mock import MagicMock
        with patch("app.routers.incidents.supabase") as mock_sb:
            # get_profile_id + incidents query both use .eq().execute()
            # We use side_effect to return the profile first, then the incidents
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=fake_incidents)
            ]

            response = client.get("/incidents/me")

        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_returns_empty_when_no_incidents(self, client):
        from unittest.mock import MagicMock
        with patch("app.routers.incidents.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[])
            ]

            response = client.get("/incidents/me")

        assert response.status_code == 200
        assert response.json() == []
