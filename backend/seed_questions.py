from app.database import SessionLocal
from app.models import Quiz, Question

def seed_database():
    try:
        with SessionLocal() as db:
            # 1. Pastikan Kuis Kategori Utama Ada
            quiz = db.query(Quiz).first()
            if not quiz:
                quiz = Quiz(
                    title="Latihan Bangun Ruang Interaktif",
                    description="Uji pemahamanmu tentang bangun ruang sisi datar dan sisi lengkung.",
                    duration_seconds=900,
                    is_active=True,
                )
                db.add(quiz)
                db.commit()
                db.refresh(quiz)
            else:
                quiz.duration_seconds = 900
                db.commit()

            # 2. Hapus semua soal lama agar bersih dan ter-reset sempurna
            db.query(Question).filter(Question.quiz_id == quiz.id).delete()
            db.commit()

            # 3. Data Soal Latihan Sesuai Gambar Lampiran (1-5 Lengkap dengan Gambar & Pembahasan)
            sample_questions = [
                {
                    "prompt": "Sebuah balok memiliki panjang 5 cm, lebar 2 cm, dan tinggi 1 cm. Berapakah volume balok tersebut?",
                    "image_url": "/uploads/no1.jpeg",
                    "option_a": "5 cm³",
                    "option_b": "8 cm³",
                    "option_c": "10 cm³",
                    "option_d": "15 cm³",
                    "correct_option": "C",
                    "explanation": "V = p × l × t = 5 × 2 × 1 = 10 cm³",
                    "order": 1
                },
                {
                    "prompt": "Sebuah prisma segitiga memiliki alas berbentuk segitiga siku-siku dengan panjang alas 10 m dan tinggi 8 m. Jika panjang prisma 15 m, berapakah volume prisma segitiga tersebut?",
                    "image_url": "/uploads/no2.jpeg",
                    "option_a": "300 m³",
                    "option_b": "450 m³",
                    "option_c": "600 m³",
                    "option_d": "750 m³",
                    "correct_option": "C",
                    "explanation": "V = ½ × a × t × p = ½ × 10 × 8 × 15 = 600 m³",
                    "order": 2
                },
                {
                    "prompt": "Sebuah balok memiliki panjang 9 cm, lebar 6 cm, dan tinggi 3 cm. Berapakah volume balok tersebut?",
                    "image_url": "/uploads/no3.jpeg",
                    "option_a": "108 cm³",
                    "option_b": "126 cm³",
                    "option_c": "162 cm³",
                    "option_d": "216 cm³",
                    "correct_option": "C",
                    "explanation": "V = p × l × t = 9 × 6 × 3 = 162 cm³",
                    "order": 3
                },
                {
                    "prompt": "Sebuah bola memiliki diameter 8,4 meter. Berapakah luas permukaan bola tersebut? (Gunakan π = 22/7)",
                    "image_url": "/uploads/no4.jpeg",
                    "option_a": "110,88 m²",
                    "option_b": "176,64 m²",
                    "option_c": "221,76 m²",
                    "option_d": "443,52 m²",
                    "correct_option": "C",
                    "explanation": "r = 8,4 ÷ 2 = 4,2 m\nL = 4πr² = 4 × 22/7 × 4,2² = 221,76 m²",
                    "order": 4
                },
                {
                    "prompt": "Sebuah kerucut memiliki jari-jari alas 6 cm dan panjang garis pelukis 8 cm. Berapakah luas selimut kerucut tersebut? (Gunakan π = 3,14)",
                    "image_url": "/uploads/no5.jpeg",
                    "option_a": "113,04 cm²",
                    "option_b": "150,72 cm²",
                    "option_c": "175,84 cm²",
                    "option_d": "301,44 cm²",
                    "correct_option": "B",
                    "explanation": "L = π × r × s = 3,14 × 6 × 8 = 150,72 cm²",
                    "order": 5
                }
            ]

            for q in sample_questions:
                question = Question(
                    quiz_id=quiz.id,
                    prompt=q["prompt"],
                    image_url=q["image_url"],
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
            print("Berhasil mereset 5 soal sesuai persis dengan gambar lampiran!")
    except Exception as err:
        print(f"Informasi seed: {err}")

if __name__ == "__main__":
    seed_database()
