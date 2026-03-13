import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from main import app
from app.accounts.dependencies import get_current_user

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

