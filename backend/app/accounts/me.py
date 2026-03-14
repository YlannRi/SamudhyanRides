from fastapi import APIRouter, Depends, HTTPException, status

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from app.accounts.validation import UserProfileCreate, UserProfileOut, UserProfileUpdate

router = APIRouter(prefix="/me", tags=["user"])


@router.get("/profile", response_model=UserProfileOut)
def get_my_profile(current_user=Depends(get_current_user)):
    auth_user_id = current_user["sub"]

    result = (
        supabase.table("user_profiles")
        .select("*")
        .eq("auth_user_id", auth_user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data


@router.post("/profile", response_model=UserProfileOut, status_code=status.HTTP_201_CREATED)
def create_my_profile(
    profile: UserProfileCreate,
    current_user=Depends(get_current_user),
):
    auth_user_id = current_user["sub"]
    email = current_user["email"]

    insert_data = {
        "auth_user_id": auth_user_id,
        "email": email,
        **profile.model_dump(exclude_unset=True),
    }

    result = supabase.table("user_profiles").insert(insert_data).execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Could not create profile")

    return result.data[0]


@router.patch("/profile", response_model=UserProfileOut)
def update_my_profile(
    updates: UserProfileUpdate,
    current_user=Depends(get_current_user),
):
    auth_user_id = current_user["sub"]

    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("user_profiles")
        .update(update_data)
        .eq("auth_user_id", auth_user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data[0]


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_my_profile(current_user=Depends(get_current_user)):
    auth_user_id = current_user["sub"]

    result = (
        supabase.table("user_profiles")
        .update({"is_active": False})
        .eq("auth_user_id", auth_user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return
