import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <span>Project</span> Sphere
          </Link>
          
          <nav className="header-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/services">Services</Link>
            {user?.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
          </nav>

          <div className="user-menu">
            <span className="user-name">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
