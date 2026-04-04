from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.database import get_database
from app.core.utils import doc, to_oid
from app.schemas.table import TableCreate, TableUpdate, TableOut
from app.routes.auth import get_current_user

router = APIRouter(prefix="/tables", tags=["tables"])

@router.get("/", response_model=List[TableOut])
async def get_tables(_=Depends(get_current_user)):
    db = get_database()
    tables = await db.tables.find().sort("number", 1).to_list(None)
    return [doc(t) for t in tables]

@router.post("/", response_model=TableOut)
async def create_table(data: TableCreate, _=Depends(get_current_user)):
    db = get_database()
    if await db.tables.find_one({"number": data.number}):
        raise HTTPException(status_code=400, detail="Table number already exists")
    result = await db.tables.insert_one({**data.model_dump(), "status": "available"})
    table = await db.tables.find_one({"_id": result.inserted_id})
    return doc(table)

@router.patch("/{table_id}", response_model=TableOut)
async def update_table_status(table_id: str, data: TableUpdate, _=Depends(get_current_user)):
    db = get_database()
    result = await db.tables.find_one_and_update(
        {"_id": to_oid(table_id)},
        {"$set": {"status": data.status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Table not found")
    return doc(result)

@router.delete("/{table_id}")
async def delete_table(table_id: str, _=Depends(get_current_user)):
    db = get_database()
    result = await db.tables.delete_one({"_id": to_oid(table_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table deleted"}
