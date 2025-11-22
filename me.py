# routers/me.py

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import create_client, Client  # pip install supabase
from pydantic import EmailStr

from validation import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileOut,
)

SUPABASE_URL = ""
SUPABASE_ANON_KEY = ""

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

router = APIRouter(prefix="/me", tags=["user"])


def get_current_user():
    """
    Dependency that validates the Supabase JWT and returns claims.

    Example output:
    {
        "sub": "<auth_user_id>",
        "email": "user@example.com",
        ...
    }

    """
    raise NotImplementedError


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

    if result.error:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data


@router.post(
    "/profile",
    response_model=UserProfileOut,
    status_code=status.HTTP_201_CREATED,
)
def create_my_profile(
    profile: UserProfileCreate,
    current_user=Depends(get_current_user),
):
    auth_user_id = current_user["sub"]
    email: EmailStr = current_user["email"]

    # IMPORTANT: auth_user_id + email come from token, not from client body
    insert_data = {
        "auth_user_id": auth_user_id,
        "email": email,
        **profile.dict(exclude_unset=True),
    }

    result = supabase.table("user_profiles").insert(insert_data).execute()

    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)

    return result.data[0]


@router.patch("/profile", response_model=UserProfileOut)
def update_my_profile(
    updates: UserProfileUpdate,
    current_user=Depends(get_current_user),
):
    auth_user_id = current_user["sub"]

    update_data = updates.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("user_profiles")
        .update(update_data)
        .eq("auth_user_id", auth_user_id)
        .execute()
    )

    if result.error or not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data[0]


@router.delete(
    "/profile",
    status_code=status.HTTP_204_NO_CONTENT,
)
def deactivate_my_profile(current_user=Depends(get_current_user)):
    """
    Soft delete: mark is_active = false but keep record
    (supports storage-limitation policy with periodic purges).
    """
    auth_user_id = current_user["sub"]

    result = (
        supabase.table("user_profiles")
        .update({"is_active": False})
        .eq("auth_user_id", auth_user_id)
        .execute()
    )

    if result.error or not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return
