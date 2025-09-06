import React from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'model' | 'jury' | 'registration';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const location = ReactRouterDOM.useLocation();

  if (hasAccess && userRole === role) {
    return children;
  }
  
  return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;