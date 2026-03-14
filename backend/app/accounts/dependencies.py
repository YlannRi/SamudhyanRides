import os

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.accounts.database import supabase

security = HTTPBearer()  # This checks the Authorization header automatically


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        user = supabase.auth.get_user(token)
        if not user.user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "sub": user.user.id,
            "email": user.user.email,
        }
    except HTTPException:
        raise  # re-raise the 401 we just threw above
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


def _get_admin_emails() -> set[str]:
    raw_admin_emails = os.getenv("ADMIN_EMAILS", "")
    return {
        email.strip().lower()
        for email in raw_admin_emails.split(",")
        if email.strip()
    }


def require_admin_user(current_user: dict = Depends(get_current_user)):
    admin_emails = _get_admin_emails()
    current_email = (current_user.get("email") or "").strip().lower()

    if current_email not in admin_emails:
        raise HTTPException(status_code=403, detail="Admin access required")

    return current_user
