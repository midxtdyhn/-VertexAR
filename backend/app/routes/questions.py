from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import UPLOAD_DIRECTORY
from app.database import get_db
from app.models import Question, Quiz
from app.schemas import QuestionResponse


router = APIRouter(
    tags=["Soal latihan"],
)


ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024


def validate_correct_option(
    correct_option: str,
) -> str:
    normalized_option = correct_option.strip().upper()

    if normalized_option not in {
        "A",
        "B",
        "C",
        "D",
    }:
        raise HTTPException(
            status_code=422,
            detail=(
                "Jawaban benar hanya boleh "
                "A, B, C, atau D."
            ),
        )

    return normalized_option


def delete_local_image(
    image_url: str | None,
) -> None:
    if not image_url:
        return

    filename = Path(image_url).name
    file_path = UPLOAD_DIRECTORY / filename

    if file_path.exists() and file_path.is_file():
        file_path.unlink()


async def save_question_image(
    image: UploadFile,
) -> str:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=422,
            detail=(
                "Format gambar harus JPG, PNG, "
                "atau WEBP."
            ),
        )

    contents = await image.read(
        MAX_IMAGE_SIZE + 1
    )

    await image.close()

    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=422,
            detail="Ukuran gambar maksimal 5 MB.",
        )

    if not contents:
        raise HTTPException(
            status_code=422,
            detail="File gambar kosong.",
        )

    extension = ALLOWED_IMAGE_TYPES[
        image.content_type
    ]

    filename = (
        f"question-{uuid4().hex}{extension}"
    )

    file_path = UPLOAD_DIRECTORY / filename

    file_path.write_bytes(contents)

    return f"/uploads/{filename}"


@router.get(
    "/api/quizzes/{quiz_id}/questions",
    response_model=list[QuestionResponse],
)
def list_questions(
    quiz_id: int,
    include_inactive: bool = False,
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

    statement = select(Question).where(
        Question.quiz_id == quiz_id
    )

    if not include_inactive:
        statement = statement.where(
            Question.is_active.is_(True)
        )

    statement = statement.order_by(
        Question.order.asc(),
        Question.id.asc(),
    )

    return list(
        database.scalars(statement).all()
    )


@router.get(
    "/api/questions/{question_id}",
    response_model=QuestionResponse,
)
def get_question(
    question_id: int,
    database: Session = Depends(get_db),
):
    question = database.get(
        Question,
        question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Soal tidak ditemukan.",
        )

    return question


@router.post(
    "/api/quizzes/{quiz_id}/questions",
    response_model=QuestionResponse,
    status_code=201,
)
async def create_question(
    quiz_id: int,
    prompt: str = Form(...),
    option_a: str = Form(...),
    option_b: str = Form(...),
    option_c: str = Form(...),
    option_d: str = Form(...),
    correct_option: str = Form(...),
    explanation: str | None = Form(None),
    order: int = Form(1, ge=1),
    is_active: bool = Form(True),
    image: UploadFile | None = File(None),
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

    normalized_correct_option = (
        validate_correct_option(
            correct_option
        )
    )

    clean_prompt = prompt.strip()
    clean_option_a = option_a.strip()
    clean_option_b = option_b.strip()
    clean_option_c = option_c.strip()
    clean_option_d = option_d.strip()

    if not clean_prompt:
        raise HTTPException(
            status_code=422,
            detail="Pertanyaan tidak boleh kosong.",
        )

    if not all(
        [
            clean_option_a,
            clean_option_b,
            clean_option_c,
            clean_option_d,
        ]
    ):
        raise HTTPException(
            status_code=422,
            detail=(
                "Pilihan A, B, C, dan D "
                "wajib diisi."
            ),
        )

    image_url = None

    if image is not None:
        image_url = await save_question_image(
            image
        )

    question = Question(
        quiz_id=quiz_id,
        prompt=clean_prompt,
        image_url=image_url,
        option_a=clean_option_a,
        option_b=clean_option_b,
        option_c=clean_option_c,
        option_d=clean_option_d,
        correct_option=normalized_correct_option,
        explanation=(
            explanation.strip()
            if explanation
            else None
        ),
        order=order,
        is_active=is_active,
    )

    database.add(question)
    database.commit()
    database.refresh(question)

    return question


@router.put(
    "/api/questions/{question_id}",
    response_model=QuestionResponse,
)
async def update_question(
    question_id: int,
    prompt: str | None = Form(None),
    option_a: str | None = Form(None),
    option_b: str | None = Form(None),
    option_c: str | None = Form(None),
    option_d: str | None = Form(None),
    correct_option: str | None = Form(None),
    explanation: str | None = Form(None),
    order: int | None = Form(None, ge=1),
    is_active: bool | None = Form(None),
    remove_image: bool = Form(False),
    image: UploadFile | None = File(None),
    database: Session = Depends(get_db),
):
    question = database.get(
        Question,
        question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Soal tidak ditemukan.",
        )

    if prompt is not None:
        clean_prompt = prompt.strip()

        if not clean_prompt:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Pertanyaan tidak boleh kosong."
                ),
            )

        question.prompt = clean_prompt

    option_fields = {
        "option_a": option_a,
        "option_b": option_b,
        "option_c": option_c,
        "option_d": option_d,
    }

    for field_name, field_value in option_fields.items():
        if field_value is None:
            continue

        clean_value = field_value.strip()

        if not clean_value:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"{field_name} tidak boleh kosong."
                ),
            )

        setattr(
            question,
            field_name,
            clean_value,
        )

    if correct_option is not None:
        question.correct_option = (
            validate_correct_option(
                correct_option
            )
        )

    if explanation is not None:
        question.explanation = (
            explanation.strip() or None
        )

    if order is not None:
        question.order = order

    if is_active is not None:
        question.is_active = is_active

    if remove_image:
        delete_local_image(
            question.image_url
        )

        question.image_url = None

    if image is not None:
        new_image_url = await save_question_image(
            image
        )

        delete_local_image(
            question.image_url
        )

        question.image_url = new_image_url

    database.commit()
    database.refresh(question)

    return question


@router.delete(
    "/api/questions/{question_id}",
)
def delete_question(
    question_id: int,
    database: Session = Depends(get_db),
):
    question = database.get(
        Question,
        question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Soal tidak ditemukan.",
        )

    delete_local_image(
        question.image_url
    )

    database.delete(question)
    database.commit()

    return {
        "status": "success",
        "message": "Soal berhasil dihapus.",
        "question_id": question_id,
    }