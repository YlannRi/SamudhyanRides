"""
test_ratings.py — Tests for the updated /ratings/ endpoints

POST /ratings/  → leave a rating (validates range, prevents duplicates, updates user profile)
GET  /ratings/{user_id} → get all ratings for a user
"""

import pytest
from unittest.mock import patch, MagicMock, call
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "user-abc-123", "email": "user@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-reviewer"
FAKE_REVIEWED_ID = "profile-reviewed"
FAKE_RIDE_ID = "ride-001"

DRIVER_RIDE = {"driver_id": FAKE_REVIEWED_ID}   # reviewed user IS the driver
PASSENGER_RIDE = {"driver_id": "some-other-driver"}  # reviewed user is a passenger


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# POST /ratings/
# ---------------------------------------------------------------------------

class TestLeaveRating:

    def _base_params(self, rating=4.0):
        return {
            "ride_id": FAKE_RIDE_ID,
            "reviewed_user_id": FAKE_REVIEWED_ID,
            "rating": rating,
        }

    def _make_mock(self, mock_sb, *, existing_rating=None, ride=DRIVER_RIDE,
                   current_avg=0.0, rating_count=1):
        """Wire up a supabase mock for the happy-path leave_rating flow."""
        def fake_table(name):
            tm = MagicMock()
            if name == "user_profiles":
                # get_profile_id call: select id where auth_user_id = ...
                profile_id_mock = MagicMock()
                profile_id_mock.data = [{"id": FAKE_PROFILE_ID}]

                # get reviewed user's profile: select driver_rating, rider_rating
                reviewed_profile_mock = MagicMock()
                reviewed_profile_mock.data = [{
                    "driver_rating": current_avg,
                    "rider_rating": current_avg,
                }]

                # update mock
                update_mock = MagicMock()
                update_mock.eq.return_value.execute.return_value.data = [{}]

                tm.select.return_value.eq.return_value.execute.return_value = profile_id_mock
                tm.select.return_value.eq.return_value.execute.side_effect = [
                    profile_id_mock, reviewed_profile_mock
                ]
                tm.update.return_value = update_mock

            elif name == "ratings":
                # Duplicate check
                dup_mock = MagicMock()
                dup_mock.data = existing_rating or []

                # Insert
                insert_mock = MagicMock()
                insert_mock.data = [{"id": "new-rating-id"}]

                # Count all ratings for reviewed user
                count_mock = MagicMock()
                count_mock.data = [{"id": f"r{i}"} for i in range(rating_count)]

                dup_exec = MagicMock()
                dup_exec.execute.return_value = dup_mock

                count_exec = MagicMock()
                count_exec.execute.return_value = count_mock

                tm.select.return_value.eq.return_value.eq.return_value.eq.return_value = dup_exec
                tm.insert.return_value.execute.return_value = insert_mock
                tm.select.return_value.eq.return_value.execute.return_value = count_mock

            elif name == "rides":
                rides_mock = MagicMock()
                rides_mock.data = [ride]
                tm.select.return_value.eq.return_value.execute.return_value = rides_mock

            return tm

        mock_sb.table.side_effect = fake_table

    def test_rejects_rating_below_1(self, client):
        with patch("app.routers.ratings.supabase"):
            response = client.post("/ratings/", params={**self._base_params(rating=0.5)})
        assert response.status_code == 422
        assert "between 1 and 5" in response.json()["detail"]

    def test_rejects_rating_above_5(self, client):
        with patch("app.routers.ratings.supabase"):
            response = client.post("/ratings/", params={**self._base_params(rating=5.5)})
        assert response.status_code == 422
        assert "between 1 and 5" in response.json()["detail"]

    def test_returns_404_when_reviewer_profile_not_found(self, client):
        with patch("app.routers.ratings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.post("/ratings/", params=self._base_params())
        assert response.status_code == 404

    def test_rejects_duplicate_rating(self, client):
        """Returns 409 when the same reviewer already rated the same user for the same ride."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "ratings":
                    dup_exec = MagicMock()
                    dup_exec.execute.return_value.data = [{"id": "existing-rating"}]
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value = dup_exec
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params=self._base_params())

        assert response.status_code == 409
        assert "already rated" in response.json()["detail"].lower()

    def test_submits_driver_rating_and_updates_driver_rating_field(self, client):
        """When reviewed user is the ride driver, driver_rating should be updated."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            # Simplified mock: track which fields were updated
            updated_fields = {}

            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    # First eq call = get_profile_id, second = get reviewed profile
                    tm.select.return_value.eq.return_value.execute.side_effect = [
                        MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                        MagicMock(data=[{"driver_rating": 0.0, "rider_rating": 0.0}]),
                    ]
                    def capture_update(data):
                        updated_fields.update(data)
                        um = MagicMock()
                        um.eq.return_value.execute.return_value.data = [{}]
                        return um
                    tm.update.side_effect = capture_update
                elif name == "ratings":
                    # No duplicate
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                    # Count = 1 rating (the new one)
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    # reviewed user IS the driver
                    tm.select.return_value.eq.return_value.execute.return_value.data = [
                        {"driver_id": FAKE_REVIEWED_ID}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params={**self._base_params(rating=4.0)})

        assert response.status_code == 200
        assert response.json()["rating_field"] == "driver_rating"
        assert "new_average_rating" in response.json()

    def test_submits_passenger_rating_and_updates_rider_rating_field(self, client):
        """When reviewed user is NOT the ride driver, rider_rating should be updated."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            updated_fields = {}

            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.side_effect = [
                        MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                        MagicMock(data=[{"driver_rating": 0.0, "rider_rating": 0.0}]),
                    ]
                    def capture_update(data):
                        updated_fields.update(data)
                        um = MagicMock()
                        um.eq.return_value.execute.return_value.data = [{}]
                        return um
                    tm.update.side_effect = capture_update
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    # reviewed user is NOT the driver
                    tm.select.return_value.eq.return_value.execute.return_value.data = [
                        {"driver_id": "some-other-driver-id"}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params={**self._base_params(rating=5.0)})

        assert response.status_code == 200
        assert response.json()["rating_field"] == "rider_rating"

    def test_first_rating_replaces_zero_directly(self, client):
        """When existing rating is 0.0 (no previous ratings), the first rating is used directly."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.side_effect = [
                        MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                        MagicMock(data=[{"driver_rating": 0.0, "rider_rating": 0.0}]),
                    ]
                    um = MagicMock()
                    um.eq.return_value.execute.return_value.data = [{}]
                    tm.update.return_value = um
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [
                        {"driver_id": FAKE_REVIEWED_ID}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params={**self._base_params(rating=3.0)})

        assert response.status_code == 200
        # First rating should be used directly (3.0), not averaged
        assert response.json()["new_average_rating"] == 3.0

    def test_rejects_rating_yourself(self, client):
        """Returns 400 if user tries to rate themselves."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            params = self._base_params()
            params["reviewed_user_id"] = FAKE_PROFILE_ID  # Same as reviewer
            response = client.post("/ratings/", params=params)

        assert response.status_code == 400
        assert "rate yourself" in response.json()["detail"].lower()

    def test_returns_404_when_ride_not_found(self, client):
        """Returns 404 if the ride does not exist."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    # return empty to simulate not found
                    tm.select.return_value.eq.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params=self._base_params())

        assert response.status_code == 404
        assert "ride not found" in response.json()["detail"].lower()

    def test_returns_404_when_reviewed_user_profile_not_found(self, client):
        """Returns 404 if the reviewed user profile does not exist."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    def mock_select(fields):
                        m = MagicMock()
                        if "driver_rating" in fields:
                            m.eq.return_value.execute.return_value.data = []
                        else:
                            m.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                        return m
                    tm.select.side_effect = mock_select
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": FAKE_REVIEWED_ID}]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params=self._base_params())

        assert response.status_code == 404
        assert "reviewed user profile not found" in response.json()["detail"].lower()

    def test_back_calculates_average_correctly(self, client):
        """When existing rating > 0, it should recalculate the average."""
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    def mock_select(fields):
                        m = MagicMock()
                        if "driver_rating" in fields:
                            m.eq.return_value.execute.return_value.data = [{"driver_rating": 4.0, "rider_rating": 4.0}]
                        else:
                            m.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                        return m
                    tm.select.side_effect = mock_select
                    um = MagicMock()
                    um.eq.return_value.execute.return_value.data = [{}]
                    tm.update.return_value = um
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "new-r"}]
                    # count query will return 3 ratings (so old_sum = 4.0 * 2 = 8.0)
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "r1"}, {"id": "r2"}, {"id": "new-r"}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [
                        {"driver_id": FAKE_REVIEWED_ID}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            # new rating is 5.0
            # old_sum = 4.0 * 2 = 8.0
            # new_sum = 8.0 + 5.0 = 13.0
            # new_avg = 13.0 / 3 = 4.333... rounded to 4.3
            response = client.post("/ratings/", params={**self._base_params(rating=5.0)})

        assert response.status_code == 200
        assert response.json()["new_average_rating"] == 4.3
        with patch("app.routers.ratings.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.side_effect = [
                        MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                        MagicMock(data=[{"driver_rating": 0.0, "rider_rating": 0.0}]),
                    ]
                    um = MagicMock()
                    um.eq.return_value.execute.return_value.data = [{}]
                    tm.update.return_value = um
                elif name == "ratings":
                    tm.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
                    tm.insert.return_value.execute.return_value.data = [{"id": "r1"}]
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": "r1"}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [
                        {"driver_id": FAKE_REVIEWED_ID}
                    ]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.post("/ratings/", params={**self._base_params(rating=3.0)})

        assert response.status_code == 200
        # First rating should be used directly (3.0), not averaged
        assert response.json()["new_average_rating"] == 3.0


# ---------------------------------------------------------------------------
# GET /ratings/{user_id}
# ---------------------------------------------------------------------------

class TestGetRatings:

    def test_returns_ratings_for_user(self, client):
        fake_ratings = [
            {"rating": 5.0, "comment": "Excellent"},
            {"rating": 3.0, "comment": "OK"},
        ]
        with patch("app.routers.ratings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = fake_ratings
            response = client.get("/ratings/some-user-id")

        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_returns_empty_list_when_no_ratings(self, client):
        with patch("app.routers.ratings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/ratings/some-user-id")

        assert response.status_code == 200
        assert response.json() == []
