
import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink as NavLinkType, SocialLinks } from '../../types';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; }> = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === '/'}
    className={({ isActive }) =>
      `relative py-2 px-3 text-sm uppercase tracking-wider font-medium transition-colors duration-300 ${
        isActive ? 'text-white' : 'text-pm-off-white/70 hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {label}
        {isActive && (
          <motion.span
            layoutId="active-nav-link"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-pm-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        )}
      </>
    )}
  </NavLink>
);

const NavLinks: React.FC<{ navLinks: NavLinkType[]; }> = ({ navLinks }) => (
  <AnimatePresence>
    <nav className="hidden lg:flex items-center gap-2">
        {navLinks.map((link) => (
            <NavLinkItem key={link.path} to={link.path} label={link.label} />
        ))}
    </nav>
  </AnimatePresence>
);

const SocialLinksComponent: React.FC<{ socialLinks: SocialLinks | undefined }> = ({ socialLinks }) => {
    const socialIcons = [
        { key: 'facebook', href: socialLinks?.facebook, icon: FacebookIcon },
        { key: 'instagram', href: socialLinks?.instagram, icon: InstagramIcon },
        { key: 'youtube', href: socialLinks?.youtube, icon: YoutubeIcon },
    ].filter(item => item.href);

    if (socialIcons.length === 0) return null;

    return (
        <div className="flex items-center gap-4">
            {socialIcons.map(social => (
                <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-white transition-colors">
                    <social.icon className="w-5 h-5" />
                </a>
            ))}
        </div>
    );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const classroomAccess = sessionStorage.getItem('classroom_access');
    const classroomRole = sessionStorage.getItem('classroom_role');
    setIsLoggedIn(classroomAccess === 'granted');
    setUserRole(classroomRole);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const navLinksFromData = data?.navLinks || [];
  const fallbackNavLinks = [
    { path: '/agence', label: 'Agence' },
    { path: '/mannequins', label: 'Mannequins' },
    { path: '/magazine', label: 'Magazine' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/contact', label: 'Contact' },
  ];

  const effectiveNavLinks = navLinksFromData.length > 0 ? navLinksFromData.filter(l => l.inHeader) : fallbackNavLinks;

  const processedNavLinks = useMemo(() => {
    return effectiveNavLinks.map(link => {
      if (link.label === 'Classroom') {
        if (userRole === 'student' || userRole === 'beginner') {
          const userId = sessionStorage.getItem('userId');
          return { ...link, label: 'Mon Profil', path: `/profil/${userId}` };
        }
        if (userRole === 'admin') return { ...link, path: '/admin/classroom' };
        return null;
      }
      return link;
    }).filter((link): link is NavLinkType => link !== null);
  }, [effectiveNavLinks, userRole]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out hidden lg:block ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src={data?.siteConfig.logo}
              alt="Perfect Models Management Logo" 
              className="h-10 w-auto transition-all duration-300"
            />
          </Link>
        </div>

        <NavLinks navLinks={processedNavLinks} />

        <div className="flex items-center gap-6">
          <SocialLinksComponent socialLinks={data?.socialLinks} />
          
          <div className="h-8 w-px bg-pm-off-white/20"></div>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to={userRole === 'admin' ? '/admin' : `/profil/${sessionStorage.getItem('userId')}`} className="flex items-center gap-2 text-pm-off-white/80 hover:text-white transition-colors text-sm font-medium">
                <UserIcon className="w-5 h-5" />
                {userRole === 'admin' ? 'Admin' : 'Profil'}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-pm-off-white/80 hover:text-white transition-colors text-sm font-medium">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/casting"
              className="px-5 py-2 text-sm font-bold bg-pm-gold text-pm-dark rounded-full hover:bg-white transition-all"
            >
              Postuler
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
