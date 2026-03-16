from unittest.mock import MagicMock, patch, call

from app.notification import service


def test_create_notification_inserts_notification_record():
    with patch("app.notification.service.supabase") as mock_sb:
        notifications = MagicMock()
        mock_sb.table.return_value = notifications

        service.create_notification("user-1", "Title", "Body", link="/activity", notif_type="chat")

    notifications.insert.assert_called_once_with({
        "user_id": "user-1",
        "type": "chat",
        "title": "Title",
        "body": "Body",
        "link": "/activity",
    })


def test_get_profile_name_returns_someone_when_profile_missing_or_blank():
    with patch("app.notification.service.supabase") as mock_sb:
        profiles = MagicMock()
        profiles.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = []
        mock_sb.table.return_value = profiles
        assert service.get_profile_name("missing") == "Someone"

        profiles.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = [{
            "first_name": " ",
            "last_name": "",
        }]
        assert service.get_profile_name("blank-name") == "Someone"


def test_booking_notification_helpers_delegate_to_create_notification():
    with patch("app.notification.service.create_notification") as mock_create:
        service.notify_driver_of_booking_request("driver-1", "Pat Passenger", "Campus", "ride-1")
        service.notify_passenger_of_booking_acceptance("passenger-1", "Campus", "ride-1")
        service.notify_driver_of_booking_cancellation("driver-1", "Pat Passenger", "Campus", "ride-1")
        service.notify_passenger_of_booking_cancellation("passenger-1", "Campus", "ride-1")

    assert mock_create.call_args_list == [
        call(
            user_id="driver-1",
            notif_type="booking",
            title="New ride request",
            body="Pat Passenger requested a seat for your ride to Campus.",
            link="/activity?mode=driver",
        ),
        call(
            user_id="passenger-1",
            notif_type="booking",
            title="Ride request accepted",
            body="Your ride request to Campus was accepted.",
            link="/activity?mode=user",
        ),
        call(
            user_id="driver-1",
            notif_type="booking",
            title="Ride request cancelled",
            body="Pat Passenger cancelled their seat request for your ride to Campus.",
            link="/activity?mode=driver",
        ),
        call(
            user_id="passenger-1",
            notif_type="booking",
            title="Ride booking cancelled",
            body="Your booking for the ride to Campus was cancelled.",
            link="/activity?mode=user",
        ),
    ]


def test_ride_notification_helpers_notify_driver_and_each_passenger():
    with patch("app.notification.service.create_notification") as mock_create:
        service.notify_ride_started("driver-1", ["passenger-1", "passenger-2"], "Campus", "ride-1")
        service.notify_passengers_of_ride_cancellation(["passenger-1", "passenger-2"], "Campus", "ride-1")

    assert mock_create.call_args_list == [
        call(
            user_id="driver-1",
            notif_type="ride",
            title="Ride started",
            body="Your ride to Campus is now in progress.",
            link="/journey?mode=driver",
        ),
        call(
            user_id="passenger-1",
            notif_type="ride",
            title="Ride started",
            body="Your ride to Campus has begun.",
            link="/journey?mode=user",
        ),
        call(
            user_id="passenger-2",
            notif_type="ride",
            title="Ride started",
            body="Your ride to Campus has begun.",
            link="/journey?mode=user",
        ),
        call(
            user_id="passenger-1",
            notif_type="ride",
            title="Ride cancelled",
            body="Your ride to Campus was cancelled by the driver.",
            link="/activity?mode=user",
        ),
        call(
            user_id="passenger-2",
            notif_type="ride",
            title="Ride cancelled",
            body="Your ride to Campus was cancelled by the driver.",
            link="/activity?mode=user",
        ),
    ]
