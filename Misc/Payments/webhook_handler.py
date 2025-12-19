from stripe_client import get_webhook_key, get_stripe
from models import PaymentStatus
from service import TRIPS


stripe = get_stripe()
WEBHOOKSECRET = get_webhook_key()

#Verifies and extracts payment details allowing for it to be processed
def webhook_handler(raw_body: bytes, signature_header: str):
    try:
        event = stripe.Webhook.construct_event(
            payload=raw_body, sig_header=signature_header, secret=WEBHOOKSECRET)
    except ValueError:
        return {"ok": False, "error": "invalid payload"}
    except stripe.error.SignatureVerificationError:
        return {"ok": False, "error": "invalid signature"}

    event_type = event["type"]
    data_object = event["data"]["object"]
    
 
    if "payment_intent" in event_type:
        handle_payment_event(event_type, data_object)
    
    return {"ok": True}

#handles if a payment is failed or paid, updating the "db" in accordance to event_message
def handle_payment_event(event_type: str, payment_intent: dict):
    trip_id = payment_intent.get("metadata", {}).get("trip_id")
    if not trip_id:
        print(f"No trip_id in metadata: {payment_intent.get('id')}")
        return
    
    if trip_id not in TRIPS:
        print(f"Trip not found: {trip_id}")
        return
    
    trip = TRIPS[trip_id]
    print(f"Updating {trip_id}: {event_type} → ", end="")
    
    if "succeeded" in event_type:
        trip.payment_status = PaymentStatus.PAID
        print("PAID")
    elif "failed" in event_type or "canceled" in event_type:
        trip.payment_status = PaymentStatus.FAILED
        print("FAILED")
    
    TRIPS[trip_id] = trip
    print(f"Trip status: {trip.payment_status}")