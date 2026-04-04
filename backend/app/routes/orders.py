from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.database import get_database
from app.core.utils import doc, to_oid
from app.models.order import OrderStatus
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate, OrderPayment
from app.routes.auth import get_current_user
from app.services.order_service import create_order_with_items
from app.websockets.manager import manager

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=List[OrderOut])
async def get_orders(_=Depends(get_current_user)):
    db = get_database()
    orders = await db.orders.find().sort("created_at", -1).to_list(None)
    return [doc(o) for o in orders]

@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: str, _=Depends(get_current_user)):
    db = get_database()
    order = await db.orders.find_one({"_id": to_oid(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return doc(order)

@router.post("/", response_model=OrderOut)
async def create_order(data: OrderCreate, user=Depends(get_current_user)):
    db = get_database()
    order = await create_order_with_items(db, data, user["id"])
    await db.tables.update_one({"_id": to_oid(data.table_id)}, {"$set": {"status": "occupied"}})
    await manager.broadcast({"event": "new_order", "order_id": order["id"], "table_id": order["table_id"]})
    return order

@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(order_id: str, data: OrderStatusUpdate, _=Depends(get_current_user)):
    db = get_database()
    result = await db.orders.find_one_and_update(
        {"_id": to_oid(order_id)},
        {"$set": {"status": data.status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    order = doc(result)
    await manager.broadcast({"event": "order_updated", "order_id": order["id"], "status": order["status"]})
    return order

@router.post("/{order_id}/pay", response_model=OrderOut)
async def pay_order(order_id: str, data: OrderPayment, _=Depends(get_current_user)):
    db = get_database()
    result = await db.orders.find_one_and_update(
        {"_id": to_oid(order_id)},
        {"$set": {"status": OrderStatus.paid, "payment_method": data.payment_method}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    order = doc(result)
    await db.tables.update_one({"_id": to_oid(order["table_id"])}, {"$set": {"status": "available"}})
    return order
