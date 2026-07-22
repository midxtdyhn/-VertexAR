import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

function ShapeModel({ type }) {
  const material = (
    <meshStandardMaterial
      color="#2f3dbf"
      roughness={0.45}
      metalness={0.15}
    />
  );

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      {type === "Kubus" && (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          {material}
        </mesh>
      )}

      {type === "Balok" && (
        <mesh>
          <boxGeometry args={[3, 1.7, 1.7]} />
          {material}
        </mesh>
      )}

      {type === "Tabung" && (
        <mesh>
          <cylinderGeometry args={[1, 1, 2.5, 64]} />
          {material}
        </mesh>
      )}

      {type === "Kerucut" && (
        <mesh>
          <coneGeometry args={[1.2, 2.6, 64]} />
          {material}
        </mesh>
      )}

      {type === "Bola" && (
        <mesh>
          <sphereGeometry args={[1.3, 64, 64]} />
          {material}
        </mesh>
      )}

      {type === "Limas" && (
        <mesh>
          <coneGeometry args={[1.5, 2.4, 4]} />
          {material}
        </mesh>
      )}

      {type === "Prisma" && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.2, 1.2, 2.8, 3]} />
          {material}
        </mesh>
      )}
    </Float>
  );
}

function ShapeViewer({ selectedShape }) {
  return (
    <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} />
      <directionalLight position={[-5, 3, -3]} intensity={1} />

      <ShapeModel type={selectedShape} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.5}
      />
    </Canvas>
  );
}

export default ShapeViewer;