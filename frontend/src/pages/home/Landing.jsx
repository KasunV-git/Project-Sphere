import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">Sphere</h1>
        
        <div className="landing-action-container" onClick={handleGetStarted} role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') handleGetStarted(); }}>
          <button className="landing-button" aria-label="Get Started">
            <span className="material-icons">arrow_forward</span>
          </button>
          <span className="landing-action-text">Get Started</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
