"""
test_rides.py — Tests for all /rides/ endpoints

All endpoints require authentication. A module-level autouse fixture
handles the dependency override for every test.

Endpoints tested:
  GET  /rides/driver/dashboard  → driver's upcoming rides with bookings
  POST /rides/                  → create a new ride (driver only)
  GET  /rides/                  → search/list open rides
  GET  /rides/{ride_id}         → get a single ride's details
  PUT  /rides/{ride_id}         → update ride (driver only)
  DELETE /rides/{ride_id}       → cancel a ride (driver only)
"""

import pytest
from unittest.mock import MagicMock, patch, call
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "driver-user-123", "email": "driver@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"

# Shared ride payload used across creation tests
VALID_RIDE_PAYLOAD = {
    "origin": "Bath Spa",
    "destination": "Bristol Temple Meads",
    "origin_lat": 51.379,
    "origin_lng": -2.359,
    "destination_lat": 51.449,
    "destination_lng": -2.581,
    "departure_time": "2026-06-01T09:00:00",
    "seats_total": 3,
}


@pytest.fixture(autouse=True)
def override_auth():
    """Inject fake auth user for every test in this file."""
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


def make_profile_mock(mock_sb, profile_id=FAKE_PROFILE_ID):
    """Helper: make supabase return a user profile with a given id."""
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": profile_id}]


# ---------------------------------------------------------------------------
# GET /rides/driver/dashboard
# ---------------------------------------------------------------------------

class TestDriverDashboard:

    def test_returns_empty_when_no_rides(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/driver/dashboard")

        assert response.status_code == 200
        assert response.json() == []

    def test_returns_rides_with_empty_bookings(self, client):
        """Rides found, but no bookings for them."""
        fake_ride = {"id": "ride-1", "origin": "Bath", "destination": "Bristol"}

        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = [fake_ride]
                elif name == "bookings":
                    tm.select.return_value.in_.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/driver/dashboard")

        assert response.status_code == 200
        assert response.json()[0]["bookings"] == []

    def test_returns_rides_with_bookings_and_passengers(self, client):
        fake_ride = {"id": "ride-1", "origin": "Bath", "destination": "Bristol"}
        fake_booking = {"id": "book-1", "ride_id": "ride-1", "passenger_id": "pass-1", "status": "confirmed"}
        fake_profile = {"id": "pass-1", "first_name": "Alice", "last_name": "Smith",
                        "university_username": "as123", "driver_rating": 0.0, "rider_rating": 4.5}

        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                    tm.select.return_value.in_.return_value.execute.return_value.data = [fake_profile]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = [fake_ride]
                elif name == "bookings":
                    tm.select.return_value.in_.return_value.execute.return_value.data = [fake_booking]
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/driver/dashboard")

        assert response.status_code == 200
        rides = response.json()
        assert len(rides) == 1
        assert len(rides[0]["bookings"]) == 1
        assert rides[0]["bookings"][0]["passenger"]["first_name"] == "Alice"

# ---------------------------------------------------------------------------
# POST /rides/
# ---------------------------------------------------------------------------

class TestCreateRide:

    def test_create_ride_successfully(self, client):
        fake_new_ride = {"id": "new-ride-1", **VALID_RIDE_PAYLOAD}

        with patch("app.routers.rides.supabase") as mock_sb:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # driver_verification check
            mock_sb.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = [{"id": "dv-1"}]
            # insert new ride
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_new_ride]

            response = client.post("/rides/", json=VALID_RIDE_PAYLOAD)

        assert response.status_code == 200
        assert response.json()["message"] == "Ride created"

    def test_create_ride_rejected_without_driver_registration(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            # get_profile_id works
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # driver_verification returns nothing → not a driver
            mock_sb.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = []

            response = client.post("/rides/", json=VALID_RIDE_PAYLOAD)

        assert response.status_code == 403
        assert "register as a driver" in response.json()["detail"]

    def test_create_ride_rejected_when_profile_not_found(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            # get_profile_id fails → 404
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/rides/", json=VALID_RIDE_PAYLOAD)

        assert response.status_code == 404


# ---------------------------------------------------------------------------
# GET /rides/
# ---------------------------------------------------------------------------

class TestSearchRides:

    def test_returns_all_open_rides(self, client):
        fake_rides = [
            {"id": "r1", "origin": "Bath", "destination": "Bristol", "status": "open", "driver_id": "drv-1"},
            {"id": "r2", "origin": "Bath", "destination": "London", "status": "open", "driver_id": "drv-2"},
        ]
        fake_driver_profiles = [
            {"id": "drv-1", "first_name": "Alice", "last_name": "A", "driver_rating": 4.5},
            {"id": "drv-2", "first_name": "Bob", "last_name": "B", "driver_rating": 0.0},
        ]

        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    # get_profile_id: eq chain
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                    # driver profiles: in_ chain
                    tm.select.return_value.in_.return_value.execute.return_value.data = fake_driver_profiles
                elif name == "rides":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = fake_rides
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["driver_name"] == "Alice A"
        assert data[0]["driver_rating"] == 4.5

    def test_returns_filtered_rides(self, client):
        fake_rides = [{"id": "r1", "origin": "Bath", "destination": "Bristol", "status": "open", "driver_id": "drv-1"}]
        fake_driver_profiles = [{"id": "drv-1", "first_name": "Alice", "last_name": "A", "driver_rating": 4.5}]

        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                    tm.select.return_value.in_.return_value.execute.return_value.data = fake_driver_profiles
                elif name == "rides":
                    mock_query = MagicMock()
                    mock_query.execute.return_value.data = fake_rides
                    mock_query.ilike.return_value = mock_query
                    mock_query.gte.return_value = mock_query
                    tm.select.return_value.eq.return_value.neq.return_value = mock_query
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/", params={"origin": "Ba", "destination": "Bris", "min_seats": 2})

        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_returns_empty_when_no_rides(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = []
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/")

        assert response.status_code == 200
        assert response.json() == []

    def test_returns_ride_with_missing_driver_profile(self, client):
        fake_rides = [{"id": "r1", "origin": "Bath", "destination": "Bristol", "status": "open", "driver_id": "drv-1"}]
        fake_driver_profiles = []

        with patch("app.routers.rides.supabase") as mock_sb:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                    tm.select.return_value.in_.return_value.execute.return_value.data = fake_driver_profiles
                elif name == "rides":
                    mock_query = MagicMock()
                    mock_query.execute.return_value.data = fake_rides
                    mock_query.ilike.return_value = mock_query
                    mock_query.gte.return_value = mock_query
                    tm.select.return_value.eq.return_value.neq.return_value = mock_query
                return tm
            mock_sb.table.side_effect = fake_table

            response = client.get("/rides/", params={"origin": "Ba"})

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["driver_name"] is None
        assert data[0]["driver_rating"] == 0.0

# ---------------------------------------------------------------------------
# GET /rides/{ride_id}
# ---------------------------------------------------------------------------

class TestGetRideDetails:

    def test_returns_ride_when_found(self, client):
        fake_ride = {"id": "ride-99", "origin": "Bath", "status": "open"}

        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [fake_ride]
            response = client.get("/rides/ride-99")

        assert response.status_code == 200
        assert response.json()["id"] == "ride-99"

    def test_returns_404_when_ride_not_found(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/rides/nonexistent")

        assert response.status_code == 404
        assert "Ride not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# PUT /rides/{ride_id}
# ---------------------------------------------------------------------------

class TestUpdateRide:

    def test_update_status_successfully(self, client):
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 2, "destination": "Bristol"}

        with patch("app.routers.rides.supabase") as mock_sb, \
             patch("app.routers.rides.notify_ride_started") as mock_notify:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # existing ride fetch
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]
            # update result
            updated_ride = {**existing_ride, "status": "completed"}
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [updated_ride]

            response = client.put("/rides/ride-1", json={"status": "completed"})

        assert response.status_code == 200
        mock_notify.assert_not_called()

    def test_notifies_driver_and_passengers_when_ride_starts(self, client):
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 2, "destination": "Bristol"}

        with patch("app.routers.rides.supabase") as mock_sb, \
             patch("app.routers.rides.notify_ride_started") as mock_notify:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]
                    tm.update.return_value.eq.return_value.execute.return_value.data = [
                        {**existing_ride, "status": "in_progress"}
                    ]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
                        {"passenger_id": "passenger-1", "status": "confirmed"},
                        {"passenger_id": "passenger-2", "status": "confirmed"},
                    ]
                return tm

            mock_sb.table.side_effect = fake_table

            response = client.put("/rides/ride-1", json={"status": "in_progress"})

        assert response.status_code == 200
        mock_notify.assert_called_once_with(
            driver_id=FAKE_PROFILE_ID,
            passenger_ids=["passenger-1", "passenger-2"],
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_update_seats_total_successfully(self, client):
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 3}
        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]
            updated_ride = {**existing_ride, "seats_total": 5, "seats_available": 4}
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [updated_ride]

            response = client.put("/rides/ride-1", json={"seats_total": 5})

        assert response.status_code == 200

    def test_update_departure_time_successfully(self, client):
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 3}
        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]
            updated_ride = {**existing_ride, "departure_time": "2026-07-01T09:00:00"}
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [updated_ride]

            response = client.put("/rides/ride-1", json={"departure_time": "2026-07-01T09:00:00"})

        assert response.status_code == 200

    def test_rejects_invalid_status(self, client):
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 2}

        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]

            response = client.put("/rides/ride-1", json={"status": "flying"})

        assert response.status_code == 400
        assert "Invalid ride status" in response.json()["detail"]

    def test_rejects_reducing_seats_below_booked(self, client):
        # 4 total, 1 available → 3 booked. Request to reduce to 2 seats < 3 booked.
        existing_ride = {"id": "ride-1", "seats_total": 4, "seats_available": 1}

        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [existing_ride]

            response = client.put("/rides/ride-1", json={"seats_total": 2})

        assert response.status_code == 400
        assert "booked seats" in response.json()["detail"]

    def test_returns_403_if_not_drivers_ride(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # Ride fetch returns nothing → not their ride
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            response = client.put("/rides/ride-1", json={"status": "completed"})

        assert response.status_code == 403


# ---------------------------------------------------------------------------
# DELETE /rides/{ride_id}
# ---------------------------------------------------------------------------

class TestCancelRide:

    def test_cancels_ride_successfully(self, client):
        with patch("app.routers.rides.supabase") as mock_sb, \
             patch("app.routers.rides.notify_passengers_of_ride_cancellation") as mock_notify:
            def fake_table(name):
                tm = MagicMock()
                if name == "user_profiles":
                    tm.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "rides":
                    tm.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
                        {"id": "ride-1", "destination": "Bristol"}
                    ]
                    tm.update.return_value.eq.return_value.execute.return_value.data = [{"status": "cancelled"}]
                elif name == "bookings":
                    tm.select.return_value.eq.return_value.neq.return_value.execute.return_value.data = [
                        {"passenger_id": "passenger-1"},
                        {"passenger_id": "passenger-2"},
                    ]
                return tm

            mock_sb.table.side_effect = fake_table

            response = client.delete("/rides/ride-1")

        assert response.status_code == 200
        assert response.json()["message"] == "Ride cancelled"
        mock_notify.assert_called_once_with(
            passenger_ids=["passenger-1", "passenger-2"],
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_returns_403_if_not_drivers_ride(self, client):
        with patch("app.routers.rides.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # ownership check fails
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            response = client.delete("/rides/ride-1")

        assert response.status_code == 403
        assert "Not your ride" in response.json()["detail"]
