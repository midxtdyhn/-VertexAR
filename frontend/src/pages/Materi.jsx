import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/layout/Footer";

const bangunRuang = [
  {
    name: "Kubus",
    icon: "/images/kubus.png",
    category: "datar",
  },
  {
    name: "Balok",
    icon: "/images/balok.png",
    category: "datar",
  },
  {
    name: "Tabung",
    icon: "/images/tabung.png",
    category: "lengkung",
  },
  {
    name: "Kerucut",
    icon: "/images/kerucut.png",
    category: "lengkung",
  },
  {
    name: "Limas",
    icon: "/images/limas.png",
    category: "datar",
  },
  {
    name: "Prisma",
    icon: "/images/prisma.png",
    category: "datar",
  },
  {
    name: "Bola",
    icon: "/images/bola.png",
    category: "lengkung",
  },
];

function Materi() {
  const navigate = useNavigate();

  const [clickedMaterial, setClickedMaterial] =
    useState(null);

  function openMaterial(item) {
    const path =
      item.category === "datar"
        ? "/bangun-ruang/sisi-datar"
        : "/bangun-ruang/sisi-lengkung";

    setClickedMaterial(item.name);

    window.setTimeout(() => {
      navigate(
        `${path}#${item.name.toLowerCase()}`
      );

      setClickedMaterial(null);
    }, 180);
  }

  return (
    <>

      <main className="vertex-materi-page">
        {/* ================= HEADER ================= */}

        <header className="vertex-materi-header">
          <h1>Materi Bangun Ruang</h1>

          <p>
            Pilih jenis bangun ruang untuk mempelajari
            konsep, sifat-sifat, rumus, serta melihat
            visualisasi objek secara interaktif.
          </p>
        </header>

        {/* ================= KLASIFIKASI ================= */}

        <section className="vertex-classification-card">
          <h2>Klasifikasi Bangun Ruang</h2>

          <div className="vertex-classification-list">
            {bangunRuang.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`vertex-classification-button ${
                  clickedMaterial === item.name
                    ? "is-clicked"
                    : ""
                }`}
                onClick={() => openMaterial(item)}
                aria-label={`Buka materi ${item.name}`}
              >
                <span className="vertex-classification-left">
                  <img
                    src={item.icon}
                    alt=""
                    className="vertex-classification-icon"
                    aria-hidden="true"
                  />

                  <span className="vertex-classification-name">
                    {item.name}
                  </span>
                </span>

                <span
                  className="vertex-classification-arrow"
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ================= EKSPLORASI ================= */}

        <section className="vertex-materi-exploration">
          <h2>
            Eksplorasi Lebih Banyak Bangun Ruang
          </h2>

          <div className="vertex-materi-exploration-box">
            <p>
              Bangun ruang merupakan bentuk tiga
              dimensi yang memiliki panjang, lebar,
              tinggi, serta volume dan dapat menempati
              ruang. Materinya berfokus pada sisi,
              rusuk, titik sudut, luas permukaan, dan
              volume. Berdasarkan jenisnya, bangun ruang
              terbagi menjadi kelompok sisi datar,
              seperti kubus, balok, prisma, dan limas,
              serta kelompok sisi lengkung yang
              meliputi tabung, kerucut, dan bola.
            </p>
          </div>
        </section>

        {/* ================= MATERI LEBIH DALAM ================= */}

        <section className="vertex-materi-deeper">
          <h2>Memahami Materi Lebih Dalam Yuk!</h2>

          <div className="vertex-materi-category-grid">
            <article className="vertex-materi-category-card">
              <h3>Sisi Datar</h3>

              <div className="vertex-materi-category-image-wrapper">
                <img
                  src="/images/sisi-datar.png"
                  alt="Kelompok bangun ruang sisi datar"
                  className="vertex-materi-category-image"
                />
              </div>

              <button
                type="button"
                className="vertex-materi-category-button"
                onClick={() =>
                  navigate(
                    "/bangun-ruang/sisi-datar"
                  )
                }
              >
                Buka Materi
              </button>
            </article>

            <article className="vertex-materi-category-card">
              <h3>Sisi Lengkung</h3>

              <div className="vertex-materi-category-image-wrapper">
                <img
                  src="/images/sisi-lengkung.png"
                  alt="Kelompok bangun ruang sisi lengkung"
                  className="vertex-materi-category-image"
                />
              </div>

              <button
                type="button"
                className="vertex-materi-category-button"
                onClick={() =>
                  navigate(
                    "/bangun-ruang/sisi-lengkung"
                  )
                }
              >
                Buka Materi
              </button>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Materi;