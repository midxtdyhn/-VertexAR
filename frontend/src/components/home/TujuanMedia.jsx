import { motion } from "framer-motion";

const sectionAnimation = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const textAnimation = {
  hidden: {
    opacity: 0,
    y: 25,
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

function TujuanMedia() {
  return (
    <motion.section
      className="vertex-learning-goal"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.3,
      }}
    >
      <motion.p
        variants={textAnimation}
        className="vertex-learning-goal-label"
      >
        TUJUAN &amp; KOLABORASI MEDIA
      </motion.p>

      <motion.h2
        variants={textAnimation}
        className="vertex-learning-goal-title"
      >
        Capaian Pembelajaran
      </motion.h2>

      <motion.p
        variants={textAnimation}
        className="vertex-learning-goal-description"
      >
        Peserta didik mampu memahami konsep bangun ruang sisi datar dan sisi
        lengkung beserta ciri-ciri, sifat-sifat, dan hubungan antarunsurnya,
        serta memahami hubungan antara jaring-jaring dan bentuk bangun ruang
        sisi datar dan sisi lengkung dengan memanfaatkan berbagai representasi,
        termasuk teknologi digital.
      </motion.p>
    </motion.section>
  );
}

export default TujuanMedia;