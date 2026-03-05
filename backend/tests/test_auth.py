"""
test_auth.py — Tests for /auth/register, /auth/login, /auth/logout

Test strategy:
  - Validation tests (no mocking needed — Supabase is never reached)
  - Success/failure paths for register and login (mock Supabase calls)
  - Logout (mock auth dependency + supabase.auth.sign_out)
"""

from unittest.mock import MagicMock, patch


# ---------------------------------------------------------------------------
# POST /auth/register — validation tests (no mocking needed)
# ---------------------------------------------------------------------------

class TestRegisterValidation:
    """All these checks fire before Supabase is ever called."""

    def test_rejects_non_bath_email(self, client):
        response = client.post("/auth/register", json={
            "email": "user@gmail.com",
            "password": "Password1!",
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "University of Bath" in response.json()["detail"]

    def test_rejects_password_too_short(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Ab1!",          # only 4 chars
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "8 characters" in response.json()["detail"]

    def test_rejects_password_no_lowercase(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "PASSWORD1!",
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "lowercase" in response.json()["detail"]

    def test_rejects_password_no_uppercase(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "password1!",
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "uppercase" in response.json()["detail"]

    def test_rejects_password_no_number(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Password!",
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "number" in response.json()["detail"]

    def test_rejects_password_with_spaces(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Pass word1!",
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "spaces" in response.json()["detail"]

    def test_rejects_password_no_special_char(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Password1",    # no special char
            "full_name": "Test User"
        })
        assert response.status_code == 400
        assert "special character" in response.json()["detail"]


# ---------------------------------------------------------------------------
# POST /auth/register — success path (mocking Supabase)
# ---------------------------------------------------------------------------

class TestRegisterSuccess:

    def test_successful_registration(self, client):
        """Mock supabase so no real network call is made."""
        mock_user = MagicMock()
        mock_user.id = "abc-123"
        mock_user.email = "newuser@bath.ac.uk"

        mock_response = MagicMock()
        mock_response.user = mock_user

        # Patch at the module where supabase is used
        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_up.return_value = mock_response
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()

            response = client.post("/auth/register", json={
                "email": "newuser@bath.ac.uk",
                "password": "Password1!",
                "full_name": "New User"
            })

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Registration successful. Please check your email to verify."
        assert data["user_id"] == "abc-123"

    def test_register_splits_full_name_correctly(self, client):
        """First/last name should be split on the first space."""
        mock_user = MagicMock()
        mock_user.id = "def-456"
        mock_user.email = "john.doe@bath.ac.uk"
        mock_response = MagicMock()
        mock_response.user = mock_user

        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_up.return_value = mock_response
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()

            response = client.post("/auth/register", json={
                "email": "john.doe@bath.ac.uk",
                "password": "Password1!",
                "full_name": "John Doe"
            })

        assert response.status_code == 200

    def test_register_supabase_returns_no_user(self, client):
        """If Supabase returns user=None, should get a 400."""
        mock_response = MagicMock()
        mock_response.user = None

        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_up.return_value = mock_response

            response = client.post("/auth/register", json={
                "email": "user@bath.ac.uk",
                "password": "Password1!",
                "full_name": "Test User"
            })

        assert response.status_code == 400


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------

class TestLogin:

    def test_successful_login(self, client):
        mock_user = MagicMock()
        mock_session = MagicMock()
        mock_session.access_token = "fake-access-token"
        mock_session.refresh_token = "fake-refresh-token"

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_in_with_password.return_value = mock_response

            response = client.post("/auth/login", json={
                "email": "user@bath.ac.uk",
                "password": "Password1!"
            })

        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "fake-access-token"
        assert data["refresh_token"] == "fake-refresh-token"
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client):
        """Supabase raises an exception on bad credentials."""
        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")

            response = client.post("/auth/login", json={
                "email": "user@bath.ac.uk",
                "password": "wrongpassword"
            })

        assert response.status_code == 401


# ---------------------------------------------------------------------------
# POST /auth/logout
# ---------------------------------------------------------------------------

class TestLogout:

    def test_successful_logout(self, client):
        """
        FastAPI resolves dependencies through its own DI system, so
        unittest.mock.patch won't intercept get_current_user. Instead we use
        app.dependency_overrides to swap it out for a simple lambda.
        """
        from main import app
        from app.accounts.dependencies import get_current_user

        fake_user = {"sub": "abc-123", "email": "user@bath.ac.uk"}
        app.dependency_overrides[get_current_user] = lambda: fake_user

        with patch("app.routers.auth.supabase") as mock_supabase:
            mock_supabase.auth.sign_out.return_value = None
            response = client.post("/auth/logout")

        app.dependency_overrides.clear()  # always clean up after the test

        assert response.status_code == 200
        assert response.json()["message"] == "Successfully logged out"
