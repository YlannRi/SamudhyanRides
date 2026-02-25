from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
import re
from pydantic import BaseModel
from postgrest.exceptions import APIError
from app.routers.bookings import get_profile_id

router = APIRouter(prefix="/drivers", tags=["Drivers"])
"based on https://www.whatdotheyknow.com/request/what_check_digit_algorithm_is_us/response/681793/attach/html/2/FOIR4709%20Mr%20R%20Nealon.pdf.html"

VEHICLE_DATABASE = {
    "AB12CDE": {"make": "Toyota", "model": "Prius", "colour": "Blue", "seats": 5},
    "BF59DZR": {"make": "Ford", "model": "Focus", "colour": "Red", "seats": 5},
    "GF54LFK": {"make": "Volkswagen", "model": "Golf", "colour": "Silver", "seats": 5},
    "LA55JVL": {"make": "Vauxhall", "model": "Corsa", "colour": "Black", "seats": 4},
    "ML09WKY": {"make": "BMW", "model": "3 Series", "colour": "White", "seats": 5},
    "TE57VRN": {"make": "Rover", "model": "75", "colour": "Blue", "seats": 5},
    "XY99ZZZ": {"make": "Mercedes", "model": "C-Class", "colour": "Grey", "seats": 5},
}

def validate_licence(licence_number):
    clean = re.sub(r'\s+', '', licence_number.strip().upper())

    if len(clean) != 16:
        raise ValueError("Must be 16 characters (spaces removed)")

    surname_section = clean[:5]
    if not re.match(r'^[A-Z0-9]{5}$', surname_section):
        raise ValueError("Surname section invalid (first 5 chars)")

    # SECTION 2: DOB (5-10)
    dob_section = clean[5:11]
    if not re.match(r'^[0-9]{6}$', dob_section):
        raise ValueError("Date section must be 6 digits (chars 6-11)")
    
    names_section = clean[11:]
    if not re.match(r'^[A-Z0-9]{5}$', names_section):
        raise ValueError("Names/check digits invalid (last 5 chars)")

    decade = dob_section[0]
    year_last = dob_section[-1]
    month = dob_section[1:3]
    day = dob_section[3:5]

    is_female = month.startswith(('5', '6'))
    if is_female:
        month = str(int(month) - 50)

    try:
        year = int(decade + year_last)
        birth_date = f"19{year}0{month.zfill(2)}{day.zfill(2)}"
        dob = datetime.strptime(birth_date[:8], "%Y%m%d")
        age = datetime.now().year - dob.year

        if age < 17:
            raise ValueError("Must be 17+ years old")

    except ValueError:
        raise ValueError("Invalid date of birth")

    # SECTION 3: Names + Check (11-15)
    names_section = clean[11:]
    if not re.match(r'^[A-HJ-NP-Z0-9]{5}$', names_section):
        raise ValueError("Names/check digits invalid (last 5 chars)")

    # Return both the cleaned licence and a small set of derived attributes.
    return clean, {"risk_score": 2 if age > 35 or age < 18 else 0}

def validate_vehicle_reg(vehicle_registration: str) -> str:
    clean = re.sub(r'\s+', '', vehicle_registration.upper())
    pattern = r'^[A-Z]{2}[0-9]{2}[A-Z]{3}$'
    if not re.match(pattern, clean):
        raise ValueError("Invalid UK plate (e.g. AB12 CDE)")
    return clean

class DriverVerificationRequest(BaseModel):
    licence_number: str
    vehicle_registration: str

@router.post("/lookup")
def lookup_vehicle(registration: str):
    vehicle = VEHICLE_DATABASE.get(registration)
    if not vehicle:
        raise HTTPException(
            status_code=400,
            detail=f"Vehicle {registration} not found. Try: AB12CDE, BF59DZR, GF54LFK"
        )
    return vehicle

def _is_missing_column_error(err: Exception) -> bool:
    # PostgREST missing-column errors show up as code PGRST204.
    try:
        payload = err.args[0] if err.args else None
        if isinstance(payload, dict) and payload.get("code") == "PGRST204":
            return True
        if isinstance(payload, str) and "PGRST204" in payload:
            return True
    except Exception:
        pass
    return "PGRST204" in str(err)


def safe_update(table: str, row_id: str, payload: dict) -> None:
    try:
        supabase.table(table).update(payload).eq("id", row_id).execute()
    except Exception as e:
        # Ignore schema mismatch (missing columns), raise everything else
        if _is_missing_column_error(e):
            return
        raise
@router.post("/upgrade")
def register_as_driver(
    request: DriverVerificationRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = get_profile_id(current_user["sub"])

    try:
        validated_licence, licence_data = validate_licence(request.licence_number)
        validated_reg = validate_vehicle_reg(request.vehicle_registration)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    vehicle_info = lookup_vehicle(validated_reg)

    risk_score = licence_data["risk_score"]
    auto_approved = risk_score <= 1 and vehicle_info["seats"] >= 3

    # If user already tried before, UPDATE instead of failing.
    existing = (
        supabase.table("driver_verification")
        .select("id")
        .eq("driver_id", user_id)
        .limit(1)
        .execute()
    )
    existing_id = existing.data[0]["id"] if existing.data else None

    # Insert minimal required fields ONLY (schema-safe)
    base_payload = {
        "driver_id": user_id,
        "licence_number": validated_licence,
        "vehicle_registration": validated_reg,
        "verified": auto_approved,
    }

    if existing_id:
        supabase.table("driver_verification").update(base_payload).eq("id", existing_id).execute()
        row_id = existing_id
    else:
        res = supabase.table("driver_verification").insert(base_payload).execute()
        row_id = res.data[0]["id"]

    # Best-effort: enrich optional vehicle fields (ignore missing columns)
    optional_payload = {
        "vehicle_make": vehicle_info["make"],
        "vehicle_model": vehicle_info["model"],
        "vehicle_color": vehicle_info["colour"],   # US spelling attempt
        "vehicle_seats": vehicle_info["seats"],
    }

    try:
        safe_update("driver_verification", row_id, {"vehicle_make": vehicle_info["make"]})
        safe_update("driver_verification", row_id, {"vehicle_model": vehicle_info["model"]})
        safe_update("driver_verification", row_id, {"vehicle_seats": vehicle_info["seats"]})
        # Try both spellings for color/colour (ignore if neither exists)
        safe_update("driver_verification", row_id, {"vehicle_color": vehicle_info["colour"]})
        safe_update("driver_verification", row_id, {"vehicle_colour": vehicle_info["colour"]})
    except APIError as e:
        err = e.args[0] if e.args else {}
        if not (isinstance(err, dict) and err.get("code") == "PGRST204"):
            raise

    status = "AUTO-APPROVED" if auto_approved else "Pending admin review"
    return {
        "message": f"Driver verification submitted. {status}",
        "driver_verification_id": row_id,
        "vehicle": vehicle_info
    }

@router.get("/me/status")
def get_my_driver_status(current_user: dict = Depends(get_current_user)):
    profile_id = get_profile_id(current_user["sub"])

    verification = (
        supabase.table("driver_verification")
        .select("id, verified, vehicle_registration")
        .eq("driver_id", profile_id)
        .limit(1)
        .execute()
    )

    record = verification.data[0] if verification.data else None

    # Treat "registered as driver" as having a verification row (verified or pending)
    is_driver = bool(record)

    return {"is_driver": is_driver, "verification": record}

@router.get("/")
def get_all_drivers(current_user: dict = Depends(get_current_user)):
    verified = supabase.table("driver_verification").select("driver_id").eq("verified", True).execute()
    driver_ids = [d["driver_id"] for d in verified.data]
    if not driver_ids:
        raise HTTPException(status_code=404, detail="No Drivers in the Database")
    profiles = supabase.table("user_profiles").select("id, first_name, last_name, university_username, driver_rating").in_("id", driver_ids).execute()
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

@router.post("/verify/{driver_verification_id}")
def verify_driver(driver_verification_id: str, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("driver_verification").select("*").eq("id", driver_verification_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Verification request not found")
    supabase.table("driver_verification").update({"verified": True}).eq("id", driver_verification_id).execute()
    return {"message": "Driver verified successfully"}