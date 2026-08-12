import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  OrbitControls,
} from "@react-three/drei";

import FoldingShape from "./FoldingShape";


const MOBILE_SCREEN_QUERY =
  "(max-width: 768px)";


function useMobileScreen() {
  const [
    isMobile,
    setIsMobile,
  ] = useState(() => {
    if (
      typeof window
      === "undefined"
    ) {
      return false;
    }


    return window
      .matchMedia(
        MOBILE_SCREEN_QUERY
      )
      .matches;
  });


  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        MOBILE_SCREEN_QUERY
      );


    function handleScreenChange(
      event
    ) {
      setIsMobile(
        event.matches
      );
    }


    setIsMobile(
      mediaQuery.matches
    );


    if (
      typeof mediaQuery.addEventListener
      === "function"
    ) {
      mediaQuery.addEventListener(
        "change",
        handleScreenChange
      );


      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleScreenChange
        );
      };
    }


    mediaQuery.addListener(
      handleScreenChange
    );


    return () => {
      mediaQuery.removeListener(
        handleScreenChange
      );
    };
  }, []);


  return isMobile;
}


function ShapeViewer({
  selectedShape,
  isNetOpen = false,
}) {
  const isMobile =
    useMobileScreen();


  const cameraConfiguration =
    isMobile
      ? {
          position: [
            5.3,
            3.9,
            6.8,
          ],

          fov: 47,
        }

      : {
          position: [
            4.8,
            3.5,
            6.2,
          ],

          fov: 43,
        };


  const pixelRatio =
    isMobile
      ? [
          1,
          1.4,
        ]

      : [
          1,
          2,
        ];


  return (
    <Canvas
      key={
        isMobile
          ? "shape-viewer-mobile"
          : "shape-viewer-desktop"
      }
      className="vertex-shape-canvas"
      camera={
        cameraConfiguration
      }
      gl={{
        antialias: true,
        alpha: true,
      }}
      dpr={
        pixelRatio
      }
    >
      <Suspense fallback={null}>
        <ambientLight
          intensity={1.35}
        />


        <directionalLight
          position={[
            5,
            6,
            5,
          ]}
          intensity={2.2}
          color="#ffffff"
        />


        <directionalLight
          position={[
            -5,
            2,
            -3,
          ]}
          intensity={1.15}
          color="#8197ff"
        />


        <pointLight
          position={[
            0,
            -3,
            4,
          ]}
          intensity={0.5}
          color="#a9d8f3"
        />


        <FoldingShape
          key={
            selectedShape
          }
          type={
            selectedShape
          }
          open={
            isNetOpen
          }
        />


        <OrbitControls
          /*
            Bangun ruang tertutup:
            bisa diputar seperti biasa.

            Jaring-jaring:
            rotation dimatikan sementara
            supaya selalu tampak seperti
            gambar jaring-jaring normal.
          */

          enableRotate={
            !isNetOpen
          }

          enablePan
          enableZoom

          minDistance={
            isMobile
              ? 4
              : 3.4
          }

          maxDistance={10}

          autoRotate={
            !isNetOpen
          }

          autoRotateSpeed={1.1}

          dampingFactor={0.08}
          enableDamping

          rotateSpeed={
            isMobile
              ? 0.75
              : 1
          }

          zoomSpeed={
            isMobile
              ? 0.75
              : 1
          }

          panSpeed={
            isMobile
              ? 0.65
              : 0.9
          }
        />
      </Suspense>
    </Canvas>
  );
}


export default ShapeViewer;