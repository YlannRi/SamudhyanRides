from unittest.mock import MagicMock, patch

from main import app
from app.accounts.dependencies import get_current_user
from app.contracts import AuthTokensResponse, HealthResponse, NotificationResponse, UnreadCountResponse


FAKE_USER = {"sub": "user-abc", "email": "test@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-123"


def _override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER


def _clear_auth_override():
    app.dependency_overrides.clear()


def test_openapi_exposes_core_paths_and_contract_schemas(client):
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()

    assert schema["info"]["title"] == "Samudhyan Rides - Backend"
    assert "/health" in schema["paths"]
    assert "/auth/login" in schema["paths"]
    assert "/auth/register" in schema["paths"]
    assert "/auth/refresh" in schema["paths"]
    assert "/notifications/" in schema["paths"]
    assert "/notifications/unread-count" in schema["paths"]

    register_props = schema["components"]["schemas"]["RegisterRequest"]["properties"]
    assert "first_name" in register_props
    assert "middle_names" in register_props
    assert "last_name" in register_props
    assert "signup_as_driver" in register_props

    login_response_schema = schema["paths"]["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"]["schema"]
    unread_count_schema = schema["paths"]["/notifications/unread-count"]["get"]["responses"]["200"]["content"]["application/json"]["schema"]

    assert login_response_schema["$ref"].endswith("/AuthTokensResponse")
    assert unread_count_schema["$ref"].endswith("/UnreadCountResponse")


def test_health_response_matches_documented_contract(client):
    response = client.get("/health")

    assert response.status_code == 200
    parsed = HealthResponse.model_validate(response.json())
    assert parsed.status == "ready"
    assert parsed.port == 8000


def test_login_response_matches_documented_token_contract(client):
    mock_user = MagicMock()
    mock_session = MagicMock()
    mock_session.access_token = "contract-access-token"
    mock_session.refresh_token = "contract-refresh-token"

    mock_response = MagicMock()
    mock_response.user = mock_user
    mock_response.session = mock_session

    with patch("app.routers.auth.create_supabase_client") as mock_create_client:
        mock_supabase = MagicMock()
        mock_create_client.return_value = mock_supabase
        mock_supabase.auth.sign_in_with_password.return_value = mock_response

        response = client.post("/auth/login", json={
            "identifier": "user@bath.ac.uk",
            "password": "Password1!",
        })

    assert response.status_code == 200
    assert set(response.json()) == {"access_token", "refresh_token", "token_type"}
    parsed = AuthTokensResponse.model_validate(response.json())
    assert parsed.token_type == "bearer"


def test_notifications_response_matches_documented_contract(client):
    _override_auth()

    try:
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                table = MagicMock()
                if name == "user_profiles":
                    table.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    table.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [
                        {
                            "id": "notif-1",
                            "user_id": FAKE_PROFILE_ID,
                            "type": "chat",
                            "title": "New message",
                            "body": "You have a message",
                            "created_at": "2026-03-16T00:00:00Z",
                            "read": False,
                            "link": "/chat/ride-1",
                            "unexpected": "ignored-by-contract",
                        }
                    ]
                return table

            mock_sb.table.side_effect = fake_table

            response = client.get("/notifications/")
    finally:
        _clear_auth_override()

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert set(body[0]) == {"id", "user_id", "type", "title", "body", "created_at", "read", "link"}
    parsed = NotificationResponse.model_validate(body[0])
    assert parsed.type == "chat"


def test_unread_count_response_matches_documented_contract(client):
    _override_auth()

    try:
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                table = MagicMock()
                if name == "user_profiles":
                    table.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    count_mock = MagicMock()
                    count_mock.count = 4
                    table.select.return_value.eq.return_value.eq.return_value.execute.return_value = count_mock
                return table

            mock_sb.table.side_effect = fake_table

            response = client.get("/notifications/unread-count")
    finally:
        _clear_auth_override()

    assert response.status_code == 200
    assert set(response.json()) == {"unread_count"}
    parsed = UnreadCountResponse.model_validate(response.json())
    assert parsed.unread_count == 4
