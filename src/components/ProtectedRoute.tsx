import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner' | 'jury-contest';
}

/** Clés de persistance session admin dans localStorage */
export const ADMIN_SESSION_KEYS = {
  access: 'pmm_admin_access',
  role: 'pmm_admin_role',
  name: 'pmm_admin_name',
  userId: 'pmm_admin_userId',
} as const;

/** Sauvegarde la session admin dans localStorage (persistante) */
export function persistAdminSession(name: string, userId: string): void {
  localStorage.setItem(ADMIN_SESSION_KEYS.access, 'granted');
  localStorage.setItem(ADMIN_SESSION_KEYS.role, 'admin');
  localStorage.setItem(ADMIN_SESSION_KEYS.name, name);
  localStorage.setItem(ADMIN_SESSION_KEYS.userId, userId);
}

/** Efface la session admin persistante */
export function clearAdminSession(): void {
  Object.values(ADMIN_SESSION_KEYS).forEach(k => localStorage.removeItem(k));
}

/** Restaure la session admin depuis localStorage vers sessionStorage */
export function restoreAdminSession(): boolean {
  const access = localStorage.getItem(ADMIN_SESSION_KEYS.access);
  const role = localStorage.getItem(ADMIN_SESSION_KEYS.role);
  if (access === 'granted' && role === 'admin') {
    sessionStorage.setItem('classroom_access', 'granted');
    sessionStorage.setItem('classroom_role', 'admin');
    sessionStorage.setItem('userName', localStorage.getItem(ADMIN_SESSION_KEYS.name) || 'Admin');
    sessionStorage.setItem('userId', localStorage.getItem(ADMIN_SESSION_KEYS.userId) || 'admin-id');
    return true;
  }
  return false;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const location = useLocation();

  // Pour le rôle admin, vérifier aussi localStorage (session persistante)
  if (role === 'admin') {
    restoreAdminSession();
    const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
    const userRole = sessionStorage.getItem('classroom_role');
    if (!hasAccess || userRole !== 'admin') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  const userRole = sessionStorage.getItem('classroom_role');
  const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';

  if (hasAccess && userRole === role) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
