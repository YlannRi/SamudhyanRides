"""
test_bookings.py — Tests for all /bookings/ endpoints

Endpoints tested:
  POST   /bookings/                             → request a booking for an open ride
  PUT    /bookings/{booking_id}/accept          → driver accepts booking (reduces seat)
  DELETE /bookings/{booking_id}                 → cancel booking (restores seat)
  GET    /bookings/me                           → get user's bookings with nested ride/driver
  POST   /bookings/bookings/{booking_id}/confirm-pickup → confirm via 4-digit code
  POST   /bookings/rides/{ride_id}/complete             → mark ride and bookings as completed
  POST   /bookings/rides/{ride_id}/emergency            → create emergency incident
"""

import pytest
from unittest.mock import MagicMock, patch
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "user-abc-123", "email": "passenger@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()

def test_generate_pickup_code():
    from app.routers.bookings import generate_pickup_code
    code = generate_pickup_code()
    assert len(code) == 4
    assert code.isdigit()

def test_get_profile_id_not_found(client):
    with patch("app.routers.bookings.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        response = client.get("/bookings/me")
    assert response.status_code == 404
    assert "User profile not found" in response.json()["detail"]

# ---------------------------------------------------------------------------
# POST /bookings/ (Request Booking)
# ---------------------------------------------------------------------------

class TestRequestBooking:

    def test_request_booking_successfully(self, client):
        fake_ride = {"id": "ride-1", "status": "open", "seats_available": 3}
        fake_booking = {"id": "book-1", "status": "pending"}

        with patch("app.routers.bookings.supabase") as mock_sb, \
             patch("app.routers.bookings.get_profile_name", return_value="Test User"), \
             patch("app.routers.bookings.notify_driver_of_booking_request") as mock_notify:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),  # get_profile_id
                MagicMock(data=[{**fake_ride, "driver_id": "driver-123", "destination": "Bristol"}]),
            ]
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_booking]

            response = client.post("/bookings/", params={
                "ride_id": "ride-1",
                "pickup_location": "Bath",
                "dropoff_location": "Bristol",
                "price": 10.50
            })

        assert response.status_code == 200
        assert response.json()["message"] == "Booking requested"
        mock_notify.assert_called_once_with(
            driver_id="driver-123",
            passenger_name="Test User",
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_fails_if_ride_not_open(self, client):
        fake_ride = {"id": "ride-1", "status": "full", "seats_available": 0}

        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[fake_ride]),
            ]

            response = client.post("/bookings/", params={
                "ride_id": "ride-1",
                "pickup_location": "Bath",
                "dropoff_location": "Bristol",
                "price": 10.50
            })

        assert response.status_code == 400
        assert "Ride not open" in response.json()["detail"]

    def test_fails_if_no_seats_available(self, client):
        # Even if status says open, if seats = 0 it should fail
        fake_ride = {"id": "ride-1", "status": "open", "seats_available": 0}

        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[fake_ride]),
            ]

            response = client.post("/bookings/", params={
                "ride_id": "ride-1",
                "pickup_location": "Bath",
                "dropoff_location": "Bristol",
                "price": 10.50
            })

        assert response.status_code == 400
        assert "No seats available" in response.json()["detail"]

    def test_fails_if_ride_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[]), # Ride not found
            ]

            response = client.post("/bookings/", params={
                "ride_id": "invalid-ride",
                "pickup_location": "Bath",
                "dropoff_location": "Bristol",
                "price": 10.50
            })

        assert response.status_code == 404
        assert "Ride not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# PUT /bookings/{booking_id}/accept
# ---------------------------------------------------------------------------

class TestAcceptBooking:

    def test_accepts_booking_and_reduces_seat(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1"}
        fake_ride = {"id": "ride-1", "seats_available": 2}

        with patch("app.routers.bookings.supabase") as mock_sb, \
             patch("app.routers.bookings.generate_pickup_code", return_value="1234"), \
             patch("app.routers.bookings.notify_passenger_of_booking_acceptance") as mock_notify:

            # 1. get_profile_id
            # 2. get booking
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[{**fake_booking, "passenger_id": "passenger-9"}]),
            ]

            # 3. get ride (requires two eq chains, so mock the first eq to return an object with another eq)
            mock_ride_query = MagicMock()
            mock_ride_query.eq.return_value.execute.return_value.data = [{**fake_ride, "destination": "Bristol"}]
            # Replace the generic .eq from the second side_effect onwards
            mock_sb.table.return_value.select.return_value.eq.return_value = mock_ride_query

            # Setup update mocks for both ride and booking
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [{"status": "confirmed"}]

            response = client.put("/bookings/book-1/accept")

        assert response.status_code == 200
        assert response.json()["status"] == "confirmed"
        mock_notify.assert_called_once_with(
            passenger_id="passenger-9",
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_accept_fails_if_booking_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[]), # Booking not found
            ]
            response = client.put("/bookings/book-1/accept")
        assert response.status_code == 404

    def test_accept_fails_if_not_your_ride(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1"}
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[fake_booking]),
            ]
            mock_ride_query = MagicMock()
            mock_ride_query.eq.return_value.execute.return_value.data = [] # Ride not found or not yours
            mock_sb.table.return_value.select.return_value.eq.return_value = mock_ride_query

            response = client.put("/bookings/book-1/accept")
        assert response.status_code == 403

    def test_accept_fails_if_no_seats(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1"}
        fake_ride = {"id": "ride-1", "seats_available": 0}
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[fake_booking]),
            ]
            mock_ride_query = MagicMock()
            mock_ride_query.eq.return_value.execute.return_value.data = [fake_ride]
            mock_sb.table.return_value.select.return_value.eq.return_value = mock_ride_query

            response = client.put("/bookings/book-1/accept")
        assert response.status_code == 400


# ---------------------------------------------------------------------------
# DELETE /bookings/{booking_id}
# ---------------------------------------------------------------------------

class TestCancelBooking:

    def test_passenger_can_cancel_booking(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1", "passenger_id": FAKE_PROFILE_ID}
        fake_ride = {"id": "ride-1", "driver_id": "driver-xyz", "seats_available": 2, "destination": "Bristol"}

        with patch("app.routers.bookings.supabase") as mock_sb, \
             patch("app.routers.bookings.get_profile_name", return_value="Test Passenger"), \
             patch("app.routers.bookings.notify_driver_of_booking_cancellation") as mock_notify:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),    # Profile ID
                MagicMock(data=[fake_booking]),               # Booking details
                MagicMock(data=[fake_ride]),                  # Ride details
            ]

            response = client.delete("/bookings/book-1")

        assert response.status_code == 200
        assert "cancelled" in response.json()["message"]
        mock_notify.assert_called_once_with(
            driver_id="driver-xyz",
            passenger_name="Test Passenger",
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_driver_can_cancel_booking_and_notify_passenger(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1", "passenger_id": "passenger-1"}
        fake_ride = {"id": "ride-1", "driver_id": FAKE_PROFILE_ID, "seats_available": 2, "destination": "Bristol"}

        with patch("app.routers.bookings.supabase") as mock_sb, \
             patch("app.routers.bookings.notify_passenger_of_booking_cancellation") as mock_notify:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[fake_booking]),
                MagicMock(data=[fake_ride]),
            ]

            response = client.delete("/bookings/book-1")

        assert response.status_code == 200
        mock_notify.assert_called_once_with(
            passenger_id="passenger-1",
            destination="Bristol",
            ride_id="ride-1",
        )

    def test_cancel_fails_if_booking_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),    
                MagicMock(data=[]), # Booking missing
            ]
            response = client.delete("/bookings/book-1")
        assert response.status_code == 404

    def test_cancel_fails_if_ride_not_found(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1", "passenger_id": FAKE_PROFILE_ID}
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),    
                MagicMock(data=[fake_booking]),
                MagicMock(data=[]), # Ride missing 
            ]
            response = client.delete("/bookings/book-1")
        assert response.status_code == 404

    def test_cancel_fails_if_unauthorized(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1", "passenger_id": "other-passenger"}
        fake_ride = {"id": "ride-1", "driver_id": "other-driver", "seats_available": 2}
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),    
                MagicMock(data=[fake_booking]),
                MagicMock(data=[fake_ride]),
            ]
            response = client.delete("/bookings/book-1")
        assert response.status_code == 403


# ---------------------------------------------------------------------------
# GET /bookings/me
# ---------------------------------------------------------------------------

class TestGetMyBookings:

    def test_returns_empty_when_no_bookings(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[]),
            ]

            response = client.get("/bookings/me")

        assert response.status_code == 200
        assert response.json() == []

    def test_returns_nested_bookings(self, client):
        fake_bookings = [{"id": "book-1", "ride_id": "ride-1"}]
        fake_rides = [{"id": "ride-1", "driver_id": "driver-1"}]
        fake_drivers = [{"id": "driver-1", "first_name": "Test", "last_name": "Driver"}]

        with patch("app.routers.bookings.supabase") as mock_sb:
            # First is profile, second is bookings, third is in_ for rides, fourth is in_ for drivers
            mock_sb_execute = MagicMock()
            mock_sb_execute.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=fake_bookings),
                MagicMock(data=fake_rides),
                MagicMock(data=fake_drivers),
            ]
            
            def fake_table(name):
                tm = MagicMock()
                if name in ("user_profiles", "bookings"):
                    tm.select.return_value.eq.return_value = mock_sb_execute
                    tm.select.return_value.in_.return_value = mock_sb_execute
                elif name == "rides":
                    tm.select.return_value.in_.return_value = mock_sb_execute
                return tm
            
            mock_sb.table.side_effect = fake_table

            response = client.get("/bookings/me")

        assert response.status_code == 200
        assert response.json()[0]["ride"]["driver"]["first_name"] == "Test"


class TestGetVehicleInfo:
    def test_get_vehicle_info_success(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"driver_id": "driver-abc"}]),
                MagicMock(data=[{"car_model": "Toyota Yaris", "number_plate": "AB12 CDE"}])
            ]
            response = client.get("/bookings/rides/ride-1/vehicle")
        
        assert response.status_code == 200
        assert response.json()["car_model"] == "Toyota Yaris"

    def test_get_vehicle_info_ride_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/bookings/rides/ride-1/vehicle")
        
        assert response.status_code == 404
        assert "Ride not found" in response.json()["detail"]

    def test_get_vehicle_info_verification_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"driver_id": "driver-abc"}]),
                MagicMock(data=[])
            ]
            response = client.get("/bookings/rides/ride-1/vehicle")
        
        assert response.status_code == 404
        assert "Vehicle info not found" in response.json()["detail"]

# ---------------------------------------------------------------------------
# POST /bookings/bookings/{booking_id}/confirm-pickup
# ---------------------------------------------------------------------------


class TestConfirmPickup:

    def test_confirms_pickup_with_correct_code(self, client):
        fake_booking = {"id": "book-1", "pickup_code": "1234"}

        with patch("app.routers.bookings.supabase") as mock_sb:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # booking select uses eq().eq().execute()
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [fake_booking]

            response = client.post("/bookings/bookings/book-1/confirm-pickup", params={"pickup_code": "1234"})

        assert response.status_code == 200
        assert response.json()["message"] == "Pickup confirmed"

    def test_rejects_pickup_with_wrong_code(self, client):
        fake_booking = {"id": "book-1", "pickup_code": "1234"}

        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [fake_booking]

            response = client.post("/bookings/bookings/book-1/confirm-pickup", params={"pickup_code": "wrong"})

        assert response.status_code == 400

    def test_confirm_fails_if_booking_missing(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/bookings/bookings/book-1/confirm-pickup", params={"pickup_code": "wrong"})

        assert response.status_code == 404


# ---------------------------------------------------------------------------
# POST /bookings/rides/{ride_id}/complete
# ---------------------------------------------------------------------------

class TestCompleteRide:

    def test_driver_can_complete_ride(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            # profile
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # ride checks eq.eq.execute
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "ride-1"}]

            response = client.post("/bookings/rides/ride-1/complete")

        assert response.status_code == 200
        assert response.json()["message"] == "Ride marked as completed"

    def test_complete_fails_if_not_your_ride(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/bookings/rides/ride-1/complete")

        assert response.status_code == 403


# ---------------------------------------------------------------------------
# POST /bookings/rides/{ride_id}/emergency
# ---------------------------------------------------------------------------

class TestEmergencyTrigger:

    def test_triggers_emergency_successfully(self, client):
        fake_incident = {"status": "open"}

        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),  # profile
                MagicMock(data=[{"id": "ride-1"}]),         # ride exists
            ]
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_incident]

            response = client.post("/bookings/rides/ride-1/emergency")

        assert response.status_code == 200
        assert "Emergency" in response.json()["message"]

    def test_emergency_fails_if_ride_not_found(self, client):
        with patch("app.routers.bookings.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[]),         # ride missing
            ]
            response = client.post("/bookings/rides/ride-1/emergency")
        assert response.status_code == 404
