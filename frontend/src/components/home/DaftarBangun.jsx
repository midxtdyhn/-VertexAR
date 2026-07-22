import { Box } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DaftarBangun() {
  const navigate = useNavigate();

  return (
    <section className="mt-10 flex justify-center">
      <div className="bangun-card w-[42%] min-w-[410px] rounded-[34px] bg-[#DDF5FF] px-10 py-8 text-blue-900">

        {/* ICON */}
        <div className="bangun-icon mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9DDBFF]">
          <Box size={40} strokeWidth={3} className="text-black" />
        </div>

        {/* TITLE */}
        <h2 className="text-[30px] font-extrabold leading-tight">
          Daftar Bangun Ruang
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-3 text-[17px] leading-relaxed">
          Pelajari bermacam jenis bangun ruang sisi datar dan lengkung:
        </p>

        {/* LIST */}
        <ul className="mt-2 list-disc pl-6 text-[17px] leading-relaxed">
          <li>Kubus & Balok</li>
          <li>Tabung & Kerucut</li>
          <li>Limas & Prisma</li>
          <li>Bola</li>
        </ul>

        {/* BUTTON NAVIGASI */}
        <button
          onClick={() => navigate("/bangun-ruang")}
          className="bangun-button mt-6 rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Mulai Belajar
        </button>

      </div>
    </section>
  );
}

export default DaftarBangun;