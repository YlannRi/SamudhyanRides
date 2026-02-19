import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from service import TripPaymentInput, create_payment_intent, TRIPS, simulate_client_confirmation,monitor_trip_status
from webhook_handler import webhook_handler

#Creates a webhook server that along with StripeCLI simulates the entire payment process which returns a final confirmation of a charge
class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/webhook':
            content_length = int(self.headers['Content-Length'])
            raw_body = self.rfile.read(content_length)
            sig_header = self.headers.get('Stripe-Signature', '')
            result = webhook_handler(raw_body, sig_header)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server = HTTPServer(('localhost', 4242), WebhookHandler)
    print("Webhook server running on http://localhost:4242/webhook")
    server.serve_forever()

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

data = TripPaymentInput(rider_id="rider_1", driver_id="driver_42", distance_km=5, tip=0)
trip, client_secret = create_payment_intent(data)

# Simulate frontend and monitors the webhook
confirmed_pi = simulate_client_confirmation(client_secret)
print("Payment confirmed, waiting for webhook...")

monitor_trip_status(trip.trip_id)
print("Final trip:", TRIPS[trip.trip_id])


