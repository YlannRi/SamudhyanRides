"""
test_payments.py — Tests for /payments/ endpoints

Endpoints tested:
  POST /payments/create                 → create a payment intent
  POST /payments/webhook                → webhook to confirm payment
  GET  /payments/{booking_id}/receipt   → get receipt for a booking
"""

import pytest
from unittest.mock import MagicMock, patch
from main import app
from app.accounts.dependencies import get_current_user

FAKE_USER = {"sub": "user-abc-123", "email": "passenger@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# POST /payments/create
# ---------------------------------------------------------------------------

class TestCreatePayment:

    def test_creates_payment_successfully(self, client):
        fake_booking = {"id": "book-1", "ride_id": "ride-1"}
        fake_ride = {"id": "ride-1", "driver_id": "driver-123"}
        fake_payment = {"id": "pay-1", "amount": 10.50, "status": "pending"}

        with patch("app.routers.payments.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),  # passenger profile
                MagicMock(data=[fake_booking]),             # booking
                MagicMock(data=[fake_ride]),                # ride
            ]
            mock_sb.table.return_value.insert.return_value.execute.return_value.data = [fake_payment]

            response = client.post("/payments/create", params={
                "booking_id": "book-1",
                "amount": 10.50
            })

        assert response.status_code == 200
        assert response.json()["message"] == "Payment intent created"

    def test_returns_404_if_booking_not_found(self, client):
        with patch("app.routers.payments.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
                MagicMock(data=[]), # Booking not found
            ]

            response = client.post("/payments/create", params={
                "booking_id": "book-error",
                "amount": 10.50
            })

        assert response.status_code == 404
        assert "Booking not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# POST /payments/webhook
# ---------------------------------------------------------------------------

class TestConfirmPaymentWebhook:

    def test_confirms_payment(self, client):
        fake_payment = {"id": "pay-1", "status": "succeeded", "payment_provider_id": "stripe-123"}
        
        with patch("app.routers.payments.supabase") as mock_sb:
            # Update returns the updated payment row
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [fake_payment]

            # webhook doesn't need auth dependency from get_current_user
            response = client.post("/payments/webhook", params={
                "payment_provider_id": "stripe-123",
                "status": "succeeded"
            })

        assert response.status_code == 200
        assert response.json()["payment"]["status"] == "succeeded"

    def test_returns_404_if_payment_not_found(self, client):
        with patch("app.routers.payments.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/payments/webhook", params={
                "payment_provider_id": "stripe-unknown",
                "status": "succeeded"
            })

        assert response.status_code == 404
        assert "Payment not found" in response.json()["detail"]


# ---------------------------------------------------------------------------
# GET /payments/{booking_id}/receipt
# ---------------------------------------------------------------------------

class TestGetReceipt:

    def test_returns_receipt_successfully(self, client):
        fake_payment = {"id": "pay-1", "booking_id": "book-1", "amount": 15.0}

        with patch("app.routers.payments.supabase") as mock_sb:
            # get_profile_id
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
            # receipt query requires .eq().eq()
            # Side effect because the first call is .select().eq().execute() and second is .select().eq().eq().execute()
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
            ]
            # Override for the chained receipt call
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [fake_payment]

            response = client.get("/payments/book-1/receipt")

        assert response.status_code == 200
        assert response.json()["amount"] == 15.0

    def test_returns_404_if_receipt_not_found(self, client):
        with patch("app.routers.payments.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),
            ]
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

            response = client.get("/payments/book-1/receipt")

        assert response.status_code == 404
        assert "Payment not found" in response.json()["detail"]
