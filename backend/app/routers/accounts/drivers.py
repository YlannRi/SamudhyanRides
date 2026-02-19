from fastapi import APIRouter, Depends, HTTPException
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/drivers", tags=["Drivers"])

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]


@router.post("/upgrade")
def register_as_driver(
    licence_number: str,
    vehicle_registration: str,
    current_user: dict = Depends(get_current_user)
):
    user_id = get_profile_id(current_user["sub"])
    existing = supabase.table("driver_verification").select("*").eq("driver_id", user_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Driver verification request already exists")
    
# so we actually need some backend thing to actually go through and verify the driver then we can 
# insert the data into the database

# just pretend 

    response = supabase.table("driver_verification").insert({
        "driver_id": user_id,
        "licence_number": licence_number,
        "vehicle_registration": vehicle_registration,
        "verified": False
    }).execute()
    return {"message": "Driver verification request submitted", "driver_verification_id": response.data[0]["id"]}


@router.get("/")
def get_all_drivers(current_user: dict = Depends(get_current_user)):
    verified = supabase.table("driver_verification").select("driver_id").eq("verified", True).execute()
    driver_ids = [d["driver_id"] for d in verified.data]
    if not driver_ids:
        raise HTTPException(status_code=404, detail="No Drivers in the Database")
    profiles = supabase.table("user_profiles").select("id, first_name, last_name, university_username," \
    "driver_rating").in_("id", driver_ids).execute()
    return profiles.data


@router.get("/verification-requests")
def get_verification_requests(current_user: dict = Depends(get_current_user)):
    response = supabase.table("driver_verification").select("*").eq("verified", False).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No Verification Requests")
    return response.data


@router.get("/{driver_id}")
def get_driver(driver_id: str, current_user: dict = Depends(get_current_user)):
    verified = supabase.table("driver_verification").select("driver_id").eq("verified", True).eq("driver_id", driver_id).execute()
    if not verified.data:
        raise HTTPException(status_code=404, detail="Driver not verified")

    profile = supabase.table("user_profiles").select(
        "id, first_name, last_name, university_username, driver_rating"
    ).eq("auth_user_id", driver_id).execute()

    if not profile.data:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return profile.data[0]


# the endpoint below is just to update a False driver verification to a true verification
@router.post("/verify/{driver_verification_id}")
def verify_driver(driver_verification_id: str, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("driver_verification").select("*").eq("driver_id", driver_verification_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Verification request not found")
    driver_id = existing.data[0]["driver_id"]
    supabase.table("driver_verification").update({"verified": True}).eq("driver_id", driver_verification_id).execute()
    return {"message": "Driver verified successfully"}
