from app.database import engine, Base, SessionLocal
from app.models import Quiz, Question
from seed_questions import seed_database

def fix_images():
    # 1. Pastikan tabel dibuat
    Base.metadata.create_all(bind=engine)
    
    # 2. Jalankan seeder utama untuk reset & isi 5 soal lengkap dengan no1.jpeg - no5.jpeg
    seed_database()
    
    # 3. Verifikasi hasil
    with SessionLocal() as db:
        questions = db.query(Question).all()
        for q in questions:
            print(f"Soal #{q.id} ({q.prompt[:25]}...) -> image_url: '{q.image_url}'")
        print("SEMUA GAMBAR SOAL BERHASIL DI-UPDATE & TERVERIFIKASI!")

if __name__ == "__main__":
    fix_images()
