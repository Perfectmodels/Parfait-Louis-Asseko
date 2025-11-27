import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  CameraIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface QuickNavigationProps {
  className?: string;
  showSearch?: boolean;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ 
  className = '', 
  showSearch = true 
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, sessionTimeLeft, extendSession } = useAuth();

  // Navigation rapide selon le rôle
  const getQuickActions = () => {
    if (!user) return [];

    const actions = [];

    switch (user.role) {
      case 'admin':
        actions.push(
          { name: 'Nouveau Booking', href: '/admin/bookings/new', icon: PlusIcon, color: 'bg-blue-500' },
          { name: 'Nouveau Casting', href: '/admin/casting/new', icon: CameraIcon, color: 'bg-purple-500' },
          { name: 'Messages', href: '/admin/messages', icon: ChatBubbleLeftRightIcon, color: 'bg-green-500' },
          { name: 'Rapports', href: '/admin/reports', icon: DocumentTextIcon, color: 'bg-orange-500' },
        );
        break;
      case 'model':
        actions.push(
          { name: 'Mon Profil', href: '/profil', icon: UserIcon, color: 'bg-pm-gold' },
          { name: 'Mes Bookings', href: '/profil/bookings', icon: CalendarIcon, color: 'bg-blue-500' },
          { name: 'Casting', href: '/casting', icon: CameraIcon, color: 'bg-purple-500' },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon, color: 'bg-green-500' },
        );
        break;
      case 'client':
        actions.push(
          { name: 'Réserver', href: '/booking', icon: PlusIcon, color: 'bg-blue-500' },
          { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon, color: 'bg-purple-500' },
          { name: 'Mes Bookings', href: '/client/bookings', icon: CalendarIcon, color: 'bg-green-500' },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon, color: 'bg-orange-500' },
        );
        break;
      case 'student':
        actions.push(
          { name: 'Formation', href: '/formations', icon: DocumentTextIcon, color: 'bg-blue-500' },
          { name: 'Forum', href: '/formations/forum', icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500' },
          { name: 'Profil', href: '/profil', icon: UserIcon, color: 'bg-green-500' },
        );
        break;
    }

    return actions;
  };

  const quickActions = getQuickActions();

  // Pages récemment visitées
  const getRecentPages = () => {
    const recent = JSON.parse(localStorage.getItem('recent_pages') || '[]');
    return recent.slice(0, 5);
  };

  const recentPages = getRecentPages();

  const handleNavigation = (href: string) => {
    // Sauvegarder la page dans l'historique
    const recent = getRecentPages();
    const updated = [
      { href, title: getPageTitle(href), timestamp: Date.now() },
      ...recent.filter(p => p.href !== href)
    ].slice(0, 10);
    
    localStorage.setItem('recent_pages', JSON.stringify(updated));
    navigate(href);
  };

  const getPageTitle = (href: string): string => {
    const titles: Record<string, string> = {
      '/': 'Accueil',
      '/mannequins': 'Mannequins',
      '/contact': 'Contact',
      '/casting': 'Casting',
      '/profil': 'Profil',
      '/admin': 'Admin',
      '/chat': 'Messages',
      '/notifications-settings': 'Notifications',
    };
    
    return titles[href] || href.replace('/', '').charAt(0).toUpperCase() + href.slice(2) || 'Page';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Logique de recherche
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const formatSessionTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}min`;
  };

  const getSessionColor = () => {
    const percentage = (sessionTimeLeft / (72 * 60 * 60 * 1000)) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {/* Header avec session */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Navigation Rapide</h3>
          
          {user && (
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getSessionColor()} bg-opacity-10`}>
              <div className={`w-2 h-2 rounded-full ${getSessionColor()} animate-pulse`}></div>
              <span className={`text-xs font-medium ${getSessionColor().replace('bg-', 'text-')}`}>
                {formatSessionTime(sessionTimeLeft)}
              </span>
              <button
                onClick={extendSession}
                className="text-xs underline"
                title="Prolonger la session de 72h"
              >
                Prolonger
              </button>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        {showSearch && (
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Rechercher une page, un mannequin..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              
              {searchOpen && searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </form>
          </div>
        )}

        {/* Actions rapides */}
        {quickActions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Actions Rapides</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleNavigation(action.href)}
                    className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pages récentes */}
        {recentPages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Pages Récentes</h4>
            <div className="space-y-1">
              {recentPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(page.href)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                    location.pathname === page.href ? 'bg-pm-gold bg-opacity-10 text-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{page.title}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(page.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation principale */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Navigation</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleNavigation('/')}
              className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                location.pathname === '/' ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
              }`}
            >
              <HomeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Accueil</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/mannequins')}
              className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                location.pathname.startsWith('/mannequins') ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Mannequins</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => handleNavigation('/profil')}
                  className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    location.pathname.startsWith('/profil') ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <UserIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Profil</span>
                </button>

                <button
                  onClick={() => handleNavigation('/chat')}
                  className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    location.pathname.startsWith('/chat') ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Messages</span>
                </button>

                <button
                  onClick={() => handleNavigation('/notifications-settings')}
                  className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    location.pathname.startsWith('/notifications-settings') ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <BellIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Notifications</span>
                </button>

                <button
                  onClick={logout}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-red-50 transition-colors text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    location.pathname === '/contact' ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Contact</span>
                </button>

                <button
                  onClick={() => handleNavigation('/casting')}
                  className={`flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    location.pathname.startsWith('/casting') ? 'bg-pm-gold bg-opacity-10 text-pm-gold border-pm-gold' : 'text-gray-700'
                  }`}
                >
                  <CameraIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Casting</span>
                </button>

                <button
                  onClick={() => handleNavigation('/login')}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <UserIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Connexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNavigation;
