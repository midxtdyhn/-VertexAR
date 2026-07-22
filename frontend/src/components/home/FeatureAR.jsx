import arCard from "../../assets/images/ar-card.png";
import { motion } from "framer-motion";

const leftVariant = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

const rightVariant = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: "easeOut",
      staggerChildren: 0.5,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

function FeatureAR() {
  return (
    <section className="mt-10 w-full rounded-[38px] bg-pink-500 px-12 py-10 text-white overflow-hidden">

      <div className="grid grid-cols-[1fr_0.95fr] items-center gap-8">

        <motion.div
          variants={leftVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex justify-center"
        >
          <img
            src={arCard}
            alt="Ilustrasi Teknologi AR"
            className="w-[clamp(340px,32vw,500px)] object-contain ar-float"
          />
        </motion.div>

        <motion.div
          variants={rightVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            variants={item}
            className="text-sm font-semibold text-blue-300"
          >
            Fitur Unggulan
          </motion.p>

          <motion.h2
            variants={item}
            className="mt-2 text-[36px] font-extrabold leading-tight"
          >
            Teknologi Proyeksi <br />
            3D & AR Interaktif <br />
            <span className="text-blue-900">Teknologi AR</span>
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 max-w-[420px] text-sm leading-relaxed"
          >
            Yuk, eksplorasi bangun ruang dengan Augmented Reality.
            Scan QR Code menggunakan HP, lalu buka melalui
            aplikasi Assemblr EDU untuk melihat objek bangun
            ruang 3D muncul secara nyata di sekitarmu.
          </motion.p>

          <motion.a
            variants={item}
            href="/augmented-reality"
            className="mt-5 inline-block rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white ar-button"
          >
            Baca Selengkapnya
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}

export default FeatureAR;