from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole

class UserCreate(BaseModel):
    name: str
    username: str
    password: str
    role: UserRole = UserRole.staff
    admin_key: Optional[str] = None

class UserOut(BaseModel):
    id: str
    name: str
    username: str
    role: UserRole

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class LoginRequest(BaseModel):
    username: str
    password: str
