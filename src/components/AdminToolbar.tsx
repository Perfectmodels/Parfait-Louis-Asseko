import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const quickLinks: { to: string; label: string }[] = [
  { to: '/admin', label: 'Accueil' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/calendar', label: 'Calendrier' },
  { to: '/admin/crm', label: 'CRM' },
  { to: '/admin/contracts', label: 'Contrats' },
  { to: '/admin/notifications', label: 'Notifications' },
  { to: '/admin/newsletter', label: 'Newsletter' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/audit', label: 'Audit' },
  { to: '/admin/matching', label: 'Matching' }
];

const AdminToolbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  if (!isAdmin) return null;

  const handleBack = () => {
    try {
      const raw = sessionStorage.getItem('adminNavHistory');
      const historyArr = raw ? JSON.parse(raw) as string[] : [];
      if (Array.isArray(historyArr) && historyArr.length >= 2) {
        const prev = historyArr[historyArr.length - 2];
        // pop current
        historyArr.pop();
        sessionStorage.setItem('adminNavHistory', JSON.stringify(historyArr));
        navigate(prev);
        return;
      }
    } catch {}
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-pm-gold/20">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-pm-gold/10 text-pm-gold hover:bg-pm-gold/20 transition"
          aria-label="Retour"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-pm-gold/10 text-pm-gold hover:bg-pm-gold/20 transition"
          aria-label="Accueil Admin"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Accueil</span>
        </Link>

        <div className="flex items-center flex-wrap gap-2 ml-2">
          {quickLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-xs font-medium transition border border-transparent hover:border-pm-gold/30 hover:bg-pm-gold/10 ${
                location.pathname === link.to ? 'text-pm-gold' : 'text-pm-off-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminToolbar;
