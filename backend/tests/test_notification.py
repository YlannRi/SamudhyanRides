import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from main import app
from app.accounts.dependencies import get_current_user

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
