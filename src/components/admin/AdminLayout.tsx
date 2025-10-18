import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  PaintBrushIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
  NewspaperIcon,
  PhotoIcon,
  PresentationChartLineIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BriefcaseIcon,
  SparklesIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import GlobalSearch from '../../admin/components/GlobalSearch';
import NotificationsDropdown from '../../admin/components/NotificationsDropdown';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  badge?: number;
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentAdmin = useMemo(() => {
    const adminId = sessionStorage.getItem('admin_id');
    return (data?.adminUsers || []).find(a => a.id === adminId) || null;
  }, [data?.adminUsers]);

  const can = (perm: keyof NonNullable<typeof currentAdmin>['permissions']) => {
    if (!currentAdmin) return true; // fallback: show all if none
    if (currentAdmin.role === 'SuperAdmin') return true;
    return Boolean(currentAdmin.permissions?.[perm]);
  };

  const counts = useMemo(() => {
    return {
      newCastingApps:
        data?.castingApplications?.filter((app) => app.status === 'Nouveau').length || 0,
      newFashionDayApps:
        data?.fashionDayApplications?.filter((app) => app.status === 'Nouveau').length || 0,
      newRecoveryRequests:
        data?.recoveryRequests?.filter((req) => req.status === 'Nouveau').length || 0,
      newBookingRequests:
        data?.bookingRequests?.filter((req) => req.status === 'Nouveau').length || 0,
      newMessages:
        data?.contactMessages?.filter((msg) => msg.status === 'Nouveau').length || 0,
    };
  }, [data]);

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Tableau de bord',
      items: [
        { label: 'Accueil', to: '/admin', icon: HomeIcon },
        { label: 'Mon Profil', to: '/admin/profile', icon: KeyIcon },
        ...(can('canManageAdmins') ? [{ label: 'Clés API', to: '/admin/api-keys', icon: Cog6ToothIcon } as NavItem] : []),
      ],
    },
    {
      title: 'Talents',
      items: [
        ...(can('canManageModels') ? [{ label: 'Mannequins Pro', to: '/admin/models', icon: UsersIcon } as NavItem] : []),
        ...(can('canEditContent') ? [{ label: 'Direction Artistique', to: '/admin/artistic-direction', icon: PaintBrushIcon } as NavItem] : []),
        {
          label: 'Candidatures Casting',
          to: '/admin/casting-applications',
          icon: ClipboardDocumentListIcon,
          badge: counts.newCastingApps,
        },
        { label: 'Résultats Casting', to: '/admin/casting-results', icon: ClipboardDocumentCheckIcon },
        { label: 'Accès Mannequins', to: '/admin/model-access', icon: KeyIcon },
      ],
    },
    {
      title: 'Contenu',
      items: [
        ...(can('canEditContent') ? [{ label: 'Magazine', to: '/admin/magazine', icon: NewspaperIcon } as NavItem] : []),
        ...(can('canEditContent') ? [{ label: 'Galerie', to: '/admin/gallery', icon: PhotoIcon } as NavItem] : []),
        ...(can('canEditContent') ? [{ label: 'Actualités', to: '/admin/news', icon: PresentationChartLineIcon } as NavItem] : []),
        ...(can('canEditContent') ? [{ label: "Contenu de l'Agence", to: '/admin/agency', icon: BuildingStorefrontIcon } as NavItem] : []),
        { label: 'Événements PFD', to: '/admin/fashion-day-events', icon: CalendarDaysIcon },
        ...(can('canModerateComments') ? [{ label: 'Commentaires', to: '/admin/comments', icon: ChatBubbleLeftRightIcon } as NavItem] : []),
        { label: 'Classroom Pro', to: '/admin/classroom', icon: BookOpenIcon },
        { label: 'Paramètres', to: '/admin/settings', icon: Cog6ToothIcon },
      ],
    },
    {
      title: 'Opérations',
      items: [
        ...(can('canManagePayments') ? [{ label: 'Comptabilité', to: '/admin/payments', icon: CurrencyDollarIcon } as NavItem] : []),
        { label: 'Absences', to: '/admin/absences', icon: CalendarIcon },
        {
          label: 'Bookings',
          to: '/admin/bookings',
          icon: BriefcaseIcon,
          badge: counts.newBookingRequests,
        },
        {
          label: 'Candidatures PFD',
          to: '/admin/fashion-day-applications',
          icon: SparklesIcon,
          badge: counts.newFashionDayApps,
        },
        { label: 'Suivi Classroom', to: '/admin/classroom-progress', icon: AcademicCapIcon },
        { label: 'Messages', to: '/admin/messages', icon: EnvelopeIcon, badge: counts.newMessages },
        {
          label: 'Récupération',
          to: '/admin/recovery-requests',
          icon: ExclamationTriangleIcon,
          badge: counts.newRecoveryRequests,
        },
      ],
    },
    {
      title: 'Pilotage',
      items: [
        ...(data?.featureFlags?.reports
          ? ([{ label: 'Rapports', to: '/admin/reports', icon: PresentationChartLineIcon }] as NavItem[])
          : []),
        ...(data?.featureFlags?.calendar
          ? ([{ label: 'Calendrier', to: '/admin/calendar', icon: CalendarDaysIcon }] as NavItem[])
          : []),
        ...(data?.featureFlags?.auditLog
          ? ([{ label: "Journal d'audit", to: '/admin/audit-log', icon: ExclamationTriangleIcon }] as NavItem[])
          : []),
      ],
    },
  ];

  const linkBaseClass =
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors';
  const linkActiveClass = 'bg-pm-gold/10 text-pm-gold';
  const linkInactiveClass = 'text-pm-off-white/80 hover:text-pm-gold hover:bg-pm-gold/5';

  const Sidebar = (
    <aside className="w-72 shrink-0 bg-black border-r border-pm-gold/10 h-full flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-pm-gold/10">
        <span className="text-pm-gold font-bold tracking-wider">PMM Admin</span>
      </div>
      <nav className="p-3 overflow-y-auto flex-1 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-2 px-2">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      [linkBaseClass, isActive ? linkActiveClass : linkInactiveClass].join(' ')
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 text-[10px] font-bold rounded-full bg-red-600 text-white px-1">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-pm-gold/10">
        <button
          onClick={() => {
            sessionStorage.clear();
            navigate('/login');
          }}
          className={`${linkBaseClass} ${linkInactiveClass} w-full justify-start`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen w-full flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen sticky top-0">{Sidebar}</div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-40 ${sidebarOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!sidebarOpen}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-72 transform transition-transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {Sidebar}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-black/60 backdrop-blur border-b border-pm-gold/10 flex items-center px-3 md:px-5">
          <button
            className="md:hidden mr-2 text-pm-off-white/80 hover:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-pm-gold font-semibold">Administration</h1>
          <div className="ml-auto flex items-center gap-2">
            {data?.featureFlags?.globalSearch && (
              <>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-pm-off-white/80 hover:text-white"
                  aria-label="Rechercher"
                >
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
                <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
              </>
            )}
            {data?.featureFlags?.notificationsCenter && (
              <NotificationsDropdown />
            )}
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
