import asyncio
import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from fastapi import WebSocketDisconnect
from main import app
from app.accounts.dependencies import get_current_user
from app.routers import chat

FAKE_USER = {"sub": "user-1", "email": "test@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-1"
DRIVER_ID = "driver-1"
PASSENGER_ID = "passenger-1"

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


class TestChatHttp:

    def test_get_chat_history_player_not_participant(self, client):
        with patch("app.routers.chat.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "intruder-profile"}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": DRIVER_ID}]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.in_.return_value.execute.return_value.data = [{"passenger_id": PASSENGER_ID}]
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/rides/ride-1/chat")
        assert res.status_code == 403

    def test_get_chat_history_as_passenger(self, client):
        with patch("app.routers.chat.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles": # profile block + sender names
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": PASSENGER_ID}]
                    tm.select.return_value.in_.return_value.execute.return_value.data = [
                        {"id": DRIVER_ID, "first_name": "Dr", "last_name": "Iver"}
                    ]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": DRIVER_ID}]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.in_.return_value.execute.return_value.data = [{"passenger_id": PASSENGER_ID}]
                elif name == "ride_chats":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "chat-123"}]
                elif name == "ride_messages":
                    tm.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
                        {"id": "m1", "sender_id": DRIVER_ID, "message": "hello"}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/rides/ride-1/chat")
        
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["sender_name"] == "Dr Iver"
        assert res.json()[0]["message"] == "hello"

    def test_post_message_as_passenger(self, client):
        with patch("app.routers.chat.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    def mock_select(fields):
                        m = MagicMock()
                        if "first_name" in fields:
                            m.eq.return_value.execute.return_value.data = [{"first_name": "Pass", "last_name": "Enger"}]
                            m.in_.return_value.execute.return_value.data = [{"id": DRIVER_ID, "first_name": "Dr", "last_name": "Iver"}]
                        else:
                            m.eq.return_value.execute.return_value.data = [{"id": PASSENGER_ID}]
                        return m
                    tm.select.side_effect = mock_select
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": DRIVER_ID}]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.in_.return_value.execute.return_value.data = [{"passenger_id": PASSENGER_ID}]
                elif name == "ride_chats":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "chat-123"}]
                elif name == "ride_messages":
                    tm.insert.return_value.execute.return_value.data = [
                        {"id": "m1", "created_at": "now"}
                    ]
                elif name == "notifications":
                    tm.insert.return_value.execute.return_value = MagicMock()
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.post("/rides/ride-1/chat/message", json={"message": "I am here"})
        
        assert res.status_code == 200
        assert res.json()["sender_name"] == "Pass Enger"

    def test_get_chat_empty_no_chat_found(self, client):
        with patch("app.routers.chat.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": PASSENGER_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": DRIVER_ID}]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.in_.return_value.execute.return_value.data = [{"passenger_id": PASSENGER_ID}]
                elif name == "ride_chats":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            res = client.get("/rides/ride-1/chat")
        
        assert res.status_code == 200
        assert len(res.json()) == 0


class TestChatHelpers:
    def test_resolve_chat_participants_requires_driver_participant_for_multiple_riders(self):
        with patch("app.routers.chat._get_ride_participant_ids", return_value=(DRIVER_ID, [PASSENGER_ID, "passenger-2"])):
            with pytest.raises(HTTPException) as exc:
                chat._resolve_chat_participants(DRIVER_ID, "ride-1")

        assert exc.value.status_code == 400
        assert "participant_id is required" in exc.value.detail

    def test_resolve_chat_participants_rejects_invalid_driver_participant(self):
        with patch("app.routers.chat._get_ride_participant_ids", return_value=(DRIVER_ID, [PASSENGER_ID])):
            with pytest.raises(HTTPException) as exc:
                chat._resolve_chat_participants(DRIVER_ID, "ride-1", participant_id="missing-passenger")

        assert exc.value.status_code == 404

    def test_resolve_chat_participants_rejects_passenger_accessing_someone_elses_chat(self):
        with patch("app.routers.chat._get_ride_participant_ids", return_value=(DRIVER_ID, [PASSENGER_ID])):
            with pytest.raises(HTTPException) as exc:
                chat._resolve_chat_participants(PASSENGER_ID, "ride-1", participant_id="other-passenger")

        assert exc.value.status_code == 403

    def test_get_or_create_chat_creates_a_chat_when_missing(self):
        with patch("app.routers.chat.supabase") as mock_sb:
            ride_chats = MagicMock()
            ride_chats.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
            ride_chats.insert.return_value.execute.return_value.data = [{"id": "chat-new"}]
            mock_sb.table.return_value = ride_chats

            chat_id = chat._get_or_create_chat("ride-1", PASSENGER_ID)

        assert chat_id == "chat-new"
        ride_chats.insert.assert_called_once_with({"ride_id": "ride-1", "passenger_id": PASSENGER_ID})

    def test_get_chat_id_returns_none_when_chat_does_not_exist(self):
        with patch("app.routers.chat.supabase") as mock_sb:
            ride_chats = MagicMock()
            ride_chats.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
            mock_sb.table.return_value = ride_chats

            assert chat._get_chat_id("ride-1", PASSENGER_ID) is None

    def test_get_messages_with_names_falls_back_to_unknown_sender(self):
        with patch("app.routers.chat.supabase") as mock_sb:
            def fake_table(name):
                table = MagicMock()
                if name == "ride_messages":
                    table.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
                        {
                            "id": "m1",
                            "chat_id": "chat-1",
                            "sender_id": DRIVER_ID,
                            "message": "hello",
                            "created_at": "2026-03-16T00:00:00Z",
                        }
                    ]
                elif name == "user_profiles":
                    table.select.return_value.in_.return_value.execute.return_value.data = []
                return table

            mock_sb.table.side_effect = fake_table

            messages = chat._get_messages_with_names("chat-1")

        assert messages == [{
            "id": "m1",
            "chat_id": "chat-1",
            "sender_id": DRIVER_ID,
            "sender_name": "Unknown",
            "message": "hello",
            "created_at": "2026-03-16T00:00:00Z",
            "read": False,
        }]

    def test_get_sender_name_falls_back_to_someone(self):
        with patch("app.routers.chat.supabase") as mock_sb:
            user_profiles = MagicMock()
            user_profiles.select.return_value.eq.return_value.execute.return_value.data = []
            mock_sb.table.return_value = user_profiles

            assert chat._get_sender_name("missing-profile") == "Someone"

    def test_build_chat_link_returns_driver_and_passenger_variants(self):
        assert chat._build_chat_link("ride-1", PASSENGER_ID) == "/chat/ride-1"
        assert chat._build_chat_link("ride-1", PASSENGER_ID, for_driver=True) == f"/chat/ride-1?participant={PASSENGER_ID}"

    def test_create_notification_inserts_chat_notification(self):
        with patch("app.routers.chat.supabase") as mock_sb:
            notifications = MagicMock()
            mock_sb.table.return_value = notifications

            chat._create_notification("user-1", "Title", "Body", "/chat/ride-1")

        notifications.insert.assert_called_once_with({
            "user_id": "user-1",
            "type": "chat",
            "title": "Title",
            "body": "Body",
            "link": "/chat/ride-1",
        })


class TestChatWebSocket:
    def test_poll_chat_messages_sends_only_new_messages(self):
        websocket = AsyncMock()

        async def run_poll():
            with patch("app.routers.chat._get_chat_id", return_value="chat-1"), \
                 patch("app.routers.chat._get_messages_with_names", return_value=[
                     {"id": "m-old", "message": "old"},
                     {"id": "m-new", "message": "new"},
                 ]), \
                 patch("app.routers.chat.asyncio.sleep", new=AsyncMock(side_effect=asyncio.CancelledError)):
                with pytest.raises(asyncio.CancelledError):
                    await chat._poll_chat_messages(websocket, "ride-1", PASSENGER_ID, {"m-old"})

        asyncio.run(run_poll())

        websocket.send_text.assert_awaited_once_with(json.dumps({"id": "m-new", "message": "new"}))

    def test_chat_websocket_closes_for_invalid_token(self):
        websocket = AsyncMock()

        async def run_socket():
            with patch("app.routers.chat.supabase") as mock_sb:
                mock_sb.auth.get_user.side_effect = Exception("bad token")
                await chat.chat_websocket(websocket, "ride-1", token="bad-token")

        asyncio.run(run_socket())

        websocket.close.assert_awaited_once_with(code=4001, reason="Invalid token")

    def test_chat_websocket_closes_when_profile_cannot_be_resolved(self):
        websocket = AsyncMock()
        user = MagicMock()
        user.user.id = "auth-user-1"

        async def run_socket():
            with patch("app.routers.chat.supabase") as mock_sb:
                mock_sb.auth.get_user.return_value = user
                profile_lookup = MagicMock()
                profile_lookup.data = []
                mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = profile_lookup
                await chat.chat_websocket(websocket, "ride-1", token="good-token")

        asyncio.run(run_socket())

        websocket.close.assert_awaited_once_with(code=4001, reason="Profile not found")

    def test_chat_websocket_closes_when_participant_resolution_fails(self):
        websocket = AsyncMock()
        user = MagicMock()
        user.user.id = "auth-user-1"

        async def run_socket():
            with patch("app.routers.chat.supabase") as mock_sb, \
                 patch("app.routers.chat._resolve_chat_participants", side_effect=HTTPException(status_code=403, detail="blocked")):
                mock_sb.auth.get_user.return_value = user
                profile_lookup = MagicMock()
                profile_lookup.data = [{"id": PASSENGER_ID}]
                mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = profile_lookup
                await chat.chat_websocket(websocket, "ride-1", token="good-token")

        asyncio.run(run_socket())

        websocket.close.assert_awaited_once_with(code=4003, reason="blocked")

    def test_chat_websocket_sends_messages_and_creates_notifications(self):
        websocket = AsyncMock()
        websocket.receive_text = AsyncMock(side_effect=[
            json.dumps({"message": ""}),
            json.dumps({"message": "Hello driver"}),
            WebSocketDisconnect(),
        ])

        user = MagicMock()
        user.user.id = "auth-user-1"

        async def fake_poll(*args, **kwargs):
            try:
                await asyncio.sleep(3600)
            except asyncio.CancelledError:
                raise

        async def run_socket():
            with patch("app.routers.chat.supabase") as mock_sb, \
                 patch("app.routers.chat._resolve_chat_participants", return_value=(DRIVER_ID, PASSENGER_ID)), \
                 patch("app.routers.chat._get_chat_id", return_value="chat-1"), \
                 patch("app.routers.chat._get_messages_with_names", return_value=[{"id": "existing"}]), \
                 patch("app.routers.chat._get_or_create_chat", return_value="chat-1"), \
                 patch("app.routers.chat._get_sender_name", return_value="Pat Passenger"), \
                 patch("app.routers.chat._create_notification") as mock_create_notification, \
                 patch("app.routers.chat._poll_chat_messages", side_effect=fake_poll):
                mock_sb.auth.get_user.return_value = user

                def fake_table(name):
                    table = MagicMock()
                    if name == "user_profiles":
                        table.select.return_value.eq.return_value.execute.return_value.data = [{"id": PASSENGER_ID}]
                    elif name == "ride_messages":
                        table.insert.return_value.execute.return_value.data = [{
                            "id": "m-new",
                            "chat_id": "chat-1",
                            "sender_id": PASSENGER_ID,
                            "message": "Hello driver",
                            "created_at": "2026-03-16T00:00:00Z",
                        }]
                    return table

                mock_sb.table.side_effect = fake_table

                await chat.chat_websocket(websocket, "ride-1", token="good-token")

                mock_create_notification.assert_called_once_with(
                    user_id=DRIVER_ID,
                    title="New message from Pat Passenger",
                    body="Hello driver",
                    link=f"/chat/ride-1?participant={PASSENGER_ID}",
                )

        asyncio.run(run_socket())

        websocket.accept.assert_awaited_once()
        websocket.send_text.assert_awaited_once_with(json.dumps({
            "id": "m-new",
            "chat_id": "chat-1",
            "sender_id": PASSENGER_ID,
            "sender_name": "Pat Passenger",
            "message": "Hello driver",
            "created_at": "2026-03-16T00:00:00Z",
            "read": False,
        }))

