from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        protected_namespaces=("settings_",),
    )

    # "postgres" (default) or "memory"
    db_mode: str = Field(default="postgres", alias="DB_MODE")

    # Required only when db_mode == "postgres"
    database_url: str | None = Field(default=None, alias="DATABASE_URL")

    cors_origins: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    model_name: str = Field(
        default="cardiffnlp/twitter-xlm-roberta-base-sentiment",
        alias="MODEL_NAME",
    )


settings = Settings()
