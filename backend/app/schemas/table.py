from pydantic import BaseModel
from app.models.table import TableStatus

class TableCreate(BaseModel):
    number: int
    capacity: int = 4

class TableUpdate(BaseModel):
    status: TableStatus

class TableOut(BaseModel):
    id: str
    number: int
    capacity: int
    status: TableStatus
