import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Changed import for NavLinkType to use centralized types.ts file to resolve circular dependency.
import { NavLink as NavLinkType, SocialLinks } from '../../types';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
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
            `relative py-2 px-3 text-pm-off-white uppercase text-sm tracking-widest transition-all duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold whitespace-nowrap text-center break-words hyphens-auto ${
              isActive ? "text-pm-gold" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="block max-w-full">{label}</span>
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
      </motion.div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative py-2 px-3 text-pm-off-white uppercase text-sm tracking-widest transition-all duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold whitespace-nowrap ${
          isActive ? "text-pm-gold" : ""
        }`
      }
    >
      {({ isActive }) => (
        <>
          <motion.span 
            className="relative z-10"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
          <motion.span 
            className="absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.div
            className="absolute inset-0 bg-pm-gold/10 rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}
    </NavLink>
  );
};


const NavLinks: React.FC<{ onLinkClick?: () => void; navLinks: NavLinkType[]; isMobile?: boolean; isOpen?: boolean; }> = ({ onLinkClick, navLinks, isMobile = false, isOpen = false }) => {
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

const LogoutButton: React.FC<{ onClick: () => void, className?: string, isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ onClick, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
    const mobileAnimationClasses = isMobile
    ? `transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`
    : '';

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 hover:text-pm-gold focus-style-self focus-visible:text-pm-gold ${className} ${mobileAnimationClasses}`}
            aria-label="Déconnexion"
            style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
        >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Déconnexion</span>
        </button>
    );
};

const SocialLinksComponent: React.FC<{ socialLinks: SocialLinks | undefined; className?: string; isMobile?: boolean; isOpen?: boolean; delay?: number }> = ({ socialLinks, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
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
                className={`flex items-center gap-5 ${className}`}
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
                        className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                        aria-label={social.label}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <social.icon className="w-6 h-6" />
                    </motion.a>
                ))}
            </motion.div>
        );
    }

    return (
        <div className={`flex items-center gap-5 ${className}`}>
            {socialIcons.map((social, index) => (
                <motion.a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <social.icon className="w-6 h-6" />
                </motion.a>
            ))}
        </div>
    );
};

export const Breadcrumb: React.FC = () => {
    const location = useLocation();
    const params = useParams();
    const { data } = useData();

    const crumbs = useMemo(() => {
        const breadcrumbNameMap: { [key: string]: string } = {
            '/agence': 'Agence', '/mannequins': 'Nos Mannequins', '/fashion-day': 'PFD',
            '/magazine': 'Magazine', '/contact': 'Contact', '/services': 'Services',
            '/casting': 'Casting', '/casting-formulaire': 'Postuler au Casting',
            '/fashion-day-application': 'Candidature PFD', '/profil': 'Mon Profil',
            '/formations': 'Classroom', '/formations/forum': 'Forum',
            '/classroom-debutant': 'Formations'
        };

        const pathnames = location.pathname.split('/').filter(Boolean);
        let currentCrumbs: { label: string; path: string }[] = [];
        let currentPath = '';

        pathnames.forEach(segment => {
            currentPath += `/${segment}`;
            if (breadcrumbNameMap[currentPath]) {
                currentCrumbs.push({ label: breadcrumbNameMap[currentPath], path: currentPath });
            } else if (params.id && currentPath.startsWith('/mannequins/')) {
                const model = data?.models.find(m => m.id === params.id);
                if (model) currentCrumbs.push({ label: model.name, path: currentPath });
            } else if (params.slug && currentPath.startsWith('/magazine/')) {
                const article = data?.articles.find(a => a.slug === params.slug);
                if (article) currentCrumbs.push({ label: article.title, path: currentPath });
            } else if (params.threadId && currentPath.startsWith('/formations/forum/')) {
                const thread = data?.forumThreads.find(t => t.id === params.threadId);
                if (thread) currentCrumbs.push({ label: thread.title, path: currentPath });
            }
        });
        return currentCrumbs;
    }, [location.pathname, params, data]);

    useEffect(() => {
        const schemaElementId = 'breadcrumb-schema-script';
        let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

        if (crumbs.length > 1) {
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": crumbs.map((crumb, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": crumb.label,
                    "item": `${window.location.origin}/#${crumb.path}`
                }))
            };
            
            if (!schemaElement) {
                schemaElement = document.createElement('script');
                schemaElement.id = schemaElementId;
                schemaElement.type = 'application/ld+json';
                document.head.appendChild(schemaElement);
            }
            schemaElement.innerHTML = JSON.stringify(breadcrumbSchema);
        } else if (schemaElement) {
            schemaElement.remove();
        }

        return () => {
            const el = document.getElementById(schemaElementId);
            if (el) el.remove();
        };
    }, [crumbs]);
    
    if (crumbs.length <= 1 || location.pathname.startsWith('/login') || location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="bg-black border-b border-pm-gold/20 print-hide">
            <div className="container mx-auto px-6">
                <nav aria-label="Fil d'Ariane" className="py-3">
                    <ol className="flex items-center space-x-1 text-sm text-pm-off-white/70 overflow-x-auto whitespace-nowrap">
                        {crumbs.map((crumb, index) => {
                            const isLast = index === crumbs.length - 1;
                            return (
                                <li key={crumb.path} className="flex items-center">
                                    {index > 0 && <ChevronRightIcon className="w-4 h-4 mx-1 text-pm-off-white/50 flex-shrink-0" />}
                                    {isLast ? (
                                        <span className="font-bold text-pm-gold truncate" aria-current="page">{crumb.label}</span>
                                    ) : (
                                        <Link to={crumb.path} className="hover:text-pm-gold transition-colors">{crumb.label}</Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
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
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          return;
        }
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      const timer = setTimeout(() => firstElement.focus(), 100);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalBodyOverflow;
        hamburgerButtonRef.current?.focus();
      };
    } else {
      document.body.style.overflow = originalBodyOverflow;
    }
  }, [isOpen]);

  useEffect(() => {
    const role = sessionStorage.getItem('classroom_role');
    const access = sessionStorage.getItem('classroom_access') === 'granted';
    const socialAccess = sessionStorage.getItem('social_access') === 'granted';
    setUserRole(role);
    setIsLoggedIn(access);
    setIsSocialLoggedIn(socialAccess);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);
  
  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [location.pathname]);

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

  const processedNavLinks = useMemo(() => {
    const links = navLinksFromData.map(link => {
        if (link.label === 'Classroom') {
            if (userRole === 'student') return { ...link, label: 'Mon Profil', path: '/profil' };
            if (userRole === 'admin') return { ...link, path: '/admin/classroom' };
            return null;
        }
        return link;
    }).filter((link): link is NavLinkType => link !== null);

    // Ajouter le lien vers le mini réseau social si l'utilisateur est connecté
    if (isLoggedIn && !isSocialLoggedIn) {
        links.push({ path: '/social-login', label: 'Réseau Social', inFooter: false });
    } else if (isSocialLoggedIn) {
        links.push({ path: '/formations/forum', label: 'Communauté', inFooter: false });
    }

    return links;
  }, [navLinksFromData, userRole, isLoggedIn, isSocialLoggedIn]);

  const applyButtonDelay = 150 + processedNavLinks.length * 50;
  const logoutButtonDelay = 150 + (processedNavLinks.length + 1) * 50;
  const socialLinksDelay = 150 + (isLoggedIn ? processedNavLinks.length + 2 : processedNavLinks.length + 1) * 50;


  return (
    <>
      <header 
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 print-hide ${
          isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 h-16 lg:h-20 flex justify-between items-center transition-all duration-300">
          {siteConfig?.logo && (
            <Link to="/" className="flex-shrink-0 z-10" onClick={() => setIsOpen(false)}>
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-12 lg:h-14 w-auto transition-all duration-300" />
            </Link>
          )}
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center max-w-4xl">
            <NavLinks navLinks={processedNavLinks} />
          </nav>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/casting-formulaire" 
                className="relative px-4 xl:px-5 py-2 text-pm-dark bg-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20 whitespace-nowrap overflow-hidden group"
              >
                <motion.span
                  className="relative z-10"
                  initial={{ x: 0 }}
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Postuler
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pm-gold to-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </Link>
            </motion.div>
            <SocialLinksComponent socialLinks={socialLinks} />
            {isLoggedIn && <LogoutButton onClick={handleLogout} />}
          </div>

          <div className="lg:hidden flex items-center">
              <button ref={hamburgerButtonRef} onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2" aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu-panel">
                  <AnimatedHamburgerIcon isOpen={isOpen} />
              </button>
          </div>
        </div>
      </header>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden={!isOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        className="lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-pm-dark shadow-2xl shadow-pm-gold/10 z-40 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isOpen}
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
      >
        <div className="flex justify-between items-center p-6 border-b border-pm-gold/20 h-24 flex-shrink-0">
             <span id="mobile-menu-title" className="font-playfair text-xl text-pm-gold">Menu</span>
        </div>
        <div className="flex-grow overflow-y-auto">
            <nav className="flex flex-col p-8 gap-6">
              <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile={true} isOpen={isOpen}/>
              <motion.div 
                className="text-center"
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
                        className="relative inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white overflow-hidden group"
                    >
                        <motion.span
                          className="relative z-10"
                          initial={{ x: 0 }}
                          whileHover={{ x: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          Postuler
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pm-gold to-white"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '0%' }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                    </Link>
                  </motion.div>
              </motion.div>
              {isLoggedIn && <LogoutButton onClick={handleLogout} isMobile={true} isOpen={isOpen} delay={logoutButtonDelay} />}
            </nav>
        </div>
        <div className="p-8 border-t border-pm-gold/20 flex-shrink-0">
             <SocialLinksComponent 
                socialLinks={socialLinks} 
                className="justify-center"
                isMobile={true}
                isOpen={isOpen}
                delay={socialLinksDelay}
             />
        </div>
      </motion.div>
    </>
  );
};

export default Header;
