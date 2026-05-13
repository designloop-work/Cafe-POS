from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class DatabaseClient:
    def __init__(self):
        self._client: AsyncIOMotorClient = None

    def get_database(self):
        return self._client[settings.MONGO_DB]

    async def connect(self):
        self._client = AsyncIOMotorClient(settings.MONGO_URL)

    async def close(self):
        if self._client:
            self._client.close()
            self._client = None


db_client = DatabaseClient()


def get_database():
    return db_client.get_database()


async def connect_db():
    await db_client.connect()


async def close_db():
    await db_client.close()
