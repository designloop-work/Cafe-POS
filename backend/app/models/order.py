import enum

class OrderStatus(str, enum.Enum):
    pending = "pending"
    preparing = "preparing"
    completed = "completed"
    paid = "paid"

class PaymentMethod(str, enum.Enum):
    cash = "cash"
    upi = "upi"
