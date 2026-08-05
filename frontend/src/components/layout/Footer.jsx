import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaFacebookF,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="vertex-footer">
      <div className="vertex-footer-container">
        <div className="vertex-footer-grid">
          <div className="vertex-footer-about">
            <h2 className="vertex-footer-title">
              VertexAR
            </h2>

            <p>
              Platform berbasis website terintegrasi AR sebagai media
              interaktif khusus materi bangun ruang tingkat SMP untuk
              mempermudah siswa dalam memahami materi bangun ruang.
            </p>
          </div>

          <div className="vertex-footer-navigation">
            <h2 className="vertex-footer-title">
              Peta Navigasi
            </h2>

            <nav className="vertex-footer-links">
              <Link to="/">› Beranda</Link>

              <Link to="/augmented-reality">
                › Augmented Reality
              </Link>

              <Link to="/bangun-ruang">
                › Bangun Ruang
              </Link>

              <Link to="/latihan">
                › Latihan
              </Link>

              <Link to="/tentang">
                › Tentang
              </Link>
            </nav>
          </div>

          <div className="vertex-footer-social">
            <h2 className="vertex-footer-title">
              Ikuti saya
            </h2>

            <div className="vertex-social-icons">
              <a
                href="#"
                aria-label="YouTube VertexAR"
                className="youtube-icon"
              >
                <FaYoutube />
              </a>

              <a
                href="#"
                aria-label="Instagram VertexAR"
                className="instagram-icon"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="X VertexAR"
                className="x-icon"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                aria-label="TikTok VertexAR"
                className="tiktok-icon"
              >
                <FaTiktok />
              </a>

              <a
                href="#"
                aria-label="Facebook VertexAR"
                className="facebook-icon"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <p className="vertex-footer-copyright">
          Copyright ©2026 VertexAR, All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;