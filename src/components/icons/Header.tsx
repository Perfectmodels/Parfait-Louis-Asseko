import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  ArrowRightOnRectangleIcon, 
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  UserIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink as NavLinkType, SocialLinks } from '../../types';

// Breadcrumb Component
export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { data } = useData();
  
  const breadcrumbNameMap: Record<string, string> = {
    '/': 'Accueil',
    '/agence': 'Agence',
    '/mannequins': 'Mannequins',
    '/fashion-day': 'Perfect Fashion Day',
    '/magazine': 'Magazine',
    '/galerie': 'Galerie',
    '/services': 'Services',
    '/contact': 'Contact',
    '/formations': 'Formations',
    '/profil': 'Mon Profil',
    '/profil-debutant': 'Profil Débutant',
    '/casting': 'Casting',
    '/casting-formulaire': 'Formulaire de Casting',
    '/fashion-day-application': 'Candidature PFD',
    '/login': 'Connexion',
    '/social-login': 'Réseau Social',
    '/admin': 'Administration',
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const currentCrumbs: Array<{ label: string; path: string }> = [];

    // Add home breadcrumb
    currentCrumbs.push({ label: 'Accueil', path: '/' });

    // Build breadcrumbs from path
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      const label = breadcrumbNameMap[currentPath] || name.charAt(0).toUpperCase() + name.slice(1);
      currentCrumbs.push({ label, path: currentPath });
    });

    return currentCrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-pm-gold/10 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-pm-gold/60" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-pm-gold font-medium">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-pm-off-white/70 hover:text-pm-gold transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

const NavLinkItem: React.FC<{ 
  to: string; 
  label: string; 
  onClick?: () => void; 
  isMobile?: boolean; 
  isOpen?: boolean; 
  delay?: number; 
}> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -20 
        }}
        transition={{ 
          duration: 0.3, 
          delay: isOpen ? delay : 0,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <NavLink
          to={to}
          onClick={onClick}
          end={to === '/'}
          className={({ isActive }) =>
            `relative py-2 px-3 text-pm-off-white uppercase text-xs tracking-widest transition-all duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold whitespace-nowrap text-center break-words hyphens-auto rounded-lg hover:bg-pm-gold/10 ${
              isActive ? "text-pm-gold bg-pm-gold/10" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="block max-w-full font-medium">{label}</span>
              <motion.span 
                className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-pm-gold transform -translate-x-1/2"
                initial={{ width: 0 }}
                animate={{ width: isActive ? '80%' : 0 }}
                whileHover={{ width: '80%' }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </>
          )}
        </NavLink>
      </motion.div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative py-1.5 px-2.5 text-pm-off-white uppercase text-xs tracking-widest transition-all duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold whitespace-nowrap ${
          isActive ? "text-pm-gold" : ""
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="block max-w-full font-medium">{label}</span>
          <motion.span 
            className="absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </>
      )}
    </NavLink>
  );
};

const NavLinks: React.FC<{ 
  onLinkClick?: () => void; 
  navLinks: NavLinkType[]; 
  isMobile?: boolean; 
  isOpen?: boolean; 
}> = ({ onLinkClick, navLinks, isMobile = false, isOpen = false }) => {
  return (
    <>
      {navLinks.map((link, index) => (
        <NavLinkItem 
          key={link.path}
          to={link.path} 
          label={link.label}
          onClick={onLinkClick}
          isMobile={isMobile}
          isOpen={isOpen}
          delay={isMobile ? 150 + index * 50 : 0}
        />
      ))}
    </>
  );
};

const LogoutButton: React.FC<{ 
  onClick: () => void, 
  className?: string, 
  isMobile?: boolean; 
  isOpen?: boolean; 
  delay?: number; 
}> = ({ onClick, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`
    : '';

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1.5 py-1.5 px-2.5 text-pm-off-white uppercase text-xs tracking-widest transition-all duration-300 hover:text-pm-gold focus-style-self focus-visible:text-pm-gold rounded-lg hover:bg-pm-gold/10 ${className} ${mobileAnimationClasses}`}
      aria-label="Déconnexion"
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4" />
      <span className="font-medium">Déconnexion</span>
    </motion.button>
  );
};

const SocialLinksComponent: React.FC<{ 
  socialLinks: SocialLinks | undefined; 
  className?: string; 
  isMobile?: boolean; 
  isOpen?: boolean; 
  delay?: number 
}> = ({ socialLinks, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  if (!socialLinks || (!socialLinks.facebook && !socialLinks.instagram && !socialLinks.youtube)) {
    return null;
  }

  const socialIcons = [
    { key: 'facebook', href: socialLinks.facebook, icon: FacebookIcon, label: 'Facebook' },
    { key: 'instagram', href: socialLinks.instagram, icon: InstagramIcon, label: 'Instagram' },
    { key: 'youtube', href: socialLinks.youtube, icon: YoutubeIcon, label: 'YouTube' }
  ].filter(item => item.href);

  if (isMobile) {
    return (
      <motion.div 
        className={`flex items-center gap-4 ${className}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -20 
        }}
        transition={{ 
          duration: 0.3, 
          delay: isOpen ? delay : 0,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {socialIcons.map((social, index) => (
          <motion.a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pm-off-white hover:text-pm-gold transition-colors duration-300"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <social.icon className="w-5 h-5" />
          </motion.a>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialIcons.map((social) => (
        <motion.a
          key={social.key}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pm-off-white hover:text-pm-gold transition-colors duration-300"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <social.icon className="w-4 h-4" />
        </motion.a>
      ))}
    </div>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSocialLoggedIn, setIsSocialLoggedIn] = useState(false);

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Focus management and body scroll lock for mobile menu
  useEffect(() => {
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const focusableElementsQuery = 'a[href], button:not([disabled])';
      const focusableElements = mobileMenuRef.current?.querySelectorAll<HTMLElement>(focusableElementsQuery);
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        document.addEventListener('keydown', handleTabKey);
        firstElement.focus();

        return () => {
          document.removeEventListener('keydown', handleTabKey);
        };
      }
    } else {
      document.body.style.overflow = originalBodyOverflow;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status
  useEffect(() => {
    const classroomAccess = sessionStorage.getItem('classroom_access');
    const classroomRole = sessionStorage.getItem('classroom_role');
    const socialLogin = sessionStorage.getItem('social_login');
    
    setIsLoggedIn(classroomAccess === 'granted');
    setUserRole(classroomRole);
    setIsSocialLoggedIn(socialLogin === 'true');
  }, [location]);

  const handleLogout = () => {
    setIsOpen(false);
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };
  
  const siteConfig = data?.siteConfig;
  const navLinksFromData = data?.navLinks || [];
  const socialLinks = data?.socialLinks;

  // Fallback navigation links if data is not loaded yet
  const fallbackNavLinks = [
    { path: '/agence', label: 'Agence', inFooter: true },
    { path: '/mannequins', label: 'Mannequins', inFooter: true },
    { path: '/fashion-day', label: 'PFD', inFooter: true, footerLabel: 'Perfect Fashion Day' },
    { path: '/magazine', label: 'Magazine', inFooter: true },
    { path: '/galerie', label: 'Galerie', inFooter: true },
    { path: '/services', label: 'Services', inFooter: true },
    { path: '/contact', label: 'Contact', inFooter: true },
    { path: '/formations', label: 'Classroom', inFooter: false },
  ];

  // Use fallback if no data is loaded yet
  const effectiveNavLinks = navLinksFromData.length > 0 ? navLinksFromData : fallbackNavLinks;

  const processedNavLinks = useMemo(() => {
    const links = effectiveNavLinks.map(link => {
        if (link.label === 'Classroom') {
            if (userRole === 'student') return { ...link, label: 'Mon Profil', path: '/profil' };
            if (userRole === 'admin') return { ...link, path: '/admin/classroom' };
            return null;
        }
        return link;
    }).filter((link): link is NavLinkType => link !== null);

    // Lien vers le mini réseau social supprimé - les icônes sociales suffisent

    return links;
  }, [effectiveNavLinks, userRole, isLoggedIn, isSocialLoggedIn]);

  const applyButtonDelay = 150 + processedNavLinks.length * 50;
  const logoutButtonDelay = 150 + (processedNavLinks.length + 1) * 50;
  const socialLinksDelay = 150 + (isLoggedIn ? processedNavLinks.length + 2 : processedNavLinks.length + 1) * 50;

  return (
    <>
      {/* Modern Glassmorphism Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-12 left-4 right-4 z-50 transition-all duration-500 print-hide ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-pm-gold/30 border border-pm-gold/20' 
            : 'bg-black/70 backdrop-blur-lg shadow-xl shadow-pm-gold/20 border border-pm-gold/10'
        } rounded-2xl`}
      >
        <div className="container mx-auto px-4 h-14 lg:h-16 flex justify-between items-center">
          {/* Logo Section */}
          <motion.div 
            className="flex-shrink-0 z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {siteConfig?.logo && (
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img 
                  src={siteConfig.logo} 
                  alt="Perfect Models Management Logo" 
                  className="h-8 lg:h-10 w-auto transition-all duration-300 rounded-lg" 
                />
              </Link>
            )}
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center max-w-4xl">
            <NavLinks navLinks={processedNavLinks} />
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Social Links */}
            <SocialLinksComponent socialLinks={socialLinks} />
            
            {/* Apply Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/casting-formulaire" 
                className="px-3 xl:px-4 py-1.5 text-pm-dark bg-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-pm-gold/30 whitespace-nowrap"
              >
                Postuler
              </Link>
            </motion.div>
            
            {/* User Actions */}
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-pm-gold/10 rounded-full border border-pm-gold/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserIcon className="w-3.5 h-3.5 text-pm-gold" />
                  <span className="text-xs font-medium text-pm-gold">
                    {userRole === 'student' ? 'Mannequin' : userRole === 'admin' ? 'Admin' : 'Utilisateur'}
                  </span>
                </motion.div>
                <LogoutButton onClick={handleLogout} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Disabled for Simple Navigation */}
          {/* Navigation mobile simplifiée en bas de l'écran */}
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                ref={mobileMenuRef}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l border-pm-gold/20 z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-6 pt-20">
                  {/* Mobile Logo */}
                  <div className="mb-6 text-center">
                    {siteConfig?.logo && (
                      <img 
                        src={siteConfig.logo} 
                        alt="Perfect Models Management Logo" 
                        className="h-10 w-auto mx-auto mb-3 rounded-lg" 
                      />
                    )}
                    <h2 className="text-pm-gold font-bold text-base">Menu</h2>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-1 mb-6">
                    <NavLinks 
                      navLinks={processedNavLinks} 
                      onLinkClick={() => setIsOpen(false)} 
                      isMobile={true} 
                      isOpen={isOpen}
                    />
                  </nav>

                  {/* Mobile Apply Button */}
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: isOpen ? 1 : 0, 
                      y: isOpen ? 0 : -20 
                    }}
                    transition={{ 
                      duration: 0.3, 
                      delay: isOpen ? applyButtonDelay : 0,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/casting-formulaire"
                        onClick={() => setIsOpen(false)}
                        className="inline-block px-6 py-2.5 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-pm-gold/30"
                      >
                        Postuler
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Mobile Social Links */}
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: isOpen ? 1 : 0, 
                      y: isOpen ? 0 : -20 
                    }}
                    transition={{ 
                      duration: 0.3, 
                      delay: isOpen ? socialLinksDelay : 0,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <SocialLinksComponent 
                      socialLinks={socialLinks} 
                      isMobile={true} 
                      isOpen={isOpen}
                      delay={socialLinksDelay}
                    />
                  </motion.div>

                  {/* Mobile Logout */}
                  {isLoggedIn && (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ 
                        opacity: isOpen ? 1 : 0, 
                        y: isOpen ? 0 : -20 
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: isOpen ? logoutButtonDelay : 0,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <LogoutButton 
                        onClick={handleLogout} 
                        isMobile={true} 
                        isOpen={isOpen}
                        delay={logoutButtonDelay}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;