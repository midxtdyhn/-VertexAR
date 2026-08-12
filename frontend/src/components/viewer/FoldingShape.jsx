import {
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import {
  Billboard,
  Edges,
} from "@react-three/drei";

import * as THREE from "three";


/* =========================================================
   WARNA
========================================================= */

const SHAPE_COLOR =
  "#080965";

const EDGE_COLOR =
  "#747ce2";


/* =========================================================
   UTILITAS
========================================================= */

function clamp01(value) {
  return THREE.MathUtils.clamp(
    value,
    0,
    1
  );
}


function smoothStep(value) {
  const t =
    clamp01(value);

  return (
    t
    * t
    * (
      3
      - 2 * t
    )
  );
}


/* =========================================================
   MATERIAL JARING-JARING
========================================================= */

function NetMaterial({
  progressRef,
}) {
  const materialRef =
    useRef(null);


  useFrame(() => {
    if (!materialRef.current) {
      return;
    }


    const raw =
      (
        progressRef.current
        - 0.28
      )
      / 0.55;


    const opacity =
      smoothStep(raw);


    materialRef.current.opacity =
      opacity;

    materialRef.current.visible =
      opacity > 0.01;
  });


  return (
    <meshStandardMaterial
      ref={materialRef}
      color={SHAPE_COLOR}
      roughness={0.38}
      metalness={0.05}
      transparent
      opacity={0}
      side={THREE.DoubleSide}
      polygonOffset
      polygonOffsetFactor={-1}
      polygonOffsetUnits={-1}
    />
  );
}


/* =========================================================
   GARIS JARING-JARING
========================================================= */

function NetEdges({
  progressRef,
}) {
  const lineRef =
    useRef(null);


  useFrame(() => {
    if (!lineRef.current) {
      return;
    }


    const raw =
      (
        progressRef.current
        - 0.3
      )
      / 0.52;


    const opacity =
      smoothStep(raw);


    lineRef.current.visible =
      opacity > 0.01;


    if (
      lineRef.current.material
    ) {
      lineRef.current.material.transparent =
        true;

      lineRef.current.material.opacity =
        opacity;
    }
  });


  return (
    <Edges
      ref={lineRef}
      scale={1.002}
      threshold={5}
      color={EDGE_COLOR}
    />
  );
}


/* =========================================================
   GARIS BANGUN RUANG

   threshold default = 5 untuk bangun bersudut.

   Untuk Tabung dan Kerucut kita akan memakai
   threshold jauh lebih tinggi supaya garis-garis
   kecil antarsegmen TIDAK terlihat.
========================================================= */

function SolidEdges({
  progressRef,
  threshold = 5,
}) {
  const lineRef =
    useRef(null);


  useFrame(() => {
    if (!lineRef.current) {
      return;
    }


    const opacity =
      1
      - smoothStep(
          progressRef.current
          / 0.48
        );


    lineRef.current.visible =
      opacity > 0.01;


    if (
      lineRef.current.material
    ) {
      lineRef.current.material.transparent =
        true;

      lineRef.current.material.opacity =
        opacity;
    }
  });


  return (
    <Edges
      ref={lineRef}
      color={EDGE_COLOR}
      threshold={threshold}
    />
  );
}


/* =========================================================
   PANEL PERSEGI / PERSEGI PANJANG
========================================================= */

function RectanglePanel({
  progressRef,

  width = 1,
  height = 1,

  position = [
    0,
    0,
    0,
  ],

  rotation = [
    0,
    0,
    0,
  ],
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
    >
      <planeGeometry
        args={[
          width,
          height,
        ]}
      />

      <NetMaterial
        progressRef={progressRef}
      />

      <NetEdges
        progressRef={progressRef}
      />
    </mesh>
  );
}


/* =========================================================
   PANEL LINGKARAN
========================================================= */

function CirclePanel({
  progressRef,

  radius = 1,

  position = [
    0,
    0,
    0,
  ],
}) {
  return (
    <mesh
      position={position}
    >
      <circleGeometry
        args={[
          radius,
          64,
        ]}
      />

      <NetMaterial
        progressRef={progressRef}
      />

      <NetEdges
        progressRef={progressRef}
      />
    </mesh>
  );
}


/* =========================================================
   PANEL SEGITIGA
========================================================= */

function TrianglePanel({
  progressRef,

  width = 1,
  height = 1,

  position = [
    0,
    0,
    0,
  ],

  rotation = [
    0,
    0,
    0,
  ],
}) {
  const shape =
    useMemo(() => {
      const triangle =
        new THREE.Shape();


      triangle.moveTo(
        -width / 2,
        -height / 2
      );


      triangle.lineTo(
        width / 2,
        -height / 2
      );


      triangle.lineTo(
        0,
        height / 2
      );


      triangle.closePath();


      return triangle;
    }, [
      width,
      height,
    ]);


  return (
    <mesh
      position={position}
      rotation={rotation}
    >
      <shapeGeometry
        args={[
          shape,
        ]}
      />

      <NetMaterial
        progressRef={progressRef}
      />

      <NetEdges
        progressRef={progressRef}
      />
    </mesh>
  );
}


/* =========================================================
   SEKTOR KERUCUT
========================================================= */

function ConeSectorPanel({
  progressRef,

  radius = 1.62,

  position = [
    0,
    0,
    0,
  ],
}) {
  const shape =
    useMemo(() => {
      const sector =
        new THREE.Shape();


      const sectorAngle =
        Math.PI / 2;


      const middleAngle =
        -Math.PI / 2;


      const startAngle =
        middleAngle
        - sectorAngle / 2;


      const endAngle =
        middleAngle
        + sectorAngle / 2;


      const segments =
        80;


      sector.moveTo(
        0,
        0
      );


      sector.lineTo(
        Math.cos(startAngle)
          * radius,

        Math.sin(startAngle)
          * radius
      );


      for (
        let index = 1;
        index <= segments;
        index += 1
      ) {
        const progress =
          index / segments;


        const angle =
          THREE.MathUtils.lerp(
            startAngle,
            endAngle,
            progress
          );


        sector.lineTo(
          Math.cos(angle)
            * radius,

          Math.sin(angle)
            * radius
        );
      }


      sector.lineTo(
        0,
        0
      );


      sector.closePath();


      return sector;
    }, [
      radius,
    ]);


  return (
    <mesh
      position={position}
    >
      <shapeGeometry
        args={[
          shape,
        ]}
      />

      <NetMaterial
        progressRef={progressRef}
      />

      <NetEdges
        progressRef={progressRef}
      />
    </mesh>
  );
}


/* =========================================================
   IRISAN BOLA
========================================================= */

function GorePanel({
  progressRef,

  width = 0.5,
  height = 2,

  position = [
    0,
    0,
    0,
  ],
}) {
  const shape =
    useMemo(() => {
      const gore =
        new THREE.Shape();


      gore.moveTo(
        0,
        -height / 2
      );


      gore.bezierCurveTo(
        width / 2,
        -height * 0.28,

        width / 2,
        height * 0.28,

        0,
        height / 2
      );


      gore.bezierCurveTo(
        -width / 2,
        height * 0.28,

        -width / 2,
        -height * 0.28,

        0,
        -height / 2
      );


      gore.closePath();


      return gore;
    }, [
      width,
      height,
    ]);


  return (
    <mesh
      position={position}
    >
      <shapeGeometry
        args={[
          shape,
        ]}
      />

      <NetMaterial
        progressRef={progressRef}
      />

      <NetEdges
        progressRef={progressRef}
      />
    </mesh>
  );
}


/* =========================================================
   MATERIAL BANGUN RUANG UTUH
========================================================= */

function SolidMaterial({
  progressRef,
}) {
  const materialRef =
    useRef(null);


  useFrame(() => {
    if (!materialRef.current) {
      return;
    }


    const opacity =
      1
      - smoothStep(
          progressRef.current
          / 0.5
        );


    materialRef.current.opacity =
      opacity;


    materialRef.current.visible =
      opacity > 0.01;
  });


  return (
    <meshStandardMaterial
      ref={materialRef}
      color={SHAPE_COLOR}
      roughness={0.35}
      metalness={0.08}
      transparent
      opacity={1}
      side={THREE.DoubleSide}
    />
  );
}


/* =========================================================
   CONTAINER BANGUN RUANG
========================================================= */

function SolidContainer({
  progressRef,
  children,
}) {
  const groupRef =
    useRef(null);


  useFrame(() => {
    if (!groupRef.current) {
      return;
    }


    const progress =
      smoothStep(
        progressRef.current
      );


    const scale =
      THREE.MathUtils.lerp(
        1,
        0.9,
        progress
      );


    groupRef.current.scale.setScalar(
      scale
    );


    groupRef.current.visible =
      progress < 0.72;
  });


  return (
    <group
      ref={groupRef}
    >
      {children}
    </group>
  );
}


/* =========================================================
   BANGUN RUANG 3D
========================================================= */

function SolidShape({
  type,
  progressRef,
}) {
  /* =========================
     KUBUS
  ========================= */

  if (
    type === "Kubus"
  ) {
    return (
      <mesh>
        <boxGeometry
          args={[
            1.8,
            1.8,
            1.8,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={5}
        />
      </mesh>
    );
  }


  /* =========================
     BALOK
  ========================= */

  if (
    type === "Balok"
  ) {
    return (
      <mesh>
        <boxGeometry
          args={[
            2.5,
            1.45,
            1.45,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={5}
        />
      </mesh>
    );
  }


  /* =========================
     TABUNG

     PERBAIKAN UTAMA:
     threshold dibuat 35 derajat.

     Permukaan tabung mempunyai banyak
     segmen dengan perubahan sudut kecil.
     Karena semuanya < 35 derajat,
     garis antarsegmen tidak akan muncul.

     Lingkaran atas dan bawah tetap dapat
     terlihat karena perbedaan sudutnya besar.
  ========================= */

  if (
    type === "Tabung"
  ) {
    return (
      <mesh>
        <cylinderGeometry
          args={[
            0.92,
            0.92,
            2.1,

            /*
              radialSegments tinggi supaya
              permukaannya benar-benar mulus.
            */

            96,

            1,

            false,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={35}
        />
      </mesh>
    );
  }


  /* =========================
     KERUCUT

     Sama seperti tabung.
     Threshold tinggi menghilangkan
     puluhan garis dari puncak ke alas.
  ========================= */

  if (
    type === "Kerucut"
  ) {
    return (
      <mesh>
        <coneGeometry
          args={[
            1.05,
            2.2,

            /*
              Lebih banyak segmen =
              permukaan terlihat lebih halus.
            */

            96,

            1,

            false,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={35}
        />
      </mesh>
    );
  }


  /* =========================
     LIMAS
  ========================= */

  if (
    type === "Limas"
  ) {
    return (
      <mesh
        rotation={[
          0,
          Math.PI / 4,
          0,
        ]}
      >
        <coneGeometry
          args={[
            1.23,
            2.05,
            4,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={5}
        />
      </mesh>
    );
  }


  /* =========================
     PRISMA
  ========================= */

  if (
    type === "Prisma"
  ) {
    return (
      <mesh
        rotation={[
          0,
          0,
          Math.PI / 2,
        ]}
      >
        <cylinderGeometry
          args={[
            0.98,
            0.98,
            2.4,
            3,
          ]}
        />

        <SolidMaterial
          progressRef={progressRef}
        />

        <SolidEdges
          progressRef={progressRef}
          threshold={5}
        />
      </mesh>
    );
  }


  /* =========================
     BOLA
  ========================= */

  return (
    <mesh>
      <sphereGeometry
        args={[
          1.15,
          64,
          64,
        ]}
      />

      <SolidMaterial
        progressRef={progressRef}
      />

      {/*
        Bola sengaja tidak memakai Edges.
        Kalau memakai Edges, garis latitude /
        longitude dari geometry bisa terlihat.
      */}
    </mesh>
  );
}


/* =========================================================
   JARING-JARING KUBUS
========================================================= */

function CubeNet({
  progressRef,
}) {
  const size =
    1.05;


  return (
    <group scale={0.82}>
      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          -1.5 * size,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          -0.5 * size,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          0.5 * size,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          1.5 * size,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          -0.5 * size,
          size,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={size}
        height={size}
        position={[
          -0.5 * size,
          -size,
          0,
        ]}
      />
    </group>
  );
}


/* =========================================================
   JARING-JARING BALOK

   Mengikuti referensi:
   empat panel vertikal,
   satu kecil di kiri,
   satu kecil di kanan bawah.
========================================================= */

function CuboidNet({
  progressRef,
}) {
  const L =
    2.4;

  const H =
    0.9;

  const D =
    0.64;


  const totalHeight =
    (
      D
      + H
    )
    * 2;


  const firstY =
    totalHeight / 2
    - D / 2;


  const secondY =
    totalHeight / 2
    - D
    - H / 2;


  const thirdY =
    totalHeight / 2
    - D
    - H
    - D / 2;


  const fourthY =
    totalHeight / 2
    - D
    - H
    - D
    - H / 2;


  const sideX =
    L / 2
    + D / 2;


  return (
    <group scale={0.82}>
      {/* Atas */}

      <RectanglePanel
        progressRef={progressRef}
        width={L}
        height={D}
        position={[
          0,
          firstY,
          0,
        ]}
      />


      {/* Panel kedua */}

      <RectanglePanel
        progressRef={progressRef}
        width={L}
        height={H}
        position={[
          0,
          secondY,
          0,
        ]}
      />


      {/* Sisi kiri */}

      <RectanglePanel
        progressRef={progressRef}
        width={D}
        height={H}
        position={[
          -sideX,
          secondY,
          0,
        ]}
      />


      {/* Panel ketiga */}

      <RectanglePanel
        progressRef={progressRef}
        width={L}
        height={D}
        position={[
          0,
          thirdY,
          0,
        ]}
      />


      {/* Panel keempat */}

      <RectanglePanel
        progressRef={progressRef}
        width={L}
        height={H}
        position={[
          0,
          fourthY,
          0,
        ]}
      />


      {/* Sisi kanan */}

      <RectanglePanel
        progressRef={progressRef}
        width={D}
        height={H}
        position={[
          sideX,
          fourthY,
          0,
        ]}
      />
    </group>
  );
}


/* =========================================================
   JARING-JARING TABUNG
========================================================= */

function CylinderNet({
  progressRef,
}) {
  const width =
    3.05;

  const height =
    1.2;

  const radius =
    0.55;


  const circleY =
    height / 2
    + radius;


  return (
    <group scale={0.84}>
      <RectanglePanel
        progressRef={progressRef}
        width={width}
        height={height}
        position={[
          0,
          0,
          0,
        ]}
      />


      <CirclePanel
        progressRef={progressRef}
        radius={radius}
        position={[
          0,
          circleY,
          0,
        ]}
      />


      <CirclePanel
        progressRef={progressRef}
        radius={radius}
        position={[
          0,
          -circleY,
          0,
        ]}
      />
    </group>
  );
}


/* =========================================================
   JARING-JARING KERUCUT
========================================================= */

function ConeNet({
  progressRef,
}) {
  const sectorRadius =
    1.62;


  const baseRadius =
    0.43;


  const circleCenterY =
    -sectorRadius
    - baseRadius;


  return (
    <group
      scale={0.86}
      position={[
        0,
        0.8,
        0,
      ]}
    >
      <ConeSectorPanel
        progressRef={progressRef}
        radius={sectorRadius}
        position={[
          0,
          0,
          0,
        ]}
      />


      <CirclePanel
        progressRef={progressRef}
        radius={baseRadius}
        position={[
          0,
          circleCenterY,
          0,
        ]}
      />
    </group>
  );
}


/* =========================================================
   JARING-JARING LIMAS
========================================================= */

function PyramidNet({
  progressRef,
}) {
  const base =
    1.2;


  const triangleHeight =
    1.35;


  const offset =
    base / 2
    + triangleHeight / 2;


  return (
    <group scale={0.82}>
      <RectanglePanel
        progressRef={progressRef}
        width={base}
        height={base}
        position={[
          0,
          0,
          0,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={base}
        height={triangleHeight}
        position={[
          0,
          offset,
          0,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={base}
        height={triangleHeight}
        position={[
          0,
          -offset,
          0,
        ]}
        rotation={[
          0,
          0,
          Math.PI,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={base}
        height={triangleHeight}
        position={[
          -offset,
          0,
          0,
        ]}
        rotation={[
          0,
          0,
          Math.PI / 2,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={base}
        height={triangleHeight}
        position={[
          offset,
          0,
          0,
        ]}
        rotation={[
          0,
          0,
          -Math.PI / 2,
        ]}
      />
    </group>
  );
}


/* =========================================================
   JARING-JARING PRISMA
========================================================= */

function PrismNet({
  progressRef,
}) {
  const panelWidth =
    1.05;


  const panelHeight =
    1.12;


  const triangleHeight =
    0.92;


  const triangleY =
    (
      panelHeight
      + triangleHeight
    )
    / 2;


  return (
    <group scale={0.86}>
      <RectanglePanel
        progressRef={progressRef}
        width={panelWidth}
        height={panelHeight}
        position={[
          -panelWidth,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={panelWidth}
        height={panelHeight}
        position={[
          0,
          0,
          0,
        ]}
      />


      <RectanglePanel
        progressRef={progressRef}
        width={panelWidth}
        height={panelHeight}
        position={[
          panelWidth,
          0,
          0,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={panelWidth}
        height={triangleHeight}
        position={[
          0,
          triangleY,
          0,
        ]}
      />


      <TrianglePanel
        progressRef={progressRef}
        width={panelWidth}
        height={triangleHeight}
        position={[
          0,
          -triangleY,
          0,
        ]}
        rotation={[
          0,
          0,
          Math.PI,
        ]}
      />
    </group>
  );
}


/* =========================================================
   BOLA

   Bola tidak memiliki jaring-jaring datar eksak.
========================================================= */

function SphereNet({
  progressRef,
}) {
  const total =
    7;


  const spacing =
    0.4;


  return (
    <group scale={0.82}>
      {Array.from(
        {
          length: total,
        },

        (
          _,
          index
        ) => {
          const center =
            (
              total
              - 1
            )
            / 2;


          return (
            <GorePanel
              key={index}
              progressRef={progressRef}
              width={0.56}
              height={2.35}
              position={[
                (
                  index
                  - center
                )
                * spacing,

                0,
                0,
              ]}
            />
          );
        }
      )}
    </group>
  );
}


/* =========================================================
   PEMILIH JARING-JARING
========================================================= */

function ShapeNet({
  type,
  progressRef,
}) {
  switch (type) {
    case "Kubus":
      return (
        <CubeNet
          progressRef={progressRef}
        />
      );


    case "Balok":
      return (
        <CuboidNet
          progressRef={progressRef}
        />
      );


    case "Tabung":
      return (
        <CylinderNet
          progressRef={progressRef}
        />
      );


    case "Kerucut":
      return (
        <ConeNet
          progressRef={progressRef}
        />
      );


    case "Limas":
      return (
        <PyramidNet
          progressRef={progressRef}
        />
      );


    case "Prisma":
      return (
        <PrismNet
          progressRef={progressRef}
        />
      );


    case "Bola":
    default:
      return (
        <SphereNet
          progressRef={progressRef}
        />
      );
  }
}


/* =========================================================
   CONTAINER JARING-JARING
========================================================= */

function NetContainer({
  type,
  progressRef,
}) {
  const groupRef =
    useRef(null);


  useFrame(() => {
    if (!groupRef.current) {
      return;
    }


    const progress =
      smoothStep(
        progressRef.current
      );


    const scale =
      THREE.MathUtils.lerp(
        0.9,
        1,
        progress
      );


    groupRef.current.scale.setScalar(
      scale
    );


    groupRef.current.position.y =
      THREE.MathUtils.lerp(
        -0.08,
        0,
        progress
      );


    groupRef.current.visible =
      progress > 0.2;
  });


  return (
    <Billboard
      follow
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <group
        ref={groupRef}
      >
        <ShapeNet
          type={type}
          progressRef={progressRef}
        />
      </group>
    </Billboard>
  );
}


/* =========================================================
   KOMPONEN UTAMA
========================================================= */

function FoldingShape({
  type,
  open,
}) {
  const progressRef =
    useRef(
      open
        ? 1
        : 0
    );


  useFrame(
    (
      _,
      delta
    ) => {
      const target =
        open
          ? 1
          : 0;


      progressRef.current =
        THREE.MathUtils.damp(
          progressRef.current,
          target,
          4.6,
          delta
        );
    }
  );


  return (
    <group scale={1.08}>
      <SolidContainer
        progressRef={progressRef}
      >
        <SolidShape
          type={type}
          progressRef={progressRef}
        />
      </SolidContainer>


      <NetContainer
        type={type}
        progressRef={progressRef}
      />
    </group>
  );
}


export default FoldingShape;