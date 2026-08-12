import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PhoneScene
  from "./PhoneScene";


/*
  PERHATIKAN:

  Nama file kamu:
  demo-ar.Mp4

  Jadi import-nya juga harus
  memakai M besar seperti file asli.
*/

import demoArVideo
  from "../../assets/videos/demo-ar.Mp4";


function Hero() {
  const navigate =
    useNavigate();


  const [
    clickedButton,
    setClickedButton,
  ] = useState(null);


  function handleNavigation(
    buttonName,
    path
  ) {
    if (
      clickedButton !== null
    ) {
      return;
    }


    setClickedButton(
      buttonName
    );


    window.setTimeout(
      () => {
        navigate(
          path
        );
      },

      260
    );
  }


  return (
    <section className="vertex-hero">

      {/* =================================================
          BADGE
      ================================================= */}

      <div
        className="vertex-hero-badge-track"
        aria-label="Media Interaktif SMP"
      >
        <div className="vertex-hero-badge-flight">
          <div className="vertex-hero-badge">

            <span
              className="vertex-hero-rocket"
              aria-hidden="true"
            >
              🚀
            </span>


            <span className="vertex-hero-banner">
              <span className="vertex-hero-banner-text">
                Media Interaktif SMP
              </span>
            </span>

          </div>
        </div>
      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="vertex-hero-content">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="vertex-hero-left">

          <p className="vertex-hero-label">
            Website Belajar Matematika
          </p>


          <h1 className="vertex-hero-title">
            Eksplorasi Bangun Ruang
            <br />

            Lebih Nyata Dengan
            <br />

            Teknologi AR
          </h1>


          <p className="vertex-hero-description">
            Bangun ruang merupakan objek geometri tiga
            dimensi yang memiliki volume dan dibedakan
            menjadi bangun ruang sisi datar serta bangun
            ruang sisi lengkung.
          </p>


          <div className="vertex-hero-buttons">

            <button
              type="button"

              className={`hero-main-button hero-main-button-primary ${
                clickedButton
                === "belajar"
                  ? "is-clicked"
                  : ""
              }`}

              onClick={() =>
                handleNavigation(
                  "belajar",
                  "/bangun-ruang"
                )
              }

              aria-label="Mulai mempelajari materi bangun ruang"
            >
              Mulai Belajar Sekarang
            </button>


            <button
              type="button"

              className={`hero-main-button hero-main-button-secondary ${
                clickedButton
                === "ar"
                  ? "is-clicked"
                  : ""
              }`}

              onClick={() =>
                handleNavigation(
                  "ar",
                  "/augmented-reality"
                )
              }

              aria-label="Buka eksplorasi tiga dimensi dan Augmented Reality"
            >
              Eksplorasi 3D &amp; AR
            </button>

          </div>
        </div>


        {/* =================================================
            RIGHT — 3D PHONE

            Tidak ada lagi tulisan Putar HP.
        ================================================= */}

        <div className="vertex-hero-right">
          <div className="vertex-hero-phone-wrapper">

            <PhoneScene
              videoSrc={
                demoArVideo
              }
            />

          </div>
        </div>

      </div>
    </section>
  );
}


export default Hero;