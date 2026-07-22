import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

function CubeObject() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
    </Float>
  );
}

function Cube3D() {
  return (
    <div className="h-80 w-80 rounded-3xl bg-blue-100">
      <Canvas camera={{ position: [4, 4, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <CubeObject />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default Cube3D;