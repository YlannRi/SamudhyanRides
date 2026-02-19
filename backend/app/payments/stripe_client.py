##Requires STRIPE library to run
import stripe


##Consider using env for api keys or alternatively find a way to store api keys securely.
##Edit to make it stateless, use actual DB and frontend - allow for numerous simultaneous purchases

#Used by the frontend - public
STRIPE_PUBLIC_KEY = "pk_test_51SfucyGRuyJ1d2Jy2yLfXZofvIoj6pctzuT8fCoNpyryEeo0GRqOGOxFdH9hWjPne5Lqrlqj3F4Es53QzVUbkxVK00UyrnnopE"

#Used and stored securely by the backend - private
STRIPE_PRIVATE_KEY = ""

#Generate local webhook key (expires in 90 days) - later if using azure integrate into that
STRIPE_WEBHOOK_KEY = ""

stripe.api_key = STRIPE_PRIVATE_KEY

def get_stripe():
    return stripe

def get_private_key():
    return STRIPE_PRIVATE_KEY

def get_webhook_key():
    return STRIPE_WEBHOOK_KEY