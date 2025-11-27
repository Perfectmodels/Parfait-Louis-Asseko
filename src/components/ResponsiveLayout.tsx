import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileNavigation from './MobileNavigation';
import QuickNavigation from './QuickNavigation';
import SessionManager from './SessionManager';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const location = useLocation();
  const { user } = useAuth();

  // Pages où la navigation mobile doit être cachée (login, 404, etc.)
  const hideMobileNavPaths = ['/login', '/404', '/privacy-policy', '/terms-of-use'];
  const shouldHideMobileNav = hideMobileNavPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  // Pages où la navigation rapide doit être affichée (desktop uniquement)
  const showQuickNavPaths = ['/admin', '/profil', '/chat', '/formations'];
  const shouldShowQuickNav = user && showQuickNavPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  // Pages où le gestionnaire de session doit être affiché
  const showSessionManager = user && !shouldHideMobileNav;

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Contenu principal */}
      <main className={`pb-16 lg:pb-0 ${shouldShowQuickNav ? 'lg:pr-80' : ''}`}>
        {children}
      </main>

      {/* Navigation mobile (visible uniquement sur mobile) */}
      {!shouldHideMobileNav && (
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      )}

      {/* Navigation rapide desktop (visible uniquement sur desktop) */}
      {shouldShowQuickNav && (
        <div className="hidden lg:block fixed right-4 top-20 w-72 z-30">
          <QuickNavigation />
        </div>
      )}

      {/* Gestionnaire de session */}
      {showSessionManager && (
        <div className="hidden lg:block fixed left-4 bottom-4 w-80 z-30">
          <SessionManager />
        </div>
      )}

      {/* Espace pour éviter le chevauchement sur mobile */}
      {shouldHideMobileNav && (
        <div className="lg:hidden h-16"></div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
