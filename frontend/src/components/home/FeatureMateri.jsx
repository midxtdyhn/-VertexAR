import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bangunImage from "../../assets/images/bangun-ruang.png";

const leftAnimation = {
  hidden: {
    opacity: 0,
    x: -70,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const textAnimation = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageAnimation = {
  hidden: {
    opacity: 0,
    x: 70,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function FeatureMateri() {
  return (
    <section className="vertex-feature-materi">
      <div className="vertex-feature-materi-grid">
        <motion.div
          className="vertex-feature-materi-content"
          variants={leftAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          <motion.p
            variants={textAnimation}
            className="vertex-feature-materi-label"
          >
            Fitur Utama
          </motion.p>

          <motion.h2
            variants={textAnimation}
            className="vertex-feature-materi-title"
          >
            Eksplorasi
            <br />
            Materi Bangun Ruang
          </motion.h2>

          <motion.p
            variants={textAnimation}
            className="vertex-feature-materi-description"
          >
            Di dalam website ini, kamu dapat mempelajari materi bangun ruang
            secara lebih interaktif. Setiap bangun ruang disajikan dengan
            penjelasan yang runtut, lengkap dengan sifat-sifat, unsur, rumus,
            dan visualisasi tiga dimensi sehingga proses belajar menjadi lebih
            mudah dipahami dan menyenangkan.
          </motion.p>

          <motion.div variants={textAnimation}>
            <Link
              to="/bangun-ruang"
              className="vertex-action-button"
            >
              Buka Materi
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="vertex-feature-materi-visual"
          variants={imageAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          <img
            src={bangunImage}
            alt="Kumpulan bangun ruang tiga dimensi"
            className="vertex-feature-materi-image"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureMateri;