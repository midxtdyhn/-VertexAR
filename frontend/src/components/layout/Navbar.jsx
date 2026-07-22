import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Beranda", path: "/" },
    { name: "Augmented Reality", path: "/augmented-reality" },
    { name: "Bangun Ruang", path: "/bangun-ruang" },
    { name: "Tentang", path: "/tentang" },
  ];

  return (
    <nav className="mx-auto mt-5 w-[94%] rounded-[28px] border border-[#E5EAF5] bg-gradient-to-r from-white via-[#F8FAFF] to-[#EEF5FF] px-6 py-3 shadow-[0_8px_25px_rgba(37,99,235,0.08)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <NavLink to="/">
          <img
            src={logo}
            alt="VertexAR Logo"
            className="h-14 w-auto object-contain"
          />
        </NavLink>

        <div className="hidden items-center gap-10 md:flex">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-5 py-2 text-base font-semibold transition ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "text-slate-600 hover:text-[#2563EB] hover:bg-blue-50"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="block text-blue-900 md:hidden"
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {open && (
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-5 py-3 text-center font-semibold transition ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "bg-blue-50 text-blue-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;