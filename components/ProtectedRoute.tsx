
import React from 'react';
// FIX: Replaced Navigate with Redirect for react-router-dom v5 compatibility.
import { Redirect, useLocation } from 'react-router-dom';

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
  
  // FIX: Using Redirect component for v5.
  return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
};

export default ProtectedRoute;
