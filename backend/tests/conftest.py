"""
conftest.py — Shared pytest fixtures for all test files.

IMPORTANT: Environment variables must be set BEFORE importing main/app,
because database.py calls create_client() at module load time.
For tests that actually call Supabase endpoints, we mock the client separately.
"""

import os

# Set env vars before any app imports — prevents Supabase from crashing at import time.
# Tests that need real DB access will mock the supabase client individually.
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "test-key-placeholder")

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Return a TestClient wrapping the FastAPI app."""
    with TestClient(app) as c:
        yield c
