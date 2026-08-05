import {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import AiAssistant from "./components/ai/AiAssistant";

import Home from "./pages/Home";
import AR from "./pages/AR";
import Materi from "./pages/Materi";
import SisiDatar from "./pages/SisiDatar";
import SisiLengkung from "./pages/SisiLengkung";
import Latihan from "./pages/Latihan";
import Quiz from "./pages/Quiz";
import About from "./pages/About";
import NotFound from "./pages/NotFound";


function App() {
  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setLoading(false);
      }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/augmented-reality"
          element={<AR />}
        />

        <Route
          path="/bangun-ruang"
          element={<Materi />}
        />

        <Route
          path="/bangun-ruang/sisi-datar"
          element={<SisiDatar />}
        />

        <Route
          path="/bangun-ruang/sisi-lengkung"
          element={<SisiLengkung />}
        />

        <Route
          path="/latihan"
          element={<Latihan />}
        />

        <Route
          path="/latihan/quiz"
          element={<Quiz />}
        />

        <Route
          path="/tentang"
          element={<About />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <AiAssistant />
    </BrowserRouter>
  );
}

export default App;