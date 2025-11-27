import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation items simples selon le rôle
  const getNavigationItems = () => {
    if (!user) {
      return [
        { name: 'Accueil', href: '/', icon: HomeIcon },
        { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon },
        { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
        { name: 'Connexion', href: '/login', icon: UserIcon },
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { name: 'Accueil', href: '/', icon: HomeIcon },
          { name: 'Admin', href: '/admin', icon: UserIcon },
          { name: 'Casting', href: '/admin/casting', icon: CalendarIcon },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon },
        ];
      case 'model':
        return [
          { name: 'Accueil', href: '/', icon: HomeIcon },
          { name: 'Profil', href: '/profil', icon: UserIcon },
          { name: 'Casting', href: '/casting', icon: CalendarIcon },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon },
        ];
      case 'client':
        return [
          { name: 'Accueil', href: '/', icon: HomeIcon },
          { name: 'Booking', href: '/booking', icon: CalendarIcon },
          { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon },
          { name: 'Messages', href: '/chat', icon: ChatBubbleLeftRightIcon },
        ];
      case 'student':
        return [
          { name: 'Accueil', href: '/', icon: HomeIcon },
          { name: 'Formation', href: '/formations', icon: UserIcon },
          { name: 'Forum', href: '/formations/forum', icon: ChatBubbleLeftRightIcon },
          { name: 'Profil', href: '/profil', icon: UserIcon },
        ];
      default:
        return [
          { name: 'Accueil', href: '/', icon: HomeIcon },
          { name: 'Mannequins', href: '/mannequins', icon: UserGroupIcon },
          { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
          { name: 'Connexion', href: '/login', icon: UserIcon },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}>
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
