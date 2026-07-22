import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import materiData from "../data/materiData";
import kubusIcon from "../assets/icons/kubus.png";
import balokIcon from "../assets/icons/balok.png";
import tabungIcon from "../assets/icons/tabung.png";
import kerucutIcon from "../assets/icons/kerucut.png";
import limasIcon from "../assets/icons/limas.png";
import prismaIcon from "../assets/icons/prisma.png";
import bolaIcon from "../assets/icons/bola.png";

function Materi() {
  const icons = {
  Kubus: kubusIcon,
  Balok: balokIcon,
  Tabung: tabungIcon,
  Kerucut: kerucutIcon,
  Limas: limasIcon,
  Prisma: prismaIcon,
  Bola: bolaIcon,
};
  const bangunRuang = [
    "Kubus",
    "Balok",
    "Tabung",
    "Kerucut",
    "Limas",
    "Prisma",
    "Bola"
  ];

  const [selectedBangun, setSelectedBangun] = useState("Kubus");

  const data = materiData[selectedBangun];

  return (
    <>
      <Navbar />

      <main className="px-24 py-10">
        {/* Judul */}
        <section className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">
            Materi Bangun Ruang
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-gray-700">
            Pilih jenis bangun ruang pada kolom kiri untuk mempelajari konsep,
            sifat-sifat, rumus, serta melihat visualisasi objek secara interaktif.
          </p>
        </section>

        {/* Daftar Bangun */}
        <section className="mx-auto mt-10 max-w-3xl rounded-3xl bg-pink-500 p-8 text-white shadow-[8px_8px_18px_rgba(0,0,0,0.22)]">
          <h2 className="text-center text-3xl font-extrabold">
            Daftar Bangun Ruang
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            {bangunRuang.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedBangun(item)}
                className={`flex items-center justify-between rounded-full px-5 py-3 font-semibold transition ${
                  selectedBangun === item
                    ? "bg-white text-blue-900"
                    : "bg-blue-900 text-white hover:bg-blue-800"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={icons[item]}
                    alt={item}
                    className="h-10 w-10 object-contain"
                  />

                  <span className="text-xl">{item}</span>
                </div>

                <span className="text-2xl">›</span>
              </button>
            ))}
          </div>
        </section>

        {/* Card Materi */}
        <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl bg-blue-100 text-blue-900 shadow-[8px_8px_18px_rgba(0,0,0,0.22)]">
          <div className="bg-blue-900 py-3 text-center text-2xl font-bold text-white">
            Materi Bangun Ruang
          </div>

          <div className="p-8">
            <h2 className="text-4xl font-extrabold">
              {data.nama}
            </h2>

            <p className="mt-4 text-lg leading-relaxed">
              {data.deskripsi}
            </p>

            <div className="mt-8 border-t-4 border-blue-900 pt-6">
              <h3 className="text-3xl font-extrabold">
                Sifat dan Unsur Bangun
              </h3>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
                {data.sifat.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border-4 border-blue-900 text-center">
              <div className="border-r-4 border-blue-900 p-6">
                <h3 className="text-2xl font-bold">
                  Volume
                </h3>

                <p className="mt-6 text-3xl italic">
                  {data.volume}
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  Luas Permukaan
                </h3>

                <p className="mt-6 text-3xl italic">
                  {data.luas}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Materi;