import { Link } from "react-router-dom";

import Footer from "../components/layout/Footer";

function NotFound() {
  return (
    <>
      <main className="vertex-not-found">
        <p>404</p>
        <h1>Halaman tidak ditemukan</h1>
        <Link to="/" className="vertex-action-button">
          Kembali ke Beranda
        </Link>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
