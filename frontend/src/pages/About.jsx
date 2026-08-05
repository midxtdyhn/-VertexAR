import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Footer from "../components/layout/Footer";

import heroImage from "../assets/images/hero.png";
import developerImage from "../assets/images/developer.png";

import "./About.css";


const FIRST_TITLE_LINE =
  "FULL STACK";

const SECOND_TITLE_LINE =
  "DEVELOPER";


const websiteFeatures = [
  {
    id: "beranda",
    title: "Beranda",
    description:
      "Menampilkan informasi utama mengenai VertexAR beserta navigasi menuju seluruh fitur website.",
    path: "/",
  },
  {
    id: "augmented-reality",
    title: "Augmented Reality",
    description:
      "Menampilkan visualisasi bangun ruang dalam bentuk Augmented Reality menggunakan QR Code.",
    path: "/augmented-reality",
  },
  {
    id: "bangun-ruang",
    title: "Bangun Ruang",
    description:
      "Menyediakan materi, sifat, unsur, rumus, serta informasi lengkap mengenai bangun ruang.",
    path: "/bangun-ruang",
  },
  {
    id: "latihan",
    title: "Latihan",
    description:
      "Menyediakan latihan interaktif untuk menguji pemahaman materi bangun ruang.",
    path: "/latihan",
  },
  {
    id: "tentang",
    title: "Tentang",
    description:
      "Menampilkan informasi mengenai VertexAR dan pengembang website.",
    path: "/tentang",
  },
];


function DeveloperTypewriterTitle() {
  const [
    firstLineCount,
    setFirstLineCount,
  ] = useState(0);

  const [
    secondLineCount,
    setSecondLineCount,
  ] = useState(0);

  const [
    phase,
    setPhase,
  ] = useState(
    "typing-first"
  );


  useEffect(() => {
    let timeoutId;

    const typeSpeed = 105;
    const deleteSpeed = 65;
    const linePause = 350;
    const completedPause = 2000;
    const emptyPause = 500;


    if (
      phase === "typing-first"
    ) {
      if (
        firstLineCount
        < FIRST_TITLE_LINE.length
      ) {
        timeoutId =
          window.setTimeout(() => {
            setFirstLineCount(
              (previousCount) =>
                previousCount + 1
            );
          }, typeSpeed);
      } else {
        timeoutId =
          window.setTimeout(() => {
            setPhase(
              "typing-second"
            );
          }, linePause);
      }
    }


    if (
      phase === "typing-second"
    ) {
      if (
        secondLineCount
        < SECOND_TITLE_LINE.length
      ) {
        timeoutId =
          window.setTimeout(() => {
            setSecondLineCount(
              (previousCount) =>
                previousCount + 1
            );
          }, typeSpeed);
      } else {
        timeoutId =
          window.setTimeout(() => {
            setPhase(
              "deleting-second"
            );
          }, completedPause);
      }
    }


    if (
      phase === "deleting-second"
    ) {
      if (
        secondLineCount > 0
      ) {
        timeoutId =
          window.setTimeout(() => {
            setSecondLineCount(
              (previousCount) =>
                previousCount - 1
            );
          }, deleteSpeed);
      } else {
        timeoutId =
          window.setTimeout(() => {
            setPhase(
              "deleting-first"
            );
          }, linePause);
      }
    }


    if (
      phase === "deleting-first"
    ) {
      if (
        firstLineCount > 0
      ) {
        timeoutId =
          window.setTimeout(() => {
            setFirstLineCount(
              (previousCount) =>
                previousCount - 1
            );
          }, deleteSpeed);
      } else {
        timeoutId =
          window.setTimeout(() => {
            setPhase(
              "typing-first"
            );
          }, emptyPause);
      }
    }


    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    phase,
    firstLineCount,
    secondLineCount,
  ]);


  const typedFirstLine =
    FIRST_TITLE_LINE.slice(
      0,
      firstLineCount
    );

  const typedSecondLine =
    SECOND_TITLE_LINE.slice(
      0,
      secondLineCount
    );


  const caretOnFirstLine =
    phase === "typing-first"
    || phase === "deleting-first";

  const caretOnSecondLine =
    phase === "typing-second"
    || phase === "deleting-second";


  return (
    <h2
      className="about-developer-title"
      aria-label="Full Stack Developer"
    >
      <span className="about-developer-title-line about-developer-title-blue">
        <span
          className="about-developer-title-placeholder"
          aria-hidden="true"
        >
          {FIRST_TITLE_LINE}
        </span>

        <span
          className="about-developer-title-typed"
          aria-hidden="true"
        >
          {typedFirstLine}

          {caretOnFirstLine && (
            <span className="about-typewriter-caret" />
          )}
        </span>
      </span>

      <span className="about-developer-title-line about-developer-title-pink">
        <span
          className="about-developer-title-placeholder"
          aria-hidden="true"
        >
          {SECOND_TITLE_LINE}
        </span>

        <span
          className="about-developer-title-typed"
          aria-hidden="true"
        >
          {typedSecondLine}

          {caretOnSecondLine && (
            <span className="about-typewriter-caret" />
          )}
        </span>
      </span>
    </h2>
  );
}


function About() {
  const navigate =
    useNavigate();

  const [
    clickedFeature,
    setClickedFeature,
  ] = useState(null);


  function handleFeatureClick(
    feature
  ) {
    setClickedFeature(
      feature.id
    );

    window.setTimeout(() => {
      navigate(
        feature.path
      );

      setClickedFeature(null);
    }, 220);
  }


  return (
    <>
      <main className="about-page vertex-about-page">
        {/* ================= HERO ================= */}

        <section className="about-hero">
          <h1 className="about-main-title">
            Tentang VertexAR
          </h1>

          <div className="about-hero-image-wrapper">
            <img
              src={heroImage}
              alt="Ilustrasi VertexAR"
              className="about-hero-image"
            />
          </div>
        </section>


        {/* ================= APA ITU ================= */}

        <section className="about-description-section">
          <h2 className="about-section-title">
            Apa itu VertexAR?
          </h2>

          <p className="about-description-text">
            VertexAR merupakan media pembelajaran
            berbasis website yang dirancang untuk
            membantu siswa SMP mempelajari materi
            bangun ruang secara lebih interaktif dan
            menarik. Website ini menyediakan materi
            pembelajaran yang disusun secara sistematis,
            dilengkapi visualisasi objek tiga dimensi,
            serta teknologi Augmented Reality (AR)
            melalui QR Code yang terintegrasi dengan
            platform Assemblr EDU sehingga siswa dapat
            mengamati bentuk bangun ruang secara nyata
            menggunakan smartphone.
          </p>
        </section>


        {/* ================= FITUR WEBSITE ================= */}

        <section className="about-feature-section vertex-about-features-section">
          <h2 className="about-feature-title">
            Fitur Website
          </h2>

          <div className="about-feature-grid">
            {websiteFeatures.map(
              (feature) => (
                <button
                  key={feature.id}
                  type="button"
                  className={[
                    "about-feature-card",

                    clickedFeature
                    === feature.id
                      ? "is-clicked"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    handleFeatureClick(
                      feature
                    )
                  }
                  aria-label={`Buka halaman ${feature.title}`}
                >
                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>
                </button>
              )
            )}
          </div>
        </section>


        {/* ================= DEVELOPER ================= */}

        <section className="about-developer-section">
          <div className="about-developer-content">
            <DeveloperTypewriterTitle />

            <p className="about-developer-description">
              Adrian Maulana Mahasiswa Program Studi
              Ilmu Komputer Universitas Negeri Jakarta
              yang memiliki minat pada bidang
              pengembangan website, Augmented Reality,
              dan teknologi pendidikan. Berpengalaman
              membangun aplikasi berbasis web
              menggunakan HTML, CSS, JavaScript,
              React.js, PHP, Laravel, Firebase, Python
              FastAPI, WordPress, serta mengembangkan
              media pembelajaran interaktif berbasis
              Augmented Reality untuk mendukung proses
              belajar yang lebih inovatif dan menarik.
            </p>
          </div>

          <div className="about-developer-photo-column">
            <div className="about-developer-photo-card">
              <img
                src={developerImage}
                alt="Foto pengembang VertexAR"
                className="about-developer-photo"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;