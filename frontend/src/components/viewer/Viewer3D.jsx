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

function Model({
  model,
  scale = 1.8,
}) {
  const gltf = useGLTF(model);

  const clonedScene = useMemo(
    () => gltf.scene.clone(true),
    [gltf.scene]
  );

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={[0, 0, 0]}
    />
  );
}

function Viewer3D({
  model,
  scale = 1.8,
}) {
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
      key={model}
      camera={{
        position: [3, 3, 4],
        fov: 45,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
    >
      <ambientLight
        intensity={1}
      />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <Suspense
        fallback={<LoadingModel />}
      >
        <Environment
          preset="city"
        />

        <Model
          model={model}
          scale={scale}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.5}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={1.5}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}

export default Viewer3D;