from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


database_url = settings.database_url
is_sqlite = database_url.startswith("sqlite")

engine_kwargs = {
    "pool_pre_ping": True,
    "echo": False,
}

if is_sqlite:
    engine_kwargs["connect_args"] = {
        "check_same_thread": False,
    }

engine = create_engine(
    database_url,
    **engine_kwargs,
)


if is_sqlite:
    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(
        dbapi_connection,
        connection_record,
    ) -> None:
        del connection_record

        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()