import time
import requests
import json

SMTP2GO_API_KEY = "" #due to the limits, i got rid of the API key
SMTP2GO_ENDPOINT = "https://api.smtp2go.com/v3/email/send"

#Dictionary for predefined templates found on SMTP2GO
TEMPLATES = {
    "welcome": "2000135",
    "welcome_driver": "9331381",
    "account_deletion":"7099045",
    "ride_receipt": "9164254",
    }

#The email used to send emails via domain, can be {anything}@samudhyanrides.infinityfreeapp.com
SENDER = "no-reply@samudhyanrides.infinityfreeapp.com"

#sends welcome emails 
def send_welcome(to_email:str,name:str):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["welcome"],
        "template_data": {"name": name}
    }
    return send_email(payload)

#welcomes drivers that have just signed up
def send_welcome_driver(to_email:str,name:str):
    payload = {
        "sender": SENDER,
        "to": [to_email],
        "template_id": TEMPLATES["welcome_driver"],
        "template_data": {"name": name}
    }
    return send_email(payload)

#Upon the users deletion of their profile, gives summary and emails them
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

#Upon a ride completion and successful completion of a payment, sends a receipt (If webhooks setup properly or send receipt then take payment?)
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

#sends the email via HTTPS, allows for emails to be send simultaneously with max 1s delay in between to allow system to breathe
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
    "Samudhyan", #driver name
    "2025-12-18 11:00 AM", #date_time of receipt creation (equal to time of dropoff- post journey?)
    2.40, #total price
    "McDonald's Weston Lock Retail Park, Lower Bristol Rd, Twerton, Bath BA21EP", #pickup location
    "2025-12-18 10:05 AM", #pickup_time
    "University Of Bath", #dropoff location
    "2025-12-18 11:00 AM", #dropoff time
    0.00, #tips
    0.50, #stars 
    2.30, #fare_price
    0.10, #fees price
    "Google Pay"
))