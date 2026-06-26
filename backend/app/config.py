from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/suds"
    SECRET_KEY: str = "cambia-esta-clave-secreta-en-produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    DEFAULT_ADMIN_EMAIL: str = "admin@suds.com"
    DEFAULT_ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"


settings = Settings()
