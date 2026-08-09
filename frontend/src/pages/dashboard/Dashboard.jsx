import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || 'User'}!</h1>
          <p className="page-subtitle">Here is what's happening with your Sphere account today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Quick Links Card */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">
            <span className="material-icons">bolt</span> Quick Actions
          </h2>
          <div className="quick-links">
            <Link to="/services" className="quick-link-item">
              <span>Discover New Services</span>
              <span className="material-icons">arrow_forward</span>
            </Link>
            <Link to="/profile" className="quick-link-item">
              <span>Update Profile</span>
              <span className="material-icons">person</span>
            </Link>
          </div>
        </div>

        {/* Favorites Placeholder */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">
            <span className="material-icons">star</span> Your Favorites
          </h2>
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p>You haven't favorited any services yet.</p>
            <Link to="/services" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>
              Browse Services
            </Link>
          </div>
        </div>

        {/* Recent Usage Placeholder */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <h2 className="dashboard-card-title">
            <span className="material-icons">history</span> Recent Activity
          </h2>
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p>No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
