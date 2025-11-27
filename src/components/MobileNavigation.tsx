import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  CameraIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, sessionTimeLeft, extendSession } = useAuth();

  // Navigation items selon le rôle
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Accueil', href: '/', icon: HomeIcon },
      { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon },
      { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
    ];

    if (!user) {
      return [
        ...baseItems,
        { name: 'Connexion', href: '/login', icon: UserIcon },
      ];
    }

    const roleItems = [];
    
    switch (user.role) {
      case 'admin':
        roleItems.push(
          { name: 'Tableau de bord', href: '/admin', icon: DocumentTextIcon },
          { name: 'Casting', href: '/admin/casting', icon: CameraIcon },
          { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon },
          { name: 'Messages', href: '/admin/messages', icon: ChatBubbleLeftRightIcon },
          { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        );
        break;
      case 'model':
        roleItems.push(
          { name: 'Profil', href: '/profil', icon: UserIcon },
          { name: 'Bookings', href: '/profil/bookings', icon: CalendarIcon },
          { name: 'Casting', href: '/casting', icon: CameraIcon },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon },
        );
        break;
      case 'client':
        roleItems.push(
          { name: 'Booking', href: '/booking', icon: CalendarIcon },
          { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon },
        );
        break;
      case 'student':
        roleItems.push(
          { name: 'Formation', href: '/formations', icon: DocumentTextIcon },
          { name: 'Forum', href: '/formations/forum', icon: ChatBubbleLeftRightIcon },
          { name: 'Profil', href: '/profil', icon: UserIcon },
        );
        break;
    }

    return [
      ...baseItems,
      ...roleItems,
      { name: 'Notifications', href: '/notifications-settings', icon: BellIcon },
    ];
  };

  const navigationItems = getNavigationItems();

  // Fermer le menu lors de la navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
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
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}>
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive 
                    ? 'text-pm-gold' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
                {item.name === 'Notifications' && unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Session Timer */}
      {user && (
        <div className="fixed top-4 right-4 z-40 lg:hidden">
          <div className={`flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-md border border-gray-200 ${getSessionColor()}`}>
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">
              {formatSessionTime(sessionTimeLeft)}
            </span>
            <button
              onClick={extendSession}
              className="text-xs underline"
              title="Prolonger la session"
            >
              +72h
            </button>
          </div>
        </div>
      )}

      {/* Slide Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {user && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pm-gold rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className={`mt-2 text-xs font-medium ${getSessionColor()}`}>
                    Session: {formatSessionTime(sessionTimeLeft)}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || 
                                 (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-pm-gold text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.name === 'Notifications' && unreadNotifications > 0 && (
                        <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {user && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Perfect Models Management
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
