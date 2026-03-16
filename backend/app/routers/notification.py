import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from app.contracts import MessageResponse, NotificationResponse, UnreadCountResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def get_profile_id(auth_user_id: str) -> str:
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]


def _list_notifications(profile_id: str, limit: int = 50) -> list[dict]:
    res = supabase.table("notifications") \
        .select("*") \
        .eq("user_id", profile_id) \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()
    return res.data or []


def _serialize_notification(notification: dict) -> dict:
    return {
        "id": notification["id"],
        "user_id": notification["user_id"],
        "type": notification["type"],
        "title": notification["title"],
        "body": notification.get("body", ""),
        "created_at": notification["created_at"],
        "read": notification.get("read", False),
        "link": notification.get("link"),
    }


async def _poll_notifications(
    websocket: WebSocket,
    profile_id: str,
    delivered_ids: set[str],
):
    while True:
        notifications = list(reversed(_list_notifications(profile_id, limit=200)))
        for notification in notifications:
            if notification["id"] in delivered_ids:
                continue

            await websocket.send_text(json.dumps(_serialize_notification(notification)))
            delivered_ids.add(notification["id"])

        await asyncio.sleep(1)


@router.get("/", response_model=list[NotificationResponse])
def get_notifications(current_user: dict = Depends(get_current_user)):
    """Return all notifications for the current user, newest first."""
    profile_id = get_profile_id(current_user["sub"])
    return [_serialize_notification(notification) for notification in _list_notifications(profile_id)]


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Return the count of unread notifications."""
    profile_id = get_profile_id(current_user["sub"])

    res = supabase.table("notifications") \
        .select("id", count="exact") \
        .eq("user_id", profile_id) \
        .eq("read", False) \
        .execute()

    return {"unread_count": res.count or 0}


@router.put("/read-all", response_model=MessageResponse)
def mark_all_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read."""
    profile_id = get_profile_id(current_user["sub"])

    supabase.table("notifications") \
        .update({"read": True}) \
        .eq("user_id", profile_id) \
        .eq("read", False) \
        .execute()

    return {"message": "All notifications marked as read"}


@router.put("/{notification_id}/read", response_model=MessageResponse)
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


@router.put("/read-by-link", response_model=MessageResponse)
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


@router.websocket("/ws")
async def notifications_websocket(
    websocket: WebSocket,
    token: str = Query(...),
):
    try:
        user = supabase.auth.get_user(token)
        if not user.user:
            await websocket.close(code=4001, reason="Unauthorized")
            return
        auth_user_id = user.user.id
    except Exception:
        await websocket.close(code=4001, reason="Invalid token")
        return

    try:
        profile_id = get_profile_id(auth_user_id)
    except HTTPException as exc:
        await websocket.close(code=4001, reason=exc.detail)
        return

    await websocket.accept()
    delivered_ids = {notification["id"] for notification in _list_notifications(profile_id, limit=200)}
    poll_task = asyncio.create_task(_poll_notifications(websocket, profile_id, delivered_ids))

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        poll_task.cancel()
        try:
            await poll_task
        except asyncio.CancelledError:
            pass
