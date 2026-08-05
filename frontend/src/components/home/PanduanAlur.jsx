import { motion } from "framer-motion";
import panduanImage from "../../assets/images/panduan-alur.png";

const guideAnimation = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function PanduanAlur() {
  return (
    <motion.section
      className="vertex-guide"
      variants={guideAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      <div className="vertex-guide-text">
        <h2 className="vertex-guide-title">
          Panduan Alur Media
        </h2>

        <ol className="vertex-guide-list">
          <li>
            <strong>Beranda:</strong>{" "}
            Halaman utama tempat pengguna pertama kali membuka website dan
            memperoleh pengantar mengenai VertexAR.
          </li>

          <li>
            <strong>Augmented Reality:</strong>{" "}
            Halaman untuk melihat, memutar, dan memproyeksikan objek 3D secara
            interaktif melalui layar atau kamera perangkat.
          </li>

          <li>
            <strong>Bangun Ruang:</strong>{" "}
            Halaman materi yang menyajikan penjelasan, gambar, rumus, dan
            pembahasan mengenai bangun ruang.
          </li>

          <li>
            <strong>Latihan:</strong>{" "}
            Halaman untuk mengerjakan latihan interaktif guna menguji pemahaman
            terhadap materi.
          </li>

          <li>
            <strong>Tentang:</strong>{" "}
            Halaman yang memuat profil, latar belakang pembuatan website, dan
            informasi pengembang VertexAR.
          </li>
        </ol>
      </div>

      <div className="vertex-guide-visual">
        <img
          src={panduanImage}
          alt="Ilustrasi panduan alur media"
          className="vertex-guide-image"
        />
      </div>
    </motion.section>
  );
}

export default PanduanAlur;