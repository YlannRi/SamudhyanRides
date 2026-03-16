import asyncio
import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from fastapi import WebSocketDisconnect
from main import app
from app.accounts.dependencies import get_current_user
from app.routers import notification

FAKE_USER = {"sub": "user-abc", "email": "test@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-123"

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()

def fake_get_profile(mock_sb, profile_id=FAKE_PROFILE_ID):
    # Mock for get_profile_id
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": profile_id}]

class TestNotifications:

    def test_get_notifications(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    tm.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [
                        {"id": "n1", "title": "Msg"}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/notifications/")
        
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["id"] == "n1"

    def test_get_unread_count(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    count_mock = MagicMock()
                    count_mock.count = 3
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value = count_mock
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/notifications/unread-count")
        
        assert res.status_code == 200
        assert res.json()["unread_count"] == 3

    def test_mark_all_read(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    tm.update.return_value.eq.return_value.eq.return_value.execute.return_value = MagicMock()
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.put("/notifications/read-all")
        
        assert res.status_code == 200

    def test_mark_read(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    # first is to check existence
                    exists_mock = MagicMock()
                    exists_mock.data = [{"id": "n1"}]
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value = exists_mock
                    # second is update
                    tm.update.return_value.eq.return_value.execute.return_value = MagicMock()
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.put("/notifications/n1/read")
        
        assert res.status_code == 200

    def test_mark_read_not_found(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    exists_mock = MagicMock()
                    exists_mock.data = [] # missing
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value = exists_mock
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.put("/notifications/nx/read")
        
        assert res.status_code == 404

    def test_mark_read_by_link(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "notifications":
                    tm.update.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value = MagicMock()
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.put("/notifications/read-by-link?link=/chat/123")
        
        assert res.status_code == 200

    def test_missing_profile(self, client):
        with patch("app.routers.notification.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/notifications/")

        assert res.status_code == 404


class TestNotificationHelpers:
    def test_serialize_notification_applies_defaults(self):
        serialized = notification._serialize_notification({
            "id": "n1",
            "user_id": FAKE_PROFILE_ID,
            "type": "chat",
            "title": "New message",
            "created_at": "2026-03-16T00:00:00Z",
        })

        assert serialized == {
            "id": "n1",
            "user_id": FAKE_PROFILE_ID,
            "type": "chat",
            "title": "New message",
            "body": "",
            "created_at": "2026-03-16T00:00:00Z",
            "read": False,
            "link": None,
        }

    def test_poll_notifications_sends_only_new_notifications(self):
        websocket = AsyncMock()

        async def run_poll():
            with patch("app.routers.notification._list_notifications", return_value=[
                {"id": "n-old", "title": "Old", "user_id": FAKE_PROFILE_ID, "type": "chat", "created_at": "t1"},
                {"id": "n-new", "title": "New", "user_id": FAKE_PROFILE_ID, "type": "chat", "created_at": "t2"},
            ]), \
                 patch("app.routers.notification.asyncio.sleep", new=AsyncMock(side_effect=asyncio.CancelledError)):
                with pytest.raises(asyncio.CancelledError):
                    await notification._poll_notifications(websocket, FAKE_PROFILE_ID, {"n-old"})

        asyncio.run(run_poll())

        websocket.send_text.assert_awaited_once_with(json.dumps({
            "id": "n-new",
            "user_id": FAKE_PROFILE_ID,
            "type": "chat",
            "title": "New",
            "body": "",
            "created_at": "t2",
            "read": False,
            "link": None,
        }))


class TestNotificationWebSocket:
    def test_notifications_websocket_closes_for_invalid_token(self):
        websocket = AsyncMock()

        async def run_socket():
            with patch("app.routers.notification.supabase") as mock_sb:
                mock_sb.auth.get_user.side_effect = Exception("bad token")
                await notification.notifications_websocket(websocket, token="bad-token")

        asyncio.run(run_socket())

        websocket.close.assert_awaited_once_with(code=4001, reason="Invalid token")

    def test_notifications_websocket_closes_when_profile_lookup_fails(self):
        websocket = AsyncMock()
        user = MagicMock()
        user.user.id = "auth-user-1"

        async def run_socket():
            with patch("app.routers.notification.supabase") as mock_sb:
                mock_sb.auth.get_user.return_value = user
                profile_lookup = MagicMock()
                profile_lookup.data = []
                mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = profile_lookup
                await notification.notifications_websocket(websocket, token="good-token")

        asyncio.run(run_socket())

        websocket.close.assert_awaited_once_with(code=4001, reason="User profile not found")

    def test_notifications_websocket_accepts_and_cancels_poll_task(self):
        websocket = AsyncMock()
        websocket.receive_text = AsyncMock(side_effect=[WebSocketDisconnect()])
        user = MagicMock()
        user.user.id = "auth-user-1"

        async def fake_poll(*args, **kwargs):
            try:
                await asyncio.sleep(3600)
            except asyncio.CancelledError:
                raise

        async def run_socket():
            with patch("app.routers.notification.supabase") as mock_sb, \
                 patch("app.routers.notification._list_notifications", return_value=[{"id": "n1"}]), \
                 patch("app.routers.notification._poll_notifications", side_effect=fake_poll):
                mock_sb.auth.get_user.return_value = user
                profile_lookup = MagicMock()
                profile_lookup.data = [{"id": FAKE_PROFILE_ID}]
                mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = profile_lookup
                await notification.notifications_websocket(websocket, token="good-token")

        asyncio.run(run_socket())

        websocket.accept.assert_awaited_once()
