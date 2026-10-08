import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func, inspect, select, text


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
    Membuat kuis awal dan soal latihan otomatis
    apabila tabel quizzes atau questions masih kosong.
    """
    with SessionLocal() as database:
        quiz = database.scalar(
            select(Quiz).order_by(
                Quiz.id.asc()
            )
        )

        if quiz is None:
            quiz = Quiz(
                title="Latihan Bangun Ruang",
                description=(
                    "Uji pemahamanmu tentang "
                    "bangun ruang sisi datar dan "
                    "sisi lengkung."
                ),
                duration_seconds=600,
                is_active=True,
            )
            database.add(quiz)
            database.commit()
            database.refresh(quiz)

        # Cek jika belum ada soal
        existing_questions_count = database.scalar(
            select(func.count(models.Question.id)).where(models.Question.quiz_id == quiz.id)
        )

        if existing_questions_count == 0:
            sample_questions = [
                {
                    "prompt": "Sebuah kubus memiliki panjang rusuk 6 cm. Berapakah volume kubus tersebut?",
                    "image_url": "/uploads/kubus.png",
                    "option_a": "36 cm³",
                    "option_b": "108 cm³",
                    "option_c": "216 cm³",
                    "option_d": "256 cm³",
                    "correct_option": "C",
                    "explanation": "Volume Kubus = s³ = 6 cm × 6 cm × 6 cm = 216 cm³.",
                    "order": 1,
                },
                {
                    "prompt": "Sebuah balok memiliki ukuran panjang 10 cm, lebar 5 cm, dan tinggi 4 cm. Luas permukaan balok tersebut adalah...",
                    "image_url": "/uploads/balok.png",
                    "option_a": "110 cm²",
                    "option_b": "220 cm²",
                    "option_c": "200 cm²",
                    "option_d": "440 cm²",
                    "correct_option": "B",
                    "explanation": "Luas Permukaan Balok = 2 × (pl + pt + lt) = 2 × (10×5 + 10×4 + 5×4) = 220 cm².",
                    "order": 2,
                },
                {
                    "prompt": "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm (menggunakan π = 22/7). Berapakah volume tabung tersebut?",
                    "image_url": "/uploads/tabung.png",
                    "option_a": "1.540 cm³",
                    "option_b": "1.440 cm³",
                    "option_c": "770 cm³",
                    "option_d": "3.080 cm³",
                    "correct_option": "A",
                    "explanation": "Volume Tabung = π × r² × t = (22/7) × 7 × 7 × 10 = 1.540 cm³.",
                    "order": 3,
                },
                {
                    "prompt": "Sebuah bola memiliki jari-jari 21 cm. Berapakah luas permukaan bola tersebut (menggunakan π = 22/7)?",
                    "image_url": "/uploads/bola.png",
                    "option_a": "1.386 cm²",
                    "option_b": "2.772 cm²",
                    "option_c": "5.544 cm²",
                    "option_d": "38.808 cm²",
                    "correct_option": "C",
                    "explanation": "Luas Permukaan Bola = 4 × π × r² = 4 × (22/7) × 21 × 21 = 5.544 cm².",
                    "order": 4,
                },
                {
                    "prompt": "Suatu kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Berapakah panjang garis pelukis (s) kerucut tersebut?",
                    "image_url": "/uploads/kerucut.png",
                    "option_a": "10 cm",
                    "option_b": "12 cm",
                    "option_c": "14 cm",
                    "option_d": "16 cm",
                    "correct_option": "A",
                    "explanation": "Panjang garis pelukis (s) = √(r² + t²) = √(6² + 8²) = √100 = 10 cm.",
                    "order": 5,
                },
            ]

            for q in sample_questions:
                database.add(
                    models.Question(
                        quiz_id=quiz.id,
                        prompt=q["prompt"],
                        image_url=q["image_url"],
                        option_a=q["option_a"],
                        option_b=q["option_b"],
                        option_c=q["option_c"],
                        option_d=q["option_d"],
                        correct_option=q["correct_option"],
                        explanation=q["explanation"],
                        order=q["order"],
                        is_active=True,
                    )
                )

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
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{full_path:path}")
async def global_options_handler(full_path: str):
    return {}

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