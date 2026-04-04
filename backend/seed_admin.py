from pymongo import MongoClient
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
client = MongoClient("mongodb+srv://posuser:pospassword123@cluster0.p0mhvyn.mongodb.net/", serverSelectionTimeoutMS=8000)
db = client["pos_cafe"]

db.users.delete_many({"username": "admin"})
db.users.insert_one({
    "name": "Admin",
    "username": "admin",
    "hashed_password": pwd.hash("admin123"),
    "role": "admin",
    "is_active": True,
})

user = db.users.find_one({"username": "admin"})
print("Admin seeded successfully!")
print("  username:", user["username"])
print("  role    :", user["role"])
print("  id      :", str(user["_id"]))
client.close()
