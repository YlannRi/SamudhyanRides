from fastapi import APIRouter, HTTPException, Depends
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/ratings", tags=["Ratings"])


def get_profile_id(auth_user_id: str):
    response = supabase.table("user_profiles").select("id").eq("auth_user_id", auth_user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]


@router.post("/")
def leave_rating(
    ride_id: str,
    reviewed_user_id: str,
    rating: float,
    comment: str | None = None,
    current_user: dict = Depends(get_current_user)
):
    # Validate rating range
    if not (1.0 <= rating <= 5.0):
        raise HTTPException(status_code=422, detail="Rating must be between 1 and 5")

    reviewer_id = get_profile_id(current_user["sub"])

    # Prevent self-rating
    if reviewer_id == reviewed_user_id:
        raise HTTPException(status_code=400, detail="You cannot rate yourself")

    # Check for duplicate rating (same reviewer + ride + reviewed user)
    existing = supabase.table("ratings") \
        .select("id") \
        .eq("reviewer_id", reviewer_id) \
        .eq("ride_id", ride_id) \
        .eq("reviewed_user_id", reviewed_user_id) \
        .execute()

    if existing.data:
        raise HTTPException(status_code=409, detail="You have already rated this person for this ride")

    # Insert the rating
    supabase.table("ratings").insert({
        "ride_id": ride_id,
        "reviewer_id": reviewer_id,
        "reviewed_user_id": reviewed_user_id,
        "rating": rating,
        "comment": comment
    }).execute()

    # Fetch the ride to determine if reviewed_user is the driver
    ride_res = supabase.table("rides").select("driver_id").eq("id", ride_id).execute()
    if not ride_res.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    is_driver_rating = ride_res.data[0]["driver_id"] == reviewed_user_id

    # Fetch the reviewed user's current profile rating
    profile_res = supabase.table("user_profiles") \
        .select("driver_rating, rider_rating") \
        .eq("id", reviewed_user_id) \
        .execute()

    if not profile_res.data:
        raise HTTPException(status_code=404, detail="Reviewed user profile not found")

    profile = profile_res.data[0]

    # Determine which rating field to update
    rating_field = "driver_rating" if is_driver_rating else "rider_rating"
    current_avg = float(profile.get(rating_field) or 0)

    # Count how many ratings this user has already received (excluding the one just inserted)
    count_res = supabase.table("ratings") \
        .select("id") \
        .eq("reviewed_user_id", reviewed_user_id) \
        .execute()

    # count_res includes the newly inserted rating, so total_count is already accurate
    total_count = len(count_res.data) if count_res.data else 1

    # Compute new average:
    # If current_avg is 0, the new rating is the first → use it directly
    # Otherwise, we back-calculate: old_sum = current_avg * (total_count - 1), then add new rating
    if current_avg == 0.0 or total_count <= 1:
        new_avg = round(rating, 1)
    else:
        old_sum = current_avg * (total_count - 1)
        new_avg = round((old_sum + rating) / total_count, 1)

    # Update the user's average rating
    supabase.table("user_profiles") \
        .update({rating_field: new_avg}) \
        .eq("id", reviewed_user_id) \
        .execute()

    return {
        "message": "Rating submitted",
        "new_average_rating": new_avg,
        "rating_field": rating_field
    }


@router.get("/{user_id}")
def get_ratings(user_id: str, current_user: dict = Depends(get_current_user)):
    ratings = supabase.table("ratings").select("*").eq("reviewed_user_id", user_id).execute()
    return ratings.data
