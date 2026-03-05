from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # AI & External APIs
    GROQ_API_KEY: str
    OPENAI_API_KEY: str
    GEMINI_API_KEY: str
    YOUTUBE_API_KEY: str
    SPOONACULAR_API_KEY: str

    # Google Calendar
    GOOGLE_CALENDAR_CLIENT_ID: str
    GOOGLE_CALENDAR_CLIENT_SECRET: str
    GOOGLE_CALENDAR_REDIRECT_URI: str

    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "allow"

@lru_cache()
def get_settings():
    return Settings()
