import enum

class TableStatus(str, enum.Enum):
    available = "available"
    occupied = "occupied"
