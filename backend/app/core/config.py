from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Lokasi folder utama backend
BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "VertexAR API"
    app_env: str = "development"

    frontend_origin: str = "http://localhost:5173"

    database_url: str = "sqlite:///./vertexar.db"
    upload_dir: str = "uploads"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()


def get_upload_directory() -> Path:
    upload_path = Path(settings.upload_dir)

    if not upload_path.is_absolute():
        upload_path = BACKEND_DIR / upload_path

    upload_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    return upload_path.resolve()


UPLOAD_DIRECTORY = get_upload_directory()