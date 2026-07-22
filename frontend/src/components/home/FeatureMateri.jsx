import bangunImage from "../../assets/images/bangun-ruang.png";

function FeatureMateri() {
  return (
    <section className="feature-materi mt-10 grid grid-cols-2 items-center gap-10">

      <div className="fm-left fade-left-delayed">
        <p className="text-sm font-semibold text-blue-900">Fitur Utama</p>

        <h2 className="mt-2 text-[36px] font-extrabold leading-tight text-blue-900">
          Eksplorasi <br />
          Materi Bangun Ruang
        </h2>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-900">
          Di dalam website ini, kamu dapat mempelajari materi bangun ruang secara
          lebih interaktif. Setiap bangun ruang disajikan dengan penjelasan yang
          runtut, lengkap dengan sifat-sifat, unsur, rumus, dan visualisasi tiga
          dimensi.
        </p>

        <a
          href="/bangun-ruang"
          className="fm-button mt-5 inline-block rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Buka Materi
        </a>
      </div>

      <div className="fm-right flex justify-end fade-right-delayed">
        <img
          src={bangunImage}
          alt="Ilustrasi Bangun Ruang"
          className="fm-image w-[clamp(320px,30vw,470px)]"
        />
      </div>

    </section>
  );
}

export default FeatureMateri;