"""
test_routing.py — Tests for /routing/ endpoints

Endpoints tested:
  POST /routing/calculate       → calculates a route
  GET  /routing/test-bath-route → calculates test route
  GET  /routing/geocode         → geocodes an address
  GET  /routing/ride/{ride_id}  → gets route for ride with pickups
"""

import pytest
from unittest.mock import MagicMock, patch
from main import app

# ---------------------------------------------------------------------------
# POST /routing/calculate
# ---------------------------------------------------------------------------

class TestCalculateRoute:

    def test_calculate_route_successfully(self, client):
        fake_response = {"routes": [{"summary": {"distance": 1000}}]}

        with patch("app.routers.routing.calculate_route", return_value=fake_response):
            response = client.post("/routing/calculate", json={
                "coordinates": [
                    {"longitude": 1.0, "latitude": 1.0},
                    {"longitude": 2.0, "latitude": 2.0}
                ]
            })

        assert response.status_code == 200
        assert response.json()["routes"][0]["summary"]["distance"] == 1000


# ---------------------------------------------------------------------------
# GET /routing/test-bath-route
# ---------------------------------------------------------------------------

class TestTestBathRoute:

    def test_test_bath_route_successfully(self, client):
        fake_response = {"routes": [{"summary": {"distance": 5000}}]}

        with patch("app.routers.routing.calculate_route", return_value=fake_response):
            response = client.get("/routing/test-bath-route")

        assert response.status_code == 200


# ---------------------------------------------------------------------------
# GET /routing/geocode
# ---------------------------------------------------------------------------

class TestGeocodeAddress:

    def test_geocodes_successfully(self, client):
        fake_response = {"features": [{"geometry": {"coordinates": [1.0, 1.0]}}]}

        with patch("app.routers.routing.geocode_address", return_value=fake_response):
            response = client.get("/routing/geocode", params={"q": "Bath Spa Station"})

        assert response.status_code == 200
        assert response.json()["features"][0]["geometry"]["coordinates"] == [1.0, 1.0]


# ---------------------------------------------------------------------------
# GET /routing/reverse-geocode
# ---------------------------------------------------------------------------

class TestReverseGeocode:

    def test_reverse_geocodes_successfully(self, client):
        fake_response = {"label": "Lower Bristol Road, Bath", "lat": 51.38, "lng": -2.36}

        with patch("app.routers.routing.reverse_geocode", return_value=fake_response) as mock_reverse:
            response = client.get("/routing/reverse-geocode", params={"lat": 51.38, "lng": -2.36})

        assert response.status_code == 200
        assert response.json()["label"] == "Lower Bristol Road, Bath"
        mock_reverse.assert_called_once_with(51.38, -2.36)


# ---------------------------------------------------------------------------
# GET /routing/ride/{ride_id}
# ---------------------------------------------------------------------------

class TestGetRideRoute:

    def test_gets_ride_route_without_pickups(self, client):
        fake_ride = {
            "origin_lat": 51.0,
            "origin_lng": -2.0,
            "destination_lat": 51.5,
            "destination_lng": -2.5
        }
        fake_response = {"routes": []}

        with patch("app.routers.routing.supabase") as mock_sb:
            # Sub-mock ride
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [fake_ride]
            # Sub-mock bookings return empty
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            with patch("app.routers.routing.calculate_route", return_value=fake_response):
                response = client.get("/routing/ride/ride-1")

        assert response.status_code == 200

    def test_returns_404_if_ride_not_found(self, client):
        with patch("app.routers.routing.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

            response = client.get("/routing/ride/ride-1")

        assert response.status_code == 404

    def test_returns_422_if_coords_missing(self, client):
        fake_ride = {
            "origin_lat": None,
            "origin_lng": None,
            "destination_lat": 51.5,
            "destination_lng": -2.5
        }

        with patch("app.routers.routing.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [fake_ride]

            response = client.get("/routing/ride/ride-1")

        assert response.status_code == 422
        
    def test_gets_ride_route_with_pickups(self, client):
        fake_ride = {
            "origin_lat": 51.0,
            "origin_lng": -2.0,
            "destination_lat": 51.5,
            "destination_lng": -2.5
        }
        fake_booking = {"id": 1, "pickup_lat": 51.2, "pickup_lng": -2.2}
        fake_response = {"routes": []}

        with patch("app.routers.routing.supabase") as mock_sb:
            # Ensure side effect handles different selects (one is .eq() the other is .eq().eq())
            # For simplicity, we can inject a mock that just checks call signatures, but let's do:
            # We need to mock supabase.table("rides").select() and supabase.table("bookings").select() differently.
            
            # Since mock chains are hard here, we mock the whole table() method
            def fake_table(name):
                t_mock = MagicMock()
                if name == "rides":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [fake_ride]
                elif name == "bookings":
                    t_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [fake_booking]
                return t_mock

            mock_sb.table.side_effect = fake_table

            with patch("app.routers.routing.optimize_route", return_value=[]) as mock_optimize, \
                 patch("app.routers.routing.calculate_route", return_value=fake_response):
                
                response = client.get("/routing/ride/ride-1")

        assert response.status_code == 200
        mock_optimize.assert_called_once()

    def test_gets_ride_route_with_pickups_and_times(self, client):
        fake_ride = {
            "origin_lat": 51.0,
            "origin_lng": -2.0,
            "destination_lat": 51.5,
            "destination_lng": -2.5,
            "departure_time": "2026-03-14T10:00:00Z"
        }
        fake_booking = {"id": 1, "pickup_lat": 51.2, "pickup_lng": -2.2}
        
        fake_response = {
            "features": [{
                "properties": {
                    "summary": {"duration": 1800},
                    "segments": [
                        {"duration": 600},
                        {"duration": 1200}
                    ]
                }
            }]
        }

        from app.pathfinder.models import Coordinate
        ordered_wps = [
            Coordinate(longitude=-2.0, latitude=51.0),
            Coordinate(longitude=-2.2, latitude=51.2),
            Coordinate(longitude=-2.5, latitude=51.5)
        ]

        with patch("app.routers.routing.supabase") as mock_sb:
            def fake_table(name):
                t_mock = MagicMock()
                if name == "rides":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [fake_ride]
                elif name == "bookings":
                    t_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [fake_booking]
                return t_mock

            mock_sb.table.side_effect = fake_table

            with patch("app.routers.routing.optimize_route", return_value=ordered_wps), \
                 patch("app.routers.routing.calculate_route", return_value=fake_response):
                
                response = client.get("/routing/ride/ride-1")

        assert response.status_code == 200
        data = response.json()
        assert "times" in data
        assert data["times"]["driver_leave"] == "2026-03-14T09:30:00+00:00"
        assert len(data["times"]["pickups"]) == 1
        assert data["times"]["pickups"][0]["estimated_time"] == "2026-03-14T09:40:00+00:00"
        assert data["times"]["pickups"][0]["booking_ids"] == [1]
