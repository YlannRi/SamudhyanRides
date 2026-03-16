from typing import Literal

from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    status: Literal["ok"]
    service: Literal["backend"]


class HealthResponse(BaseModel):
    status: Literal["ready"]
    port: int = Field(..., ge=1)


class AuthTokensResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"]


class RegisterResponse(BaseModel):
    message: str
    user_id: str


class MessageResponse(BaseModel):
    message: str


class UnreadCountResponse(BaseModel):
    unread_count: int = Field(..., ge=0)


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    body: str = ""
    created_at: str
    read: bool = False
    link: str | None = None
