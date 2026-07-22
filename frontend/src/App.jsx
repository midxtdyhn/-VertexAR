import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import AR from "./pages/AR";
import Materi from "./pages/Materi";
import About from "./pages/About";

import LoadingScreen from "./components/LoadingScreen";

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/augmented-reality"
          element={<AR />}
        />

        <Route
          path="/bangun-ruang"
          element={<Materi />}
        />

        <Route
          path="/tentang"
          element={<About />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;