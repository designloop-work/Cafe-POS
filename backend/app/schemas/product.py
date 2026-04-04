from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    is_available: bool = True
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    is_available: Optional[bool] = None

class ProductOut(BaseModel):
    id: str
    name: str
    category: str
    price: float
    is_available: bool
    image_url: Optional[str] = None
