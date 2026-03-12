from fastapi import APIRouter, Depends, HTTPException

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def get_profile_id(auth_user_id: str) -> str:
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]


@router.get("/")
def get_notifications(current_user: dict = Depends(get_current_user)):
    """Return all notifications for the current user, newest first."""
    profile_id = get_profile_id(current_user["sub"])

    res = supabase.table("notifications") \
        .select("*") \
        .eq("user_id", profile_id) \
        .order("created_at", desc=True) \
        .limit(50) \
        .execute()

    return res.data or []


@router.get("/unread-count")
def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Return the count of unread notifications."""
    profile_id = get_profile_id(current_user["sub"])

    res = supabase.table("notifications") \
        .select("id", count="exact") \
        .eq("user_id", profile_id) \
        .eq("read", False) \
        .execute()

    return {"unread_count": res.count or 0}


@router.put("/read-all")
def mark_all_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read."""
    profile_id = get_profile_id(current_user["sub"])

    supabase.table("notifications") \
        .update({"read": True}) \
        .eq("user_id", profile_id) \
        .eq("read", False) \
        .execute()

    return {"message": "All notifications marked as read"}


@router.put("/{notification_id}/read")
def mark_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    """Mark a single notification as read."""
    profile_id = get_profile_id(current_user["sub"])

    existing = supabase.table("notifications") \
        .select("id") \
        .eq("id", notification_id) \
        .eq("user_id", profile_id) \
        .execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Notification not found")

    supabase.table("notifications") \
        .update({"read": True}) \
        .eq("id", notification_id) \
        .execute()

    return {"message": "Notification marked as read"}


@router.put("/read-by-link")
def mark_read_by_link(link: str, current_user: dict = Depends(get_current_user)):
    """Mark all notifications with a specific link as read (e.g. when opening a chat)."""
    profile_id = get_profile_id(current_user["sub"])

    supabase.table("notifications") \
        .update({"read": True}) \
        .eq("user_id", profile_id) \
        .eq("link", link) \
        .eq("read", False) \
        .execute()

    return {"message": "Notifications marked as read"}
