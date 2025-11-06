import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
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
// FIX: Removed "Classroom Débutant" from breadcrumb map as the feature is deprecated.
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
  const [mobileSearch, setMobileSearch] = useState('');

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Focus management and body scroll lock for mobile menu
  useEffect(() => {
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const focusableElementsQuery = 'a[href], button:not([disabled]), input';
      const menu = mobileMenuRef.current;
      if (!menu) return;
      
      // FIX: Proactively fix potential 'Untyped function calls may not accept type arguments' error by using type assertion instead of generic.
      const focusableElements = menu.querySelectorAll(focusableElementsQuery) as NodeListOf<HTMLElement>;
      if (focusableElements.length === 0) return;

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

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/mannequins?q=${encodeURIComponent(mobileSearch.trim())}`);
      setIsOpen(false);
      setMobileSearch('');
    }
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
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-12 lg:h-14 w-auto transition-all duration-300 bg-black rounded-full border-2 border-pm-gold p-1" />
            </Link>
          )}
          
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks navLinks={processedNavLinks} />
            
            <div className="flex items-center gap-6 pl-6 border-l border-pm-gold/20">
                <Link to="/casting-formulaire" className="px-5 py-2 text-pm-dark bg-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                    Postuler
                </Link>
                <SocialLinksComponent socialLinks={socialLinks} />
                {isLoggedIn && <LogoutButton onClick={handleLogout} />}
            </div>
          </nav>

          <div className="lg:hidden flex items-center">
              <button ref={hamburgerButtonRef} onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2" aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu-panel">
                  <AnimatedHamburgerIcon isOpen={isOpen} />
              </button>
          </div>
        </div>
      </header>
      
      <div 
        className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      
      <div 
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-pm-dark shadow-2xl shadow-pm-gold/10 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-40 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isOpen}
      >
        <div className="flex justify-between items-center p-6 border-b border-pm-gold/20 h-24 flex-shrink-0">
             <span id="mobile-menu-title" className="font-playfair text-xl text-pm-gold">Menu</span>
        </div>
        <div className="flex-grow overflow-y-auto p-8">
            <form onSubmit={handleMobileSearch} className="mb-8">
              <div className="relative">
                  <input
                      type="search"
                      value={mobileSearch}
                      onChange={(e) => setMobileSearch(e.target.value)}
                      placeholder="Rechercher un mannequin..."
                      className="w-full bg-black border-2 border-pm-gold/50 rounded-full py-2 pl-10 pr-4 text-pm-off-white focus:outline-none focus:border-pm-gold transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="w-5 h-5 text-pm-gold/60" />
                  </div>
              </div>
            </form>

            <nav className="flex flex-col gap-6">
              <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile={true} isOpen={isOpen}/>
              <div 
                className={`text-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: `${isOpen ? applyButtonDelay : 0}ms` }}
              >
                  <Link
                      to="/casting-formulaire"
                      onClick={() => setIsOpen(false)}
                      className="inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white"
                  >
                      Postuler
                  </Link>
              </div>
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
      </div>
    </>
  );
};

export default Header;