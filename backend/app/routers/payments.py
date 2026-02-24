from fastapi import APIRouter, HTTPException, Depends
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]

# Create payment intent
@router.post("/create")
def create_payment(
    booking_id: str,
    amount: float,
    current_user: dict = Depends(get_current_user)
):
    passenger_id = get_profile_id(current_user["sub"])

    booking = supabase.table("bookings").select("*").eq("id", booking_id).execute()
    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking = booking.data[0]

    ride = supabase.table("rides").select("*").eq("id", booking["ride_id"]).execute()
    ride = ride.data[0]

    # Insert payment record
    payment = supabase.table("payments").insert({
        "booking_id": booking_id,
        "passenger_id": passenger_id,
        "driver_id": ride["driver_id"],
        "amount": amount,
        "status": "pending"
    }).execute()

    return {"message": "Payment intent created", "payment": payment.data[0]}

# Confirm payment (Webhook)
@router.post("/webhook")
def confirm_payment(
    payment_provider_id: str,
    status: str,  # 'succeeded', 'failed'
):
    # Update the payment
    payment = supabase.table("payments").update({
        "status": status,
        "payment_provider_id": payment_provider_id
    }).eq("payment_provider_id", payment_provider_id).execute()

    if not payment.data:
        raise HTTPException(status_code=404, detail="Payment not found")

    return {"message": "Payment updated", "payment": payment.data[0]}

# Get receipt
@router.get("/{booking_id}/receipt")
def get_receipt(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    passenger_id = get_profile_id(current_user["sub"])

    payment = supabase.table("payments").select("*") \
        .eq("booking_id", booking_id) \
        .eq("passenger_id", passenger_id).execute()

    if not payment.data:
        raise HTTPException(status_code=404, detail="Payment not found")

    return payment.data[0]
