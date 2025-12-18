import time
import requests
import json

SMTP2GO_API_KEY = ""
SMTP2GO_ENDPOINT = "https://api.smtp2go.com/v3/email/send"

TEMPLATES = {
    "welcome": "2000135",
    "welcome_driver": "9331381",
    "account_deletion":"7099045",
    "ride_receipt": "9164254",
    }

SENDER = "no-reply@samudhyanrides.infinityfreeapp.com"

def send_welcome(to_email:str,name:str):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["welcome"],
        "template_data": {"name": name}
    }
    return send_email(payload)

def send_welcome_driver(to_email:str,name:str):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["welcome_driver"],
        "template_data": {"name": name}
    }
    return send_email(payload)

def send_deletion_email(to_email:str,name:str,trips_number:int,longest_trip:int,no_stars:int):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["account_deletion"],
        "template_data": {"name": name,
                          "no_trips":trips_number,
                          "longest_trip":longest_trip,
                          "no_stars":no_stars
                          }
    }
    return send_email(payload)


def send_receipt_email(to_email:str,name:str,date_time:str,total_price:float,pickup_location:str,
                       pickup_time:str,dropoff_location:str,dropoff_time:str,tips:float,
                       star_rated:float,fare_price:float,fees_price:float,payment_method:str):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["ride_receipt"],
        "template_data": {
            "name": name,
            "date_time": date_time,
            "total_price": total_price,
            "pickup_location": pickup_location,
            "pickup_time": pickup_time,
            "dropoff_location": dropoff_location,
            "dropoff_time": dropoff_time,
            "tips": tips,
            "star_rated": star_rated,
            "fare_price": fare_price,
            "fees_price": fees_price,
            "payment_method": payment_method
        }
    }
    return send_email(payload)

def send_email(payload:dict):
    body = {"api_key":SMTP2GO_API_KEY, **payload}
    headers = {"Content-Type": "application/json"}
    r = requests.post(SMTP2GO_ENDPOINT, json=body,headers=headers, timeout=30)
    r.raise_for_status()
    return r.json()


to_email="sk3250@bath.ac.uk"

print(send_welcome(to_email, "Samudhyan"))
time.sleep(1)
print(send_welcome_driver(to_email, "Samudhyan"))
time.sleep(1)
print(send_deletion_email(to_email, "Samudhyan", 100, 5, 0))
time.sleep(1)
print(send_receipt_email(
    to_email,
    "Samudhyan",
    "2025-12-18 11:00 AM",
    2.40,
    "McDonald's Weston Lock Retail Park, Lower Bristol Rd, Twerton, Bath BA21EP",
    "2025-12-18 10:05 AM",
    "University Of Bath",
    "2025-12-18 11:00 AM",
    2.00,
    0.40,
    2.40,
    2.40,
    "Google Pay"
))