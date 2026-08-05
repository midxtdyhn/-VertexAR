from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Question, Quiz
from app.schemas import QuizResponse, QuizUpdate


router = APIRouter(
    prefix="/api/quizzes",
    tags=["Konfigurasi latihan"],
)


def quiz_to_response(
    quiz: Quiz,
    question_count: int,
) -> QuizResponse:
    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        description=quiz.description,
        duration_seconds=quiz.duration_seconds,
        is_active=quiz.is_active,
        question_count=question_count,
        created_at=quiz.created_at,
        updated_at=quiz.updated_at,
    )


def count_active_questions(
    database: Session,
    quiz_id: int,
) -> int:
    statement = select(
        func.count(Question.id)
    ).where(
        Question.quiz_id == quiz_id,
        Question.is_active.is_(True),
    )

    return database.scalar(statement) or 0


@router.get(
    "/active",
    response_model=QuizResponse,
)
def get_active_quiz(
    database: Session = Depends(get_db),
):
    statement = (
        select(Quiz)
        .where(Quiz.is_active.is_(True))
        .order_by(Quiz.id.asc())
    )

    quiz = database.scalar(statement)

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail="Belum ada latihan yang aktif.",
        )

    question_count = count_active_questions(
        database,
        quiz.id,
    )

    return quiz_to_response(
        quiz,
        question_count,
    )


@router.get(
    "/{quiz_id}",
    response_model=QuizResponse,
)
def get_quiz(
    quiz_id: int,
    database: Session = Depends(get_db),
):
    quiz = database.get(
        Quiz,
        quiz_id,
    )

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail="Latihan tidak ditemukan.",
        )

    question_count = count_active_questions(
        database,
        quiz.id,
    )

    return quiz_to_response(
        quiz,
        question_count,
    )


@router.patch(
    "/{quiz_id}",
    response_model=QuizResponse,
)
def update_quiz(
    quiz_id: int,
    payload: QuizUpdate,
    database: Session = Depends(get_db),
):
    quiz = database.get(Quiz, quiz_id)

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail="Latihan tidak ditemukan.",
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field_name, value in update_data.items():
        setattr(quiz, field_name, value)

    database.commit()
    database.refresh(quiz)

    question_count = count_active_questions(
        database,
        quiz.id,
    )

    return quiz_to_response(
        quiz,
        question_count,
    )