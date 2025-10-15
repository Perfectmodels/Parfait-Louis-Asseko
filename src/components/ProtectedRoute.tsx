import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const adminId = sessionStorage.getItem('admin_id');
  const location = useLocation();

  // Special-case: admin access also valid if an admin session exists
  if (role === 'admin' && adminId) {
    return children;
  }

  if (hasAccess && userRole === role) {
    return children;
  }
  
  // Allow bootstrap admin access if default session marker is present
  if (role === 'admin' && sessionStorage.getItem('classroom_role') === 'admin') {
    return children;
  }
  
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;