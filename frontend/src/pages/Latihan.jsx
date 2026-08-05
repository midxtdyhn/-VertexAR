import { useNavigate } from "react-router-dom";
import { BookOpenCheck, Play } from "lucide-react";

import Footer from "../components/layout/Footer";

function Latihan() {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/latihan/quiz");
  };

  const handleOpenMaterial = () => {
    navigate("/bangun-ruang");
  };

  return (
    <>

      <main className="vertex-quiz-intro-page">
        <section className="vertex-quiz-intro-card">
          <div className="vertex-quiz-intro-icon">
            <BookOpenCheck
              size={76}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div className="vertex-quiz-intro-content">
            <p className="vertex-quiz-intro-label">
              LATIHAN BANGUN RUANG
            </p>

            <h1>
              Latihan Interaktif
              <br />
              Sudah Siap
            </h1>

            <p className="vertex-quiz-intro-description">
              Uji pemahamanmu mengenai materi bangun ruang melalui latihan
              pilihan ganda yang dilengkapi timer, gambar soal, hasil, dan
              pembahasan.
            </p>

            <div className="vertex-quiz-intro-actions">
              <button
                type="button"
                className="vertex-quiz-start-button"
                onClick={handleStartQuiz}
              >
                <Play
                  size={20}
                  fill="currentColor"
                  aria-hidden="true"
                />

                <span>Mulai Latihan</span>
              </button>

              <button
                type="button"
                className="vertex-quiz-material-button"
                onClick={handleOpenMaterial}
              >
                Pelajari Materi
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Latihan;