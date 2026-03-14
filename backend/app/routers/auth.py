from app.accounts.database import create_supabase_client
from app.accounts.dependencies import get_current_user
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import re

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    identifier: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str

class RefreshRequest(BaseModel):
    refresh_token: str

# auth.py (inside the register function)
@router.post("/register")
def register(request: RegisterRequest):
    auth_client = create_supabase_client()

    # Restrict to University of Bath emails
    if not request.email.endswith("@bath.ac.uk"):
        raise HTTPException(status_code=400, detail="Only University of Bath emails are allowed.")

    # Check password strength
    if len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not (re.search("[a-z]", request.password)):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    if not (re.search("[A-Z]", request.password)):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if not (re.search("[0-9]", request.password)):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")
    if re.search(r"\s", request.password):
        raise HTTPException(status_code=400, detail="Password must not contain spaces")
    if not (re.search("[^a-zA-Z0-9]", request.password)):
        raise HTTPException(status_code=400, detail="Password must contain a special character.")

    try:
        # Create user in Supabase Auth
        response = auth_client.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")

        name_parts = request.full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        uni_username = request.email.split("@")[0].lower()

        # Create user profile row with the new data
        auth_client.table("user_profiles").insert({
            "auth_user_id": response.user.id,
            "email": response.user.email,
            "first_name": first_name,
            "last_name": last_name,
            "university_username": uni_username
        }).execute()

        return {
            "message": "Registration successful. Please check your email to verify.",
            "user_id": response.user.id
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(request: LoginRequest):
    auth_client = create_supabase_client()

    try:
        identifier = request.identifier

        user_lookup = auth_client.table("user_profiles") \
                .select("email") \
                .eq("university_username", identifier) \
                .execute()

        if user_lookup.data:
            identifier = user_lookup.data[0]["email"]

        response = auth_client.auth.sign_in_with_password({
            "email": identifier,
            "password": request.password
        })

        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer" # this is the JWT token
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/refresh")
def refresh(request: RefreshRequest):
    auth_client = create_supabase_client()
    try:
        response = auth_client.auth.refresh_session(request.refresh_token)
        if response.session is None:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    try:
        create_supabase_client().auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
