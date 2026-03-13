import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.accounts.dependencies import get_current_user

class TestDependencies:

    def test_get_current_user_success(self):
        with patch("app.accounts.dependencies.supabase") as mock_sb:
            mock_user = MagicMock()
            mock_user.user.id = "user123"
            mock_user.user.email = "test@bath.ac.uk"
            mock_sb.auth.get_user.return_value = mock_user

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")
            user = get_current_user(cred)

            assert user["sub"] == "user123"
            assert user["email"] == "test@bath.ac.uk"
            mock_sb.auth.get_user.assert_called_once_with("valid_token")

    def test_get_current_user_not_found(self):
        with patch("app.accounts.dependencies.supabase") as mock_sb:
            mock_user = MagicMock()
            mock_user.user = None
            mock_sb.auth.get_user.return_value = mock_user

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")
            
            with pytest.raises(HTTPException) as exc:
                get_current_user(cred)
            
            assert exc.value.status_code == 401
            assert "User not found" in exc.value.detail

    def test_get_current_user_invalid_token(self):
        with patch("app.accounts.dependencies.supabase") as mock_sb:
            mock_sb.auth.get_user.side_effect = Exception("Malformed JWT")

            cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials="bad_token")
            
            with pytest.raises(HTTPException) as exc:
                get_current_user(cred)
            
            assert exc.value.status_code == 401
            assert "Invalid token" in exc.value.detail
