
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const location = useLocation();
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';

  if (!hasAccess || userRole !== role) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;