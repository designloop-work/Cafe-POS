from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str
    MONGO_DB: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    ALGORITHM: str = "HS256"
    ADMIN_REGISTRATION_KEY: str = "cafe-admin-2024"

    class Config:
        env_file = ".env"

settings = Settings()
