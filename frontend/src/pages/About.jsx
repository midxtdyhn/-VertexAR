import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import heroImage from "../assets/images/hero.png";
import developerImage from "../assets/images/developer.png";

function About() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-[95vw] max-w-[1700px] px-[2vw] py-10">

        {/* ================= HERO ================= */}

        <section className="text-center">

          <h1 className="text-[clamp(38px,4vw,58px)] font-extrabold text-blue-900">
            Tentang VertexAR
          </h1>

          <div className="flex justify-center self-end">
            <img
              src={heroImage}
              alt="Hero VertexAR"
              className="w-[clamp(280px,28vw,450px)] object-contain"
            />
          </div>

        </section>

        {/* ================= APA ITU ================= */}

        <section className="mt-20 w-full">

          <h2 className="text-[clamp(32px,3vw,46px)] font-extrabold text-blue-900">
            Apa itu VertexAR?
          </h2>

          <p className="mt-6 max-w-none text-justify text-[clamp(16px,1.1vw,20px)] leading-9 text-gray-700">
            VertexAR merupakan media pembelajaran berbasis website yang dirancang
            untuk membantu siswa SMP mempelajari materi bangun ruang secara
            lebih interaktif dan menarik. Website ini menyediakan materi
            pembelajaran yang disusun secara sistematis, dilengkapi visualisasi
            objek tiga dimensi, serta teknologi Augmented Reality (AR) melalui
            QR Code yang terintegrasi dengan platform Assemblr EDU sehingga
            siswa dapat mengamati bentuk bangun ruang secara nyata menggunakan
            smartphone.
          </p>

        </section>

        {/* ================= FITUR WEBSITE ================= */}

        <section className="mt-20 w-full rounded-[34px] bg-[#FF3E6C] px-10 py-10 shadow-[10px_10px_22px_rgba(0,0,0,0.18)]">

          <h2 className="text-center text-[clamp(32px,3vw,46px)] font-extrabold text-white">
            Fitur Website
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4 items-stretch">

            <div className="h-full rounded-[24px] bg-white p-6 text-center shadow-[5px_8px_15px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1">

              <h3 className="text-xl font-bold text-blue-900">
                Beranda
              </h3>

              <p className="mt-4 leading-7 text-gray-700">
                Menampilkan informasi utama mengenai VertexAR beserta navigasi menuju seluruh fitur website.
              </p>

            </div>

            <div className="h-full rounded-[24px] bg-white p-6 text-center shadow-[5px_8px_15px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1">

              <h3 className="text-xl font-bold text-blue-900">
                Augmented Reality
              </h3>

              <p className="mt-4 leading-7 text-gray-700">
                Menampilkan visualisasi bangun ruang dalam bentuk Augmented Reality menggunakan QR Code.
              </p>

            </div>

            <div className="h-full rounded-[24px] bg-white p-6 text-center shadow-[5px_8px_15px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1">

              <h3 className="text-xl font-bold text-blue-900">
                Bangun Ruang
              </h3>

              <p className="mt-4 leading-7 text-gray-700">
                Menyediakan materi, sifat, unsur, rumus, serta informasi lengkap mengenai bangun ruang.
              </p>

            </div>

            <div className="h-full rounded-[24px] bg-white p-6 text-center shadow-[5px_8px_15px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1">

              <h3 className="text-xl font-bold text-blue-900">
                Tentang
              </h3>

              <p className="mt-4 leading-7 text-gray-700">
                Menampilkan informasi mengenai VertexAR dan pengembang website.
              </p>

            </div>

          </div>

        </section>

        {/* ================= DEVELOPER ================= */}

        <section className="mt-24 w-full">

          <div className="grid items-center gap-16 xl:grid-cols-[1.2fr_0.8fr]">

            {/* KIRI */}

            <div>

              <h2 className="text-[clamp(44px,4vw,64px)] font-extrabold text-blue-900">
                FULL STACK
              </h2>

              <h2 className="text-[clamp(44px,4vw,64px)] font-extrabold text-[#FF3E6C]">
                DEVELOPER
              </h2>

              <p className="mt-8 text-justify text-[clamp(16px,1.1vw,20px)] leading-9 text-gray-700">
                Mahasiswa Program Studi Ilmu Komputer Universitas Negeri Jakarta yang memiliki minat pada bidang pengembangan website, Augmented Reality, dan teknologi pendidikan. Berpengalaman membangun aplikasi berbasis web menggunakan HTML, CSS, JavaScript, React.js, PHP, Laravel, Firebase, Python FastAPI, WordPress, serta mengembangkan media pembelajaran interaktif berbasis Augmented Reality untuk mendukung proses belajar yang lebih inovatif dan menarik.
              </p>

            </div>


            {/* KANAN */}

            <div className="flex justify-center xl:justify-end">

              <div
                className="
                  w-[380px]
                  h-[420px]
                  overflow-hidden
                  rounded-[28px]
                  bg-[#665CFF]
                  shadow-[12px_14px_24px_rgba(0,0,0,0.22)]
                  flex
                  items-end
                  justify-center
                "
              >

                <img
                  src={developerImage}
                  alt="Developer"
                  className="
                    w-[340px]
                    h-auto
                    object-contain
                    object-bottom
                  "
                />

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default About;