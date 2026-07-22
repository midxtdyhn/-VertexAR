import loadingVideo from "../assets/videos/loading.webm";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white">

      {/* Background Particles */}
      <div className="absolute inset-0">

        <span className="particle particle1"></span>
        <span className="particle particle2"></span>
        <span className="particle particle3"></span>
        <span className="particle particle4"></span>
        <span className="particle particle5"></span>
        <span className="particle particle6"></span>
        <span className="particle particle7"></span>
        <span className="particle particle8"></span>

      </div>

      {/* Video Logo */}
      <video
        autoPlay
        muted
        playsInline
        className="loading-video relative z-10"
      >
        <source
          src={loadingVideo}
          type="video/webm"
        />
      </video>
      
      <p className="loading-text">
        Memuat VertexAR...
      </p>

    </div>
  );
}

export default LoadingScreen;