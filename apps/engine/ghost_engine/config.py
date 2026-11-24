import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Preload .env from possible locations
load_dotenv()
for candidate in [
    Path(".env"),
    Path("../.env"),
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent.parent / ".env",
]:
    if candidate.exists():
        load_dotenv(candidate)

class Settings(BaseSettings):
    """GhostBrowser Engine Configuration."""
    app_name: str = "GhostBrowser Engine"
    debug: bool = True
    port: int = 8000
    host: str = "127.0.0.1"

    # Production AI & Cloud Keys
    sambanova_api_key: str = os.getenv("SAMBANOVA_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    steel_api_key: str = os.getenv("STEEL_API_KEY", "")
    deepgram_api_key: str = os.getenv("DEEPGRAM_API_KEY", "")
    cartesia_api_key: str = os.getenv("CARTESIA_API_KEY", "")
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")

    # Browser automation limits
    headless: bool = True
    max_parallel_workers: int = 3
    viewport_width: int = 1440
    viewport_height: int = 900
    demo_mock_fallback: bool = True

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
