import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Edges,
  Float,
  OrbitControls,
} from "@react-three/drei";


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


function ShapeMaterial({
  showEdges = true,
}) {
  return (
    <>
      <meshStandardMaterial
        color="#202276"
        roughness={0.38}
        metalness={0.12}
      />

      {showEdges && (
        <Edges
          scale={1.002}
          threshold={15}
          color="#5f67c8"
        />
      )}
    </>
  );
}


function ShapeModel({
  type,
}) {
  return (
    <Float
      speed={1.45}
      rotationIntensity={0.22}
      floatIntensity={0.28}
    >
      {type === "Kubus" && (
        <mesh
          rotation={[
            0.08,
            -0.45,
            0.05,
          ]}
        >
          <boxGeometry
            args={[
              1.75,
              1.75,
              1.75,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Balok" && (
        <mesh
          rotation={[
            0.08,
            -0.45,
            0.03,
          ]}
        >
          <boxGeometry
            args={[
              2.55,
              1.55,
              1.55,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Tabung" && (
        <mesh
          rotation={[
            0.02,
            -0.35,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.9,
              0.9,
              2.15,
              64,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Kerucut" && (
        <mesh
          rotation={[
            0.02,
            -0.35,
            0,
          ]}
        >
          <coneGeometry
            args={[
              1.05,
              2.25,
              64,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Limas" && (
        <mesh
          rotation={[
            0.02,
            -0.45,
            0,
          ]}
        >
          <coneGeometry
            args={[
              1.25,
              2.05,
              4,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Prisma" && (
        <mesh
          rotation={[
            0,
            0,
            Math.PI / 2,
          ]}
        >
          <cylinderGeometry
            args={[
              1,
              1,
              2.35,
              3,
            ]}
          />

          <ShapeMaterial />
        </mesh>
      )}


      {type === "Bola" && (
        <mesh>
          <sphereGeometry
            args={[
              1.15,
              64,
              64,
            ]}
          />

          <ShapeMaterial
            showEdges={false}
          />
        </mesh>
      )}
    </Float>
  );
}


function ShapeViewer({
  selectedShape,
}) {
  const isMobile =
    useMobileScreen();


  /*
    Konfigurasi desktop tetap memakai
    nilai dari kode sebelumnya.

    Pada HP, kamera sedikit dijauhkan
    agar objek tidak terpotong.
  */

  const cameraConfiguration =
    isMobile
      ? {
          position: [
            4.8,
            3.6,
            6.1,
          ],
          fov: 46,
        }
      : {
          position: [
            4.3,
            3.2,
            5.3,
          ],
          fov: 42,
        };


  /*
    DPR desktop tetap maksimal 2.

    DPR HP dibatasi agar animasi 3D
    tidak terlalu berat dan tetap halus.
  */

  const pixelRatio =
    isMobile
      ? [1, 1.4]
      : [1, 2];


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

        <ShapeModel
          key={
            selectedShape
          }
          type={
            selectedShape
          }
        />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={
            isMobile
              ? 3.8
              : 3.3
          }
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1.25}
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
        />
      </Suspense>
    </Canvas>
  );
}


export default ShapeViewer;