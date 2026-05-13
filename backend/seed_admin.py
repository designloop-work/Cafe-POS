import os
from pymongo import MongoClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
MONGO_URL = os.environ["MONGO_URL"]
MONGO_DB = os.environ.get("MONGO_DB", "pos_cafe")

client = None
try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=8000)
    db = client[MONGO_DB]

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
except Exception as e:
    print("Error:", e)
finally:
    if client:
        client.close()
