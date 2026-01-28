from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ModuChat"
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 数据库配置
    SQLALCHEMY_DATABASE_URL: str = "sqlite+aiosqlite:///./moduchat.db"
    
    # WebSocket配置
    WEBSOCKET_PATH: str = "/ws/chat"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
