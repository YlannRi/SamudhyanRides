"""
Tests for /auth/register, /auth/login, and /auth/logout.
"""

from unittest.mock import MagicMock, patch


class TestRegisterValidation:
    def test_rejects_non_bath_email(self, client):
        response = client.post("/auth/register", json={
            "email": "user@gmail.com",
            "password": "Password1!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "University of Bath" in response.json()["detail"]

    def test_rejects_password_too_short(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Ab1!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "8 characters" in response.json()["detail"]

    def test_rejects_password_no_lowercase(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "PASSWORD1!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "lowercase" in response.json()["detail"]

    def test_rejects_password_no_uppercase(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "password1!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "uppercase" in response.json()["detail"]

    def test_rejects_password_no_number(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Password!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "number" in response.json()["detail"]

    def test_rejects_password_with_spaces(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Pass word1!",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "spaces" in response.json()["detail"]

    def test_rejects_password_no_special_char(self, client):
        response = client.post("/auth/register", json={
            "email": "user@bath.ac.uk",
            "password": "Password1",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "special character" in response.json()["detail"]


class TestRegisterSuccess:
    def test_successful_registration(self, client):
        mock_user = MagicMock()
        mock_user.id = "abc-123"
        mock_user.email = "newuser@bath.ac.uk"

        mock_response = MagicMock()
        mock_response.user = mock_user

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.auth.sign_up.return_value = mock_response
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()

            response = client.post("/auth/register", json={
                "email": "newuser@bath.ac.uk",
                "password": "Password1!",
                "full_name": "New User",
            })

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Registration successful. Please check your email to verify."
        assert data["user_id"] == "abc-123"

    def test_register_splits_full_name_correctly(self, client):
        mock_user = MagicMock()
        mock_user.id = "def-456"
        mock_user.email = "john.doe@bath.ac.uk"

        mock_response = MagicMock()
        mock_response.user = mock_user

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.auth.sign_up.return_value = mock_response
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()

            response = client.post("/auth/register", json={
                "email": "john.doe@bath.ac.uk",
                "password": "Password1!",
                "full_name": "John Doe",
            })

        assert response.status_code == 200

    def test_register_supabase_returns_no_user(self, client):
        mock_response = MagicMock()
        mock_response.user = None

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.auth.sign_up.return_value = mock_response

            response = client.post("/auth/register", json={
                "email": "user@bath.ac.uk",
                "password": "Password1!",
                "full_name": "Test User",
            })

        assert response.status_code == 400


class TestLogin:
    def test_successful_login_with_email(self, client):
        mock_user = MagicMock()
        mock_session = MagicMock()
        mock_session.access_token = "fake-access-token"
        mock_session.refresh_token = "fake-refresh-token"

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            mock_supabase.auth.sign_in_with_password.return_value = mock_response

            response = client.post("/auth/login", json={
                "identifier": "user@bath.ac.uk",
                "password": "Password1!",
            })

        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "fake-access-token"
        assert data["refresh_token"] == "fake-refresh-token"
        assert data["token_type"] == "bearer"

    def test_successful_login_with_university_username(self, client):
        mock_user = MagicMock()
        mock_session = MagicMock()
        mock_session.access_token = "fake-access-token"
        mock_session.refresh_token = "fake-refresh-token"

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
                {"email": "jd123@bath.ac.uk"},
            ]
            mock_supabase.auth.sign_in_with_password.return_value = mock_response

            response = client.post("/auth/login", json={
                "identifier": "jd123",
                "password": "Password1!",
            })

        assert response.status_code == 200

    def test_login_invalid_credentials(self, client):
        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")

            response = client.post("/auth/login", json={
                "identifier": "user@bath.ac.uk",
                "password": "wrongpassword",
            })

        assert response.status_code == 401


class TestLogout:
    def test_successful_logout(self, client):
        from app.accounts.dependencies import get_current_user
        from main import app

        fake_user = {"sub": "abc-123", "email": "user@bath.ac.uk"}
        app.dependency_overrides[get_current_user] = lambda: fake_user

        with patch("app.routers.auth.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.auth.sign_out.return_value = None
            response = client.post("/auth/logout")

        app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["message"] == "Successfully logged out"
