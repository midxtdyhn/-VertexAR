import { useState } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "../../assets/images/hero-ar.png";


function Hero() {
  const navigate = useNavigate();

  const [
    clickedButton,
    setClickedButton,
  ] = useState(null);


  function handleNavigation(
    buttonName,
    path
  ) {
    // Mencegah tombol diklik berkali-kali.
    if (clickedButton !== null) {
      return;
    }

    setClickedButton(buttonName);

    // Memberi waktu agar animasi klik terlihat.
    window.setTimeout(() => {
      navigate(path);
    }, 260);
  }


  return (
    <section className="vertex-hero">
      {/*
        Roket masuk dari kanan menuju tengah
        sambil membawa banner tulisan.
      */}

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


      <div className="vertex-hero-content">
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
                clickedButton === "belajar"
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
                clickedButton === "ar"
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


        <div className="vertex-hero-right">
          <img
            src={heroImage}
            alt="Ilustrasi eksplorasi Augmented Reality"
            className="vertex-hero-image"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}


export default Hero;