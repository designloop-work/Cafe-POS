from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole

class UserCreate(BaseModel):
    name: str
    username: str
    password: str
    admin_secret: Optional[str] = None

class PromoteRequest(BaseModel):
    user_id: str
    role: UserRole

class UserOut(BaseModel):
    id: str
    name: str
    username: str
    role: UserRole
    is_active: bool = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class LoginRequest(BaseModel):
    username: str
    password: str
