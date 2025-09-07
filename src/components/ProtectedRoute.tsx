import React from 'react';
// FIX: Updated react-router-dom imports for v6 compatibility. Replaced `Redirect` with `Navigate`.
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const location = useLocation();

  if (hasAccess && userRole === role) {
    return children;
  }
  
  // FIX: Use Navigate component for react-router-dom v6.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;