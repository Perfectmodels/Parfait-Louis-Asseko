
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const breadcrumbNameMap: Record<string, string> = {
  '/': 'Accueil',
  '/agence': 'Agence',
  '/mannequins': 'Mannequins',
  '/magazine': 'Magazine',
  '/galerie': 'Galerie',
  '/contact': 'Contact',
  '/casting': 'Casting',
  '/admin': 'Administration',
  // Add other paths here
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = pathnames.map((name, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = breadcrumbNameMap[path] || name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Handle dynamic model names
    if (path.startsWith('/mannequins/') && pathnames.length > 1 && isLast) {
        // In a real app, you would fetch the model name from an API using the ID `name`
        label = `Profil de ${name}`;
    }

    return { path, label, isLast };
  });

  const allCrumbs = [{ path: '/', label: 'Accueil', isLast: pathnames.length === 0 }, ...breadcrumbs];

  if (location.pathname === '/' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bg-black/50 border-b border-pm-gold/20 py-3 hidden lg:block">
      <div className="container mx-auto px-6">
        <div className="flex items-center text-sm">
          {allCrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-pm-gold/50 mx-2" />
              )}
              <Link
                to={crumb.path}
                className={`${
                  crumb.isLast
                    ? 'text-pm-gold font-semibold'
                    : 'text-pm-off-white/60 hover:text-white transition-colors'
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
