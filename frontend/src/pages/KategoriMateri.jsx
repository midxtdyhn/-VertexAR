import { useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Footer from "../components/layout/Footer";
import materiData from "../data/materiData";

import kubusIcon from "../assets/icons/kubus.png";
import balokIcon from "../assets/icons/balok.png";
import tabungIcon from "../assets/icons/tabung.png";
import kerucutIcon from "../assets/icons/kerucut.png";
import limasIcon from "../assets/icons/limas.png";
import prismaIcon from "../assets/icons/prisma.png";
import bolaIcon from "../assets/icons/bola.png";

const icons = {
  Kubus: kubusIcon,
  Balok: balokIcon,
  Tabung: tabungIcon,
  Kerucut: kerucutIcon,
  Limas: limasIcon,
  Prisma: prismaIcon,
  Bola: bolaIcon,
};

const kategoriData = {
  datar: {
    title: "Bangun Ruang Sisi Datar",
    description:
      "Pelajari bangun ruang yang seluruh permukaannya tersusun dari bidang datar.",
    shapes: ["Kubus", "Balok", "Prisma", "Limas"],
    defaultShape: "Kubus",
  },

  lengkung: {
    title: "Bangun Ruang Sisi Lengkung",
    description:
      "Pelajari bangun ruang yang memiliki satu atau lebih permukaan berbentuk lengkung.",
    shapes: ["Tabung", "Kerucut", "Bola"],
    defaultShape: "Tabung",
  },
};

function KategoriMateri({ category }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const config = kategoriData[category];

  const selectedShape = useMemo(() => {
    const shapeFromUrl = searchParams.get("shape");

    if (
      shapeFromUrl &&
      config.shapes.includes(shapeFromUrl)
    ) {
      return shapeFromUrl;
    }

    return config.defaultShape;
  }, [config, searchParams]);

  const data = materiData[selectedShape];

  const selectShape = (shape) => {
    navigate(
      `/bangun-ruang/sisi-${category}?shape=${encodeURIComponent(
        shape
      )}`
    );
  };

  return (
    <>

      <main className="vertex-category-page">
        <header className="vertex-category-header">
          <p className="vertex-category-label">
            MATERI BANGUN RUANG
          </p>

          <h1>{config.title}</h1>

          <p>{config.description}</p>
        </header>

        <section className="vertex-category-layout">
          <aside className="vertex-category-sidebar">
            <h2>Pilih Bangun Ruang</h2>

            <div className="vertex-category-options">
              {config.shapes.map((shape) => {
                const isActive = selectedShape === shape;

                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => selectShape(shape)}
                    className={`vertex-category-option ${
                      isActive
                        ? "vertex-category-option-active"
                        : ""
                    }`}
                  >
                    <img
                      src={icons[shape]}
                      alt=""
                      aria-hidden="true"
                    />

                    <span>{shape}</span>

                    <span aria-hidden="true">›</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="vertex-category-material">
            <div className="vertex-category-material-heading">
              <img
                src={icons[selectedShape]}
                alt={`Ikon ${selectedShape}`}
              />

              <h2>{data.nama}</h2>
            </div>

            <p className="vertex-category-description">
              {data.deskripsi}
            </p>

            <div className="vertex-category-divider" />

            <h3>Sifat dan Unsur Bangun</h3>

            <ol className="vertex-category-properties">
              {data.sifat.map((property) => (
                <li key={property}>{property}</li>
              ))}
            </ol>

            <div className="vertex-category-formulas">
              <div>
                <h4>Volume</h4>
                <p>{data.volume}</p>
              </div>

              <div>
                <h4>Luas Permukaan</h4>
                <p>{data.luas}</p>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default KategoriMateri;