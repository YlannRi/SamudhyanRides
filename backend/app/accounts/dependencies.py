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