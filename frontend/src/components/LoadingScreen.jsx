import loadingVideo from "../assets/videos/loading.webm";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0" aria-hidden="true">
        <span className="particle particle1" />
        <span className="particle particle2" />
        <span className="particle particle3" />
        <span className="particle particle4" />
        <span className="particle particle5" />
        <span className="particle particle6" />
        <span className="particle particle7" />
        <span className="particle particle8" />
      </div>

      <video
        autoPlay
        muted
        playsInline
        className="loading-video relative z-10"
        aria-label="Animasi logo VertexAR"
      >
        <source src={loadingVideo} type="video/webm" />
      </video>

      <p className="loading-text relative z-10">Memuat VertexAR...</p>
    </div>
  );
}

export default LoadingScreen;
