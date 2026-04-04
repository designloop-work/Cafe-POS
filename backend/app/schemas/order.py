from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.order import OrderStatus, PaymentMethod
from app.schemas.order_item import OrderItemCreate, OrderItemOut

class OrderCreate(BaseModel):
    table_id: str
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderPayment(BaseModel):
    payment_method: PaymentMethod

class OrderOut(BaseModel):
    id: str
    table_id: str
    staff_id: str
    status: OrderStatus
    payment_method: Optional[PaymentMethod] = None
    total_amount: float
    created_at: datetime
    items: List[OrderItemOut]
