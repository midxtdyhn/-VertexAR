import {
  Suspense,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import Phone3D
  from "./Phone3D";


function PhoneScene({
  videoSrc,
}) {
  return (
    <div className="vertex-hero-phone-scene">
      <Canvas
        frameloop="always"

        camera={{
          position: [
            0,
            0.15,
            7.8,
          ],

          fov: 34,

          near: 0.1,

          far: 100,
        }}

        gl={{
          antialias: true,
          alpha: true,

          /*
            Meminta browser memilih GPU
            berperforma tinggi kalau tersedia.
          */
          powerPreference:
            "high-performance",
        }}

        /*
          SEBELUMNYA:
          dpr={[1, 2]}

          Untuk Canvas dengan video texture,
          DPR 2 bisa cukup berat.

          1.5 masih terlihat tajam
          tetapi jauh lebih ringan.
        */

        dpr={[
          1,
          1.5,
        ]}
      >

        {/* =================================================
            LIGHT
        ================================================= */}

        <ambientLight
          intensity={1.3}
        />


        <directionalLight
          position={[
            5,
            6,
            5,
          ]}
          intensity={2.3}
          color="#ffffff"
        />


        <directionalLight
          position={[
            -5,
            3,
            2,
          ]}
          intensity={1}
          color="#9fd7ff"
        />


        {/* =================================================
            PHONE
        ================================================= */}

        <Suspense fallback={null}>
          <Environment
            preset="city"
          />


          <Phone3D
            videoSrc={videoSrc}
          />
        </Suspense>


        {/* =================================================
            CONTROLS
        ================================================= */}

        <OrbitControls
          enableRotate
          enableZoom

          enablePan={false}

          /*
            Jangan pakai autoRotate.
            Rotasi opening ditangani Phone3D.
          */

          autoRotate={false}

          enableDamping

          dampingFactor={0.06}

          rotateSpeed={0.65}

          zoomSpeed={0.6}

          minDistance={6}

          maxDistance={9}

          minPolarAngle={
            Math.PI
            / 2.8
          }

          maxPolarAngle={
            Math.PI
            / 1.65
          }

          target={[
            0,
            0,
            0,
          ]}
        />
      </Canvas>
    </div>
  );
}


export default PhoneScene;