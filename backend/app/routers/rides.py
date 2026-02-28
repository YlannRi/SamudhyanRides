from datetime import datetime
from typing import Optional

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/rides", tags=["Rides"])

class RideCreate(BaseModel):
    origin: str
    destination: str
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    departure_time: datetime
    seats_total: int

class RideUpdate(BaseModel):
    seats_total: Optional[int] = None
    status: Optional[str] = None
    departure_time: Optional[datetime] = None

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return response.data[0]["id"]

@router.get("/driver/dashboard")
def get_driver_dashboard(current_user: dict = Depends(get_current_user)):
    """
    Returns all upcoming rides for the driver with nested bookings and passenger profiles.
    Used for the 'My Rides' / management view.
    """
    profile_id = get_profile_id(current_user["sub"])
    
    # Fetch the driver's upcoming rides
    rides_res = supabase.table("rides") \
        .select("*") \
        .eq("driver_id", profile_id) \
        .neq("status", "completed") \
        .neq("status", "cancelled") \
        .execute()
    
    if not rides_res.data:
        return []
    
    ride_ids = [r["id"] for r in rides_res.data]
    
    # 2. Fetch all bookings for these rides
    bookings_res = supabase.table("bookings") \
        .select("*") \
        .in_("ride_id", ride_ids) \
        .execute()
        
    if not bookings_res.data:
        for ride in rides_res.data:
            ride["bookings"] = []
        return rides_res.data

    # 3. Fetch passenger profiles for these bookings
    passenger_ids = list(set(b["passenger_id"] for b in bookings_res.data))
    profiles_res = supabase.table("user_profiles") \
        .select("id, first_name, last_name, university_username, driver_rating, rider_rating") \
        .in_("id", passenger_ids) \
        .execute()
        
    profiles_by_id = {p["id"]: p for p in profiles_res.data}
    
    # 4. Attach profiles to bookings
    for booking in bookings_res.data:
        booking["passenger"] = profiles_by_id.get(booking["passenger_id"])
        
    # 5. Group bookings onto their respective rides
    bookings_by_ride = {}
    for b in bookings_res.data:
        rid = b["ride_id"]
        if rid not in bookings_by_ride:
            bookings_by_ride[rid] = []
        bookings_by_ride[rid].append(b)
        
    for ride in rides_res.data:
        ride["bookings"] = bookings_by_ride.get(ride["id"], [])
        
    return rides_res.data

@router.post("/")
def create_ride(
    ride: RideCreate, # FastAPI now expects a JSON body matching the model
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    # Check driver verified
    driver = supabase.table("driver_verification") \
        .select("id") \
        .eq("driver_id", profile_id) \
        .limit(1) \
        .execute()

    if not driver.data or driver.data[0].get("verified") is not True:
        raise HTTPException(status_code=403, detail="You need to register as a driver")

    new_ride = supabase.table("rides").insert({
        "driver_id": profile_id,
        "origin": ride.origin,
        "destination": ride.destination,
        "origin_lat": ride.origin_lat,
        "origin_lng": ride.origin_lng,
        "destination_lat": ride.destination_lat,
        "destination_lng": ride.destination_lng,
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
    # Get the current user's profile ID
    profile_id = get_profile_id(current_user["sub"])

    # Exclude rides where the current user is the driver
    query = supabase.table("rides") \
        .select("*") \
        .eq("status", "open") \
        .neq("driver_id", profile_id)

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
    ride_update: RideUpdate,
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