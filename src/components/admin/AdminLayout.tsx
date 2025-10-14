import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  PaintBrushIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
  BuildingStorefrontIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  SparklesIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: '/admin', label: 'Tableau de bord', icon: HomeIcon, end: true },
  { to: '/admin/models', label: 'Mannequins Pro', icon: UsersIcon },
  { to: '/admin/beginner-students-access', label: 'Débutants', icon: UserGroupIcon },
  { to: '/admin/artistic-direction', label: 'Direction Artistique', icon: PaintBrushIcon },
  { to: '/admin/casting-applications', label: 'Candidatures Casting', icon: ClipboardDocumentListIcon },
  { to: '/admin/casting-results', label: 'Résultats Casting', icon: ClipboardDocumentCheckIcon },
  { to: '/admin/model-access', label: 'Accès Mannequins', icon: KeyIcon },
  { to: '/admin/magazine', label: 'Magazine', icon: NewspaperIcon },
  { to: '/admin/news', label: 'Actualités', icon: PresentationChartLineIcon },
  { to: '/admin/agency', label: 'Contenu Agence', icon: BuildingStorefrontIcon },
  { to: '/admin/classroom', label: 'Classroom Pro', icon: BookOpenIcon },
  { to: '/admin/classroom-progress', label: 'Suivi Classroom', icon: AcademicCapIcon },
  { to: '/admin/fashion-day-applications', label: 'Candidatures PFD', icon: SparklesIcon },
  { to: '/admin/fashion-day-events', label: 'Événements PFD', icon: CalendarIcon },
  { to: '/admin/comments', label: 'Commentaires', icon: ChatBubbleLeftRightIcon },
  { to: '/admin/messages', label: 'Messages', icon: EnvelopeIcon },
  { to: '/admin/bookings', label: 'Demandes Booking', icon: BriefcaseIcon },
  { to: '/admin/payments', label: 'Comptabilité', icon: CurrencyDollarIcon },
  { to: '/admin/absences', label: 'Absences', icon: CalendarIcon },
  { to: '/admin/recovery-requests', label: 'Récupérations', icon: ExclamationTriangleIcon },
  { to: '/admin/settings', label: 'Paramètres', icon: Cog6ToothIcon },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white flex">
      <aside className="hidden md:flex md:w-72 lg:w-80 xl:w-96 border-r border-pm-gold/20 flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-pm-gold/20">
          <div className="flex items-center gap-2">
            <span className="text-pm-gold font-bold tracking-wider">PMM</span>
            <span className="text-pm-off-white/60">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs text-pm-off-white/60 hover:text-pm-gold"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors border-l-2',
                      isActive
                        ? 'bg-pm-gold/10 text-pm-gold border-pm-gold'
                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/5 border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 border-t border-pm-gold/20 text-xs text-pm-off-white/50">
          Perfect Models Management
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar for mobile */}
        <div className="md:hidden h-14 px-4 flex items-center justify-between border-b border-pm-gold/20 bg-black/40 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-pm-gold font-semibold">PMM</span>
            <span className="text-pm-off-white/60">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs text-pm-off-white/60 hover:text-pm-gold"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
