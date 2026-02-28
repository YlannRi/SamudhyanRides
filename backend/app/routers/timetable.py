from __future__ import annotations

from datetime import datetime, timedelta
from typing import Literal
from zoneinfo import ZoneInfo

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl

from app.accounts.dependencies import get_current_user


router = APIRouter(prefix="/timetable", tags=["Timetable"])


class TimetableEventsRequest(BaseModel):
    # We still validate as URL, but ALSO apply an allowlist check to avoid SSRF.
    url: HttpUrl
    scope: Literal["week", "day"] = "week"


class TimetableEvent(BaseModel):
    uid: str
    title: str
    location: str | None = None
    description: str | None = None
    start: str  # ISO 8601
    end: str  # ISO 8601


def _ensure_allowed_timetable_url(url: str) -> None:
    # Prevent SSRF: only allow Bath timetable feeds.
    if not url.startswith("https://mytimetable.bath.ac.uk/ical"):
        raise HTTPException(
            status_code=400,
            detail="Invalid timetable URL. Only https://mytimetable.bath.ac.uk/ical feeds are allowed.",
        )


@router.post("/events", response_model=list[TimetableEvent])
async def get_events(
    payload: TimetableEventsRequest,
    _current_user: dict = Depends(get_current_user),
):
    """
    Fetch a Bath iCal feed and return events for the current week or current day.

    - week: Monday 00:00 -> next Monday 00:00 (Europe/London)
    - day:  Today 00:00 -> tomorrow 00:00 (Europe/London)
    """

    url = str(payload.url)
    _ensure_allowed_timetable_url(url)

    tz = ZoneInfo("Europe/London")
    now = datetime.now(tz)

    # Compute filter window
    if payload.scope == "day":
        start_window = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_window = start_window + timedelta(days=1)
    else:
        start_window = (now - timedelta(days=now.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        end_window = start_window + timedelta(days=7)

    # Fetch iCal
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers={"Accept": "text/calendar"})
            resp.raise_for_status()
            ical_bytes = resp.content
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch timetable feed: {e}")

    # Parse iCal
    try:
        from icalendar import Calendar
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="iCal parser not available. Ensure 'icalendar' is installed.",
        )

    try:
        cal = Calendar.from_ical(ical_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid iCal feed: {e}")

    events: list[TimetableEvent] = []

    def to_dt(value) -> datetime:
        # value can be date or datetime
        if isinstance(value, datetime):
            dt = value
        else:
            dt = datetime(value.year, value.month, value.day)

        # Normalize timezone
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=tz)
        else:
            dt = dt.astimezone(tz)
        return dt

    for component in cal.walk():
        if component.name != "VEVENT":
            continue

        dtstart = component.get("DTSTART")
        dtend = component.get("DTEND")
        if not dtstart or not dtend:
            continue

        start_dt = to_dt(dtstart.dt)
        end_dt = to_dt(dtend.dt)

        # Overlap filter
        if end_dt <= start_window or start_dt >= end_window:
            continue

        uid = str(component.get("UID", ""))
        summary = str(component.get("SUMMARY", "Untitled"))
        location = component.get("LOCATION")
        description = component.get("DESCRIPTION")

        events.append(
            TimetableEvent(
                uid=uid or f"{summary}-{start_dt.isoformat()}",
                title=summary,
                location=str(location) if location is not None else None,
                description=str(description) if description is not None else None,
                start=start_dt.isoformat(),
                end=end_dt.isoformat(),
            )
        )

    events.sort(key=lambda e: e.start)
    return events