import os
import requests
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent

# Load .env
for env_file_path in [
    BACKEND_DIR / ".env",
    BACKEND_DIR / "backend" / ".env",
    Path("/app/.env"),
    Path.cwd() / ".env",
]:
    if env_file_path.exists():
        load_dotenv(env_file_path, override=True)

groq_key = os.getenv("GROQ_API_KEY", "").strip()

print("=" * 60)
print("  VERTEXAR GROQ AI CONNECTIVITY TEST")
print("=" * 60)
print(f"GROQ_API_KEY : {'TERSEDIA (len ' + str(len(groq_key)) + ')' if groq_key else 'KOSONG / TIDAK DITEMUKAN'}")

if groq_key:
    candidate_models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
    for model_name in candidate_models:
        print(f"\nMenguji Groq API dengan model: '{model_name}'...")
        try:
            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": "Kamu adalah AI VertexAR asisten matematika."},
                        {"role": "user", "content": "Berapakah rumus volume kubus?"}
                    ],
                    "max_tokens": 100,
                },
                timeout=10,
            )
            print(f"HTTP Status: {resp.status_code}")
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                print(f"SUKSES GROQ ({model_name}):\n{content.strip()}")
                break
            else:
                print(f"GAGAL GROQ ({model_name}): {resp.text}")
        except Exception as e:
            print(f"ERROR: {e}")

print("=" * 60)
