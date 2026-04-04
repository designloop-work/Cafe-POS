from pydantic import BaseModel

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderItemOut(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
