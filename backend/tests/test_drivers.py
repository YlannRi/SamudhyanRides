"""
test_drivers.py — Tests for /drivers/ endpoints and validation logic

Endpoints tested:
  - Licence validation unit tests
  - Vehicle Reg validation unit tests
  - POST /drivers/lookup
  - POST /drivers/validate
  - POST /drivers/upgrade
  - GET  /drivers/me/status
  - GET  /drivers/me
  - GET  /drivers/
  - GET  /drivers/verification-requests
  - GET  /drivers/{driver_id}
  - POST /drivers/verify/{driver_verification_id}
"""

import pytest
from unittest.mock import MagicMock, patch
from main import app
from app.accounts.dependencies import get_current_user
from datetime import date
from pydantic import ValidationError
from postgrest.exceptions import APIError

from app.routers.drivers import (
    validate_licence,
    validate_vehicle_reg,
    _infer_full_year,
    _is_missing_column_error,
    safe_update
)

FAKE_USER = {"sub": "user-abc-123", "email": "passenger@bath.ac.uk"}
FAKE_PROFILE_ID = "profile-abc"

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: FAKE_USER
    yield
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Core Logic Unit Tests (No DB needed)
# ---------------------------------------------------------------------------

class TestValidationLogic:

    def test_infer_full_year(self):
        # We are around 2026. A 02 birth year should be 2002 (age ~24), not 1902.
        assert _infer_full_year(2) == 2002
        # A 85 birth year should be 1985.
        assert _infer_full_year(85) == 1985
        # Fallback when no age is between 17 and 100 (e.g. 10 -> 2010=age 16, 1910=age 116)
        assert _infer_full_year(10) == 1910

    def test_validate_licence_male(self):
        # DOB: 1985-05-15, Male
        # dec=8, month=05, day=15, yl=5 -> 805155
        clean, data = validate_licence("SMITH 805155 9A9A9")
        assert clean == "SMITH8051559A9A9"
        assert data["dob"] == "1985-05-15"
        assert data["is_female"] is False
        assert data["age"] >= 40

    def test_validate_licence_female(self):
        # DOB: 2002-12-05, Female
        # dec=0, month=12+50=62, day=05, yl=2 -> 062052
        clean, data = validate_licence("JONES06205212345")
        assert clean == "JONES06205212345"
        assert data["dob"] == "2002-12-05"
        assert data["is_female"] is True

    def test_validate_licence_invalid_length(self):
        with pytest.raises(ValueError, match="16 characters"):
            validate_licence("SMITH805155")

    def test_validate_licence_invalid_surname(self):
        with pytest.raises(ValueError, match="Surname section invalid"):
            validate_licence("SMI**8051559A9A9")

    def test_validate_licence_invalid_names(self):
        with pytest.raises(ValueError, match="Last 5 chars must be alphanumeric"):
            validate_licence("SMITH805155**9A9")

    def test_validate_licence_invalid_date_format(self):
        with pytest.raises(ValueError, match="Date section must be 6 digits"):
            validate_licence("SMITHXXXXXX9A9A9")

    def test_validate_licence_invalid_date_logic(self):
        # Feb 30th (month=02, day=30)
        with pytest.raises(ValueError, match="Invalid date of birth in licence number"):
            validate_licence("SMITH8023059A9A9")

    def test_validate_licence_general_exception(self):
        with patch("app.routers.drivers.date", side_effect=Exception("General Error")):
            with pytest.raises(ValueError, match="Invalid date of birth in licence number"):
                validate_licence("SMITH8051559A9A9")

    def test_validate_licence_too_young(self):
        # We must mock _infer_full_year to force it to return a recent year (e.g., 8 years ago)
        current_year = date.today().year
        birth_year = current_year - 8
        yy_str = str(birth_year)[-2:] # e.g. "18"
        dec = yy_str[0]
        yl = yy_str[1]
        bd_str = f"{dec}0515{yl}"
        
        with patch("app.routers.drivers._infer_full_year", return_value=birth_year):
            with pytest.raises(ValueError, match="Must be 17\\+"):
                validate_licence(f"SMITH{bd_str}9A9A9")

    def test_validate_vehicle_reg(self):
        assert validate_vehicle_reg("AB12 CDE") == "AB12CDE"
        with pytest.raises(ValueError, match="Invalid UK plate"):
            validate_vehicle_reg("INVALID123")

    def test_is_missing_column_error(self):
        assert _is_missing_column_error(Exception({"code": "PGRST204"})) is True
        assert _is_missing_column_error(Exception("PGRST204 found in string value")) is True
        assert _is_missing_column_error(Exception("Random string with PGRST204 code")) is True
        assert _is_missing_column_error(Exception("Other error")) is False
        
        # Test the except block by causing an exception inside the try block
        class WeirdException(Exception):
            @property
            def args(self):
                raise ValueError("Boom")
        assert _is_missing_column_error(WeirdException()) is False

    def test_safe_update(self):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.side_effect = Exception({"code": "PGRST204"})
            # Should suppress error
            safe_update("table", "1", {"col": "v"})
            
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.side_effect = Exception("Normal Error")
            # Should re-raise
            with pytest.raises(Exception, match="Normal Error"):
                safe_update("table", "1", {"col": "v"})


# ---------------------------------------------------------------------------
# POST /drivers/lookup  &  POST /drivers/validate
# ---------------------------------------------------------------------------

class TestLookupAndValidate:

    def test_lookup_vehicle_found(self, client):
        response = client.post("/drivers/lookup", params={"registration": "AB12CDE"})
        assert response.status_code == 200
        assert response.json()["make"] == "Toyota"

    def test_lookup_vehicle_not_found(self, client):
        response = client.post("/drivers/lookup", params={"registration": "XX99XXX"})
        assert response.status_code == 404

    def test_validate_driver_inputs_valid(self, client):
        response = client.post("/drivers/validate", json={
            "licence_number": "SMITH8051559A9A9",
            "vehicle_registration": "AB12CDE"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is True
        assert "SMITH8051559A9A9" in data["cleaned"]["licence_number"]

    def test_validate_driver_inputs_invalid(self, client):
        response = client.post("/drivers/validate", json={
            "licence_number": "SHORT",
            "vehicle_registration": "INVALID"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is False
        assert "licence_number" in data["field_errors"]
        assert "vehicle_registration" in data["field_errors"]

    def test_validate_driver_inputs_empty(self, client):
        response = client.post("/drivers/validate", json={})
        assert response.status_code == 400


# ---------------------------------------------------------------------------
# POST /drivers/upgrade
# ---------------------------------------------------------------------------

class TestUpgradeDriver:

    def test_upgrade_driver_successfully(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
            # 1. get_profile_id
            # 2. check existing driver verification -> returns empty (no existing)
            # 3. insert new driver verification -> returns [{'id': 'dv-123'}]
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
                MagicMock(data=[{"id": FAKE_PROFILE_ID}]),  # profile query uses execute()
            ]

            # The existing logic limits with .limit(1) and uses execute()
            mock_existing = MagicMock()
            mock_existing.eq.return_value.limit.return_value.execute.return_value.data = []
            
            # Recreate exactly what happens: supabase.table('driver_verification').select('id').eq(...).limit(1).execute()
            # We must be careful to handle the second table lookup for `existing`. It goes through .select().eq().limit().execute()
            def fake_table(name):
                t_mock = MagicMock()
                if name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "driver_verification":
                    # for the `existing` lookup
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = []
                    # for the `insert`
                    t_mock.insert.return_value.execute.return_value.data = [{"id": "verif-1"}]
                    # updating throws an API error handled silently by safe_update (or just succeeds)
                    t_mock.update.return_value.eq.return_value.execute.return_value = None
                return t_mock

            mock_sb.table.side_effect = fake_table

            response = client.post("/drivers/upgrade", json={
                "licence_number": "SMITH8051559A9A9",
                "vehicle_registration": "AB12CDE"
            })

        assert response.status_code == 200
        assert "verification submitted" in response.json()["message"]

    def test_upgrade_driver_existing_request(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
             
            def fake_table(name):
                t_mock = MagicMock()
                if name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "driver_verification":
                    # Returns existing id
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = [{"id": "exist-1"}]
                    # updating throws an API error handled silently by safe_update
                    t_mock.update.return_value.eq.return_value.execute.return_value = None
                return t_mock

            mock_sb.table.side_effect = fake_table

            response = client.post("/drivers/upgrade", json={
                "licence_number": "SMITH8051559A9A9",
                "vehicle_registration": "AB12CDE"
            })

        assert response.status_code == 200
        assert "verification submitted" in response.json()["message"]

    def test_upgrade_driver_safe_update_throws_other_error(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID), \
             patch("app.routers.drivers.safe_update", side_effect=APIError({"code": "OTHER_ERR"})):
            
            def fake_table(name):
                t_mock = MagicMock()
                if name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = []
                    t_mock.insert.return_value.execute.return_value.data = [{"id": "verif-1"}]
                return t_mock

            mock_sb.table.side_effect = fake_table

            with pytest.raises(APIError):
                client.post("/drivers/upgrade", json={
                    "licence_number": "SMITH8051559A9A9",
                    "vehicle_registration": "AB12CDE"
                })

    def test_upgrade_fails_invalid_payload(self, client):
        with patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
            response = client.post("/drivers/upgrade", json={
                "licence_number": "JUNK",
                "vehicle_registration": "JUNK2"
            })

        assert response.status_code == 400
        assert "licence_number" in response.json()["detail"]["field_errors"]


# ---------------------------------------------------------------------------
# GET details and status
# ---------------------------------------------------------------------------

class TestGetDriverInfo:

    def test_get_my_driver_status(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
            def fake_table(name):
                t_mock = MagicMock()
                if name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = [{"verified": True}]
                return t_mock

            mock_sb.table.side_effect = fake_table

            response = client.get("/drivers/me/status")

        assert response.status_code == 200
        assert response.json()["is_driver"] is True

    def test_get_my_driver_profile(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
            def fake_table(name):
                t_mock = MagicMock()
                if name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = [{"driver_id": FAKE_PROFILE_ID}]
                return t_mock

            mock_sb.table.side_effect = fake_table

            response = client.get("/drivers/me")

        assert response.status_code == 200
        assert response.json()["driver_id"] == FAKE_PROFILE_ID

    def test_get_my_driver_profile_not_found(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb, \
             patch("app.routers.drivers.get_profile_id", return_value=FAKE_PROFILE_ID):
            def fake_table(name):
                t_mock = MagicMock()
                if name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": FAKE_PROFILE_ID}]
                elif name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.limit.return_value.execute.return_value.data = []
                return t_mock

            mock_sb.table.side_effect = fake_table

            response = client.get("/drivers/me")

        assert response.status_code == 404

    def test_get_all_drivers_empty(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/drivers/")
        assert response.status_code == 404

    def test_get_all_drivers(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            def fake_table(name):
                t_mock = MagicMock()
                if name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"driver_id": "drv-1"}]
                elif name == "user_profiles":
                    t_mock.select.return_value.in_.return_value.execute.return_value.data = [{"id": "drv-1", "first_name": "Tom"}]
                return t_mock
            
            mock_sb.table.side_effect = fake_table
    
            response = client.get("/drivers/")

        assert response.status_code == 200
        assert response.json()[0]["first_name"] == "Tom"

    def test_get_verification_requests_empty(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/drivers/verification-requests")
        assert response.status_code == 404

    def test_get_verification_requests(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "req-1"}]
            response = client.get("/drivers/verification-requests")

        assert response.status_code == 200
        assert response.json()[0]["id"] == "req-1"

    def test_get_driver_not_verified(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
            response = client.get("/drivers/drv-1")
        assert response.status_code == 404
        assert "Driver not verified" in response.json()["detail"]

    def test_get_driver_profile_not_found(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            def fake_table(name):
                t_mock = MagicMock()
                if name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"driver_id": "drv-1"}]
                elif name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = []
                return t_mock
            mock_sb.table.side_effect = fake_table

            response = client.get("/drivers/drv-1")
        assert response.status_code == 404
        assert "Driver profile not found" in response.json()["detail"]

    def test_get_driver(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            def fake_table(name):
                t_mock = MagicMock()
                if name == "driver_verification":
                    t_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"driver_id": "drv-1"}]
                elif name == "user_profiles":
                    t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"id": "drv-1"}]
                return t_mock
            
            mock_sb.table.side_effect = fake_table

            response = client.get("/drivers/drv-1")

        assert response.status_code == 200
        assert response.json()["id"] == "drv-1"

    def test_verify_driver_not_found(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
            response = client.post("/drivers/verify/verif-1")
        assert response.status_code == 404

    def test_verify_driver(self, client):
        with patch("app.routers.drivers.supabase") as mock_sb:
            # First select
            mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "verif-1"}]
            # Then update
            mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []

            response = client.post("/drivers/verify/verif-1")

        assert response.status_code == 200
        assert response.json()["message"] == "Driver verified successfully"
