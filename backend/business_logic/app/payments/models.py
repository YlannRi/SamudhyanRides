from dataclasses import dataclass 
from enum import Enum

def calculate_price(distance_km:float):
    base = 150 # £1.50
    ppkm = 50 # £0.50 per km
    amount = base + int(distance_km * ppkm)
    return amount ##must be an integer as the API rejects it otherwise

class PaymentStatus(str, Enum):
    REQUIRES_PAYMENT = "requires_payment"
    PAID = "paid"
    FAILED = "failed"

@dataclass
class Trip:
    trip_id: str
    rider_id: str
    driver_id: str
    distance_km: float
    price: float
    tip: float
    payment_status: PaymentStatus
    stripe_payment_intent_id: str | None = None
