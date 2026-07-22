import heroImage from "../../assets/images/hero-ar.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fullText = `Eksplorasi Bangun Ruang
Lebih Nyata Dengan
Teknologi AR`;

function Hero() {
  const [isVisible, setIsVisible] = useState(true);
  const [typedText, setTypedText] = useState("");

  // Scroll Hide / Show
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typewriter per kata
  useEffect(() => {
  if (!isVisible) {
    setTypedText("");
    return;
  }

  let index = 0;
  let deleting = false;
  let timer;

  const type = () => {
    if (!deleting) {
      index++;

      setTypedText(fullText.substring(0, index));

      if (index === fullText.length) {
        deleting = true;

        timer = setTimeout(type, 1800);
        return;
      }

      timer = setTimeout(type, 70); // ketik per huruf
    } else {
      index--;

      setTypedText(fullText.substring(0, index));

      if (index === 0) {
        deleting = false;

        timer = setTimeout(type, 700);
        return;
      }

      timer = setTimeout(type, 30); // hapus per huruf
    }
  };

  type();

  return () => clearTimeout(timer);
}, [isVisible]);

  return (
    <section className="hero-section w-full">
      {/* BADGE */}
      <motion.div
        className="hero-badge mb-4 flex justify-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -30,
        }}
        transition={{ duration: 0.6 }}
      >
        <p className="badge-animation rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white">
          🚀 Media Interaktif SMP
        </p>
      </motion.div>

      <div className="hero-grid grid grid-cols-2 items-center gap-20">
        {/* LEFT */}
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            x: isVisible ? 0 : -60,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="hero-sub text-base font-medium text-violet-500"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isVisible ? 1 : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            Website Belajar Matematika
          </motion.p>

          {/* TYPEWRITER */}
          <h1 className="hero-title mt-2 mb-10 text-[clamp(38px,4vw,58px)] font-extrabold leading-[1.15] text-blue-900">

  <span
    style={{ whiteSpace: "pre-line" }}
    className="text-blue-900"
  >
    {typedText}
  </span>

  <span className="cursor"></span>

</h1>

          <motion.p
            className="hero-desc mt-4 max-w-[390px] text-sm leading-relaxed text-blue-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 20,
            }}
            transition={{
              duration: 0.6,
              delay: 1.8,
            }}
          >
            Bangun ruang merupakan objek geometri tiga dimensi yang memiliki
            volume dan dibedakan menjadi bangun ruang sisi datar serta bangun
            ruang sisi lengkung.
          </motion.p>

          <motion.div
            className="hero-buttons mt-5 flex gap-4"
            initial={{ opacity: 0, y: 25 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 25,
            }}
            transition={{
              duration: 0.6,
              delay: 2.2,
            }}
          >
            <a
              href="/bangun-ruang"
              className="hero-btn-primary rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Mulai Belajar Sekarang
            </a>

            <a
              href="/augmented-reality"
              className="hero-btn-secondary rounded-full border border-blue-900 px-5 py-2 text-sm font-semibold text-blue-900"
            >
              Eksplorasi 3D & AR
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="hero-right flex justify-end"
          initial={{ opacity: 0, x: 60 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            x: isVisible ? 0 : 60,
          }}
          transition={{ duration: 0.9 }}
        >
          <img
            src={heroImage}
            alt="Ilustrasi AR"
            className={`hero-image w-[clamp(360px,34vw,520px)] object-contain ${
              isVisible ? "float-image" : ""
            }`}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;