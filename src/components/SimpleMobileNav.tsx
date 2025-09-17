import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  NewspaperIcon, 
  PhotoIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  isProtected?: boolean;
  requiredRole?: string;
}

const SimpleMobileNav: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem('classroom_access') === 'granted';
  const userRole = sessionStorage.getItem('classroom_role');

  const navItems: NavItem[] = [
    { path: '/', label: 'Accueil', icon: HomeIcon },
    { path: '/mannequins', label: 'Mannequins', icon: UserGroupIcon },
    { path: '/fashion-day', label: 'PFD', icon: SparklesIcon },
    { path: '/magazine', label: 'Magazine', icon: NewspaperIcon },
    { path: '/galerie', label: 'Galerie', icon: PhotoIcon },
    { 
      path: '/formations', 
      label: 'Formations', 
      icon: Cog6ToothIcon, 
      isProtected: true, 
      requiredRole: 'classroom' 
    },
    { 
      path: isLoggedIn ? `/profil/${sessionStorage.getItem('userId')}` : '/login', 
      label: 'Profil', 
      icon: UserIcon, 
      isProtected: true 
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const canAccess = (item: NavItem) => {
    if (!item.isProtected) return true;
    if (!isLoggedIn) return false;
    if (item.requiredRole === 'classroom') {
      return userRole === 'student' || userRole === 'beginner';
    }
    return true;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="bg-black/90 backdrop-blur-xl border-t border-pm-gold/20 shadow-2xl">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const accessible = canAccess(item);

            return (
              <motion.div
                key={item.path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex-1"
              >
                <Link
                  to={accessible ? item.path : '/login'}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 ${
                    active 
                      ? 'text-pm-gold bg-pm-gold/10' 
                      : accessible 
                        ? 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/5' 
                        : 'text-pm-off-white/30'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${active ? 'text-pm-gold' : ''}`} />
                  </motion.div>
                  <span className={`text-xs font-medium leading-tight ${
                    active ? 'text-pm-gold' : ''
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pm-gold rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SimpleMobileNav;
