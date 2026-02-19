from fastapi import APIRouter, HTTPException, Depends
from app.accounts.database import supabase
from app.accounts.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


# auth contains, register, login and logout
# when user logs in, the endpoint will return JWT token, this will need to be stored in front end
# cuz to access any data we need the JWT token

@router.post("/register")
def register(
    email: str,
    password: str
):
    # Restrict to University of Bath emails
    if not email.endswith("@bath.ac.uk"):
        raise HTTPException(status_code=400, detail="Only University of Bath emails are allowed.")

    try:
        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")

        # Optional: create user profile row
        supabase.table("user_profiles").insert({
            "auth_user_id": response.user.id,
            "email": response.user.email
        }).execute()

        return {
            "message": "Registration successful. Please check your email to verify.",
            "user_id": response.user.id # so it returns the auth user id 
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(email: str, password: str):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
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