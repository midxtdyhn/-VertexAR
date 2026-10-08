from sqlalchemy import text
from app.database import engine, SessionLocal
from app.models import Question

def fix_images():
    with SessionLocal() as db:
        questions = db.query(Question).all()
        for q in questions:
            img_path = f"/uploads/no{q.id if q.id <= 5 else 1}.jpeg"
            q.image_url = img_path
            print(f"Soal #{q.id} ({q.prompt[:25]}...) -> {q.image_url}")
        db.commit()
        print("SEMUA GAMBAR SOAL BERHASIL DI-UPDATE!")

if __name__ == "__main__":
    fix_images()
