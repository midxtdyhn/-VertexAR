import LongMaterialPage from "../components/materi/LongMaterialPage";

const items = [
  {
    id: "tabung",
    name: "Tabung",
    image: "/images/tabung.png",
    description:
      "adalah bangun ruang tiga dimensi yang dibatasi oleh dua buah sisi alas dan tutup berbentuk lingkaran yang kongruen serta sejajar, serta sebuah sisi selimut melengkung yang menghubungkan keduanya. Tabung juga memiliki dua buah rusuk lengkung dan tidak memiliki titik sudut.",
    extra: "Adapun rumus luas permukaan serta volume tabung, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "2 × π × r × (r + t)" },
      { label: "Volume", value: "π × r² × t" },
      { label: "Jari-jari", value: "r" },
      { label: "Tinggi", value: "t" },
      { label: "π (phi)", value: "3, 14 atau 22/7" },
    ],
  },
  {
    id: "kerucut",
    name: "Kerucut",
    image: "/images/kerucut.png",
    description:
      "adalah bangun ruang dengan sisi melengkung, yang memiliki dua sisi, yaitu satu sisi lingkaran serta satu sisi lengkung. Kerucut memiliki satu rusuk lengkung dan satu titik puncak.",
    extra: "Adapun rumus luas permukaan serta volume kerucut, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "π × r × (r + s)" },
      { label: "Volume", value: "⅓ × π × r² × t" },
      { label: "Garis Pelukis", value: "s" },
      { label: "π (phi)", value: "3, 14 atau 22/7" },
    ],
  },
  {
    id: "bola",
    name: "Bola",
    image: "/images/bola.png",
    description:
      "adalah salah satu bentuk bangun ruang yang ada. Memiliki sisi melengkung, yang hanya memiliki satu lengkung dengan bentuk bulat sempurna serta memiliki jari-jari dan pusat lingkaran yang sama.",
    extra: "Adapun rumus luas permukaan serta volume bola, yaitu sebagai berikut:",
    formulas: [
      { label: "Luas Permukaan", value: "4 × π × r²" },
      { label: "Volume", value: "⁴⁄₃ × π × r³" },
      { label: "Jari-jari", value: "r" },
      { label: "π (phi)", value: "3, 14 atau 22/7" },
    ],
  },
];

function SisiLengkung() {
  return <LongMaterialPage title="Bangun Ruang Sisi Lengkung" items={items} />;
}

export default SisiLengkung;
