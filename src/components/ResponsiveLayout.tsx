import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileNavigation from './MobileNavigation';

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

  // Pages où la navigation mobile doit être cachée
  const hideMobileNavPaths = ['/login', '/404', '/privacy-policy', '/terms-of-use'];
  const shouldHideMobileNav = hideMobileNavPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Contenu principal */}
      <main className={`pb-16 lg:pb-0`}>
        {children}
      </main>

      {/* Navigation mobile (visible uniquement sur mobile) */}
      {!shouldHideMobileNav && (
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
