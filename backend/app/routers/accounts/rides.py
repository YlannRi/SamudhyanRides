from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel # Add this import
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/rides", tags=["Rides"])

class RideCreate(BaseModel):
    origin: str
    destination: str
    departure_time: datetime
    seats_total: int

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return response.data[0]["id"]

@router.post("/")
def create_ride(
    ride: RideCreate, # FastAPI now expects a JSON body matching the model
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    # Check driver verified
    verified = supabase.table("driver_verification") \
        .select("*") \
        .eq("driver_id", profile_id) \
        .eq("verified", True) \
        .execute()

    if not verified.data:
        raise HTTPException(status_code=403, detail="You are not a verified driver")

    new_ride = supabase.table("rides").insert({
        "driver_id": profile_id,
        "origin": ride.origin,
        "destination": ride.destination,
        "departure_time": ride.departure_time.isoformat(),
        "seats_total": ride.seats_total,
        "seats_available": ride.seats_total,
        "status": "open"
    }).execute()

    return {"message": "Ride created", "ride": new_ride.data[0]}

# SEARCH RIDES (GET requests should still use query parameters, not JSON bodies)
@router.get("/")
def search_rides(
    origin: str | None = None,
    destination: str | None = None,
    min_seats: int | None = None,
    current_user: dict = Depends(get_current_user)
):
    query = supabase.table("rides") \
        .select("*") \
        .eq("status", "open")

    if origin:
        query = query.ilike("origin", f"%{origin}%")

    if destination:
        query = query.ilike("destination", f"%{destination}%")

    if min_seats:
        query = query.gte("seats_available", min_seats)

    response = query.execute()

    return response.data


# GET RIDE DETAILS
@router.get("/{rides_id}")
def get_ride_details(
    rides_id: str,
    current_user: dict = Depends(get_current_user)
):
    response = supabase.table("rides") \
        .select("*") \
        .eq("id", rides_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    return response.data[0]


# UPDATE RIDE (Driver Only) - Now accepts JSON body
@router.put("/{ride_id}")
def update_ride(
    ride_id: str,
    ride_update: RideCreate,
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    existing = supabase.table("rides") \
        .select("*") \
        .eq("id", ride_id) \
        .eq("driver_id", profile_id) \
        .execute()

    if not existing.data:
        raise HTTPException(status_code=403, detail="You cannot edit this ride")

    ride_data = existing.data[0]
    update_data = {}

    if ride_update.seats_total is not None:
        seats_taken = ride_data["seats_total"] - ride_data["seats_available"]

        if ride_update.seats_total < seats_taken:
            raise HTTPException(status_code=400, detail="Cannot reduce below booked seats")

        update_data["seats_total"] = ride_update.seats_total
        update_data["seats_available"] = ride_update.seats_total - seats_taken

    if ride_update.status:
        if ride_update.status not in ["open", "full", "in_progress", "completed", "cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid ride status")
        update_data["status"] = ride_update.status

    if ride_update.departure_time:
        update_data["departure_time"] = ride_update.departure_time

    updated = supabase.table("rides") \
        .update(update_data) \
        .eq("id", ride_id) \
        .execute()

    return updated.data[0]


# CANCEL RIDE
@router.delete("/{ride_id}")
def cancel_ride(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    existing = supabase.table("rides") \
        .select("*") \
        .eq("id", ride_id) \
        .eq("driver_id", profile_id) \
        .execute()

    if not existing.data:
        raise HTTPException(status_code=403, detail="Not your ride")

    supabase.table("rides") \
        .update({"status": "cancelled"}) \
        .eq("id", ride_id) \
        .execute()

    return {"message": "Ride cancelled"}