import asyncio
import logging

from fastapi import (
    APIRouter,
    HTTPException,
)

from app.schemas import (
    AiChatRequest,
    AiChatResponse,
)
from app.services.gemini_service import (
    GeminiConfigurationError,
    GeminiResponseError,
    generate_vertexar_answer,
    get_gemini_model,
)


logger = logging.getLogger(
    __name__
)


router = APIRouter(
    prefix="/api/ai",
    tags=["AI VertexAR"],
)


# =========================================================
# HEALTH CHECK AI
# =========================================================

@router.get("/health")
def ai_health_check():
    return {
        "status": "ready",
        "service": "AI VertexAR",
        "model": get_gemini_model(),
    }


# =========================================================
# CHAT DENGAN AI VERTEXAR
# =========================================================

@router.options("/chat")
def options_ai_chat():
    return {}


@router.post(
    "/chat",
    response_model=AiChatResponse,
)
async def chat_with_vertexar(
    payload: AiChatRequest,
):
    history = [
        history_item.model_dump()
        for history_item in payload.history
    ]

    try:
        answer = await asyncio.to_thread(
            generate_vertexar_answer,
            payload.message,
            history,
        )

        return AiChatResponse(
            answer=answer,
            model=get_gemini_model(),
        )

    except Exception as error:
        logger.exception(
            "Terjadi kesalahan saat menghubungi AI service: %s", error
        )
        return AiChatResponse(
            answer=(
                "Halo! Asisten AI VertexAR saat ini sedang dalam proses pemeliharaan koneksi. "
                "Silakan coba tanyakan kembali beberapa saat lagi."
            ),
            model="VertexAR Assistant",
        )