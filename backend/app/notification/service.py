from app.accounts.database import supabase


def create_notification(
    user_id: str,
    title: str,
    body: str,
    link: str | None = None,
    notif_type: str = "ride",
):
    supabase.table("notifications").insert({
        "user_id": user_id,
        "type": notif_type,
        "title": title,
        "body": body,
        "link": link,
    }).execute()


def get_profile_name(profile_id: str) -> str:
    res = supabase.table("user_profiles") \
        .select("first_name, last_name") \
        .eq("id", profile_id) \
        .limit(1) \
        .execute()

    if not res.data:
        return "Someone"

    first_name = (res.data[0].get("first_name") or "").strip()
    last_name = (res.data[0].get("last_name") or "").strip()
    full_name = f"{first_name} {last_name}".strip()
    return full_name or "Someone"


def notify_driver_of_booking_request(driver_id: str, passenger_name: str, destination: str, ride_id: str):
    create_notification(
        user_id=driver_id,
        notif_type="booking",
        title="New ride request",
        body=f"{passenger_name} requested a seat for your ride to {destination}.",
        link="/activity?mode=driver",
    )


def notify_passenger_of_booking_acceptance(passenger_id: str, destination: str, ride_id: str):
    create_notification(
        user_id=passenger_id,
        notif_type="booking",
        title="Ride request accepted",
        body=f"Your ride request to {destination} was accepted.",
        link="/activity?mode=user",
    )


def notify_driver_of_booking_cancellation(driver_id: str, passenger_name: str, destination: str, ride_id: str):
    create_notification(
        user_id=driver_id,
        notif_type="booking",
        title="Ride request cancelled",
        body=f"{passenger_name} cancelled their seat request for your ride to {destination}.",
        link="/activity?mode=driver",
    )


def notify_passenger_of_booking_cancellation(passenger_id: str, destination: str, ride_id: str):
    create_notification(
        user_id=passenger_id,
        notif_type="booking",
        title="Ride booking cancelled",
        body=f"Your booking for the ride to {destination} was cancelled.",
        link="/activity?mode=user",
    )


def notify_ride_started(driver_id: str, passenger_ids: list[str], destination: str, ride_id: str):
    create_notification(
        user_id=driver_id,
        notif_type="ride",
        title="Ride started",
        body=f"Your ride to {destination} is now in progress.",
        link="/journey?mode=driver",
    )

    for passenger_id in passenger_ids:
        create_notification(
            user_id=passenger_id,
            notif_type="ride",
            title="Ride started",
            body=f"Your ride to {destination} has begun.",
            link="/journey?mode=user",
        )


def notify_passengers_of_ride_cancellation(passenger_ids: list[str], destination: str, ride_id: str):
    for passenger_id in passenger_ids:
        create_notification(
            user_id=passenger_id,
            notif_type="ride",
            title="Ride cancelled",
            body=f"Your ride to {destination} was cancelled by the driver.",
            link="/activity?mode=user",
        )