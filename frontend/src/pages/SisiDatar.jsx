import LongMaterialPage from "../components/materi/LongMaterialPage";

const items = [
  {
    id: "kubus",
    name: "Kubus",
    image: "/images/kubus.png",
    description:
      "adalah bangun ruang tiga dimensi yang dibatasi oleh 6 bidang sisi yang kongruen (berbentuk persegi yang sama besar), serta memiliki 12 rusuk yang sama panjang dan 8 titik sudut.",
    extra: "Adapun rumus luas permukaan serta volume kubus, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "6 × s²" },
      { label: "Volume", value: "s × s × s" },
      { label: "Rusuk", value: "s" },
    ],
  },
  {
    id: "balok",
    name: "Balok",
    image: "/images/balok.png",
    description:
      "adalah bangun ruang tiga dimensi yang dibatasi oleh 6 bidang sisi (tiga pasang sisi yang berhadapan kongruen dan berbentuk persegi panjang), serta memiliki 12 rusuk dan 8 titik sudut.",
    extra: "Adapun rumus luas permukaan serta volume balok, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "2 × ((p × l) + (p × t) + (l × t))" },
      { label: "Volume", value: "p × l × t" },
      { label: "Panjang", value: "p" },
      { label: "Lebar", value: "l" },
      { label: "Tinggi", value: "t" },
    ],
  },
  {
    id: "prisma",
    name: "Prisma Tegak Segi-n",
    image: "/images/prisma.png",
    description:
      "Prisma adalah bangun ruang sisi datar yang memiliki tutup dan alas yang kongruen serta sejajar berbentuk segi-n. Prisma memiliki berbagai bentuk seperti prisma segitiga, prisma segiempat, prisma segilima, prisma segi enam, prisma segi delapan, dan lain sebagainya.",
    extra: "Adapun rumus luas permukaan serta volume prisma, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "2 × Luas Alas + Keliling Alas × Tinggi" },
      { label: "Volume", value: "Luas Alas × Tinggi" },
    ],
  },
  {
    id: "limas",
    name: "Limas Segi-n Beraturan",
    image: "/images/limas.png",
    description:
      " adalah bangun ruang yang dibatasi oleh alas yang berbentuk segi-n serta sisi tegak berbentuk segitiga yang berpotongan di satu titik puncak. Terdapat berbagai variasi limas seperti limas segitiga, limas segiempat, limas segilima, dan lain sebagainya.",
    extra: "Adapun rumus luas permukaan serta volume limas, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "Luas Alas + Jumlah Luas Seluruh Sisi Tegak" },
      { label: "Volume", value: "⅓ × Luas Alas × Tinggi" },
    ],
  },
];

function SisiDatar() {
  return <LongMaterialPage title="Bangun Ruang Sisi Datar" items={items} />;
}

export default SisiDatar;
