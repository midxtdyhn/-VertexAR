from app.database import SessionLocal
from app.models import Quiz, Question

def seed_database():
    with SessionLocal() as db:
        # 1. Pastikan Kuis Kategori Utama Ada
        quiz = db.query(Quiz).first()
        if not quiz:
            quiz = Quiz(
                title="Latihan Bangun Ruang Interaktif",
                description="Uji pemahamanmu tentang bangun ruang sisi datar dan sisi lengkung.",
                duration_seconds=600,
                is_active=True,
            )
            db.add(quiz)
            db.commit()
            db.refresh(quiz)

        # 2. Hapus soal lama jika ada agar bersih
        db.query(Question).filter(Question.quiz_id == quiz.id).delete()
        db.commit()

        # 3. Data Soal Latihan Bangun Ruang SMP
        sample_questions = [
            {
                "prompt": "Sebuah kubus memiliki panjang rusuk 6 cm. Berapakah volume kubus tersebut?",
                "option_a": "36 cm³",
                "option_b": "108 cm³",
                "option_c": "216 cm³",
                "option_d": "256 cm³",
                "correct_option": "C",
                "explanation": "Volume Kubus = s³ = 6 cm × 6 cm × 6 cm = 216 cm³.",
                "order": 1
            },
            {
                "prompt": "Sebuah balok memiliki ukuran panjang 10 cm, lebar 5 cm, dan tinggi 4 cm. Luas permukaan balok tersebut adalah...",
                "option_a": "110 cm²",
                "option_b": "220 cm²",
                "option_c": "200 cm²",
                "option_d": "440 cm²",
                "correct_option": "B",
                "explanation": "Luas Permukaan Balok = 2 × (pl + pt + lt) = 2 × (10×5 + 10×4 + 5×4) = 2 × (50 + 40 + 20) = 2 × 110 = 220 cm².",
                "order": 2
            },
            {
                "prompt": "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm (menggunakan π = 22/7). Berapakah volume tabung tersebut?",
                "option_a": "1.540 cm³",
                "option_b": "1.440 cm³",
                "option_c": "770 cm³",
                "option_d": "3.080 cm³",
                "correct_option": "A",
                "explanation": "Volume Tabung = π × r² × t = (22/7) × 7 × 7 × 10 = 22 × 7 × 10 = 1.540 cm³.",
                "order": 3
            },
            {
                "prompt": "Sebuah bola memiliki jari-jari 21 cm. Berapakah luas permukaan bola tersebut (menggunakan π = 22/7)?",
                "option_a": "1.386 cm²",
                "option_b": "2.772 cm²",
                "option_c": "5.544 cm²",
                "option_d": "38.808 cm²",
                "correct_option": "C",
                "explanation": "Luas Permukaan Bola = 4 × π × r² = 4 × (22/7) × 21 × 21 = 4 × 22 × 3 × 21 = 5.544 cm².",
                "order": 4
            },
            {
                "prompt": "Suatu kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Berapakah panjang garis pelukis (s) kerucut tersebut?",
                "option_a": "10 cm",
                "option_b": "12 cm",
                "option_c": "14 cm",
                "option_d": "16 cm",
                "correct_option": "A",
                "explanation": "Panjang garis pelukis (s) = √(r² + t²) = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.",
                "order": 5
            }
        ]

        for q in sample_questions:
            question = Question(
                quiz_id=quiz.id,
                prompt=q["prompt"],
                option_a=q["option_a"],
                option_b=q["option_b"],
                option_c=q["option_c"],
                option_d=q["option_d"],
                correct_option=q["correct_option"],
                explanation=q["explanation"],
                order=q["order"],
                is_active=True
            )
            db.add(question)

        db.commit()
        print(f"Berhasil menambahkan {len(sample_questions)} soal ke database '{quiz.title}'!")

if __name__ == "__main__":
    seed_database()
