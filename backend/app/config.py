from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str
    freecryptoapi_key: str
    exchangerateapi_key: str
    github_pat: str = ''
    allowed_origins: str = "https://dlgiovani.github.io,http://localhost:4321"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()  # type: ignore[call-arg]
