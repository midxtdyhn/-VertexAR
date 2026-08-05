import os

from dotenv import load_dotenv
from google import genai


# Membaca file backend/.env
load_dotenv()


api_key = os.getenv(
    "GEMINI_API_KEY"
)

model_name = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash",
)


if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY belum terbaca dari file .env"
    )


client = genai.Client(
    api_key=api_key
)


try:
    response = client.models.generate_content(
        model=model_name,
        contents=(
            "Jawab menggunakan bahasa Indonesia. "
            "Jelaskan secara singkat apa itu kubus "
            "untuk siswa SMP."
        ),
    )

    print("\n=== MODEL YANG DIGUNAKAN ===\n")
    print(model_name)

    print("\n=== RESPONS GEMINI ===\n")
    print(response.text)

except Exception as error:
    print("\n=== TERJADI ERROR ===\n")
    print(type(error).__name__)
    print(error)