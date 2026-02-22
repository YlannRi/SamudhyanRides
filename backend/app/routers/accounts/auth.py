from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str

# auth.py (inside the register function)
@router.post("/register")
def register(request: RegisterRequest):
    # Restrict to University of Bath emails
    if not request.email.endswith("@bath.ac.uk"):
        raise HTTPException(status_code=400, detail="Only University of Bath emails are allowed.")

    try:
        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")

        name_parts = request.full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        uni_username = request.email.split("@")[0]

        # Create user profile row with the new data
        supabase.table("user_profiles").insert({
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
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
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

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))