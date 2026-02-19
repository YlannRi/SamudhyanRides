from fastapi import APIRouter, Depends, HTTPException
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
import random
import string

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
def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    passenger_id = get_profile_id(current_user["sub"])

    booking = supabase.table("bookings") \
        .select("*") \
        .eq("id", booking_id) \
        .eq("passenger_id", passenger_id) \
        .execute()

    if not booking.data:
        raise HTTPException(status_code=403, detail="Not your booking")

    supabase.table("bookings") \
        .update({"status": "cancelled"}) \
        .eq("id", booking_id) \
        .execute()

    return {"message": "Booking cancelled"}


# dont need that also we need something that actually completes the ride and turns
    

# GET MY BOOKINGS
@router.get("/me")
def get_my_bookings(current_user: dict = Depends(get_current_user)):
    profile_id = get_profile_id(current_user["sub"])

    bookings = supabase.table("bookings") \
        .select("*") \
        .eq("passenger_id", profile_id) \
        .execute()

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
