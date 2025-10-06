import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from './SEO';
import { 
  HomeIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  CalendarDaysIcon,
  KeyIcon,
  Bars3Icon,
  XMarkIcon,
  PresentationChartLineIcon,
  PaintBrushIcon,
  CameraIcon,
  BookOpenIcon,
  UserIcon,
  BellIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
// import AIAssistant from '../AIAssistant';

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({ 
  children, 
  title, 
  description, 
  breadcrumbs = [], 
  showSearch = false,
  onSearch 
}) => {
  const location = useLocation();
  const { data } = useData();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  // const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['Principal']));

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const toggleMenu = (category: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Notifications count
  const newCastingApps = (data as any)?.castingApplications?.filter((app: any) => app.status === 'Nouveau').length || 0;
  const newFashionDayApps = (data as any)?.fashionDayApplications?.filter((app: any) => app.status === 'Nouveau').length || 0;
  const newRecoveryRequests = (data as any)?.recoveryRequests?.filter((req: any) => req.status === 'Nouveau').length || 0;
  const newBookingRequests = (data as any)?.bookingRequests?.filter((req: any) => req.status === 'Nouveau').length || 0;
  const newMessages = (data as any)?.contactMessages?.filter((msg: any) => msg.status === 'Nouveau').length || 0;
  const totalNotifications = newCastingApps + newFashionDayApps + newRecoveryRequests + newBookingRequests + newMessages;

  interface MenuItem {
    path: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
    notificationCount?: number;
  }

  const menuItems = [
    { 
      category: 'Principal', 
      items: [
        { path: '/admin', label: 'Dashboard', icon: HomeIcon, exact: true },
        { path: '/admin/models', label: 'Mannequins', icon: UserGroupIcon },
        { path: '/admin/content', label: 'Contenu', icon: DocumentTextIcon },
        { path: '/admin/communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
        { path: '/admin/finance', label: 'Finance', icon: CurrencyDollarIcon },
        { path: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
      ] as MenuItem[]
    },
    { 
      category: 'Gestion', 
      items: [
        { path: '/admin/casting-applications', label: 'Candidatures Casting', icon: ClipboardDocumentListIcon, notificationCount: newCastingApps },
        { path: '/admin/fashion-day-applications', label: 'Candidatures PFD', icon: CalendarDaysIcon, notificationCount: newFashionDayApps },
        { path: '/admin/bookings', label: 'Réservations', icon: CalendarIcon, notificationCount: newBookingRequests },
        { path: '/admin/payments', label: 'Paiements', icon: CreditCardIcon },
        { path: '/admin/messages', label: 'Messages', icon: EnvelopeIcon, notificationCount: newMessages },
        { path: '/admin/recovery-requests', label: 'Récupération', icon: KeyIcon, notificationCount: newRecoveryRequests },
      ] as MenuItem[]
    },
    { 
      category: 'Contenu & Formation', 
      items: [
        { path: '/admin/magazine', label: 'Magazine', icon: NewspaperIcon },
        { path: '/admin/classroom', label: 'Formation', icon: BookOpenIcon },
        { path: '/admin/media', label: 'Médias', icon: CameraIcon },
        { path: '/admin/news', label: 'Actualités', icon: PresentationChartLineIcon },
        { path: '/admin/artistic-direction', label: 'Direction Artistique', icon: PaintBrushIcon },
      ] as MenuItem[]
    },
    { 
      category: 'Système', 
      items: [
        { path: '/admin/users', label: 'Utilisateurs', icon: UserIcon },
        { path: '/admin/settings', label: 'Paramètres', icon: CogIcon },
        { path: '/admin/technical', label: 'Technique', icon: WrenchScrewdriverIcon },
        { path: '/admin/profile', label: 'Profil', icon: ShieldCheckIcon },
      ] as MenuItem[]
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
      <SEO title={`${title || 'Admin'} - Administration`} noIndex />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pm-gold/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-60 right-20 w-40 h-40 bg-pm-gold/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pm-gold/4 rounded-full blur-2xl animate-pulse delay-2000"></div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-sm border-r border-pm-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-pm-gold/20">
              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 rounded-xl flex items-center justify-center border border-pm-gold/30 group-hover:scale-105 transition-transform">
                  <HomeIcon className="w-6 h-6 text-pm-gold" />
                </div>
                <div>
                  <h1 className="text-xl font-playfair text-pm-gold">Admin Panel</h1>
                  <p className="text-xs text-pm-off-white/60">Perfect Models Management</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((category, categoryIndex) => {
                const isExpanded = expandedMenus.has(category.category);
                return (
                  <div key={categoryIndex} className="mb-2">
                    {/* Menu Header */}
                    <button
                      onClick={() => toggleMenu(category.category)}
                      className="w-full flex items-center justify-between px-6 py-3 text-sm font-semibold text-pm-gold/80 hover:text-pm-gold hover:bg-pm-gold/5 transition-all duration-200 group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-wider">{category.category}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
                      )}
                    </button>
                    
                    {/* Menu Items */}
                    {isExpanded && (
                      <div className="space-y-1 mb-4">
                        {category.items.map((item, itemIndex) => {
                          const isItemActive = isActive(item.path, item.exact);
                          return (
                            <Link
                              key={itemIndex}
                              to={item.path}
                              className={`flex items-center justify-between px-8 py-2 text-sm transition-all duration-200 group relative ${
                                isItemActive
                                  ? 'bg-pm-gold/10 text-pm-gold border-r-2 border-pm-gold'
                                  : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/5'
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </div>
                              {item.notificationCount && item.notificationCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {item.notificationCount}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-pm-gold/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-gradient-to-r from-black/95 via-pm-dark/98 to-black/95 backdrop-blur-sm border-b border-pm-gold/20 sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Menu Button & Title */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </button>
                  
                  <div>
                    <h1 className="text-2xl font-playfair text-pm-gold">{title || 'Dashboard'}</h1>
                    {description && (
                      <p className="text-pm-off-white/70 text-sm">{description}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Search */}
                  {showSearch && (
                    <form onSubmit={handleSearch} className="hidden md:block">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pm-off-white/50" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher..."
                          className="w-64 pl-10 pr-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        />
                      </div>
                    </form>
                  )}

                  {/* Notifications */}
                  {totalNotifications > 0 && (
                    <div className="relative">
                      <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                        <BellIcon className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                        <span className="text-white text-xs font-bold">{totalNotifications}</span>
                      </div>
                    </div>
                  )}

                  {/* AI Assistant - Temporairement désactivé */}
                </div>
              </div>

              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="mt-4 flex items-center space-x-2 text-sm">
                  <Link to="/admin" className="text-pm-gold hover:text-yellow-300 transition-colors">
                    Dashboard
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <span className="text-pm-gold/50">/</span>
                      {crumb.href ? (
                        <Link 
                          to={crumb.href} 
                          className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-pm-gold">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-6 py-8">
            <div className="space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* AI Assistant - Temporairement désactivé */}
      {/* <AIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onInsertContent={() => {}}
        fieldName="Assistant Global"
        initialPrompt="Bonjour ! Je suis votre assistant IA pour Perfect Models Management. Comment puis-je vous aider avec la gestion de votre agence de mannequins ?"
      /> */}
    </div>
  );
};

export default AdminSidebarLayout;
