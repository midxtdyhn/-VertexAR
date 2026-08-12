import {
  Suspense,
  useMemo,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";


/* =========================================================
   LOADING MODEL
========================================================= */

function LoadingModel() {
  return (
    <Html center>
      <div
        style={{
          padding: "8px 14px",

          color: "#073b91",
          background: "#ffffff",

          borderRadius: "999px",

          fontFamily:
            "Poppins, sans-serif",

          fontSize: "13px",
          fontWeight: 700,

          whiteSpace: "nowrap",

          boxShadow:
            "0 6px 18px rgba(7, 59, 145, 0.15)",
        }}
      >
        Memuat model 3D...
      </div>
    </Html>
  );
}


/* =========================================================
   MODEL GLTF / GLB

   Model di-clone agar objek asli dari cache useGLTF
   tidak ikut berubah ketika digunakan di tempat lain.
========================================================= */

function Model({
  model,
  scale = 1.8,
}) {
  const gltf =
    useGLTF(model);


  const clonedScene =
    useMemo(
      () => {
        const scene =
          gltf.scene.clone(true);


        /*
          Pastikan semua mesh tetap menggunakan
          material masing-masing dari file GLTF.

          Tidak mengubah warna atau desain model.
        */

        scene.traverse(
          (object) => {
            if (!object.isMesh) {
              return;
            }


            object.frustumCulled =
              true;
          }
        );


        return scene;
      },

      [
        gltf.scene,
      ]
    );


  return (
    <primitive
      object={
        clonedScene
      }
      scale={
        scale
      }
      position={[
        0,
        0,
        0,
      ]}
    />
  );
}


/* =========================================================
   VIEWER 3D

   Fungsi utama tetap sama:
   - rotate
   - zoom
   - auto rotate
   - lighting
   - environment
========================================================= */

function Viewer3D({
  model,

  scale = 1.8,

  /*
    Prop tambahan ini hanya memberikan pilihan.

    Kalau Viewer3D dipakai seperti sebelumnya:

    <Viewer3D model={model} />

    tampilannya TETAP sama.
  */

  enablePan = false,
  enableZoom = true,

  autoRotate = true,
  autoRotateSpeed = 1.5,

  minDistance = 2.5,
  maxDistance = 8,
}) {
  /*
    Kalau tidak ada file model,
    tampilan lama tetap dipertahankan.
  */

  if (!model) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",

          minHeight: "280px",

          display: "flex",

          alignItems: "center",
          justifyContent: "center",

          color: "#073b91",
          background: "#dff5ff",

          fontFamily:
            "Poppins, sans-serif",

          fontWeight: 700,
        }}
      >
        Model 3D belum tersedia.
      </div>
    );
  }


  return (
    <Canvas
      /*
        Canvas dibuat ulang jika model berubah.

        Ini mencegah posisi/rotasi model sebelumnya
        terbawa ke model berikutnya.
      */

      key={
        model
      }

      camera={{
        position: [
          3,
          3,
          4,
        ],

        fov: 45,

        near: 0.1,
        far: 100,
      }}

      gl={{
        antialias: true,
        alpha: true,
      }}

      dpr={[
        1,
        2,
      ]}
    >
      {/* ===================================================
          LIGHTING
      =================================================== */}

      <ambientLight
        intensity={1}
      />


      <directionalLight
        position={[
          5,
          5,
          5,
        ]}
        intensity={2}
      />


      {/* Cahaya tambahan sangat ringan.

          Tujuannya hanya mencegah sisi belakang model
          menjadi terlalu gelap.

          Tidak mengubah warna model.
      */}

      <directionalLight
        position={[
          -4,
          2,
          -4,
        ]}
        intensity={0.35}
      />


      {/* ===================================================
          MODEL
      =================================================== */}

      <Suspense
        fallback={
          <LoadingModel />
        }
      >
        <Environment
          preset="city"
        />


        <Model
          model={
            model
          }
          scale={
            scale
          }
        />
      </Suspense>


      {/* ===================================================
          CONTROLLER
      =================================================== */}

      <OrbitControls
        /*
          Rotate tetap aktif.
        */

        enableRotate


        /*
          Default false agar perilaku
          halaman lama tidak berubah.

          Kalau suatu saat ingin pan:

          <Viewer3D
            model={model}
            enablePan
          />
        */

        enablePan={
          enablePan
        }


        enableZoom={
          enableZoom
        }


        minDistance={
          minDistance
        }

        maxDistance={
          maxDistance
        }


        autoRotate={
          autoRotate
        }

        autoRotateSpeed={
          autoRotateSpeed
        }


        /*
          Membuat rotate / zoom berhenti
          secara halus dan tidak kaku.
        */

        enableDamping

        dampingFactor={
          0.08
        }


        rotateSpeed={
          0.9
        }

        zoomSpeed={
          0.9
        }
      />
    </Canvas>
  );
}


export default Viewer3D;