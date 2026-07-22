import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ShapeViewer from "../components/viewer/ShapeViewer";
import karakterAR from "../assets/images/karakter-ar.png";
import { motion } from "framer-motion";

function AR() {
  const shapes = ["Kubus", "Balok", "Tabung", "Kerucut", "Limas", "Prisma", "Bola"];
  const [selectedShape, setSelectedShape] = useState("Kubus");

  const fadeUp = {
    hidden: { opacity: 0, y: 70 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 },
    },
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto w-[90%] py-10">

        {/* HEADER */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h1 className="text-[clamp(32px,4vw,56px)] font-extrabold text-blue-900">
            Eksplorasi Tiga Dimensi & Simulasi AR
          </h1>

          <p className="mx-auto mt-4 max-w-[900px] text-[clamp(16px,1.5vw,22px)] leading-relaxed text-gray-800">
            Akses visualisasi objek bangun ruang melalui QR Code yang
            terintegrasi dengan konten Augmented Reality pada platform Assemblr EDU.
          </p>
        </motion.section>

        {/* 3D CARD */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-14 w-[62%] overflow-hidden rounded-[30px] bg-white border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-lg:w-[90%] max-md:w-full"
        >
          <div className="bg-gradient-to-r from-[#2046B3] to-[#3B82F6] py-5 text-center text-[clamp(28px,3vw,44px)] font-extrabold text-white">
            Bangun Ruang 3D
          </div>

          <div className="h-[clamp(330px,34vw,500px)] bg-[#6256ff]">
            <ShapeViewer selectedShape={selectedShape} />
          </div>

          <div className="flex flex-wrap justify-center gap-4 bg-gradient-to-r from-[#1D3E9F] via-[#2952C9] to-[#3F74FF] px-6 py-6">
            {shapes.map((shape) => (
              <motion.button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-7 py-3 text-[clamp(14px,1.2vw,18px)] font-semibold transition-all duration-300 ${
                  selectedShape === shape
                    ? "bg-[#B7E3FF] text-[#1547A8] shadow-lg"
                    : "bg-white text-[#1D3E9F] hover:bg-[#EEF7FF]"
                }`}
              >
                {shape}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* QR SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-20 w-[62%] rounded-[30px] bg-white border border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.12)] px-10 py-8 text-center max-lg:w-[80%] max-md:w-full"
        >
          <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-blue-900">
            Visualisasi AR melalui <br /> QR Code
          </h2>

          <p className="mx-auto mt-4 max-w-[720px] text-[clamp(14px,1.3vw,18px)] leading-relaxed text-blue-900">
            Pindai QR Code di bawah menggunakan smartphone Anda untuk
            menampilkan bangun ruang dalam Augmented Reality melalui Assemblr EDU.
          </p>

          <div className="mx-auto mt-8 flex aspect-square w-[clamp(220px,24vw,320px)] items-center justify-center bg-gray-100 font-bold text-gray-600">
            QR Assemblr EDU
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 rounded-full bg-blue-100 px-10 py-3 text-[clamp(14px,1.2vw,18px)] font-semibold text-blue-900"
          >
            Target AR: {selectedShape}
          </motion.button>
        </motion.section>

        {/* HERO SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 items-center gap-10 max-md:grid-cols-1"
        >
          <div>
            <h1 className="text-[clamp(42px,4vw,62px)] font-black leading-tight text-[#163B8F] drop-shadow-[0_3px_8px_rgba(22,59,143,0.15)]">
              Ayo Jelajahi Bangun <br />
              <span className="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#4F8BFF] bg-clip-text text-transparent">
                Ruang Lebih Seru!
              </span>
            </h1>

            <p className="mt-6 max-w-[720px] text-[clamp(16px,1.6vw,24px)] leading-relaxed text-blue-900">
              Temukan bentuk bangun ruang secara interaktif melalui model 3D dan
              Augmented Reality untuk pengalaman belajar yang lebih nyata.
            </p>
          </div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <img
              src={karakterAR}
              alt="Karakter VertexAR"
              className="w-[clamp(280px,32vw,470px)] object-contain"
            />
          </motion.div>
        </motion.section>

      </main>

      <Footer />
    </>
  );
}

export default AR;