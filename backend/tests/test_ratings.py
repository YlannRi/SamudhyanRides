"""
test_ratings.py — Tests for /ratings/ endpoints

Endpoints tested:
  POST /ratings/              → leave a rating for a user
  GET  /ratings/{user_id}     → get all ratings for a user
"""

import pytest
from unittest.mock import patch
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "user-abc-123", "email": "user@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# POST /ratings/
# ---------------------------------------------------------------------------

class TestLeaveRating:

    def test_submits_rating_successfully(self, client):
        fake_rating = {
            "ride_id": "ride-1",
            "reviewer_id": FAKE_PROFILE_ID,
            "reviewed_user_id": "other-profile",
            "rating": 5.0,
            "comment": "Great driver!"
        }

        with patch("app.routers.ratings.supabase") as mock_sb:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # insert rating
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_rating]

            response = client.post("/ratings/", params={
                "ride_id": "ride-1",
                "reviewed_user_id": "other-profile",
                "rating": 5.0,
                "comment": "Great driver!"
            })

        assert response.status_code == 200
        assert response.json()["message"] == "Rating submitted"
        assert response.json()["rating"]["rating"] == 5.0

    def test_returns_404_when_profile_not_found(self, client):
        with patch("app.routers.ratings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/ratings/", params={
                "ride_id": "ride-1",
                "reviewed_user_id": "other-profile",
                "rating": 4.0
            })

        assert response.status_code == 404


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
