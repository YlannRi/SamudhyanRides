from fastapi import APIRouter, Depends, HTTPException
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user, require_admin_user
from app.accounts.validation import UserPreferencesUpdate

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    # current_user["sub"] is their Supabase user ID
    auth_user_id = current_user["sub"]

    response = supabase.table("user_profiles").select("*").eq("auth_user_id", auth_user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data


@router.post("/me")
def create_my_profile(
    first_name: str,
    last_name: str,
    university_username: str,
    gender: str | None = None,  # optional
    phone_number: str | None = None,
    current_user: dict = Depends(get_current_user),
    ):
    auth_user_id = current_user["sub"]

    insert_data = {
        "first_name": first_name,
        "last_name": last_name,
        "university_username": university_username,
        "gender": gender  # will insert NULL if not provided
    }

    result = supabase.table("user_profiles").update(insert_data).eq("auth_user_id", auth_user_id).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Could not update your profile")

    return result.data[0]


@router.put("/me")
def update_my_profile(
    first_name: str | None = None,
    last_name: str | None = None,
    university_username: str | None = None,
    gender: str | None = None,
    phone_number: str | None = None,
    current_user: dict = Depends(get_current_user),
):
    auth_user_id = current_user["sub"]
    update_data = {}

    if first_name:
        update_data["first_name"] = first_name
    if last_name:
        update_data["last_name"] = last_name
    if university_username:
        update_data["university_username"] = university_username
    if gender:
        update_data["gender"] = gender
    if phone_number:
        update_data["phone_number"] = phone_number

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = supabase.table("user_profiles").update(update_data).eq("auth_user_id", auth_user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data[0]


@router.put("/me/preferences")
def update_my_preferences(
    payload: UserPreferencesUpdate,
    current_user: dict = Depends(get_current_user),
):
    auth_user_id = current_user["sub"]
    update_data = payload.model_dump(exclude_unset=True)

    if "calendar_link" in update_data:
        calendar_link = update_data["calendar_link"]
        update_data["calendar_link"] = calendar_link.strip() if isinstance(calendar_link, str) else None
        if update_data["calendar_link"] == "":
            update_data["calendar_link"] = None

    if not update_data:
        raise HTTPException(status_code=400, detail="No preferences to update")

    result = supabase.table("user_profiles").update(update_data).eq("auth_user_id", auth_user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data[0]


@router.delete("/me")
def deactivate_my_profile(current_user: dict = Depends(get_current_user)):
    auth_user_id = current_user["sub"]
    result = supabase.table("user_profiles").update({"is_active": False}).eq("auth_user_id", auth_user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Profile deactivated"}


@router.get("/{user_id}")
def get_public_user_profile(user_id: str, current_user: dict = Depends(get_current_user)):
    # Anyone can view this profile (e.g., drivers can see passenger info)
    result = supabase.table("user_profiles").select(
        "first_name, last_name, university_username, driver_rating, rider_rating"
    ).eq("auth_user_id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    return result.data[0]


@router.get("/")
def get_all_users(current_user: dict = Depends(require_admin_user)):
    response = supabase.table("user_profiles").select(
        "id, first_name, last_name, university_username, driver_rating, rider_rating"
    ).execute()
    return response.data

 # havent actually tested update, deactivate or get public user profile
