from fastapi import APIRouter, HTTPException, Depends
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles").select("id").eq("auth_user_id", auth_user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]

# Report incident
@router.post("/")
def report_incident(
    ride_id: str,
    description: str,
    current_user: dict = Depends(get_current_user)
):
    reporter_id = get_profile_id(current_user["sub"])

    incident = supabase.table("incident_reports").insert({
        "ride_id": ride_id,
        "reporter_id": reporter_id,
        "description": description,
        "status": "open"
    }).execute()

    return {"message": "Incident reported", "incident": incident.data[0]}

# Get my reported incidents
@router.get("/me")
def get_my_incidents(current_user: dict = Depends(get_current_user)):
    reporter_id = get_profile_id(current_user["sub"])
    incidents = supabase.table("incident_reports").select("*").eq("reporter_id", reporter_id).execute()
    return incidents.data
