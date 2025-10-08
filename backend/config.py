from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "postgresql://harshraj@localhost:5432/disease_management"
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "disease_management"
    db_user: str = "harshraj"
    db_password: str = ""
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application
    app_name: str = "Disease Management System"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
