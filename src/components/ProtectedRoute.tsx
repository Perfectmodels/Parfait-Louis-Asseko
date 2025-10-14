import React from 'react';
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
  
  // Emit a global event so listeners (like router) can re-evaluate on auth changes
  try {
    const event = new Event('pmm-auth-changed');
    window.dispatchEvent(event);
  } catch {}
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;