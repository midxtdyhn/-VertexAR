import { useEffect, useMemo, useState } from "react";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

import {
  getActiveQuiz,
  getImageUrl,
  getQuizQuestions,
} from "../services/quizApi";

import "./Quiz.css";

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function QuizPageLayout({ children }) {
  return (
    <>

      <main className="vertex-quiz-page">
        {children}
      </main>

      <Footer />
    </>
  );
}

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFinished, setIsFinished] = useState(false);
  const [showResultModal, setShowResultModal] =
    useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    let componentIsMounted = true;

    async function loadQuiz() {
      try {
        setLoading(true);
        setError("");

        const activeQuiz = await getActiveQuiz();

        const quizQuestions = await getQuizQuestions(
          activeQuiz.id
        );

        if (!componentIsMounted) {
          return;
        }

        setQuiz(activeQuiz);
        setQuestions(quizQuestions);
        setTimeLeft(activeQuiz.duration_seconds);
      } catch (requestError) {
        if (!componentIsMounted) {
          return;
        }

        setError(
          requestError.message ||
            "Data latihan gagal dimuat."
        );
      } finally {
        if (componentIsMounted) {
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      componentIsMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      loading ||
      !quiz ||
      questions.length === 0 ||
      isFinished
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) =>
        Math.max(previousTime - 1, 0)
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    loading,
    quiz,
    questions.length,
    isFinished,
  ]);

  useEffect(() => {
    if (
      !loading &&
      quiz &&
      questions.length > 0 &&
      timeLeft === 0 &&
      !isFinished
    ) {
      setIsFinished(true);
      setShowResultModal(true);
    }
  }, [
    loading,
    quiz,
    questions.length,
    timeLeft,
    isFinished,
  ]);

  const currentQuestion =
    questions[currentIndex] || null;

  const resultItems = useMemo(() => {
    return questions.map((question) => {
      const selectedOption = answers[question.id];

      if (!selectedOption) {
        return {
          questionId: question.id,
          status: "unanswered",
        };
      }

      return {
        questionId: question.id,
        status:
          selectedOption === question.correct_option
            ? "correct"
            : "wrong",
      };
    });
  }, [questions, answers]);

  const correctCount = resultItems.filter(
    (item) => item.status === "correct"
  ).length;

  const wrongCount = resultItems.filter(
    (item) => item.status === "wrong"
  ).length;

  const unansweredCount = resultItems.filter(
    (item) => item.status === "unanswered"
  ).length;

  function selectAnswer(optionKey) {
    if (
      !currentQuestion ||
      isFinished ||
      reviewMode
    ) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: optionKey,
    }));
  }

  function goToPreviousQuestion() {
    setCurrentIndex((previousIndex) =>
      Math.max(previousIndex - 1, 0)
    );
  }

  function goToNextQuestion() {
    setCurrentIndex((previousIndex) =>
      Math.min(
        previousIndex + 1,
        questions.length - 1
      )
    );
  }

  function goToQuestion(questionIndex) {
    setCurrentIndex(questionIndex);
  }

  function finishQuiz() {
    setIsFinished(true);
    setShowResultModal(true);
  }

  function handleFinishButton() {
    if (isFinished) {
      setShowResultModal(true);
      return;
    }

    finishQuiz();
  }

  function openReview() {
    setReviewMode(true);
    setShowResultModal(false);
    setCurrentIndex(0);
  }

  function openQuestionReview(questionIndex) {
    setCurrentIndex(questionIndex);
    setReviewMode(true);
    setShowResultModal(false);
  }

  function getProgressClass(question, index) {
    const classNames = [
      "vertex-quiz-progress-item",
    ];

    if (index === currentIndex) {
      classNames.push("is-current");
    }

    if (answers[question.id]) {
      classNames.push("is-answered");
    }

    if (reviewMode) {
      const result = resultItems[index];

      if (result?.status === "correct") {
        classNames.push("is-correct");
      }

      if (result?.status === "wrong") {
        classNames.push("is-wrong");
      }

      if (result?.status === "unanswered") {
        classNames.push("is-unanswered");
      }
    }

    return classNames.join(" ");
  }

  function getOptionClass(optionKey) {
    if (!currentQuestion) {
      return "";
    }

    const selectedOption =
      answers[currentQuestion.id];

    if (reviewMode) {
      if (
        optionKey === currentQuestion.correct_option
      ) {
        return "is-correct";
      }

      if (
        selectedOption === optionKey &&
        optionKey !== currentQuestion.correct_option
      ) {
        return "is-wrong";
      }

      return "";
    }

    if (selectedOption === optionKey) {
      return "is-selected";
    }

    return "";
  }

  if (loading) {
    return (
      <QuizPageLayout>
        <section className="vertex-quiz-status-card">
          <div className="vertex-quiz-spinner" />

          <p>Memuat latihan...</p>
        </section>
      </QuizPageLayout>
    );
  }

  if (error) {
    return (
      <QuizPageLayout>
        <section className="vertex-quiz-status-card">
          <h2>Latihan belum dapat dibuka</h2>

          <p>{error}</p>

          <p>
            Pastikan backend FastAPI masih berjalan
            pada port 8000.
          </p>
        </section>
      </QuizPageLayout>
    );
  }

  if (!currentQuestion) {
    return (
      <QuizPageLayout>
        <section className="vertex-quiz-status-card">
          <h2>Belum ada soal</h2>

          <p>
            Tambahkan soal terlebih dahulu melalui
            Swagger FastAPI.
          </p>
        </section>
      </QuizPageLayout>
    );
  }

  const options = [
    {
      key: "A",
      text: currentQuestion.option_a,
    },
    {
      key: "B",
      text: currentQuestion.option_b,
    },
    {
      key: "C",
      text: currentQuestion.option_c,
    },
    {
      key: "D",
      text: currentQuestion.option_d,
    },
  ];

  return (
    <QuizPageLayout>
      <section className="vertex-quiz-card">
        <div className="vertex-quiz-finish-row">
          <button
            type="button"
            className="vertex-quiz-finish-button"
            onClick={handleFinishButton}
          >
            {isFinished ? "Lihat Hasil" : "Selesai"}
          </button>
        </div>

        <div className="vertex-quiz-info-row">
          <h2>No {currentIndex + 1}</h2>

          <div
            className={`vertex-quiz-timer ${
              timeLeft <= 30 ? "is-warning" : ""
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="vertex-quiz-progress">
          {questions.map((question, index) => (
            <button
              key={question.id}
              type="button"
              aria-label={`Buka soal nomor ${
                index + 1
              }`}
              aria-current={
                index === currentIndex
                  ? "true"
                  : undefined
              }
              className={getProgressClass(
                question,
                index
              )}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div
          className={`vertex-quiz-question ${
            currentQuestion.image_url
              ? "has-image"
              : "without-image"
          }`}
        >
          <div className="vertex-quiz-question-text">
            <p>{currentQuestion.prompt}</p>
          </div>

          {currentQuestion.image_url && (
            <div className="vertex-quiz-image-wrapper">
              <img
                src={getImageUrl(
                  currentQuestion.image_url
                )}
                alt={`Gambar soal nomor ${
                  currentIndex + 1
                }`}
                className="vertex-quiz-image"
              />
            </div>
          )}
        </div>

        <p className="vertex-quiz-answer-label">
          Pilih jawabanmu
        </p>

        <div className="vertex-quiz-options">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`vertex-quiz-option ${getOptionClass(
                option.key
              )}`}
              onClick={() =>
                selectAnswer(option.key)
              }
              disabled={reviewMode || isFinished}
            >
              <span className="vertex-quiz-option-key">
                {option.key}.
              </span>

              <span>{option.text}</span>
            </button>
          ))}
        </div>

        <div className="vertex-quiz-navigation">
          <button
            type="button"
            className="vertex-quiz-navigation-button"
            onClick={goToPreviousQuestion}
            disabled={currentIndex === 0}
          >
            <span className="vertex-quiz-arrow">
              ‹
            </span>

            <span>Back</span>
          </button>

          <button
            type="button"
            className="vertex-quiz-navigation-button"
            onClick={goToNextQuestion}
            disabled={
              currentIndex === questions.length - 1
            }
          >
            <span>Next</span>

            <span className="vertex-quiz-arrow">
              ›
            </span>
          </button>
        </div>
      </section>

      {reviewMode && (
        <section className="vertex-quiz-explanation">
          <h3>Pembahasan :</h3>

          <p>
            {currentQuestion.explanation ||
              "Belum ada pembahasan untuk soal ini."}
          </p>
        </section>
      )}
        <div className="vertex-quiz-back-menu">
        <Link
            to="/latihan"
            className="vertex-quiz-back-menu-button"
        >
            <span className="vertex-quiz-back-menu-icon">
            ‹
            </span>

            <span>Kembali ke Menu Latihan</span>
        </Link>
        </div>

      {showResultModal && (
        <div
          className="vertex-quiz-modal-overlay"
          role="presentation"
        >
          <div
            className="vertex-quiz-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-result-title"
          >
            <button
              type="button"
              className="vertex-quiz-modal-close"
              onClick={() =>
                setShowResultModal(false)
              }
              aria-label="Tutup hasil latihan"
            >
              ×
            </button>

            <h2 id="quiz-result-title">
              Quiz sudah selesai
            </h2>

            <div className="vertex-quiz-result-numbers">
              {resultItems.map((result, index) => (
                <button
                  key={result.questionId}
                  type="button"
                  className={`vertex-quiz-result-number is-${result.status}`}
                  onClick={() =>
                    openQuestionReview(index)
                  }
                >
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </button>
              ))}
            </div>

            <div className="vertex-quiz-result-summary">
              <span>
                Benar:{" "}
                <strong>{correctCount}</strong>
              </span>

              <span>
                Salah:{" "}
                <strong>{wrongCount}</strong>
              </span>

              {unansweredCount > 0 && (
                <span>
                  Kosong:{" "}
                  <strong>
                    {unansweredCount}
                  </strong>
                </span>
              )}
            </div>

            <button
              type="button"
              className="vertex-quiz-review-button"
              onClick={openReview}
            >
              Cek Pembahasan
            </button>
          </div>
        </div>
      )}
    </QuizPageLayout>
  );
}

export default Quiz;