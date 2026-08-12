from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from sqlalchemy import (
    func,
    select,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    Question,
    Quiz,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api",
    tags=[
        "Pengaturan Waktu Kuis"
    ],
)


# =========================================================
# SCHEMA REQUEST
# =========================================================

class QuizTimeUpdateRequest(
    BaseModel
):
    """
    Pengaturan durasi berdasarkan waktu
    yang diberikan untuk setiap soal.
    """

    minutes_per_question: float = Field(
        default=3,
        gt=0,
        le=60,
        description=(
            "Waktu pengerjaan untuk setiap "
            "soal dalam menit. "
            "Contoh: isi 3 untuk 3 menit "
            "per soal."
        ),
    )


# =========================================================
# SCHEMA RESPONSE
# =========================================================

class QuizTimeResponse(
    BaseModel
):
    quiz_id: int

    quiz_title: str

    active_questions: int

    minutes_per_question: float

    seconds_per_question: int

    total_duration_seconds: int

    total_duration_minutes: float

    message: str


# =========================================================
# FUNGSI BANTUAN
# =========================================================

def get_quiz_or_404(
    database: Session,
    quiz_id: int,
) -> Quiz:
    quiz = database.get(
        Quiz,
        quiz_id,
    )

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Kuis tidak ditemukan."
            ),
        )

    return quiz


def count_active_questions(
    database: Session,
    quiz_id: int,
) -> int:
    statement = (
        select(
            func.count(
                Question.id
            )
        )
        .where(
            Question.quiz_id
            == quiz_id,

            Question.is_active.is_(
                True
            ),
        )
    )

    total = database.scalar(
        statement
    )

    return int(
        total or 0
    )


# =========================================================
# LIHAT PENGATURAN WAKTU
# =========================================================

@router.get(
    "/quizzes/{quiz_id}/time-settings",
)
def get_quiz_time_settings(
    quiz_id: int,
    database: Session = Depends(
        get_db
    ),
):
    """
    Melihat durasi kuis yang sekarang
    tersimpan di SQLite.
    """

    quiz = get_quiz_or_404(
        database,
        quiz_id,
    )

    active_questions = (
        count_active_questions(
            database,
            quiz.id,
        )
    )


    duration_seconds = int(
        quiz.duration_seconds
    )


    duration_minutes = round(
        duration_seconds / 60,
        2,
    )


    if active_questions > 0:
        minutes_per_question = round(
            duration_minutes
            / active_questions,
            2,
        )

    else:
        minutes_per_question = 0


    return {
        "quiz_id": quiz.id,

        "quiz_title": quiz.title,

        "active_questions": (
            active_questions
        ),

        "duration_seconds": (
            duration_seconds
        ),

        "duration_minutes": (
            duration_minutes
        ),

        "estimated_minutes_per_question": (
            minutes_per_question
        ),
    }


# =========================================================
# UPDATE WAKTU BERDASARKAN JUMLAH SOAL
# =========================================================

@router.patch(
    "/quizzes/{quiz_id}/time-settings",
    response_model=QuizTimeResponse,
)
def update_quiz_time_settings(
    quiz_id: int,

    payload: QuizTimeUpdateRequest,

    database: Session = Depends(
        get_db
    ),
):
    """
    Mengatur waktu kuis berdasarkan
    menit per soal.

    Contoh:

    minutes_per_question = 3

    Jika terdapat:
    - 1 soal  -> total 3 menit
    - 5 soal  -> total 15 menit
    - 10 soal -> total 30 menit

    Nilai total kemudian disimpan ke
    Quiz.duration_seconds.
    """

    quiz = get_quiz_or_404(
        database,
        quiz_id,
    )


    # =====================================================
    # HITUNG SOAL AKTIF
    # =====================================================

    active_questions = (
        count_active_questions(
            database,
            quiz.id,
        )
    )


    if active_questions <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Kuis belum memiliki soal aktif. "
                "Tambahkan minimal satu soal "
                "terlebih dahulu."
            ),
        )


    # =====================================================
    # MENIT PER SOAL -> DETIK
    # =====================================================

    seconds_per_question = round(
        payload.minutes_per_question
        * 60
    )


    # =====================================================
    # TOTAL DURASI
    # =====================================================

    total_duration_seconds = (
        active_questions
        * seconds_per_question
    )


    # =====================================================
    # SIMPAN KE SQLITE
    # =====================================================

    quiz.duration_seconds = (
        total_duration_seconds
    )


    database.add(
        quiz
    )

    database.commit()

    database.refresh(
        quiz
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return QuizTimeResponse(
        quiz_id=quiz.id,

        quiz_title=quiz.title,

        active_questions=(
            active_questions
        ),

        minutes_per_question=(
            payload.minutes_per_question
        ),

        seconds_per_question=(
            seconds_per_question
        ),

        total_duration_seconds=(
            quiz.duration_seconds
        ),

        total_duration_minutes=round(
            quiz.duration_seconds
            / 60,
            2,
        ),

        message=(
            "Pengaturan waktu kuis "
            "berhasil diperbarui."
        ),
    )


# =========================================================
# SET CEPAT 3 MENIT PER SOAL
# =========================================================

@router.patch(
    "/quizzes/{quiz_id}/time-settings/3-minutes",
    response_model=QuizTimeResponse,
)
def set_three_minutes_per_question(
    quiz_id: int,

    database: Session = Depends(
        get_db
    ),
):
    """
    Tombol cepat untuk mengatur
    setiap soal = 3 menit.
    """

    quiz = get_quiz_or_404(
        database,
        quiz_id,
    )


    active_questions = (
        count_active_questions(
            database,
            quiz.id,
        )
    )


    if active_questions <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Kuis belum memiliki soal aktif."
            ),
        )


    seconds_per_question = 180


    total_duration_seconds = (
        active_questions
        * seconds_per_question
    )


    quiz.duration_seconds = (
        total_duration_seconds
    )


    database.add(
        quiz
    )

    database.commit()

    database.refresh(
        quiz
    )


    return QuizTimeResponse(
        quiz_id=quiz.id,

        quiz_title=quiz.title,

        active_questions=(
            active_questions
        ),

        minutes_per_question=3,

        seconds_per_question=180,

        total_duration_seconds=(
            quiz.duration_seconds
        ),

        total_duration_minutes=round(
            quiz.duration_seconds
            / 60,
            2,
        ),

        message=(
            "Waktu berhasil diatur "
            "menjadi 3 menit per soal."
        ),
    )