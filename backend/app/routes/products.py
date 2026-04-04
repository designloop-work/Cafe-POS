from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.database import get_database
from app.core.utils import doc, to_oid
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.routes.auth import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductOut])
async def get_products(_=Depends(get_current_user)):
    db = get_database()
    products = await db.products.find().to_list(None)
    return [doc(p) for p in products]

@router.post("/", response_model=ProductOut)
async def create_product(data: ProductCreate, _=Depends(get_current_user)):
    db = get_database()
    result = await db.products.insert_one(data.model_dump())
    product = await db.products.find_one({"_id": result.inserted_id})
    return doc(product)

@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(product_id: str, data: ProductUpdate, _=Depends(get_current_user)):
    db = get_database()
    updates = data.model_dump(exclude_none=True)
    result = await db.products.find_one_and_update(
        {"_id": to_oid(product_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc(result)

@router.delete("/{product_id}")
async def delete_product(product_id: str, _=Depends(get_current_user)):
    db = get_database()
    result = await db.products.delete_one({"_id": to_oid(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
