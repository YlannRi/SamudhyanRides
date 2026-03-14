"""
test_users.py — Tests for all /users/ endpoints

All endpoints require authentication (Depends(get_current_user)), so
we use app.dependency_overrides to inject a fake user for every test.
Supabase calls are mocked with unittest.mock.patch.

Endpoints tested:
  GET    /users/me           → get my profile
  POST   /users/me           → create/update my profile
  PUT    /users/me           → update fields on my profile
  DELETE /users/me           → deactivate my account
  GET    /users/{user_id}    → get another user's public profile
  GET    /users/             → get all users (admin-style)
"""

import pytest
from unittest.mock import MagicMock, patch
from main import app
from app.accounts.dependencies import get_current_user, require_admin_user

FAKE_USER = {"sub": "user-abc-123", "email": "user@bath.ac.uk"}


@pytest.fixture(autouse=True)
def override_auth():
    """
    Automatically inject a fake authenticated user for every test in
    this file. `autouse=True` means we don't have to list it manually
    on every test — pytest applies it globally for this module.
    Cleans up after each test automatically.
    """
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    app.dependency_overrides[require_admin_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# GET /users/me
# ---------------------------------------------------------------------------

class TestGetMyProfile:

    def test_returns_profile_when_found(self, client):
        fake_profile = [{"auth_user_id": "user-abc-123", "first_name": "Jane", "last_name": "Doe"}]

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = fake_profile
            response = client.get("/users/me")

        assert response.status_code == 200
        assert response.json() == fake_profile

    def test_returns_404_when_not_found(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/users/me")

        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"


# ---------------------------------------------------------------------------
# POST /users/me
# ---------------------------------------------------------------------------

class TestCreateMyProfile:

    def test_creates_profile_successfully(self, client):
        fake_result = {"first_name": "Jane", "last_name": "Doe", "university_username": "jd123"}

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [fake_result]
            response = client.post("/users/me", params={
                "first_name": "Jane",
                "last_name": "Doe",
                "university_username": "jd123"
            })

        assert response.status_code == 200
        assert response.json()["first_name"] == "Jane"

    def test_returns_400_when_update_fails(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []
            response = client.post("/users/me", params={
                "first_name": "Jane",
                "last_name": "Doe",
                "university_username": "jd123"
            })

        assert response.status_code == 400
        assert "Could not update" in response.json()["detail"]


# ---------------------------------------------------------------------------
# PUT /users/me
# ---------------------------------------------------------------------------

class TestUpdateMyProfile:

    def test_updates_single_field(self, client):
        fake_result = {"first_name": "Updated", "last_name": "Doe"}

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [fake_result]
            response = client.put("/users/me", params={"first_name": "Updated"})

        assert response.status_code == 200
        assert response.json()["first_name"] == "Updated"

    def test_returns_400_when_no_fields_provided(self, client):
        """Sending no query params means update_data stays empty → 400."""
        response = client.put("/users/me")
        assert response.status_code == 400
        assert "No fields to update" in response.json()["detail"]

    def test_returns_404_when_profile_not_found(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []
            response = client.put("/users/me", params={"first_name": "Updated"})

        assert response.status_code == 404
        assert "Profile not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# PUT /users/me/preferences
# ---------------------------------------------------------------------------

class TestUpdateMyPreferences:

    def test_updates_calendar_link_and_contacts(self, client):
        fake_result = {
            "calendar_link": "https://bath.ac.uk/feed.ics",
            "trusted_contacts": [{"id": "1", "firstName": "Jane", "lastName": "Doe", "phone": "07123456789", "isPrimary": True}],
        }

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [fake_result]
            response = client.put("/users/me/preferences", json=fake_result)

        assert response.status_code == 200
        assert response.json()["calendar_link"] == "https://bath.ac.uk/feed.ics"
        assert response.json()["trusted_contacts"][0]["firstName"] == "Jane"

    def test_trims_and_clears_blank_calendar_link(self, client):
        fake_result = {"calendar_link": None}

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [fake_result]
            response = client.put("/users/me/preferences", json={"calendar_link": "   "})

        assert response.status_code == 200
        mock_sb.table.return_value.update.assert_called_once_with({"calendar_link": None})

    def test_returns_400_when_no_preferences_provided(self, client):
        response = client.put("/users/me/preferences", json={})
        assert response.status_code == 400
        assert response.json()["detail"] == "No preferences to update"

    def test_returns_404_when_profile_not_found(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []
            response = client.put("/users/me/preferences", json={"calendar_link": "https://bath.ac.uk/feed.ics"})

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"


# ---------------------------------------------------------------------------
# DELETE /users/me
# ---------------------------------------------------------------------------

class TestDeactivateMyProfile:

    def test_deactivates_profile(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [{"is_active": False}]
            response = client.delete("/users/me")

        assert response.status_code == 200
        assert response.json()["message"] == "Profile deactivated"

    def test_returns_404_when_profile_not_found(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []
            response = client.delete("/users/me")

        assert response.status_code == 404


# ---------------------------------------------------------------------------
# GET /users/{user_id}
# ---------------------------------------------------------------------------

class TestGetPublicProfile:

    def test_returns_public_profile(self, client):
        fake_profile = {"first_name": "John", "last_name": "Smith", "driver_rating": 4.8}

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [fake_profile]
            response = client.get("/users/some-other-user-id")

        assert response.status_code == 200
        assert response.json()["first_name"] == "John"

    def test_returns_404_for_unknown_user(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/users/nonexistent-id")

        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# GET /users/
# ---------------------------------------------------------------------------

class TestGetAllUsers:

    def test_returns_list_of_users(self, client):
        fake_users = [
            {"first_name": "Alice"},
            {"first_name": "Bob"},
        ]

        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.execute.return_value.data = fake_users
            response = client.get("/users/")

        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_returns_empty_list_when_no_users(self, client):
        with patch("app.routers.users.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.execute.return_value.data = []
            response = client.get("/users/")

        assert response.status_code == 200
        assert response.json() == []
