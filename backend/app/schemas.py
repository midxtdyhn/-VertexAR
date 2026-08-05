from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# QUIZ
# =========================================================


class QuizUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    duration_seconds: int | None = Field(
        default=None,
        ge=10,
        le=7200,
    )

    is_active: bool | None = None


class QuizResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    title: str
    description: str | None
    duration_seconds: int
    is_active: bool
    question_count: int = 0
    created_at: datetime
    updated_at: datetime


# =========================================================
# QUESTION
# =========================================================


class QuestionResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    quiz_id: int

    prompt: str
    image_url: str | None

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_option: str
    explanation: str | None

    order: int
    is_active: bool

    created_at: datetime
    updated_at: datetime


# =========================================================
# MENYIMPAN JAWABAN
# =========================================================


class AnswerSaveRequest(BaseModel):
    selected_option: Literal[
        "A",
        "B",
        "C",
        "D",
    ]


class AnswerSaveResponse(BaseModel):
    status: str

    attempt_id: str | int
    question_id: int

    selected_option: str
    answered_at: datetime


# =========================================================
# MEMULAI ATTEMPT / PENGERJAAN KUIS
# =========================================================


class AttemptStartResponse(BaseModel):
    id: str | int
    quiz_id: int

    started_at: datetime
    ends_at: datetime

    status: str
    total_questions: int
    duration_seconds: int


# =========================================================
# STATUS ATTEMPT
# =========================================================


class AttemptStatusResponse(BaseModel):
    id: str | int
    quiz_id: int

    started_at: datetime
    ends_at: datetime
    submitted_at: datetime | None

    status: str
    remaining_seconds: int
    total_questions: int

    saved_answers: dict[int, str]


# =========================================================
# DETAIL HASIL PER SOAL
# =========================================================


class AttemptResultItem(BaseModel):
    question_id: int
    question_number: int

    prompt: str

    selected_option: str | None
    correct_option: str

    is_correct: bool | None
    explanation: str | None


# =========================================================
# HASIL AKHIR ATTEMPT
# =========================================================


class AttemptResultResponse(BaseModel):
    attempt_id: str | int
    quiz_id: int

    status: str
    score: int

    total_questions: int
    correct_count: int
    wrong_count: int
    unanswered_count: int

    started_at: datetime
    ends_at: datetime
    submitted_at: datetime | None

    results: list[AttemptResultItem]

# =========================================================
# AI VERTEXAR
# =========================================================


class AiChatHistoryItem(BaseModel):
    role: Literal[
        "user",
        "assistant",
    ]

    content: str = Field(
        min_length=1,
        max_length=5000,
    )


class AiChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=3000,
    )

    history: list[
        AiChatHistoryItem
    ] = Field(
        default_factory=list,
        max_length=20,
    )


class AiChatResponse(BaseModel):
    answer: str
    model: str