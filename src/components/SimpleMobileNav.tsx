
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  HomeIcon,
  UserGroupIcon,
  SparklesIcon,
  NewspaperIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/solid'; // Using solid icons for better visibility
import { motion } from 'framer-motion';

const iconMap: { [key: string]: React.ElementType } = {
  Accueil: HomeIcon,
  Mannequins: UserGroupIcon,
  'Perfect Fashion Day': SparklesIcon,
  PFD: SparklesIcon,
  Magazine: NewspaperIcon,
  Galerie: PhotoIcon,
  Profil: UserIcon,
};

const MobileNavItem: React.FC<{ path: string; label: string; icon: React.ElementType; isActive: boolean; }> = ({ path, label, icon: Icon, isActive }) => {
  return (
    <Link to={path} className="flex-1 flex flex-col items-center justify-center py-2 relative">
      <Icon className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/60'}`} />
      <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-pm-off-white/70'}`}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="mobile-active-indicator"
          className="absolute bottom-0 h-1 w-8 bg-pm-gold rounded-full"
        />
      )}
    </Link>
  );
};


const SimpleMobileNav: React.FC = () => {
  const location = useLocation();
  const { data } = useData();
  const isLoggedIn = sessionStorage.getItem('classroom_access') === 'granted';
  const userRole = sessionStorage.getItem('classroom_role');
  const userId = sessionStorage.getItem('userId');

  const navLinks = data?.navLinks?.filter(l => l.inMobileNav) || [];

  const getProfilePath = () => {
    if (!isLoggedIn) return '/login';
    if (userRole === 'admin') return '/admin';
    return `/profil/${userId}`;
  };

  const finalNavItems = [
    ...navLinks.map(link => ({
      path: link.path,
      label: link.mobileLabel || link.label,
      icon: iconMap[link.label] || HomeIcon,
    })),
    {
      path: getProfilePath(),
      label: isLoggedIn ? 'Profil' : 'Connexion',
      icon: isLoggedIn ? UserIcon : ArrowRightOnRectangleIcon,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/profil') && isLoggedIn) return location.pathname.startsWith('/profil');
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden print-hide"
    >
      <div className="bg-black/80 backdrop-blur-lg border-t border-pm-gold/20">
        <div className="flex justify-around items-start pt-1 pb-safe">
          {finalNavItems.map((item) => (
            <MobileNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.path)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SimpleMobileNav;
