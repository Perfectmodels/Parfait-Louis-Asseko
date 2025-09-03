
import React from 'react';
// FIX: Replaced v5 `Redirect` with v6 `Navigate` to fix module export errors.
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
    // FIX: Replaced v5 `<Redirect>` component with v6 `<Navigate>`.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
