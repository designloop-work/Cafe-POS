from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.core.database import get_database
from app.core.utils import doc, to_oid
from app.models.user import UserRole
from app.schemas.user import UserCreate, UserOut, Token, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer()

def hash_password(p: str) -> str:
    return pwd_context.hash(p)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        db = get_database()
        user = await db.users.find_one({"_id": to_oid(payload.get("sub"))})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return doc(user)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", response_model=UserOut)
async def register(data: UserCreate):
    db = get_database()
    if await db.users.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if data.role == UserRole.admin:
        if not data.admin_key or data.admin_key != settings.ADMIN_REGISTRATION_KEY:
            raise HTTPException(status_code=403, detail="Invalid admin registration key")
    result = await db.users.insert_one({
        "name": data.name,
        "username": data.username,
        "hashed_password": hash_password(data.password),
        "role": data.role,
        "is_active": True,
    })
    user = await db.users.find_one({"_id": result.inserted_id})
    return doc(user)

@router.post("/login", response_model=Token)
async def login(data: LoginRequest):
    db = get_database()
    user = await db.users.find_one({"username": data.username})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = doc(user)
    token = create_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": user}
