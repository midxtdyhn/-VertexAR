import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import Footer from "../components/layout/Footer";
import ShapeViewer from "../components/viewer/ShapeViewer";

import mascotVideo from "../assets/videos/mascot-vertexar.webm";


/* =========================================================
   QR CODE
========================================================= */

import qrKubus from "../assets/qr/qr-kubus.png";
import qrBalok from "../assets/qr/qr-balok.png";
import qrTabung from "../assets/qr/qr-tabung.png";
import qrKerucut from "../assets/qr/qr-kerucut.png";
import qrLimas from "../assets/qr/qr-limas.png";
import qrPrisma from "../assets/qr/qr-prisma.png";
import qrBola from "../assets/qr/qr-bola.png";


const SHAPES = [
  "Kubus",
  "Balok",
  "Tabung",
  "Kerucut",
  "Limas",
  "Prisma",
  "Bola",
];


/* =========================================================
   QR BERDASARKAN BANGUN RUANG
========================================================= */

const QR_CODES = {
  Kubus: qrKubus,
  Balok: qrBalok,
  Tabung: qrTabung,
  Kerucut: qrKerucut,
  Limas: qrLimas,
  Prisma: qrPrisma,
  Bola: qrBola,
};


/* =========================================================
   LINK EMBED ASSEMBLR EDU
========================================================= */

const ASSEMBLR_EMBED_URLS = {
  Kubus:
    "https://viewer.assemblrworld.com/Embed/-iqhSYHPg7KA6w89nmAn",

  Balok:
    "https://viewer.assemblrworld.com/Embed/-zrZsRvPa6TKrCXXnoR7",

  Tabung:
    "https://viewer.assemblrworld.com/Embed/-kPacVu8ZJJSmJ7CVYz6",

  Kerucut:
    "https://viewer.assemblrworld.com/Embed/-EHa8KfftULmi2w3kWrf",

  Limas:
    "https://viewer.assemblrworld.com/Embed/-buEYwgF23lPeXfHJTeu",

  Prisma:
    "https://viewer.assemblrworld.com/Embed/-6ZgQLJJncw7KuPxFH2X",

  Bola:
    "https://viewer.assemblrworld.com/Embed/-EAg6uWGyHHHEHRCZ6qc",
};


/* =========================================================
   ANIMASI HALAMAN
========================================================= */

const revealAnimation = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,

      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};


/* =========================================================
   VIDEO WEBM + GREEN SCREEN

   TIDAK ADA FALLBACK IMAGE.
   Kalau video gagal dimuat, komponen tidak akan membuat
   seluruh halaman error.
========================================================= */

function ChromaKeyVideo({
  source,
}) {
  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const stageRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  const videoFrameRef =
    useRef(null);

  const lastFrameTimeRef =
    useRef(0);

  const isVisibleRef =
    useRef(true);


  const [
    isReady,
    setIsReady,
  ] = useState(false);


  const [
    hasError,
    setHasError,
  ] = useState(false);


  useEffect(() => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    const stage =
      stageRef.current;


    if (
      !video
      || !canvas
      || !stage
    ) {
      return undefined;
    }


    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
          willReadFrequently: true,
        }
      );


    if (!context) {
      setHasError(true);

      return undefined;
    }


    let stopped = false;

    let started = false;

    let firstFrameRendered =
      false;


    /* =====================================================
       UKURAN CANVAS
    ===================================================== */

    function getMaximumCanvasWidth() {
      if (
        window.innerWidth <= 480
      ) {
        return 240;
      }


      if (
        window.innerWidth <= 768
      ) {
        return 280;
      }


      return 360;
    }


    function setCanvasSize() {
      if (
        video.videoWidth === 0
        || video.videoHeight === 0
      ) {
        return;
      }


      const maximumWidth =
        getMaximumCanvasWidth();


      const scale =
        Math.min(
          1,

          maximumWidth
          / video.videoWidth
        );


      const nextWidth =
        Math.max(
          1,

          Math.round(
            video.videoWidth
            * scale
          )
        );


      const nextHeight =
        Math.max(
          1,

          Math.round(
            video.videoHeight
            * scale
          )
        );


      if (
        canvas.width
        !== nextWidth
      ) {
        canvas.width =
          nextWidth;
      }


      if (
        canvas.height
        !== nextHeight
      ) {
        canvas.height =
          nextHeight;
      }
    }


    /* =====================================================
       PROSES GREEN SCREEN
    ===================================================== */

    function processFrame() {
      if (
        stopped
        || !isVisibleRef.current
        || document.hidden
        || video.readyState < 2
        || canvas.width === 0
        || canvas.height === 0
      ) {
        return;
      }


      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );


      let imageData;


      try {
        imageData =
          context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
      } catch (error) {
        console.error(
          "Gagal memproses video:",
          error
        );


        stopped = true;

        setHasError(true);

        return;
      }


      const pixels =
        imageData.data;


      for (
        let index = 0;
        index < pixels.length;
        index += 4
      ) {
        const red =
          pixels[index];

        const green =
          pixels[index + 1];

        const blue =
          pixels[index + 2];


        const strongestNonGreen =
          Math.max(
            red,
            blue
          );


        const greenDominance =
          green
          - strongestNonGreen;


        if (
          green > 72
          && greenDominance > 20
          && green > red * 1.1
          && green > blue * 1.08
        ) {
          const removalStrength =
            Math.min(
              1,

              Math.max(
                0,

                (
                  greenDominance
                  - 20
                ) / 75
              )
            );


          pixels[index + 3] =
            Math.round(
              255
              * (
                1
                - removalStrength
              )
            );


          pixels[index + 1] =
            Math.round(
              strongestNonGreen

              + (
                green
                - strongestNonGreen
              )
              * 0.06
            );
        } else if (
          greenDominance > 7
          && green > red
          && green > blue
        ) {
          pixels[index + 1] =
            Math.round(
              strongestNonGreen
              + greenDominance
              * 0.18
            );
        }
      }


      context.putImageData(
        imageData,
        0,
        0
      );


      if (
        !firstFrameRendered
      ) {
        firstFrameRendered =
          true;

        setIsReady(true);
      }
    }


    /* =====================================================
       FALLBACK REQUEST ANIMATION FRAME
    ===================================================== */

    function renderWithAnimationFrame(
      timestamp
    ) {
      if (stopped) {
        return;
      }


      const frameInterval =
        1000 / 24;


      if (
        timestamp
        - lastFrameTimeRef.current
        >= frameInterval
      ) {
        lastFrameTimeRef.current =
          timestamp;

        processFrame();
      }


      animationFrameRef.current =
        window.requestAnimationFrame(
          renderWithAnimationFrame
        );
    }


    /* =====================================================
       VIDEO FRAME CALLBACK
    ===================================================== */

    function renderWithVideoFrame() {
      if (stopped) {
        return;
      }


      processFrame();


      videoFrameRef.current =
        video.requestVideoFrameCallback(
          renderWithVideoFrame
        );
    }


    /* =====================================================
       START VIDEO
    ===================================================== */

    function startProcessing() {
      if (started) {
        return;
      }


      started = true;


      setCanvasSize();


      video
        .play()
        .catch((error) => {
          console.warn(
            "Autoplay video tertahan:",
            error
          );
        });


      if (
        typeof video.requestVideoFrameCallback
        === "function"
      ) {
        videoFrameRef.current =
          video.requestVideoFrameCallback(
            renderWithVideoFrame
          );


        return;
      }


      animationFrameRef.current =
        window.requestAnimationFrame(
          renderWithAnimationFrame
        );
    }


    /* =====================================================
       ERROR VIDEO

       Tidak lagi memakai gambar fallback.
       Kalau video rusak / terhapus, hanya karakter yang
       tidak ditampilkan. Halaman tetap aman.
    ===================================================== */

    function handleVideoError() {
      console.warn(
        "Video mascot VertexAR gagal dimuat."
      );


      stopped = true;

      setHasError(true);
    }


    function handleWindowResize() {
      setCanvasSize();
    }


    function handleVisibilityChange() {
      if (
        !document.hidden
        && video.paused
      ) {
        video
          .play()
          .catch(() => {});
      }
    }


    /* =====================================================
       HENTIKAN PROSES SAAT TIDAK TERLIHAT
    ===================================================== */

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current =
            entry.isIntersecting;


          if (
            entry.isIntersecting
            && video.paused
          ) {
            video
              .play()
              .catch(() => {});
          }
        },

        {
          root: null,

          rootMargin:
            "120px 0px",

          threshold:
            0.01,
        }
      );


    observer.observe(
      stage
    );


    /* =====================================================
       EVENT LISTENER
    ===================================================== */

    video.addEventListener(
      "loadedmetadata",
      setCanvasSize
    );


    video.addEventListener(
      "loadeddata",
      startProcessing
    );


    video.addEventListener(
      "error",
      handleVideoError
    );


    window.addEventListener(
      "resize",
      handleWindowResize,
      {
        passive: true,
      }
    );


    window.addEventListener(
      "orientationchange",
      handleWindowResize
    );


    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    if (
      video.readyState >= 2
    ) {
      startProcessing();
    }


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      stopped = true;


      observer.disconnect();


      video.removeEventListener(
        "loadedmetadata",
        setCanvasSize
      );


      video.removeEventListener(
        "loadeddata",
        startProcessing
      );


      video.removeEventListener(
        "error",
        handleVideoError
      );


      window.removeEventListener(
        "resize",
        handleWindowResize
      );


      window.removeEventListener(
        "orientationchange",
        handleWindowResize
      );


      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );


      if (
        animationFrameRef.current
        !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }


      if (
        videoFrameRef.current
        !== null
        && typeof video.cancelVideoFrameCallback
          === "function"
      ) {
        video.cancelVideoFrameCallback(
          videoFrameRef.current
        );
      }


      video.pause();
    };
  }, [source]);


  /* =======================================================
     KALAU VIDEO ERROR

     Tidak return <img>.
     Hanya tidak menampilkan karakter.
  ======================================================= */

  if (hasError) {
    return null;
  }


  /* =======================================================
     VIDEO
  ======================================================= */

  return (
    <div
      ref={stageRef}

      className={[
        "vertex-ar-video-stage",

        isReady
          ? "is-ready"
          : "is-loading",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <video
        ref={videoRef}

        className="vertex-ar-video-source"

        src={source}

        autoPlay

        loop

        muted

        playsInline

        preload="metadata"

        disablePictureInPicture

        aria-hidden="true"
      />


      <canvas
        ref={canvasRef}

        className={[
          "vertex-ar-video-canvas",

          isReady
            ? "is-ready"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}

        role="img"

        aria-label="Animasi karakter VertexAR menunjukkan bangun ruang pada tablet"
      />
    </div>
  );
}


/* =========================================================
   HALAMAN AR
========================================================= */

function AR() {
  const [
    selectedShape,
    setSelectedShape,
  ] = useState(
    "Kubus"
  );


  const [
    isNetOpen,
    setIsNetOpen,
  ] = useState(
    false
  );


  /* =======================================================
     GANTI BANGUN RUANG
  ======================================================= */

  function handleShapeChange(
    shape
  ) {
    setSelectedShape(
      shape
    );


    setIsNetOpen(
      false
    );
  }


  /* =======================================================
     JARING-JARING
  ======================================================= */

  function handleToggleNet() {
    setIsNetOpen(
      (current) =>
        !current
    );
  }


  /* =======================================================
     EMBED URL
  ======================================================= */

  const currentEmbedUrl =
    ASSEMBLR_EMBED_URLS[
      selectedShape
    ];


  return (
    <>
      <main className="vertex-ar-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
          className="vertex-ar-header"

          variants={
            revealAnimation
          }

          initial="hidden"

          animate="visible"
        >
          <h1>
            Eksplorasi Tiga Dimensi &amp; Simulasi AR
          </h1>


          <p>
            Akses visualisasi objek bangun ruang melalui
            QR Code yang terintegrasi dengan konten
            Augmented Reality pada platform Assemblr EDU.
          </p>
        </motion.header>


        {/* =================================================
            3D VIEWER
        ================================================= */}

        <motion.section
          className="vertex-ar-viewer-card"

          variants={
            revealAnimation
          }

          initial="hidden"

          animate="visible"
        >
          <div className="vertex-ar-viewer-header">
            <h2>
              Bangun Ruang 3D
            </h2>
          </div>


          <div className="vertex-ar-viewer-body">
            <ShapeViewer
              selectedShape={
                selectedShape
              }

              isNetOpen={
                isNetOpen
              }
            />
          </div>


          <div
            className="vertex-ar-shape-navigation"

            aria-label="Kontrol bangun ruang"

            style={{
              display:
                "flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap:
                "10px",
            }}
          >
            <div
              style={{
                width:
                  "100%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexWrap:
                  "wrap",

                gap:
                  "12px",
              }}
            >
              {SHAPES.map(
                (shape) => {
                  const isActive =
                    selectedShape
                    === shape;


                  return (
                    <button
                      key={
                        shape
                      }

                      type="button"

                      onClick={() =>
                        handleShapeChange(
                          shape
                        )
                      }

                      className={[
                        "vertex-ar-shape-button",

                        isActive
                          ? "vertex-ar-shape-button-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}

                      aria-label={`Tampilkan bangun ruang ${shape}`}

                      aria-pressed={
                        isActive
                      }
                    >
                      <span>
                        {shape}
                      </span>
                    </button>
                  );
                }
              )}
            </div>


            <button
              type="button"

              onClick={
                handleToggleNet
              }

              className="vertex-ar-shape-button"

              aria-pressed={
                isNetOpen
              }
            >
              <span>
                {isNetOpen
                  ? "Tutup Jaring-jaring"
                  : "Buka Jaring-jaring"}
              </span>
            </button>
          </div>
        </motion.section>


        {/* =================================================
            QR CODE
        ================================================= */}

        <motion.section
          className="vertex-ar-qr-card"

          variants={
            revealAnimation
          }

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:
              true,

            amount:
              0.2,
          }}
        >
          <h2>
            Visualisasi AR melalui
            <br />

            QR Code
          </h2>


          <p>
            Pindai QR Code di bawah menggunakan
            smartphone untuk menampilkan bangun ruang
            dalam Augmented Reality melalui Assemblr EDU.
          </p>


          <div className="vertex-ar-qr-placeholder">
            <motion.img
              key={
                selectedShape
              }

              src={
                QR_CODES[
                  selectedShape
                ]
              }

              alt={`QR Code Augmented Reality ${selectedShape}`}

              className="vertex-ar-qr-image"

              initial={{
                opacity:
                  0,

                scale:
                  0.94,
              }}

              animate={{
                opacity:
                  1,

                scale:
                  1,
              }}

              transition={{
                duration:
                  0.25,

                ease:
                  "easeOut",
              }}

              draggable="false"
            />
          </div>


          <div className="vertex-ar-target">
            Target AR:{" "}

            <strong>
              {selectedShape}
            </strong>
          </div>
        </motion.section>


        {/* =================================================
            AR EXPERIENCE
        ================================================= */}

        <motion.section
          className="vertex-assemblr-card"

          variants={
            revealAnimation
          }

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:
              true,

            amount:
              0.1,
          }}
        >

          {/* TITLE */}

          <div className="vertex-assemblr-title">
            <h2>
              AR Experience
            </h2>
          </div>


          {/* =================================================
              EMBED SCREEN
          ================================================= */}

          <div className="vertex-assemblr-screen">
            {currentEmbedUrl ? (
              <iframe
                key={
                  `${selectedShape}-assemblr`
                }

                src={
                  currentEmbedUrl
                }

                title={`AR ${selectedShape} Assemblr EDU`}

                className="vertex-assemblr-iframe"

                loading="lazy"

                allow="
                  camera;
                  microphone;
                  accelerometer;
                  gyroscope;
                  autoplay;
                  fullscreen;
                  xr-spatial-tracking
                "

                allowFullScreen
              />
            ) : (
              <div className="vertex-assemblr-placeholder">
                <span>
                  AR {selectedShape}
                </span>


                <p>
                  Embed Assemblr EDU akan tampil di sini.
                </p>
              </div>
            )}
          </div>


          {/* =================================================
              TEXT
          ================================================= */}

          <div className="vertex-assemblr-description">
            <h3>
              Coba Augmented Reality
              <br />

              Langsung di Sini!
            </h3>


            <p>
              Jelajahi bangun ruang secara lebih nyata
              melalui tampilan Augmented Reality dari
              Assemblr EDU
            </p>
          </div>


          {/* =================================================
              TARGET
          ================================================= */}

          <div className="vertex-assemblr-target">
            Target AR:{" "}

            <strong>
              {selectedShape}
            </strong>
          </div>
        </motion.section>


        {/* =================================================
            EXPLORE
        ================================================= */}

        <motion.section
          className="vertex-ar-explore"

          variants={
            revealAnimation
          }

          initial="hidden"

          whileInView="visible"

          viewport={{
            once:
              true,

            amount:
              0.2,
          }}
        >
          <div className="vertex-ar-explore-content">
            <h2>
              Ayo Jelajahi Bangun
              <br />

              <span>
                Ruang Lebih Seru!
              </span>
            </h2>


            <p>
              Temukan bentuk bangun ruang secara
              interaktif melalui model 3D dan Augmented
              Reality untuk pengalaman belajar yang
              lebih nyata.
            </p>
          </div>


          <div className="vertex-ar-character-wrapper">
            <ChromaKeyVideo
              source={
                mascotVideo
              }
            />
          </div>
        </motion.section>
      </main>


      <Footer />
    </>
  );
}


export default AR;