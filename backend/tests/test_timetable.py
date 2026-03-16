"""
test_timetable.py — Tests for /timetable/ endpoints

Endpoints tested:
  POST /timetable/events  → fetches and parses bath.ac.uk iCal feeds
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

import httpx

from app.accounts.dependencies import get_current_user
from main import app

FAKE_USER = {"sub": "user-abc-123", "email": "passenger@bath.ac.uk"}


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# Minimal valid iCal payload for testing that falls within the current week/day.
# Since the endpoint filters by current real-world time, we have to mock `datetime.now()` 
# OR provide an event that spans a massive time window (easier and less brittle).
# dtstart: 2020 to dtend: 2030 guarantees it will show up when tested.
VALID_ICAL_DATA = b"""BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:event-123
SUMMARY:Test Lecture
LOCATION:BATH 1.2
DESCRIPTION:A test lecture
DTSTART:20200101T100000Z
DTEND:20300101T110000Z
END:VEVENT
END:VCALENDAR
"""

INVALID_ICAL_DATA = b"""BEGIN:VCALENDAR
VERSION:2.0
THIS IS NOT A VALID CALENDAR
END:VCALENDAR
"""


class TestTimetableEvents:

    def test_fetches_and_parses_events_successfully_week(self, client):
        mock_response = MagicMock()
        mock_response.content = VALID_ICAL_DATA
        mock_response.raise_for_status = MagicMock()

        # Mock the AsyncClient to return our fake response
        mock_client_instance = AsyncMock()
        mock_client_instance.get.return_value = mock_response

        # The context manager (__aenter__) needs to return the mocked instance
        mock_client_cls = MagicMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client_instance

        with patch("app.routers.timetable.httpx.AsyncClient", new=mock_client_cls):
            response = client.post("/timetable/events", json={
                "url": "https://mytimetable.bath.ac.uk/ical/test",
                "scope": "week"
            })

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Test Lecture"
        assert data[0]["location"] == "BATH 1.2"

    def test_fetches_and_parses_events_successfully_day(self, client):
        mock_response = MagicMock()
        mock_response.content = VALID_ICAL_DATA
        mock_response.raise_for_status = MagicMock()

        mock_client_instance = AsyncMock()
        mock_client_instance.get.return_value = mock_response

        mock_client_cls = MagicMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client_instance

        with patch("app.routers.timetable.httpx.AsyncClient", new=mock_client_cls):
            response = client.post("/timetable/events", json={
                "url": "https://mytimetable.bath.ac.uk/ical/test",
                "scope": "day"
            })

        assert response.status_code == 200
        assert response.json()[0]["title"] == "Test Lecture"

    def test_rejects_non_bath_urls(self, client):
        response = client.post("/timetable/events", json={
            "url": "https://google.com/calendar/ical/test",
            "scope": "week"
        })
        
        assert response.status_code == 400
        assert "Only https://mytimetable.bath.ac.uk/ical feeds are allowed" in response.json()["detail"]

    def test_handles_httpx_timeout_or_error(self, client):
        mock_client_instance = AsyncMock()
        # Simulate a network error throwing RequestError
        mock_client_instance.get.side_effect = httpx.RequestError("Timeout")

        mock_client_cls = MagicMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client_instance

        with patch("app.routers.timetable.httpx.AsyncClient", new=mock_client_cls):
            response = client.post("/timetable/events", json={
                "url": "https://mytimetable.bath.ac.uk/ical/test",
                "scope": "week"
            })

        # The router wraps httpx.HTTPError into a 502
        assert response.status_code == 502
        assert "Failed to fetch timetable feed" in response.json()["detail"]

    def test_handles_invalid_ical_format(self, client):
        mock_response = MagicMock()
        mock_response.content = INVALID_ICAL_DATA
        mock_response.raise_for_status = MagicMock()

        mock_client_instance = AsyncMock()
        mock_client_instance.get.return_value = mock_response

        mock_client_cls = MagicMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client_instance

        with patch("app.routers.timetable.httpx.AsyncClient", new=mock_client_cls):
            response = client.post("/timetable/events", json={
                "url": "https://mytimetable.bath.ac.uk/ical/test",
                "scope": "week"
            })

        assert response.status_code == 400
        assert "Invalid iCal feed" in response.json()["detail"]
