import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './SocialIcons';
// FIX: Changed import for NavLinkType to use centralized types.ts file to resolve circular dependency.
import { NavLink as NavLinkType, SocialLinks } from '../../../types';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`
    : '';

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold ${mobileAnimationClasses} ` +
        (isActive ? "text-pm-gold" : "")
      }
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      {({ isActive }) => (
        <>
          {label}
          <span 
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold transform transition-transform duration-300 ease-out ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
            }`} 
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
    const mobileAnimationClasses = isMobile
    ? `transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`
    : '';

    if (!socialLinks || (!socialLinks.facebook && !socialLinks.instagram && !socialLinks.youtube)) {
        return null;
    }

    return (
        <div 
            className={`flex items-center gap-5 ${className} ${mobileAnimationClasses}`}
            style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
        >
            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Facebook"><FacebookIcon className="w-6 h-6" /></a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Instagram"><InstagramIcon className="w-6 h-6" /></a>}
            {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="YouTube"><YoutubeIcon className="w-6 h-6" /></a>}
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
            '/classroom-debutant': 'Classroom Débutant'
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
  const [showSubmenu, setShowSubmenu] = useState(false);

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
    setUserRole(role);
    setIsLoggedIn(access);
    
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
    return navLinksFromData.map(link => {
        if (link.label === 'Classroom') {
            if (userRole === 'student') return { ...link, label: 'Mon Profil', path: '/profil' };
            if (userRole === 'admin') return { ...link, path: '/admin/classroom' };
            return null;
        }
        return link;
    }).filter((link): link is NavLinkType => link !== null);
  }, [navLinksFromData, userRole]);

  const applyButtonDelay = 150 + processedNavLinks.length * 50;
  const logoutButtonDelay = 150 + (processedNavLinks.length + 1) * 50;
  const socialLinksDelay = 150 + (isLoggedIn ? processedNavLinks.length + 2 : processedNavLinks.length + 1) * 50;


  return (
    <>
      {/* Header minimaliste - uniquement le bouton hamburger */}
      <div className="fixed top-0 right-0 z-50 p-6 print-hide">
        <button 
          ref={hamburgerButtonRef}
          onClick={() => setIsOpen(!isOpen)} 
          className="relative group"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Cercle de fond animé */}
            <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
              isOpen 
                ? 'border-pm-gold bg-pm-gold/10 rotate-90 scale-110' 
                : 'border-pm-gold/30 bg-black/50 group-hover:border-pm-gold group-hover:bg-pm-gold/5 group-hover:scale-110'
            }`}></div>
            
            {/* Lignes du hamburger */}
            <div className="relative w-6 h-5 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 bg-pm-gold rounded-full transition-all duration-500 ${
                isOpen ? 'rotate-45 translate-y-2 w-6' : 'w-6 group-hover:w-7'
              }`}></span>
              <span className={`block h-0.5 bg-pm-gold rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0 scale-0' : 'w-4 group-hover:w-7'
              }`}></span>
              <span className={`block h-0.5 bg-pm-gold rounded-full transition-all duration-500 ${
                isOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-5 group-hover:w-7'
              }`}></span>
            </div>
          </div>
        </button>
      </div>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-30 transition-opacity duration-500 ${
          isOpen ? 'bg-black/70 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      
      {/* Sidebar Menu */}
      <div 
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-b from-black via-pm-dark to-black border-l border-pm-gold/30 shadow-2xl z-40 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isOpen}
      >
        {/* Background décoratif */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-64 h-64 bg-pm-gold/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-pm-gold/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Contenu scrollable */}
        <div className="relative h-full flex flex-col overflow-y-auto">
          {/* Header du menu */}
          <div className="flex-shrink-0 p-6 border-b border-pm-gold/20">
            <h2 id="mobile-menu-title" className="sr-only">Menu de navigation</h2>
            
            {/* Logo dans le menu */}
            {siteConfig?.logo && (
              <div className={`transition-all duration-500 delay-100 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}>
                <img 
                  src={siteConfig.logo} 
                  alt="Perfect Models Management" 
                  className="h-14 mx-auto"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">
            {processedNavLinks.map((link, index) => (
              <div
                key={link.path}
                className={`transition-all duration-500 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${isOpen ? 150 + index * 60 : 0}ms` }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`group relative block px-4 py-3 rounded-lg transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                      : 'text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold border border-transparent hover:border-pm-gold/20'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg font-playfair font-semibold">
                      {link.label}
                    </span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Footer du menu */}
          <div className="flex-shrink-0 p-6 border-t border-pm-gold/20 space-y-4">
            {/* Bouton Postuler */}
            <div 
              className={`transition-all duration-500 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${isOpen ? 150 + processedNavLinks.length * 60 : 0}ms` }}
            >
              <Link
                to="/casting-formulaire"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pm-gold via-yellow-400 to-pm-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all duration-500 hover:shadow-xl hover:shadow-pm-gold/40"
              >
                <span>⭐</span>
                Postuler Maintenant
              </Link>
            </div>

            {/* Bouton Déconnexion si connecté */}
            {isLoggedIn && (
              <div 
                className={`transition-all duration-500 ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${isOpen ? 150 + (processedNavLinks.length + 1) * 60 : 0}ms` }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}

            {/* Réseaux sociaux */}
            {socialLinks && (
              <div 
                className={`flex justify-center gap-4 transition-all duration-500 ${
                  isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{ transitionDelay: `${isOpen ? 150 + (processedNavLinks.length + 2) * 60 : 0}ms` }}
              >
                {socialLinks.facebook && (
                  <a 
                    href={socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300 hover:scale-110"
                  >
                    <FacebookIcon className="w-5 h-5 text-pm-gold" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a 
                    href={socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300 hover:scale-110"
                  >
                    <InstagramIcon className="w-5 h-5 text-pm-gold" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a 
                    href={socialLinks.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300 hover:scale-110"
                  >
                    <YoutubeIcon className="w-5 h-5 text-pm-gold" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
