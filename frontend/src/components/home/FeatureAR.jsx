import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import arCard from "../../assets/images/ar-card.png";

const imageAnimation = {
  hidden: {
    opacity: 0,
    x: -80,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const contentAnimation = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const textAnimation = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function FeatureAR() {
  return (
    <section className="vertex-feature-ar">
      <div className="vertex-feature-ar-grid">
        <motion.div
          className="vertex-feature-ar-visual"
          variants={imageAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          <img
            src={arCard}
            alt="Ilustrasi teknologi Augmented Reality"
            className="vertex-feature-ar-image"
          />
        </motion.div>

        <motion.div
          className="vertex-feature-ar-content"
          variants={contentAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          <motion.p
            variants={textAnimation}
            className="vertex-feature-ar-label"
          >
            Fitur Unggulan
          </motion.p>

          <motion.h2
            variants={textAnimation}
            className="vertex-feature-ar-title"
          >
            <span className="vertex-feature-ar-gradient">
              Teknologi Proyeksi
              <br />
              3D &amp; AR Interaktif
            </span>

            <span className="vertex-feature-ar-dark-title">
              Teknologi AR
            </span>
          </motion.h2>

          <motion.p
            variants={textAnimation}
            className="vertex-feature-ar-description"
          >
            Yuk, eksplorasi bangun ruang dengan Augmented Reality. Scan QR
            Code menggunakan HP, lalu buka melalui aplikasi Assemblr EDU
            untuk melihat objek bangun ruang 3D muncul secara nyata di
            sekitarmu.
          </motion.p>

          <motion.div variants={textAnimation}>
            <Link
              to="/augmented-reality"
              className="vertex-action-button"
            >
              Baca Selengkapnya
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureAR;