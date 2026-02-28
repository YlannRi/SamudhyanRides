import random
import string

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return response.data[0]["id"]


def generate_pickup_code():
    return ''.join(random.choices(string.digits, k=4))


# REQUEST SEAT
@router.post("/")
def request_booking(
    ride_id: str,
    pickup_location: str,
    dropoff_location: str,
    price: float,
    pickup_lat: float | None = None,
    pickup_lng: float | None = None,
    current_user: dict = Depends(get_current_user)
):
    passenger_id = get_profile_id(current_user["sub"])

    ride = supabase.table("rides") \
        .select("*") \
        .eq("id", ride_id) \
        .execute()

    if not ride.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride = ride.data[0]

    if ride["status"] != "open":
        raise HTTPException(status_code=400, detail="Ride not open")

    if ride["seats_available"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    booking = supabase.table("bookings").insert({
        "ride_id": ride_id,
        "passenger_id": passenger_id,
        "pickup_location": pickup_location,
        "dropoff_location": dropoff_location,
        "pickup_lat": pickup_lat,
        "pickup_lng": pickup_lng,
        "price": price,
        "status": "pending"
    }).execute()

    return {"message": "Booking requested", "booking": booking.data[0]}


# were 


# ACCEPT BOOKING (Driver)
@router.put("/{booking_id}/accept")
def accept_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    booking = supabase.table("bookings") \
        .select("*") \
        .eq("id", booking_id) \
        .execute()

    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking = booking.data[0]

    ride = supabase.table("rides") \
        .select("*") \
        .eq("id", booking["ride_id"]) \
        .eq("driver_id", profile_id) \
        .execute()

    if not ride.data:
        raise HTTPException(status_code=403, detail="Not your ride")

    ride = ride.data[0]

    if ride["seats_available"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # Reduce seat
    supabase.table("rides") \
        .update({
            "seats_available": ride["seats_available"] - 1,
            "status": "full" if ride["seats_available"] - 1 == 0 else "open"
        }) \
        .eq("id", ride["id"]) \
        .execute()

    pickup_code = generate_pickup_code()

    updated = supabase.table("bookings") \
        .update({
            "status": "confirmed",
            "pickup_code": pickup_code
        }) \
        .eq("id", booking_id) \
        .execute()

    return updated.data[0]

"""
# REJECT BOOKING
@router.put("/{booking_id}/reject")
def reject_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    profile_id = get_profile_id(current_user["sub"])

    booking = supabase.table("bookings") \
        .select("*, rides(driver_id)") \
        .eq("id", booking_id) \
        .execute()

    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    ride = booking.data[0]["rides"]

    if ride["driver_id"] != profile_id:
        raise HTTPException(status_code=403, detail="Not your ride")

    supabase.table("bookings") \
        .update({"status": "cancelled"}) \
        .eq("id", booking_id) \
        .execute()

    return {"message": "Booking rejected"}
"""

# dk what this function is doig
# also need smth that checks if a ride is complete and confirms the status to completed

    

# CANCEL BOOKING (Passenger)
@router.delete("/{booking_id}")
def cancel_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    profile_id = get_profile_id(current_user["sub"])

    # 1. Fetch the booking
    booking_res = supabase.table("bookings") \
        .select("*") \
        .eq("id", booking_id) \
        .execute()

    if not booking_res.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking = booking_res.data[0]
    passenger_id = booking["passenger_id"]
    ride_id = booking["ride_id"]

    # 2. Fetch the associated ride to get the driver_id and current seats
    ride_res = supabase.table("rides") \
        .select("driver_id, seats_available") \
        .eq("id", ride_id) \
        .execute()

    if not ride_res.data:
        raise HTTPException(status_code=404, detail="Associated ride not found")

    ride = ride_res.data[0]
    driver_id = ride["driver_id"]

    # 3. Check authorization: User must be either the passenger OR the driver
    if profile_id != passenger_id and profile_id != driver_id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking.")

    # 4. Delete the booking (or you could update status to 'cancelled')
    supabase.table("bookings").delete().eq("id", booking_id).execute()

    # 5. Restore the available seat on the ride
    new_seats = ride["seats_available"] + 1
    supabase.table("rides").update({"seats_available": new_seats}).eq("id", ride_id).execute()

    return {"message": "Passenger removed / Booking cancelled"}



# GET MY BOOKINGS
@router.get("/me")
def get_my_bookings(current_user: dict = Depends(get_current_user)):
    profile_id = get_profile_id(current_user["sub"])

    # Fetch the user's bookings
    bookings = supabase.table("bookings") \
        .select("*") \
        .eq("passenger_id", profile_id) \
        .execute()

    if not bookings.data:
        return []

    # Fetch the associated rides
    ride_ids = list(set(b["ride_id"] for b in bookings.data))
    rides_res = supabase.table("rides") \
        .select("*") \
        .in_("id", ride_ids) \
        .execute()

    # Fetch the driver profiles for those rides
    driver_ids = list(set(r["driver_id"] for r in rides_res.data))
    drivers_res = supabase.table("user_profiles") \
        .select("id, first_name, last_name") \
        .in_("id", driver_ids) \
        .execute()

    drivers_by_id = {d["id"]: d for d in drivers_res.data}

    # Assemble the nested data
    rides_by_id = {}
    for r in rides_res.data:
        r["driver"] = drivers_by_id.get(r["driver_id"])
        rides_by_id[r["id"]] = r

    for b in bookings.data:
        b["ride"] = rides_by_id.get(b["ride_id"])

    return bookings.data


# Confirm pickup (passenger provides code to driver)
@router.post("/bookings/{booking_id}/confirm-pickup")
def confirm_pickup(
    booking_id: str,
    pickup_code: str,
    current_user: dict = Depends(get_current_user)
):
    passenger_id = get_profile_id(current_user["sub"])

    booking = supabase.table("bookings").select("*").eq("id", booking_id).eq("passenger_id", passenger_id).execute()
    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking = booking.data[0]
    if booking["pickup_code"] != pickup_code:
        raise HTTPException(status_code=400, detail="Invalid pickup code")

    supabase.table("bookings").update({"status": "confirmed"}).eq("id", booking_id).execute()
    return {"message": "Pickup confirmed"}

# Complete ride (driver)
@router.post("/rides/{ride_id}/complete")
def complete_ride(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    driver_id = get_profile_id(current_user["sub"])

    ride = supabase.table("rides").select("*").eq("id", ride_id).eq("driver_id", driver_id).execute()
    if not ride.data:
        raise HTTPException(status_code=403, detail="Not your ride")

    # Update ride and all bookings to completed
    supabase.table("rides").update({"status": "completed"}).eq("id", ride_id).execute()
    supabase.table("bookings").update({"status": "completed"}).eq("ride_id", ride_id).execute()
    return {"message": "Ride marked as completed"}

# Emergency trigger
@router.post("/rides/{ride_id}/emergency")
def ride_emergency(
    ride_id: str,
    description: str | None = None,
    current_user: dict = Depends(get_current_user)
):
    user_id = get_profile_id(current_user["sub"])
    ride = supabase.table("rides").select("*").eq("id", ride_id).execute()
    if not ride.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    incident = supabase.table("incident_reports").insert({
        "ride_id": ride_id,
        "reporter_id": user_id,
        "description": description or "Emergency triggered",
        "status": "open"
    }).execute()

    return {"message": "Emergency incident reported", "incident": incident.data[0]}
