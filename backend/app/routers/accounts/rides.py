from fastapi import APIRouter, Depends, HTTPException
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/rides", tags=["Rides"])


# Helper: Get internal profile ID from auth ID
def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return response.data[0]["id"]


#POST RIDE (Driver Only)
@router.post("/")
def create_ride(
    origin: str,
    destination: str,
    departure_time: str,
    seats_total: int,
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

    ride = supabase.table("rides").insert({
        "driver_id": profile_id,
        "origin": origin,
        "destination": destination,
        "departure_time": departure_time,
        "seats_total": seats_total,
        "seats_available": seats_total,
        "status": "open"
    }).execute()

    return {"message": "Ride created", "ride": ride.data[0]}


#SEARCH RIDES
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


#GET RIDE DETAILS
@router.get("/{rides_id}")
def get_ride_details(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    response = supabase.table("rides") \
        .select("*") \
        .eq("id", ride_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    return response.data[0]

# when testing in teh fast api docs thing i have to give it the driver id to fetch the RIDE details
# not sure how this is actually going to work, gpt said that when the front end calls it will include
# the id but i dont rlly understand how that worls tbh


#UPDATE RIDE (Driver Only)
@router.put("/{ride_id}")
def update_ride(
    ride_id: str,
    seats_total: int | None = None,
    status: str | None = None,
    departure_time: str | None = None,
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

    ride = existing.data[0]
    update_data = {}

    if seats_total is not None:
        seats_taken = ride["seats_total"] - ride["seats_available"]

        if seats_total < seats_taken:
            raise HTTPException(status_code=400, detail="Cannot reduce below booked seats")

        update_data["seats_total"] = seats_total
        update_data["seats_available"] = seats_total - seats_taken

    if status:
        if status not in ["open", "full", "in_progress", "completed", "cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid ride status")
        update_data["status"] = status

    if departure_time:
        update_data["departure_time"] = departure_time

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
