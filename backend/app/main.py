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
                duration_seconds=900,
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
                    "prompt": "Sebuah balok memiliki panjang 5 cm, lebar 2 cm, dan tinggi 1 cm. Berapakah volume balok tersebut?",
                    "image_url": "/uploads/no1.jpeg",
                    "option_a": "5 cm³",
                    "option_b": "8 cm³",
                    "option_c": "10 cm³",
                    "option_d": "15 cm³",
                    "correct_option": "C",
                    "explanation": "V = p × l × t = 5 × 2 × 1 = 10 cm³",
                    "order": 1,
                },
                {
                    "prompt": "Sebuah prisma segitiga memiliki alas berbentuk segitiga siku-siku dengan panjang alas 10 m dan tinggi 8 m. Jika panjang prisma 15 m, berapakah volume prisma segitiga tersebut?",
                    "image_url": "/uploads/no2.jpeg",
                    "option_a": "300 m³",
                    "option_b": "450 m³",
                    "option_c": "600 m³",
                    "option_d": "750 m³",
                    "correct_option": "C",
                    "explanation": "V = ½ × a × t × p = ½ × 10 × 8 × 15 = 600 m³",
                    "order": 2,
                },
                {
                    "prompt": "Sebuah balok memiliki panjang 9 cm, lebar 6 cm, dan tinggi 3 cm. Berapakah volume balok tersebut?",
                    "image_url": "/uploads/no3.jpeg",
                    "option_a": "108 cm³",
                    "option_b": "126 cm³",
                    "option_c": "162 cm³",
                    "option_d": "216 cm³",
                    "correct_option": "C",
                    "explanation": "V = p × l × t = 9 × 6 × 3 = 162 cm³",
                    "order": 3,
                },
                {
                    "prompt": "Sebuah bola memiliki diameter 8,4 meter. Berapakah luas permukaan bola tersebut? (Gunakan π = 22/7)",
                    "image_url": "/uploads/no4.jpeg",
                    "option_a": "110,88 m²",
                    "option_b": "176,64 m²",
                    "option_c": "221,76 m²",
                    "option_d": "443,52 m²",
                    "correct_option": "C",
                    "explanation": "r = 8,4 ÷ 2 = 4,2 m\nL = 4πr² = 4 × 22/7 × 4,2² = 221,76 m²",
                    "order": 4,
                },
                {
                    "prompt": "Sebuah kerucut memiliki jari-jari alas 6 cm dan panjang garis pelukis 8 cm. Berapakah luas selimut kerucut tersebut? (Gunakan π = 3,14)",
                    "image_url": "/uploads/no5.jpeg",
                    "option_a": "113,04 cm²",
                    "option_b": "150,72 cm²",
                    "option_c": "175,84 cm²",
                    "option_d": "301,44 cm²",
                    "correct_option": "B",
                    "explanation": "L = π × r × s = 3,14 × 6 × 8 = 150,72 cm²",
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