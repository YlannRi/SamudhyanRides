"""
test_pathfinder.py — Tests for app/pathfinder/service.py

Functions tested:
  - calculate_route
  - geocode_address
  - reverse_geocode
  - optimize_route
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from app.pathfinder.models import RouteRequest, Coordinate
from app.pathfinder.service import calculate_route, geocode_address, optimize_route, reverse_geocode

@pytest.fixture
def mock_env_key():
    with patch("os.getenv", return_value="fake-api-key"):
        yield

@pytest.fixture
def mock_env_no_key():
    with patch("os.getenv", return_value=None):
        yield

# ---------------------------------------------------------------------------
# calculate_route
# ---------------------------------------------------------------------------

class TestCalculateRoute:

    def test_missing_api_key(self, mock_env_no_key):
        req = RouteRequest(coordinates=[Coordinate(longitude=1.0, latitude=2.0)])
        with pytest.raises(HTTPException) as exc:
            calculate_route(req)
        assert exc.value.status_code == 500
        assert "API key not found" in str(exc.value.detail)

    @patch("app.pathfinder.service.requests.post")
    def test_successful_calculation(self, mock_post, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"routes": [{"distance": 100}]}
        mock_post.return_value = mock_resp

        req = RouteRequest(coordinates=[
            Coordinate(longitude=1.0, latitude=2.0),
            Coordinate(longitude=3.0, latitude=4.0)
        ])
        res = calculate_route(req)

        assert res["routes"][0]["distance"] == 100
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        assert kwargs["json"]["coordinates"] == [[1.0, 2.0], [3.0, 4.0]]
        assert kwargs["headers"]["Authorization"] == "fake-api-key"

# ---------------------------------------------------------------------------
# geocode_address
# ---------------------------------------------------------------------------

class TestGeocodeAddress:

    def test_missing_api_key(self, mock_env_no_key):
        with pytest.raises(HTTPException) as exc:
            geocode_address("Bath")
        assert exc.value.status_code == 500

    @patch("app.pathfinder.service.requests.get")
    def test_successful_geocode(self, mock_get, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = True
        mock_resp.json.return_value = {
            "features": [
                {
                    "properties": {"label": "Bath Spa Station", "country_a": "GBR"},
                    "geometry": {"coordinates": [-2.36, 51.37]}
                }
            ]
        }
        mock_get.return_value = mock_resp

        res = geocode_address("Bath")
        assert len(res) == 1
        assert res[0]["label"] == "Bath Spa Station"
        assert res[0]["lng"] == -2.36
        assert res[0]["lat"] == 51.37

    @patch("app.pathfinder.service.requests.get")
    def test_api_error(self, mock_get, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = False
        mock_resp.text = "Rate limit exceeded"
        mock_get.return_value = mock_resp

        with pytest.raises(HTTPException) as exc:
            geocode_address("Bath")
        assert exc.value.status_code == 502
        assert "ORS geocode error" in str(exc.value.detail)

# ---------------------------------------------------------------------------
# reverse_geocode
# ---------------------------------------------------------------------------

class TestReverseGeocode:

    def test_missing_api_key(self, mock_env_no_key):
        with pytest.raises(HTTPException) as exc:
            reverse_geocode(51.38, -2.36)
        assert exc.value.status_code == 500

    @patch("app.pathfinder.service.requests.get")
    def test_successful_reverse_geocode(self, mock_get, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = True
        mock_resp.json.return_value = {
            "features": [
                {
                    "properties": {
                        "street": "Lower Bristol Road",
                        "locality": "Bath",
                        "country_a": "GBR",
                    },
                    "geometry": {"coordinates": [-2.36, 51.38]}
                }
            ]
        }
        mock_get.return_value = mock_resp

        res = reverse_geocode(51.38, -2.36)

        assert res["label"] == "Lower Bristol Road, Bath"
        assert res["lng"] == -2.36
        assert res["lat"] == 51.38
        mock_get.assert_called_once()
        assert mock_get.call_args.kwargs["params"]["point.lat"] == 51.38
        assert mock_get.call_args.kwargs["params"]["point.lon"] == -2.36

    @patch("app.pathfinder.service.requests.get")
    def test_reverse_geocode_api_error(self, mock_get, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = False
        mock_resp.text = "Rate limit exceeded"
        mock_get.return_value = mock_resp

        with pytest.raises(HTTPException) as exc:
            reverse_geocode(51.38, -2.36)
        assert exc.value.status_code == 502
        assert "ORS reverse geocode error" in str(exc.value.detail)

# ---------------------------------------------------------------------------
# optimize_route
# ---------------------------------------------------------------------------

class TestOptimizeRoute:

    def test_missing_api_key(self, mock_env_no_key):
        with pytest.raises(HTTPException) as exc:
            optimize_route(
                Coordinate(longitude=1, latitude=1), 
                Coordinate(longitude=2, latitude=2), 
                []
            )
        assert exc.value.status_code == 500

    @patch("app.pathfinder.service.requests.post")
    def test_successful_optimization(self, mock_post, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = True
        mock_resp.json.return_value = {
            "routes": [
                {
                    "steps": [
                        {"type": "start", "location": [1.0, 1.0]},
                        {"type": "job", "location": [1.5, 1.5]},
                        {"type": "end", "location": [2.0, 2.0]},
                        {"type": "break", "location": [0,0]} # Should be ignored
                    ]
                }
            ]
        }
        mock_post.return_value = mock_resp

        origin = Coordinate(longitude=1.0, latitude=1.0)
        destination = Coordinate(longitude=2.0, latitude=2.0)
        pickups = [Coordinate(longitude=1.5, latitude=1.5)]

        res = optimize_route(origin, destination, pickups)

        assert len(res) == 3
        assert res[1].longitude == 1.5
        assert res[1].latitude == 1.5

    @patch("app.pathfinder.service.requests.post")
    def test_api_error(self, mock_post, mock_env_key):
        mock_resp = MagicMock()
        mock_resp.ok = False
        mock_resp.text = "Invalid request"
        mock_post.return_value = mock_resp

        with pytest.raises(HTTPException) as exc:
            optimize_route(
                Coordinate(longitude=1, latitude=1), 
                Coordinate(longitude=2, latitude=2), 
                []
            )
        assert exc.value.status_code == 502
        assert "ORS optimize error" in str(exc.value.detail)
