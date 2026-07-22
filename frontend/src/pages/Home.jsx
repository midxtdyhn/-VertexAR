import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import FeatureAR from "../components/home/FeatureAR";
import FeatureMateri from "../components/home/FeatureMateri";
import DaftarBangun from "../components/home/DaftarBangun";
import TujuanMedia from "../components/home/TujuanMedia";

function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-[92%] py-6">
        <Hero />
        <FeatureAR />
        <FeatureMateri />
        <DaftarBangun />
        <TujuanMedia />
      </main>
      <Footer />
    </>
  );
}

export default Home;