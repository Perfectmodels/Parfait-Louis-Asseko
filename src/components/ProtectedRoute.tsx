import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'jury' | 'registration';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
  const adminId = sessionStorage.getItem('admin_id');
  const location = useLocation();

  // If localStorage holds a valid persisted auth, ensure sessionStorage mirrors it
  useEffect(() => {
    try {
      if (hasAccess) return; // already ok
      const raw = localStorage.getItem('pmm_auth');
      if (!raw) return;
      const auth = JSON.parse(raw) as { role: string; userId?: string; adminId?: string; expiresAt: number };
      if (auth && auth.expiresAt && Date.now() < auth.expiresAt) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', auth.role);
        if (auth.adminId) sessionStorage.setItem('admin_id', auth.adminId);
        if (auth.userId) sessionStorage.setItem('userId', auth.userId);
      }
    } catch {
      // ignore
    }
  }, [hasAccess]);

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