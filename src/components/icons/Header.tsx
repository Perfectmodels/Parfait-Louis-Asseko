import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
// FIX: Changed import for NavLinkType to use centralized types.ts file to resolve circular dependency.
import { NavLink as NavLinkType, SocialLinks } from '../../types';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`
    : '';

  const mobileStyles = isMobile ? 'py-3 lg:py-4 px-2 lg:px-4 rounded-lg hover:bg-pm-gold/10 active:bg-pm-gold/20 mobile-nav-item' : 'py-2';

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative ${mobileStyles} text-pm-off-white uppercase text-sm lg:text-base tracking-widest transition-all duration-300 group hover:text-pm-gold focus-style-self focus-visible:text-pm-gold ${mobileAnimationClasses} ` +
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

    const mobileStyles = isMobile ? 'py-3 lg:py-4 px-2 lg:px-4 rounded-lg hover:bg-red-500/10 active:bg-red-500/20 mobile-nav-item' : 'py-2';

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 ${mobileStyles} text-pm-off-white uppercase text-sm lg:text-base tracking-widest transition-all duration-300 hover:text-red-400 focus-style-self focus-visible:text-red-400 ${className} ${mobileAnimationClasses}`}
            aria-label="Déconnexion"
            style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
        >
            <ArrowRightOnRectangleIcon className="w-5 h-5 lg:w-6 lg:h-6" />
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
            // '/classroom-debutant': 'Classroom Débutant' // retiré du panel
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

  // Add swipe gesture support for mobile menu
  useEffect(() => {
    if (!isOpen) return;

    let startX = 0;
    let startY = 0;
    let isSwipeGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwipeGesture = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeGesture) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Determine if this is a horizontal swipe
        isSwipeGesture = diffX > diffY && diffX > 10;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwipeGesture) {
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;
        
        // Swipe right to close menu
        if (diffX > 50) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
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
      <header 
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 print-hide ${
          isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 h-16 lg:h-20 flex justify-between items-center transition-all duration-300">
          {siteConfig?.logo && (
            <Link to="/" className="flex-shrink-0" onClick={() => setIsOpen(false)}>
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-12 lg:h-14 w-auto transition-all duration-300" />
            </Link>
          )}
          
          {/* Desktop Navigation - visible on xl screens and up */}
          <nav className="hidden xl:flex items-center gap-8">
            <NavLinks navLinks={processedNavLinks} />
            
            <div className="flex items-center gap-6 pl-6 border-l border-pm-gold/20">
                <Link to="/casting-formulaire" className="px-5 py-2 text-pm-dark bg-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                    Postuler
                </Link>
                <SocialLinksComponent socialLinks={socialLinks} />
                {isLoggedIn && <LogoutButton onClick={handleLogout} />}
            </div>
          </nav>

          {/* Tablet Navigation - visible on lg screens */}
          <nav className="hidden lg:flex xl:hidden items-center gap-6">
            <NavLinks navLinks={processedNavLinks.slice(0, 4)} />
            
            <div className="flex items-center gap-4 pl-4 border-l border-pm-gold/20">
                <Link to="/casting-formulaire" className="px-4 py-2 text-pm-dark bg-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                    Postuler
                </Link>
                <SocialLinksComponent socialLinks={socialLinks} />
                {isLoggedIn && <LogoutButton onClick={handleLogout} />}
            </div>
          </nav>

          {/* Mobile/Tablet Menu Button - visible on screens smaller than xl */}
          <div className="xl:hidden flex items-center">
              <button ref={hamburgerButtonRef} onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2 touch-button mobile-focus" aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu-panel">
                  <AnimatedHamburgerIcon isOpen={isOpen} />
              </button>
          </div>
        </div>
      </header>
      
      <div 
        className={`xl:hidden fixed inset-0 z-30 transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] mobile-menu-overlay ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      
      <div 
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        className={`xl:hidden fixed top-0 right-0 w-4/5 max-w-sm lg:max-w-md h-full bg-pm-dark mobile-menu-panel transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-40 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isOpen}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          
          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Swipe right to close (if swipe is more horizontal than vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
              setIsOpen(false);
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            }
          };
          
          const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };
          
          document.addEventListener('touchmove', handleTouchMove, { passive: true });
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        <div className="flex justify-between items-center p-6 lg:p-8 border-b border-pm-gold/20 h-24 lg:h-28 flex-shrink-0">
             <span id="mobile-menu-title" className="font-playfair text-xl lg:text-2xl text-pm-gold">Menu</span>
             <button 
               onClick={() => setIsOpen(false)}
               className="text-pm-off-white/70 hover:text-pm-gold transition-colors p-2 -mr-2 touch-button mobile-focus"
               aria-label="Fermer le menu"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
        </div>
        <div className="flex-grow overflow-y-auto">
            <nav className="flex flex-col p-8 lg:p-10 gap-6 lg:gap-8">
              <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile={true} isOpen={isOpen}/>
              <div 
                className={`text-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: `${isOpen ? applyButtonDelay : 0}ms` }}
              >
                  <Link
                      to="/casting-formulaire"
                      onClick={() => setIsOpen(false)}
                      className="inline-block px-8 py-3 lg:px-10 lg:py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm lg:text-base rounded-full transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 touch-button mobile-focus"
                  >
                      Postuler
                  </Link>
              </div>
              {isLoggedIn && <LogoutButton onClick={handleLogout} isMobile={true} isOpen={isOpen} delay={logoutButtonDelay} />}
            </nav>
        </div>
        <div className="p-8 lg:p-10 border-t border-pm-gold/20 flex-shrink-0">
             <SocialLinksComponent 
                socialLinks={socialLinks} 
                className="justify-center"
                isMobile={true}
                isOpen={isOpen}
                delay={socialLinksDelay}
             />
        </div>
      </div>
    </>
  );
};

export default Header;
