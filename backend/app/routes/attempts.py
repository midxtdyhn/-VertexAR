from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attempt, AttemptAnswer, Question, Quiz
from app.schemas import (
    AnswerSaveRequest,
    AnswerSaveResponse,
    AttemptResultItem,
    AttemptResultResponse,
    AttemptStartResponse,
    AttemptStatusResponse,
)

__all__ = ["router"]

router = APIRouter(
    prefix="/api",
    tags=["Pengerjaan Kuis"],
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_datetime(value: datetime) -> datetime:
    """Pastikan datetime dari SQLite dianggap sebagai UTC."""
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


def get_attempt_or_404(
    database: Session,
    attempt_id: str,
) -> Attempt:
    attempt = database.get(Attempt, attempt_id)

    if attempt is None:
        raise HTTPException(
            status_code=404,
            detail="Pengerjaan kuis tidak ditemukan.",
        )

    return attempt


def get_quiz_questions(
    database: Session,
    quiz_id: int,
) -> list[Question]:
    statement = (
        select(Question)
        .where(
            Question.quiz_id == quiz_id,
            Question.is_active.is_(True),
        )
        .order_by(
            Question.order.asc(),
            Question.id.asc(),
        )
    )

    return list(database.scalars(statement).all())


def get_attempt_answers(
    database: Session,
    attempt_id: str,
) -> list[AttemptAnswer]:
    statement = (
        select(AttemptAnswer)
        .where(AttemptAnswer.attempt_id == attempt_id)
        .order_by(AttemptAnswer.id.asc())
    )

    return list(database.scalars(statement).all())


def attempt_has_expired(attempt: Attempt) -> bool:
    return utc_now() >= normalize_datetime(attempt.ends_at)


def calculate_remaining_seconds(attempt: Attempt) -> int:
    if attempt.status != "in_progress":
        return 0

    difference = normalize_datetime(attempt.ends_at) - utc_now()
    return max(0, int(difference.total_seconds()))


def finalize_attempt(
    database: Session,
    attempt: Attempt,
    final_status: str,
) -> AttemptResultResponse:
    questions = get_quiz_questions(database, attempt.quiz_id)
    attempt_answers = get_attempt_answers(database, attempt.id)

    answers_by_question = {
        answer.question_id: answer
        for answer in attempt_answers
    }

    correct_count = 0
    wrong_count = 0
    unanswered_count = 0
    result_items: list[AttemptResultItem] = []

    for question_number, question in enumerate(
        questions,
        start=1,
    ):
        answer = answers_by_question.get(question.id)

        selected_option = (
            answer.selected_option
            if answer is not None
            else None
        )

        if selected_option is None:
            is_correct = None
            unanswered_count += 1
        else:
            is_correct = (
                selected_option == question.correct_option
            )

            if is_correct:
                correct_count += 1
            else:
                wrong_count += 1

        if answer is not None:
            answer.is_correct = is_correct

        result_items.append(
            AttemptResultItem(
                question_id=question.id,
                question_number=question_number,
                prompt=question.prompt,
                selected_option=selected_option,
                correct_option=question.correct_option,
                is_correct=is_correct,
                explanation=question.explanation,
            )
        )

    total_questions = len(questions)

    score = (
        round(correct_count / total_questions * 100)
        if total_questions > 0
        else 0
    )

    attempt.status = final_status
    attempt.score = score
    attempt.total_questions = total_questions
    attempt.correct_count = correct_count
    attempt.wrong_count = wrong_count
    attempt.unanswered_count = unanswered_count

    if attempt.submitted_at is None:
        attempt.submitted_at = utc_now()

    database.commit()
    database.refresh(attempt)

    return AttemptResultResponse(
        attempt_id=attempt.id,
        quiz_id=attempt.quiz_id,
        status=attempt.status,
        score=attempt.score,
        total_questions=attempt.total_questions,
        correct_count=attempt.correct_count,
        wrong_count=attempt.wrong_count,
        unanswered_count=attempt.unanswered_count,
        started_at=attempt.started_at,
        ends_at=attempt.ends_at,
        submitted_at=attempt.submitted_at,
        results=result_items,
    )


@router.post(
    "/quizzes/{quiz_id}/attempts",
    response_model=AttemptStartResponse,
    status_code=201,
)
def start_attempt(
    quiz_id: int,
    database: Session = Depends(get_db),
):
    quiz = database.get(Quiz, quiz_id)

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail="Kuis tidak ditemukan.",
        )

    if not quiz.is_active:
        raise HTTPException(
            status_code=409,
            detail="Kuis sedang tidak aktif.",
        )

    questions = get_quiz_questions(database, quiz.id)

    if not questions:
        raise HTTPException(
            status_code=409,
            detail="Kuis belum memiliki soal aktif.",
        )

    started_at = utc_now()

    attempt = Attempt(
        quiz_id=quiz.id,
        started_at=started_at,
        ends_at=started_at + timedelta(
            seconds=quiz.duration_seconds
        ),
        status="in_progress",
        score=0,
        total_questions=len(questions),
        correct_count=0,
        wrong_count=0,
        unanswered_count=len(questions),
    )

    database.add(attempt)
    database.flush()

    for question in questions:
        database.add(
            AttemptAnswer(
                attempt_id=attempt.id,
                question_id=question.id,
                selected_option=None,
                is_correct=None,
                answered_at=None,
            )
        )

    database.commit()
    database.refresh(attempt)

    return AttemptStartResponse(
        id=attempt.id,
        quiz_id=attempt.quiz_id,
        started_at=attempt.started_at,
        ends_at=attempt.ends_at,
        status=attempt.status,
        total_questions=attempt.total_questions,
        duration_seconds=quiz.duration_seconds,
    )


@router.get(
    "/attempts/{attempt_id}",
    response_model=AttemptStatusResponse,
)
def get_attempt_status(
    attempt_id: str,
    database: Session = Depends(get_db),
):
    attempt = get_attempt_or_404(database, attempt_id)

    if (
        attempt.status == "in_progress"
        and attempt_has_expired(attempt)
    ):
        finalize_attempt(
            database,
            attempt,
            "expired",
        )

    answers = get_attempt_answers(
        database,
        attempt.id,
    )

    saved_answers = {
        answer.question_id: answer.selected_option
        for answer in answers
        if answer.selected_option is not None
    }

    return AttemptStatusResponse(
        id=attempt.id,
        quiz_id=attempt.quiz_id,
        started_at=attempt.started_at,
        ends_at=attempt.ends_at,
        submitted_at=attempt.submitted_at,
        status=attempt.status,
        remaining_seconds=calculate_remaining_seconds(
            attempt
        ),
        total_questions=attempt.total_questions,
        saved_answers=saved_answers,
    )


@router.put(
    "/attempts/{attempt_id}/answers/{question_id}",
    response_model=AnswerSaveResponse,
)
def save_answer(
    attempt_id: str,
    question_id: int,
    payload: AnswerSaveRequest,
    database: Session = Depends(get_db),
):
    attempt = get_attempt_or_404(database, attempt_id)

    if attempt.status != "in_progress":
        raise HTTPException(
            status_code=409,
            detail="Pengerjaan kuis sudah selesai.",
        )

    if attempt_has_expired(attempt):
        finalize_attempt(
            database,
            attempt,
            "expired",
        )

        raise HTTPException(
            status_code=409,
            detail="Waktu kuis sudah habis.",
        )

    question = database.get(Question, question_id)

    if (
        question is None
        or question.quiz_id != attempt.quiz_id
        or not question.is_active
    ):
        raise HTTPException(
            status_code=404,
            detail="Soal tidak ditemukan pada kuis ini.",
        )

    statement = select(AttemptAnswer).where(
        AttemptAnswer.attempt_id == attempt.id,
        AttemptAnswer.question_id == question.id,
    )

    attempt_answer = database.scalar(statement)

    if attempt_answer is None:
        attempt_answer = AttemptAnswer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_option=None,
            is_correct=None,
            answered_at=None,
        )
        database.add(attempt_answer)

    attempt_answer.selected_option = payload.selected_option
    attempt_answer.is_correct = (
        payload.selected_option == question.correct_option
    )
    attempt_answer.answered_at = utc_now()

    database.commit()
    database.refresh(attempt_answer)

    return AnswerSaveResponse(
        status="saved",
        attempt_id=attempt.id,
        question_id=question.id,
        selected_option=attempt_answer.selected_option,
        answered_at=attempt_answer.answered_at,
    )


@router.post(
    "/attempts/{attempt_id}/submit",
    response_model=AttemptResultResponse,
)
def submit_attempt(
    attempt_id: str,
    database: Session = Depends(get_db),
):
    attempt = get_attempt_or_404(database, attempt_id)

    if attempt.status == "submitted":
        return finalize_attempt(
            database,
            attempt,
            "submitted",
        )

    if attempt.status == "expired":
        return finalize_attempt(
            database,
            attempt,
            "expired",
        )

    final_status = (
        "expired"
        if attempt_has_expired(attempt)
        else "submitted"
    )

    return finalize_attempt(
        database,
        attempt,
        final_status,
    )
