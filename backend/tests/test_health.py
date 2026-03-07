"""
test_health.py — Tests for the root and health-check endpoints.

These are the simplest endpoints in the app (no auth, no DB calls),
and are a good starting point for understanding the test structure.

Endpoints tested:
  GET /        → {"status": "ok", "service": "backend"}
  GET /health  → {"status": "ready", "port": 8000}
"""


def test_root_returns_ok(client):
    """GET / should return HTTP 200 with a status of 'ok'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "backend"}


def test_health_returns_ready(client):
    """GET /health should return HTTP 200 with status 'ready' and port 8000."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["port"] == 8000
