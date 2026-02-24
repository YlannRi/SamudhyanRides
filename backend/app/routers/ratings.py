from fastapi import APIRouter, HTTPException, Depends
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/ratings", tags=["Ratings"])

def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles").select("id").eq("auth_user_id", auth_user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]

# Leave rating
@router.post("/")
def leave_rating(
    ride_id: str,
    reviewed_user_id: str,
    rating: float,
    comment: str | None = None,
    current_user: dict = Depends(get_current_user)
):
    reviewer_id = get_profile_id(current_user["sub"])

    # Insert rating
    r = supabase.table("ratings").insert({
        "ride_id": ride_id,
        "reviewer_id": reviewer_id,
        "reviewed_user_id": reviewed_user_id,
        "rating": rating,
        "comment": comment
    }).execute()

    return {"message": "Rating submitted", "rating": r.data[0]}

# Get ratings for user
@router.get("/{user_id}")
def get_ratings(user_id: str):
    ratings = supabase.table("ratings").select("*").eq("reviewed_user_id", user_id).execute()
    return ratings.data
