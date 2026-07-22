const materiData = {
  Kubus: {
    nama: "Kubus",

    deskripsi:
      "Kubus adalah bangun ruang tiga dimensi yang memiliki enam sisi berbentuk persegi dengan ukuran yang sama. Semua rusuk kubus memiliki panjang yang sama sehingga bentuknya simetris.",

    sifat: [
      "Memiliki 6 sisi berbentuk persegi.",
      "Memiliki 12 rusuk yang sama panjang.",
      "Memiliki 8 titik sudut.",
      "Memiliki 12 diagonal bidang.",
      "Memiliki 4 diagonal ruang.",
      "Memiliki 6 bidang diagonal."
    ],

    volume: "V = s³",

    luas: "L = 6s²",
  },

  Balok: {
    nama: "Balok",

    deskripsi:
      "Balok merupakan bangun ruang tiga dimensi yang memiliki tiga pasang sisi berbentuk persegi panjang. Setiap sisi yang berhadapan memiliki ukuran yang sama.",

    sifat: [
      "Memiliki 6 sisi berbentuk persegi panjang.",
      "Memiliki 12 rusuk.",
      "Memiliki 8 titik sudut.",
      "Sisi yang berhadapan sama besar.",
      "Memiliki 12 diagonal bidang.",
      "Memiliki 4 diagonal ruang.",
      "Memiliki 6 bidang diagonal."
    ],

    volume: "V = p × l × t",

    luas: "L = 2(pl + pt + lt)",
  },

  Tabung: {
    nama: "Tabung",

    deskripsi:
      "Tabung adalah bangun ruang sisi lengkung yang memiliki dua alas berbentuk lingkaran dan satu sisi lengkung yang menghubungkan kedua alas.",

    sifat: [
      "Memiliki 3 sisi.",
      "Terdiri atas 2 sisi berbentuk lingkaran.",
      "Memiliki 1 sisi lengkung.",
      "Memiliki 2 rusuk lengkung.",
      "Tidak memiliki titik sudut."
    ],

    volume: "V = πr²t",

    luas: "L = 2πr(r+t)",
  },

  Kerucut: {
    nama: "Kerucut",

    deskripsi:
      "Kerucut adalah bangun ruang sisi lengkung yang mempunyai satu alas berbentuk lingkaran dan satu titik puncak.",

    sifat: [
      "Memiliki 2 sisi.",
      "Memiliki 1 alas berbentuk lingkaran.",
      "Memiliki 1 sisi lengkung.",
      "Memiliki 1 rusuk lengkung.",
      "Memiliki 1 titik puncak."
    ],

    volume: "V = ⅓πr²t",

    luas: "L = πr(r+s)",
  },

  Limas: {
    nama: "Limas",

    deskripsi:
      "Limas adalah bangun ruang yang memiliki satu alas dan beberapa sisi tegak berbentuk segitiga yang bertemu pada satu titik puncak.",

    sifat: [
      "Memiliki satu alas.",
      "Sisi tegaknya berbentuk segitiga.",
      "Memiliki satu titik puncak.",
      "Jumlah rusuk dan titik sudut bergantung pada bentuk alas."
    ],

    volume: "V = ⅓ × Luas Alas × Tinggi",

    luas: "L = Luas Alas + Luas Seluruh Sisi Tegak",
  },

  Prisma: {
    nama: "Prisma",

    deskripsi:
      "Prisma merupakan bangun ruang yang memiliki dua bidang alas dan atap yang sejajar serta kongruen, sedangkan sisi tegaknya berbentuk persegi panjang.",

    sifat: [
      "Memiliki dua alas yang sejajar.",
      "Alas dan atap kongruen.",
      "Sisi tegak berbentuk persegi panjang.",
      "Jumlah rusuk dan titik sudut bergantung pada bentuk alas."
    ],

    volume: "V = Luas Alas × Tinggi",

    luas: "L = (2 × Luas Alas) + (Keliling Alas × Tinggi)",
  },

  Bola: {
    nama: "Bola",

    deskripsi:
      "Bola adalah bangun ruang sisi lengkung yang seluruh permukaannya berjarak sama terhadap titik pusat.",

    sifat: [
      "Memiliki satu sisi lengkung.",
      "Tidak memiliki rusuk.",
      "Tidak memiliki titik sudut.",
      "Memiliki satu titik pusat."
    ],

    volume: "V = ⁴⁄₃πr³",

    luas: "L = 4πr²",
  },
};

export default materiData;