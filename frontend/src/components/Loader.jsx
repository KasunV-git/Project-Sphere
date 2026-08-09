import '../styles/components.css';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="spinner"></div>
      <p className="loader-text">Loading...</p>
    </div>
  );
};

export default Loader;
