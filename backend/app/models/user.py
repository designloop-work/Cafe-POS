import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    staff = "staff"
