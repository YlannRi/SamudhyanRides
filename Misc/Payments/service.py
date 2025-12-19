from dataclasses import dataclass
from models import calculate_price, Trip, PaymentStatus
from stripe_client import get_stripe

stripe = get_stripe()

##replace with actual DB
USERS = {
    "rider_1":{"name": "Samudhyan", "stripe_customer_id": None}
    }
TRIPS = {}

@dataclass
class TripPaymentInput:
    rider_id:str
    driver_id:str
    distance_km:float
    tip:float

def get_stripe_customer_id(rider_id:str):
    rider = USERS[rider_id]
    customer_id = rider["stripe_customer_id"]
    if customer_id:
        return customer_id

    ##allows to store payment history on stripe, but store transactional_id in db for retrieval along with payment state
    customer = stripe.Customer.create(
        name = rider["name"],
        metadata={"rider_id": rider_id},
        )
    rider["stripe_customer_id"] = customer.id
    return customer.id


def generate_trip_id():
    return f"trip_{len(TRIPS)+1}"

#creates an intent - informs API of a charge
def create_payment_intent(trip_input: TripPaymentInput):
    price = calculate_price(trip_input.distance_km)

    trip_id = generate_trip_id()
    trip = Trip(
        trip_id=trip_id,
        rider_id=trip_input.rider_id,
        driver_id=trip_input.driver_id,
        distance_km= trip_input.distance_km,
        price=price,
        tip=trip_input.tip,
        payment_status=PaymentStatus.REQUIRES_PAYMENT, 
        )
    TRIPS[trip_id]= trip

    customer_id = get_stripe_customer_id(trip_input.rider_id)
    payment_intent = stripe.PaymentIntent.create(
        amount=price,
        currency="gbp",
        customer=customer_id,
        #edit automatic payments - allow for app to close mid-transaction
        # payment should be continued once app reoppened with session_id (or other way of identifying user)
        automatic_payment_methods={
            "enabled":True,
            "allow_redirects":"never",
            },
        metadata={"trip_id":trip.trip_id, "rider_id":trip.rider_id},
        )
    trip.stripe_payment_intent_id = payment_intent.id
    TRIPS[trip_id] = trip
    return trip, payment_intent.client_secret

#simulates user confirmation and entering card details to then confirm the intent if valid and process it.
#replace with frontend implementation, have it handle card input as well as working for google/apple pay 
#accepting test card: 4242424242424242, 232,  12/30
#rejecting test card: 4000000000009979, 232, 12/30 

def simulate_client_confirmation(client_secret:str):
    ##accepting test payment method
    #payment_method = "pm_card_mastercard_au_debit_mastercardStandardDebitProductCode"

    ##rejecting test payment method
    payment_method = "pm_card_visa_chargeDeclined"
    payment_intent_id = client_secret.split("_secret")[0]

    try: 
        confirmed_intent = stripe.PaymentIntent.confirm(
            payment_intent_id,
            payment_method=payment_method ,
            )
        return confirmed_intent
    except stripe.error.CardError as e:
        return None

#Once a webhook confirms the payment, trip status confirms it - this prevents the code from running endlessly
def monitor_trip_status(trip_id: str, timeout: int = 30):
    import time
    print(f"{trip_id} status...")
    for i in range(timeout):
        trip = TRIPS.get(trip_id)
        status = trip.payment_status if trip else "NOT_FOUND"
        print(f"{i+1}s | {trip_id}: {status}")
        if status == "paid":
            print("PAYMENT CONFIRMED")
            return True
        elif status == "failed":
            print("PAYMENT FAILED")
            return True
        time.sleep(1)
    return False