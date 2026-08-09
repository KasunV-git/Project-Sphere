import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Could replace with a modern spinner
  }

  // Ensure user is logged in AND has the 'admin' role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />; // Redirect non-admins to home/dashboard
  }

  return <Outlet />;
};

export default AdminRoute;
