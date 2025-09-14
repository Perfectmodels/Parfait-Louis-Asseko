
import React from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  // FIX: Add 'beginner' to the list of valid roles.
  role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const location = ReactRouterDOM.useLocation();

  if (hasAccess && userRole === role) {
    return children;
  }
  
  // FIX: Use Navigate component for react-router-dom v6.
  return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
