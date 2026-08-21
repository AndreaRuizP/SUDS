from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}
