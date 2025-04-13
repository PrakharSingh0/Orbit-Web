import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AppContext/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, profileCompleted } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profileCompleted) {
    // Redirect to profile setup if profile is not completed
    return <Navigate to="/profile-setup" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 