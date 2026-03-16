import os
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from unittest.mock import MagicMock, patch

from app.accounts.dependencies import _get_admin_emails, get_current_user, require_admin_user


class TestDependencies:
    def test_get_current_user_success(self):
        with patch("app.accounts.dependencies.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase

            mock_user = MagicMock()
            mock_user.user.id = "user123"
            mock_user.user.email = "test@bath.ac.uk"
            mock_supabase.auth.get_user.return_value = mock_user

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")
            user = get_current_user(cred)

        assert user["sub"] == "user123"
        assert user["email"] == "test@bath.ac.uk"
        mock_supabase.auth.get_user.assert_called_once_with("valid_token")

    def test_get_current_user_not_found(self):
        with patch("app.accounts.dependencies.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase

            mock_user = MagicMock()
            mock_user.user = None
            mock_supabase.auth.get_user.return_value = mock_user

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")

            with pytest.raises(HTTPException) as exc:
                get_current_user(cred)

        assert exc.value.status_code == 401
        assert "User not found" in exc.value.detail

    def test_get_current_user_invalid_token(self):
        with patch("app.accounts.dependencies.create_supabase_client") as mock_create_client:
            mock_supabase = MagicMock()
            mock_create_client.return_value = mock_supabase
            mock_supabase.auth.get_user.side_effect = Exception("Malformed JWT")

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="bad_token")

            with pytest.raises(HTTPException) as exc:
                get_current_user(cred)

        assert exc.value.status_code == 401
        assert "Invalid token" in exc.value.detail

    def test_get_admin_emails_normalizes_and_filters_values(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": " ADMIN@bath.ac.uk, second@bath.ac.uk , ,THIRD@bath.ac.uk "}, clear=False):
            assert _get_admin_emails() == {"admin@bath.ac.uk", "second@bath.ac.uk", "third@bath.ac.uk"}

    def test_require_admin_user_allows_admin_email(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": "admin@bath.ac.uk"}, clear=False):
            current_user = {"email": " Admin@bath.ac.uk "}
            assert require_admin_user(current_user) is current_user

    def test_require_admin_user_rejects_non_admin_email(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": "admin@bath.ac.uk"}, clear=False):
            with pytest.raises(HTTPException) as exc:
                require_admin_user({"email": "user@bath.ac.uk"})

        assert exc.value.status_code == 403
        assert exc.value.detail == "Admin access required"
