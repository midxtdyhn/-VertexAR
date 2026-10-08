import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, select, text


from app import models
from app.core.config import (
    UPLOAD_DIRECTORY,
    settings,
)
from app.database import (
    Base,
    SessionLocal,
    engine,
)

from app.models import Quiz
from app.routes.attempts import (
    router as attempts_router,
)
from app.routes.questions import (
    router as questions_router,
)
from app.routes.quizzes import (
    router as quizzes_router,
)
from app.routes.ai_chat import (
    router as ai_chat_router,
)
from app.routes.quiz_settings import (
    router as quiz_settings_router,
)

def ensure_default_quiz() -> None:
    """
    Membuat satu latihan awal apabila
    tabel quizzes masih kosong.
    """

    with SessionLocal() as database:
        quiz = database.scalar(
            select(Quiz).order_by(
                Quiz.id.asc()
            )
        )

        if quiz is not None:
            return

        default_quiz = Quiz(
            title="Latihan Bangun Ruang",
            description=(
                "Uji pemahamanmu tentang "
                "bangun ruang sisi datar dan "
                "sisi lengkung."
            ),
            duration_seconds=180,
            is_active=True,
        )

        database.add(default_quiz)
        database.commit()


@asynccontextmanager
async def lifespan(
    application: FastAPI,
):
    del application

    Base.metadata.create_all(
        bind=engine
    )

    ensure_default_quiz()

    yield


app = FastAPI(
    
    title=settings.app_name,
    description=(
        "Backend API latihan interaktif VertexAR"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "VertexAR FastAPI is running"
    }

raw_frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "",
)

allowed_frontend_origins = [
    "https://vertexar.my.id",
    "https://www.vertexar.my.id",
    "https://vertex-ar.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

for origin in raw_frontend_origins.split(","):
    origin = origin.strip().rstrip("/")

    if origin and origin not in allowed_frontend_origins:
        allowed_frontend_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_frontend_origins,
    allow_origin_regex=r"https://.*\.my\.id|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(
            UPLOAD_DIRECTORY
        )
    ),
    name="uploads",
)


app.include_router(
    quizzes_router
)

app.include_router(
    questions_router
)

app.include_router(
    attempts_router
)

app.include_router(
    ai_chat_router
)

app.include_router(
    quiz_settings_router
)



@app.get("/")
def root():
    return {
        "message": "VertexAR API berjalan",
        "database": "SQLite",
        "environment": settings.app_env,
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": settings.app_name,
    }


@app.get("/api/database-test")
def database_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT 1")
            )

            value = result.scalar_one()

        return {
            "status": "connected",
            "database": "SQLite",
            "test_result": value,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Koneksi SQLite gagal: "
                f"{error}"
            ),
        ) from error


@app.get("/api/database/tables")
def database_tables():
    inspector = inspect(engine)

    return {
        "status": "success",
        "tables": inspector.get_table_names(),
    }