import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const dashboardMap = {
      admin: '/admin/dashboard',
      user: '/user/stores',
      store_owner: '/store-owner/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
