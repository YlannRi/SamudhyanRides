from collections import defaultdict
import json

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel

from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/rides", tags=["Chat"])


# ── helpers ────────────────────────────────────────────────────

def get_profile_id(auth_user_id: str) -> str:
    response = supabase.table("user_profiles") \
        .select("id") \
        .eq("auth_user_id", auth_user_id) \
        .execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User profile not found")
    return response.data[0]["id"]


def _get_ride_participant_ids(ride_id: str) -> tuple[str, list[str]]:
    """Return (driver_id, [passenger_ids]) for a ride."""
    ride = supabase.table("rides").select("driver_id").eq("id", ride_id).execute()
    if not ride.data:
        raise HTTPException(status_code=404, detail="Ride not found")
    driver_id = ride.data[0]["driver_id"]

    bookings = supabase.table("bookings") \
        .select("passenger_id") \
        .eq("ride_id", ride_id) \
        .in_("status", ["confirmed", "pending"]) \
        .execute()
    passenger_ids = list({b["passenger_id"] for b in (bookings.data or [])})
    return driver_id, passenger_ids


def _assert_participant(profile_id: str, ride_id: str):
    """Raise 403 if user is not the driver or a booked passenger."""
    driver_id, passenger_ids = _get_ride_participant_ids(ride_id)
    if profile_id != driver_id and profile_id not in passenger_ids:
        raise HTTPException(status_code=403, detail="You are not a participant of this ride")


def _resolve_chat_participants(profile_id: str, ride_id: str, participant_id: str | None = None) -> tuple[str, str]:
    """Return (driver_id, passenger_id) for a one-to-one ride chat."""
    driver_id, passenger_ids = _get_ride_participant_ids(ride_id)

    if profile_id == driver_id:
        if participant_id:
            if participant_id not in passenger_ids:
                raise HTTPException(status_code=404, detail="Passenger chat not found for this ride")
            return driver_id, participant_id
        if len(passenger_ids) == 1:
            return driver_id, passenger_ids[0]
        if not passenger_ids:
            raise HTTPException(status_code=400, detail="No passengers are available to chat for this ride")
        raise HTTPException(status_code=400, detail="participant_id is required for driver chats with multiple riders")

    if profile_id in passenger_ids:
        if participant_id and participant_id != profile_id:
            raise HTTPException(status_code=403, detail="Passengers can only access their own ride chat")
        return driver_id, profile_id

    raise HTTPException(status_code=403, detail="You are not a participant of this ride")


def _get_or_create_chat(ride_id: str, passenger_id: str) -> str:
    """Return the chat id for a driver and passenger within a ride."""
    existing = supabase.table("ride_chats").select("id").eq("ride_id", ride_id).eq("passenger_id", passenger_id).execute()
    if existing.data:
        return existing.data[0]["id"]
    new_chat = supabase.table("ride_chats").insert({"ride_id": ride_id, "passenger_id": passenger_id}).execute()
    return new_chat.data[0]["id"]


def _build_chat_link(ride_id: str, passenger_id: str, for_driver: bool = False) -> str:
    if for_driver:
        return f"/chat/{ride_id}?participant={passenger_id}"
    return f"/chat/{ride_id}"


def _create_notification(user_id: str, title: str, body: str, link: str, notif_type: str = "chat"):
    supabase.table("notifications").insert({
        "user_id": user_id,
        "type": notif_type,
        "title": title,
        "body": body,
        "link": link,
    }).execute()


def _get_sender_name(profile_id: str) -> str:
    res = supabase.table("user_profiles").select("first_name, last_name").eq("id", profile_id).execute()
    if res.data:
        return f"{res.data[0]['first_name']} {res.data[0]['last_name']}"
    return "Someone"


# ── REST endpoints ─────────────────────────────────────────────

class MessageCreate(BaseModel):
    message: str


@router.get("/{ride_id}/chat")
def get_chat_history(
    ride_id: str,
    participant_id: str | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
):
    profile_id = get_profile_id(current_user["sub"])
    _, passenger_id = _resolve_chat_participants(profile_id, ride_id, participant_id)

    chat = supabase.table("ride_chats").select("id").eq("ride_id", ride_id).eq("passenger_id", passenger_id).execute()
    if not chat.data:
        return []

    chat_id = chat.data[0]["id"]
    messages = supabase.table("ride_messages") \
        .select("*") \
        .eq("chat_id", chat_id) \
        .order("created_at") \
        .execute()

    # Fetch sender names in bulk
    sender_ids = list({m["sender_id"] for m in (messages.data or [])})
    names_map: dict[str, str] = {}
    if sender_ids:
        profiles = supabase.table("user_profiles") \
            .select("id, first_name, last_name") \
            .in_("id", sender_ids) \
            .execute()
        names_map = {p["id"]: f"{p['first_name']} {p['last_name']}" for p in profiles.data}

    result = []
    for m in (messages.data or []):
        result.append({
            **m,
            "sender_name": names_map.get(m["sender_id"], "Unknown"),
        })

    return result


@router.post("/{ride_id}/chat/message")
def post_message(
    ride_id: str,
    body: MessageCreate,
    participant_id: str | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
):
    profile_id = get_profile_id(current_user["sub"])
    driver_id, passenger_id = _resolve_chat_participants(profile_id, ride_id, participant_id)

    chat_id = _get_or_create_chat(ride_id, passenger_id)

    new_msg = supabase.table("ride_messages").insert({
        "chat_id": chat_id,
        "sender_id": profile_id,
        "message": body.message,
    }).execute()

    msg_data = new_msg.data[0]

    # Create notifications for other participants
    sender_name = _get_sender_name(profile_id)
    all_participants = {driver_id, passenger_id}
    all_participants.discard(profile_id)

    for pid in all_participants:
        _create_notification(
            user_id=pid,
            title=f"New message from {sender_name}",
            body=body.message[:100],
            link=_build_chat_link(ride_id, passenger_id, for_driver=pid == driver_id),
        )

    return {**msg_data, "sender_name": sender_name}


# ── WebSocket ──────────────────────────────────────────────────

# Active connections keyed by ride_id + passenger_id
_connections: dict[str, list[tuple[str, WebSocket]]] = defaultdict(list)


@router.websocket("/ws/rides/{ride_id}")
async def chat_websocket(
    websocket: WebSocket,
    ride_id: str,
    token: str = Query(...),
    participant_id: str | None = Query(default=None),
):
    # Authenticate via token query param
    try:
        user = supabase.auth.get_user(token)
        if not user.user:
            await websocket.close(code=4001, reason="Unauthorized")
            return
        auth_user_id = user.user.id
    except Exception:
        await websocket.close(code=4001, reason="Invalid token")
        return

    # Resolve profile
    profile_res = supabase.table("user_profiles").select("id").eq("auth_user_id", auth_user_id).execute()
    if not profile_res.data:
        await websocket.close(code=4001, reason="Profile not found")
        return
    profile_id = profile_res.data[0]["id"]

    try:
        driver_id, passenger_id = _resolve_chat_participants(profile_id, ride_id, participant_id)
    except HTTPException as exc:
        await websocket.close(code=4003, reason=exc.detail)
        return

    connection_key = f"{ride_id}:{passenger_id}"
    await websocket.accept()
    _connections[connection_key].append((profile_id, websocket))

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            message_text = payload.get("message", "")
            if not message_text:
                continue

            chat_id = _get_or_create_chat(ride_id, passenger_id)

            new_msg = supabase.table("ride_messages").insert({
                "chat_id": chat_id,
                "sender_id": profile_id,
                "message": message_text,
            }).execute()

            msg_data = new_msg.data[0]
            sender_name = _get_sender_name(profile_id)

            broadcast = json.dumps({
                "id": msg_data["id"],
                "chat_id": chat_id,
                "sender_id": profile_id,
                "sender_name": sender_name,
                "message": message_text,
                "created_at": msg_data["created_at"],
                "read": False,
            })

            # Broadcast to the driver/passenger pair for this ride chat
            for pid, ws in _connections[connection_key]:
                try:
                    await ws.send_text(broadcast)
                except Exception:
                    pass

            # Create notifications for offline participants
            all_participants = {driver_id, passenger_id}
            all_participants.discard(profile_id)
            connected_ids = {pid for pid, _ in _connections[connection_key]}

            for pid in all_participants:
                if pid not in connected_ids:
                    _create_notification(
                        user_id=pid,
                        title=f"New message from {sender_name}",
                        body=message_text[:100],
                        link=_build_chat_link(ride_id, passenger_id, for_driver=pid == driver_id),
                    )

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        _connections[connection_key] = [(pid, ws) for pid, ws in _connections[connection_key] if ws != websocket]
        if not _connections[connection_key]:
            del _connections[connection_key]
