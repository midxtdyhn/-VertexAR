import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import FeatureAR from "../components/home/FeatureAR";
import FeatureMateri from "../components/home/FeatureMateri";
import TujuanMedia from "../components/home/TujuanMedia";
import PanduanAlur from "../components/home/PanduanAlur";

import Reveal from "../components/Reveal";


function Home() {
  return (
    <>
      <main className="vertex-home">
        <Reveal
          direction="up"
          delay={0}
        >
          <Hero />
        </Reveal>

        <div className="vertex-home-sections">
          <Reveal
            direction="up"
            delay={50}
          >
            <FeatureAR />
          </Reveal>

          <Reveal
            direction="up"
            delay={80}
          >
            <FeatureMateri />
          </Reveal>

          <Reveal
            direction="up"
            delay={100}
          >
            <TujuanMedia />
          </Reveal>

          <Reveal
            direction="up"
            delay={120}
          >
            <PanduanAlur />
          </Reveal>
        </div>
      </main>

      <Reveal
        direction="up"
        delay={80}
      >
        <Footer />
      </Reveal>
    </>
  );
}

export default Home;