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
import karakterFallback from "../assets/images/karakter-ar.png";


const SHAPES = [
  "Kubus",
  "Balok",
  "Tabung",
  "Kerucut",
  "Limas",
  "Prisma",
  "Bola",
];


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
   VIDEO WEBM DENGAN PENGHAPUSAN GREEN SCREEN
========================================================= */

function ChromaKeyVideo({
  source,
  fallback,
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
    let firstFrameRendered = false;


    function getMaximumCanvasWidth() {
      /*
        Desktop tetap memakai ukuran lama.
        Resolusi hanya diperkecil di HP agar
        pemrosesan green screen lebih ringan.
      */

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


        /*
          Menghapus background hijau utama.
        */

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


          /*
            Mengurangi warna hijau
            pada tepi karakter.
          */

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
          /*
            Mengurangi sisa pantulan
            warna hijau tipis.
          */

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


      if (!firstFrameRendered) {
        firstFrameRendered = true;

        setIsReady(true);
      }
    }


    function renderWithAnimationFrame(
      timestamp
    ) {
      if (stopped) {
        return;
      }


      /*
        Pemrosesan dibatasi sekitar 24 FPS
        agar tetap ringan pada HP.
      */

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


    function handleVideoError() {
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
          .catch(() => {
            /*
              Tidak perlu menampilkan error.
              Browser dapat menahan autoplay.
            */
          });
      }
    }


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
              .catch(() => {
                /*
                  Autoplay dapat tertahan
                  oleh kebijakan browser.
                */
              });
          }
        },
        {
          root: null,
          rootMargin: "120px 0px",
          threshold: 0.01,
        }
      );


    observer.observe(stage);


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


  if (hasError) {
    return (
      <img
        src={fallback}
        alt="Karakter VertexAR membawa perangkat Augmented Reality"
        className="vertex-ar-video-fallback"
      />
    );
  }


  return (
    <div
      ref={stageRef}
      className="vertex-ar-video-stage"
    >
      {/*
        Video asli tetap berjalan,
        tetapi tidak ditampilkan kepada pengguna.
      */}

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

      {!isReady && (
        <img
          src={fallback}
          alt=""
          aria-hidden="true"
          className="vertex-ar-video-loading"
        />
      )}

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
   HALAMAN AUGMENTED REALITY
========================================================= */

function AR() {
  const [
    selectedShape,
    setSelectedShape,
  ] = useState("Kubus");


  return (
    <>
      <main className="vertex-ar-page">
        <motion.header
          className="vertex-ar-header"
          variants={revealAnimation}
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


        <motion.section
          className="vertex-ar-viewer-card"
          variants={revealAnimation}
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
            />
          </div>

          <div
            className="vertex-ar-shape-navigation"
            aria-label="Pilih bentuk bangun ruang"
          >
            {SHAPES.map(
              (shape) => {
                const isActive =
                  selectedShape
                  === shape;

                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() =>
                      setSelectedShape(
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
        </motion.section>


        <motion.section
          className="vertex-ar-qr-card"
          variants={revealAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
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
            <span>
              QR Assemblr EDU
            </span>
          </div>

          <div className="vertex-ar-target">
            Target AR:{" "}

            <strong>
              {selectedShape}
            </strong>
          </div>
        </motion.section>


        <motion.section
          className="vertex-ar-explore"
          variants={revealAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
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
              source={mascotVideo}
              fallback={karakterFallback}
            />
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}


export default AR;