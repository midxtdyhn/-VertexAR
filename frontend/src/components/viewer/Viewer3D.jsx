import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function Model({ model }) {
  const gltf = useGLTF(model);

  return (
    <primitive
      object={gltf.scene}
      scale={1.8}
    />
  );
}

function Viewer3D({ model }) {
  return (
    <Canvas
      camera={{
        position: [3, 3, 4],
        fov: 45,
      }}
    >
      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <Environment preset="city" />

      <Model model={model} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </Canvas>
  );
}

export default Viewer3D;