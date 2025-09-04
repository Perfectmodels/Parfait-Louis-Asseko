
import React from 'react';
// FIX: Changed react-router-dom import to use a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
const { Navigate, useLocation } = ReactRouterDOM;

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'model';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const location = useLocation();

  if (hasAccess && userRole === role) {
    return children;
  }
  
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;