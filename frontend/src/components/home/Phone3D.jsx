import {
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import {
  RoundedBox,
  useVideoTexture,
} from "@react-three/drei";

import * as THREE from "three";


/* =========================================================
   VIDEO SCREEN
========================================================= */

function PhoneScreen({
  videoSrc,
}) {
  const videoTexture =
    useVideoTexture(
      videoSrc,
      {
        muted: true,
        loop: true,
        playsInline: true,
        start: true,
        crossOrigin: "anonymous",
      }
    );


  return (
    <mesh
      position={[
        0,
        -0.025,
        0.191,
      ]}
    >
      <planeGeometry
        args={[
          1.91,
          4.03,
        ]}
      />

      <meshBasicMaterial
        map={videoTexture}
        toneMapped={false}
      />
    </mesh>
  );
}


/* =========================================================
   EASING

   SmootherStep mempunyai transisi awal dan akhir
   yang lebih lembut dibanding easeOut biasa.
========================================================= */

function smootherStep(
  value
) {
  const t =
    THREE.MathUtils.clamp(
      value,
      0,
      1
    );


  return (
    t
    * t
    * t
    * (
      t
      * (
        t * 6
        - 15
      )
      + 10
    )
  );
}


/* =========================================================
   PHONE
========================================================= */

function Phone3D({
  videoSrc,
}) {
  /*
    introRef:
    mengatur keseluruhan gerakan masuk HP.

    floatRef:
    hanya untuk gerakan melayang setelah intro.

    Dipisah agar transform tidak saling berebut.
  */

  const introRef =
    useRef(null);

  const floatRef =
    useRef(null);

  const startTimeRef =
    useRef(null);


  useFrame(
    (
      state,
      delta
    ) => {
      if (
        !introRef.current
        || !floatRef.current
      ) {
        return;
      }


      const time =
        state.clock.elapsedTime;


      if (
        startTimeRef.current
        === null
      ) {
        startTimeRef.current =
          time;
      }


      const elapsed =
        time
        - startTimeRef.current;


      /* ===================================================
         INTRO

         3 detik supaya putarannya terlihat
         lebih smooth dan tidak terlalu cepat.
      =================================================== */

      const introDuration =
        3;


      const rawProgress =
        elapsed
        / introDuration;


      const progress =
        smootherStep(
          rawProgress
        );


      /* ===================================================
         ROTASI Y

         Sekitar 1,5 putaran.

         Sebelumnya 2 putaran cukup cepat,
         sehingga mata bisa melihat seperti frame skip.
      =================================================== */

      const finalRotationY =
        -0.28;


      const totalRotation =
        Math.PI * 3;


      introRef.current.rotation.y =
        finalRotationY
        - totalRotation
        * (
          1
          - progress
        );


      /* ===================================================
         ROTASI X

         Awalnya sedikit miring ke belakang.
      =================================================== */

      introRef.current.rotation.x =
        THREE.MathUtils.lerp(
          0.17,
          0.035,
          progress
        );


      /* ===================================================
         SCALE

         Tidak terlalu kecil saat awal.
      =================================================== */

      const introScale =
        THREE.MathUtils.lerp(
          0.9,
          1,
          progress
        );


      introRef.current.scale.setScalar(
        introScale
      );


      /* ===================================================
         POSISI INTRO

         HP masuk sedikit dari bawah.
      =================================================== */

      introRef.current.position.y =
        THREE.MathUtils.lerp(
          -0.32,
          0,
          progress
        );


      /* ===================================================
         IDLE BLEND

         Floating sudah mulai masuk secara perlahan
         sebelum intro benar-benar selesai.

         Ini mencegah transisi:
         "putar -> berhenti -> tiba-tiba floating"
      =================================================== */

      const idleBlend =
        smootherStep(
          (
            elapsed
            - 2.25
          )
          / 0.9
        );


      const idleTime =
        Math.max(
          0,
          elapsed
          - 2.25
        );


      /*
        Target floating.
      */

      const targetFloatY =
        Math.sin(
          idleTime
          * 1.05
        )
        * 0.055
        * idleBlend;


      const targetFloatX =
        Math.sin(
          idleTime
          * 0.48
        )
        * 0.012
        * idleBlend;


      const targetTiltZ =
        Math.sin(
          idleTime
          * 0.62
        )
        * 0.012
        * idleBlend;


      /*
        Damp digunakan supaya floating
        juga tidak meloncat antar-frame.
      */

      floatRef.current.position.y =
        THREE.MathUtils.damp(
          floatRef.current.position.y,
          targetFloatY,
          5,
          delta
        );


      floatRef.current.position.x =
        THREE.MathUtils.damp(
          floatRef.current.position.x,
          targetFloatX,
          5,
          delta
        );


      floatRef.current.rotation.z =
        THREE.MathUtils.damp(
          floatRef.current.rotation.z,
          targetTiltZ,
          4,
          delta
        );
    }
  );


  return (
    <group ref={introRef}>

      <group ref={floatRef}>

        {/* =================================================
            BODY HP
        ================================================= */}

        <RoundedBox
          args={[
            2.28,
            4.62,
            0.24,
          ]}
          radius={0.2}
          smoothness={6}
        >
          <meshPhysicalMaterial
            color="#3478e5"
            metalness={0.42}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </RoundedBox>


        {/* =================================================
            BEZEL
        ================================================= */}

        <RoundedBox
          args={[
            2.12,
            4.42,
            0.065,
          ]}
          radius={0.16}
          smoothness={6}
          position={[
            0,
            0,
            0.145,
          ]}
        >
          <meshStandardMaterial
            color="#07142d"
            metalness={0.12}
            roughness={0.32}
          />
        </RoundedBox>


        {/* =================================================
            VIDEO SCREEN
        ================================================= */}

        <PhoneScreen
          videoSrc={videoSrc}
        />


        {/* =================================================
            CAMERA / DYNAMIC ISLAND
        ================================================= */}

        <RoundedBox
          args={[
            0.46,
            0.12,
            0.025,
          ]}
          radius={0.055}
          smoothness={4}
          position={[
            0,
            2.03,
            0.212,
          ]}
        >
          <meshStandardMaterial
            color="#020714"
            roughness={0.35}
          />
        </RoundedBox>


        {/* =================================================
            POWER
        ================================================= */}

        <RoundedBox
          args={[
            0.055,
            0.64,
            0.105,
          ]}
          radius={0.025}
          smoothness={3}
          position={[
            1.16,
            0.62,
            0,
          ]}
        >
          <meshStandardMaterial
            color="#235aa9"
            metalness={0.45}
            roughness={0.24}
          />
        </RoundedBox>


        {/* =================================================
            VOLUME UP
        ================================================= */}

        <RoundedBox
          args={[
            0.055,
            0.42,
            0.105,
          ]}
          radius={0.025}
          smoothness={3}
          position={[
            -1.16,
            0.72,
            0,
          ]}
        >
          <meshStandardMaterial
            color="#235aa9"
            metalness={0.45}
            roughness={0.24}
          />
        </RoundedBox>


        {/* =================================================
            VOLUME DOWN
        ================================================= */}

        <RoundedBox
          args={[
            0.055,
            0.42,
            0.105,
          ]}
          radius={0.025}
          smoothness={3}
          position={[
            -1.16,
            0.15,
            0,
          ]}
        >
          <meshStandardMaterial
            color="#235aa9"
            metalness={0.45}
            roughness={0.24}
          />
        </RoundedBox>


        {/* =================================================
            CAMERA BUMP BELAKANG
        ================================================= */}

        <RoundedBox
          args={[
            0.8,
            0.82,
            0.09,
          ]}
          radius={0.16}
          smoothness={5}
          position={[
            -0.58,
            1.62,
            -0.17,
          ]}
        >
          <meshPhysicalMaterial
            color="#2868c7"
            metalness={0.35}
            roughness={0.22}
            clearcoat={0.8}
          />
        </RoundedBox>


        {/* =================================================
            CAMERA 1
        ================================================= */}

        <mesh
          position={[
            -0.75,
            1.78,
            -0.23,
          ]}
          rotation={[
            0,
            Math.PI,
            0,
          ]}
        >
          <circleGeometry
            args={[
              0.16,
              32,
            ]}
          />

          <meshPhysicalMaterial
            color="#08132c"
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>


        {/* =================================================
            CAMERA 2
        ================================================= */}

        <mesh
          position={[
            -0.43,
            1.48,
            -0.23,
          ]}
          rotation={[
            0,
            Math.PI,
            0,
          ]}
        >
          <circleGeometry
            args={[
              0.16,
              32,
            ]}
          />

          <meshPhysicalMaterial
            color="#08132c"
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>

      </group>
    </group>
  );
}


export default Phone3D;