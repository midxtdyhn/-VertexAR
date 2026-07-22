import youtube from "../../assets/images/social/youtube.png";
import instagram from "../../assets/images/social/instagram.png";
import x from "../../assets/images/social/x.png";
import tiktok from "../../assets/images/social/tiktok.png";
import facebook from "../../assets/images/social/facebook.png";
import { Link } from "react-router-dom";

function Footer() {
  const socials = [
    { icon: youtube, url: "#", name: "YouTube" },
    { icon: instagram, url: "#", name: "Instagram" },
    { icon: x, url: "#", name: "X" },
    { icon: tiktok, url: "#", name: "TikTok" },
    { icon: facebook, url: "#", name: "Facebook" },
  ];

  return (
    <footer
      className="
      relative
      overflow-hidden
      text-white

      bg-[linear-gradient(135deg,#1D6CF3_0%,#174DBE_40%,#123D9A_70%,#0B2F82_100%)]

      shadow-[0_-8px_30px_rgba(0,0,0,0.18)]
    "
    >
      {/* Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div
          className="
          absolute
          -top-28
          -left-16
          h-72
          w-72
          rounded-full
          bg-cyan-300/20
          blur-3xl
        "
        />

        <div
          className="
          absolute
          bottom-0
          right-0
          h-96
          w-96
          rounded-full
          bg-blue-400/20
          blur-3xl
        "
        />

        <div
          className="
          absolute
          top-1/2
          left-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/5
          blur-3xl
        "
        />

      </div>

      {/* Garis Atas */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

      <div className="relative z-10 mx-auto w-[90%] max-w-[1400px] px-6 py-12">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

          {/* Kolom 1 */}
          <div>

            <h2 className="text-4xl font-extrabold tracking-tight">
              VertexAR
            </h2>

            <p className="mt-5 max-w-sm text-[17px] leading-8 text-blue-100">
              Platform berbasis website terintegrasi Augmented Reality sebagai
              media pembelajaran interaktif materi bangun ruang tingkat SMP
              untuk membantu siswa memahami konsep bangun ruang secara lebih
              menarik dan mudah dipahami.
            </p>

          </div>

          {/* Kolom 2 */}
          <div className="flex justify-start md:justify-center">

            <div>

              <h3 className="text-4xl font-extrabold tracking-tight">
                Peta Navigasi
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-[18px] text-blue-100">

                <Link
                  to="/"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
                >
                  › Beranda
                </Link>

                <Link
                  to="/augmented-reality"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
                >
                  › Augmented Reality
                </Link>

                <Link
                  to="/bangun-ruang"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
                >
                  › Bangun Ruang
                </Link>

                <Link
                  to="/tentang"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
                >
                  › Tentang
                </Link>

              </div>

            </div>

          </div>

          {/* Kolom 3 */}
          <div className="flex justify-start md:justify-end">

            <div>

              <h3 className="text-4xl font-extrabold tracking-tight">
                Ikuti Saya
              </h3>

              <div className="mt-5 flex items-center gap-5">

                {socials.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-110
                    "
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="
                        h-8
                        w-8
                        object-contain
                        drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]
                      "
                    />
                  </a>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-white/15 bg-black/10 py-5 text-center text-[17px] text-blue-100 backdrop-blur-sm">
        Copyright ©2026 VertexAR. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;