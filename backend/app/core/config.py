from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    MONGO_URL: str
    MONGO_DB: str
    SECRET_KEY: str
    ADMIN_REGISTER_SECRET: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    ALGORITHM: str = "HS256"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    @property
    def allowed_origins_list(self) -> List[str]:
        origins = [o.strip() for o in self.ALLOWED_ORIGINS.replace('\n', ',').split(',')]
        return [o for o in origins if o]

    class Config:
        env_file = ".env"

settings = Settings()
