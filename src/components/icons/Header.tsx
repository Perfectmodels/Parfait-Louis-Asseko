import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import CloseIcon from './CloseIcon';
import GlobalSearch from '../GlobalSearch';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
// FIX: Changed import for NavLinkType to use centralized types.ts file to resolve circular dependency.
import { NavLink as NavLinkType, SocialLinks } from '../../types';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
    : '';

  const mobileLinkClasses = isMobile
    ? "text-2xl font-playfair lowercase first-letter:uppercase py-3 border-b border-white/5 w-full block"
    : "text-sm text-pm-off-white uppercase tracking-widest";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative group transition-colors duration-300 hover:text-pm-gold focus-style-self focus-visible:text-pm-gold ${mobileLinkClasses} ${mobileAnimationClasses} ` +
        (isActive ? "text-pm-gold" : "text-pm-off-white")
      }
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{label}</span>
          {!isMobile && (
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
                }`}
            />
          )}
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
          delay={isMobile ? 100 + index * 50 : 0}
        />
      ))}
    </>
  );
};

// ... (LogoutButton remains similar but we can tweak it if needed, assuming it's fine for now or I'll include it to be safe)

const LogoutButton: React.FC<{ onClick: () => void, className?: string, isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ onClick, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
    : '';

  const mobileButtonClasses = isMobile
    ? "text-xl font-playfair lowercase first-letter:uppercase py-3 w-full border-b border-white/5 justify-start text-red-400 hover:text-red-300"
    : "text-sm uppercase tracking-widest text-pm-off-white hover:text-pm-gold";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 transition-colors duration-300 focus-style-self focus-visible:text-pm-gold ${className} ${mobileButtonClasses} ${mobileAnimationClasses}`}
      aria-label="Déconnexion"
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      <ArrowRightOnRectangleIcon className={isMobile ? "w-6 h-6" : "w-5 h-5"} />
      <span>Déconnexion</span>
    </button>
  );
};

// ... (SocialLinksComponent remains similar)
const SocialLinksComponent: React.FC<{ socialLinks: SocialLinks | undefined; className?: string; isMobile?: boolean; isOpen?: boolean; delay?: number }> = ({ socialLinks, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileAnimationClasses = isMobile
    ? `transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
    : '';

  if (!socialLinks || (!socialLinks.facebook && !socialLinks.instagram && !socialLinks.youtube)) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-8 ${className} ${mobileAnimationClasses}`}
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="Facebook"><FacebookIcon className="w-6 h-6" /></a>}
      {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="Instagram"><InstagramIcon className="w-6 h-6" /></a>}
      {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="YouTube"><YoutubeIcon className="w-6 h-6" /></a>}
    </div>
  );
};

// ... (Breadcrumb remains same)
// I will skip replacing Breadcrumb to avoid huge chunk, I will target Header specifically with replace_file_content if I can, but I need to replace Header component.
// I'll grab the file content again and provide the replacement for Header component primarily.

// Actually I need to be careful with replace_file_content rules. "Single contiguous block".
// The changes are scattered in NavLinkItem, LogoutButton, and Header.
// So I should use multi_replace_file_content.


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
  const [showSearch, setShowSearch] = useState(false);
  const { data } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  // Focus management and body scroll lock for mobile menu
  useEffect(() => {
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const focusableElementsQuery = 'a[href], button:not([disabled]), input';
      const menu = mobileMenuRef.current;
      if (!menu) return;

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

  const applyButtonDelay = 100 + processedNavLinks.length * 50;
  const logoutButtonDelay = 100 + (processedNavLinks.length + 1) * 50;
  const socialLinksDelay = 100 + (isLoggedIn ? processedNavLinks.length + 2 : processedNavLinks.length + 1) * 50;


  return (
    <>
      <header
        className={`fixed top-0 lg:top-8 left-0 right-0 z-40 transition-all duration-300 print-hide ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-pm-gold/10' : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 h-20 lg:h-20 flex justify-between items-center transition-all duration-300">
          {siteConfig?.logo && (
            <Link to="/" className="flex-shrink-0 relative z-50" onClick={() => setIsOpen(false)}>
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-12 lg:h-14 w-auto transition-all duration-300 bg-black rounded-full border-2 border-pm-gold p-1" />
            </Link>
          )}

          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks navLinks={processedNavLinks} />

            <div className="flex items-center gap-6 pl-6 border-l border-pm-gold/20">
              <div ref={searchRef}>
                 <button onClick={() => setShowSearch(!showSearch)} className="text-white hover:text-pm-gold transition-colors">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                 </button>
                 {showSearch && (
                    <GlobalSearch onClose={() => setShowSearch(false)} className="absolute top-20 right-6 w-80" />
                 )}
              </div>

              {!isLoggedIn ? (
                <Link to="/login" className="px-5 py-2 text-pm-gold border border-pm-gold font-bold uppercase text-xs tracking-widest rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-black hover:shadow-lg hover:shadow-pm-gold/20">
                  Admin Panel
                </Link>
              ) : (
                <LogoutButton onClick={handleLogout} />
              )}
            </div>
          </nav>

          <div className="lg:hidden flex items-center">
            <button ref={hamburgerButtonRef} onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2 relative" aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu-panel">
              {/* Hide hamburger when open because we have a close button inside, or trigger animation. 
                   Since we have a full drawer on right covering part of screen, keeping the hamburger might be confusing if it is covered. 
                   But if header is transparent, we might see it? 
                   Wait, the drawer has z-40. Header has z-40. 
                   Actually, let's keep it simple. The drawer covers the right side. 
                   So we rely on the close button inside. */}
              <AnimatedHamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <div
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 w-[85%] max-w-md h-full bg-black/95 backdrop-blur-2xl border-l border-pm-gold/10 shadow-2xl shadow-black/50 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-50 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isOpen}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10 h-24 flex-shrink-0">
          <span id="mobile-menu-title" className="font-playfair text-3xl text-pm-gold italic">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 scrollbar-hide">
          {/* Search Bar */}
          <form onSubmit={handleMobileSearch} className="mb-8">
            <div className="relative group">
              <input
                type="search"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-white/5 border border-white/10 rounded-none border-b-2 border-b-pm-gold/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-b-pm-gold focus:bg-white/10 transition-all text-lg font-playfair"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-pm-gold/60 group-focus-within:text-pm-gold transition-colors" />
              </div>
            </div>
          </form>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-2">
            <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile={true} isOpen={isOpen} />

            {/* Additional Pages Section */}
            <div className={`mt-6 pt-6 border-t border-white/10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${isOpen ? 100 + processedNavLinks.length * 50 : 0}ms` }}>
              <p className="text-xs uppercase tracking-widest text-pm-gold/60 mb-4 font-bold">Plus</p>
              <div className="flex flex-col gap-2">
                <NavLinkItem
                  to="/services"
                  label="Nos Services"
                  onClick={() => setIsOpen(false)}
                  isMobile={true}
                  isOpen={isOpen}
                  delay={100 + (processedNavLinks.length + 1) * 50}
                />
                <NavLinkItem
                  to="/casting"
                  label="Casting"
                  onClick={() => setIsOpen(false)}
                  isMobile={true}
                  isOpen={isOpen}
                  delay={100 + (processedNavLinks.length + 2) * 50}
                />
                <NavLinkItem
                  to="/fashion-day/reservation"
                  label="Réserver PFD"
                  onClick={() => setIsOpen(false)}
                  isMobile={true}
                  isOpen={isOpen}
                  delay={100 + (processedNavLinks.length + 3) * 50}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`mt-8 space-y-3 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${isOpen ? 100 + (processedNavLinks.length + 4) * 50 : 0}ms` }}>
              <Link
                to="/casting-formulaire"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-pm-gold text-black font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-white shadow-lg shadow-pm-gold/20 text-center"
              >
                Devenir Mannequin
              </Link>

              <Link
                to="/fashion-day/reservation"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-transparent border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-pm-gold hover:text-black text-center"
              >
                Réserver PFD
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-white/5 border border-white/20 text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-white/10 text-center"
              >
                Nous Contacter
              </Link>
            </div>

            {/* Admin/Logout */}
            {!isLoggedIn ? (
              <div className={`mt-6 pt-6 border-t border-white/10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${isOpen ? 100 + (processedNavLinks.length + 7) * 50 : 0}ms` }}>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center text-pm-gold/70 border border-pm-gold/30 font-medium uppercase tracking-widest text-xs transition-all duration-300 hover:bg-pm-gold/10 hover:text-pm-gold"
                >
                  Admin Panel
                </Link>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-white/10">
                <LogoutButton onClick={handleLogout} isMobile={true} isOpen={isOpen} delay={100 + (processedNavLinks.length + 7) * 50} />
              </div>
            )}
          </nav>
        </div>
        <div className="p-8 border-t border-white/10 flex-shrink-0 bg-white/5">
          <SocialLinksComponent
            socialLinks={socialLinks}
            className="justify-center gap-10"
            isMobile={true}
            isOpen={isOpen}
            delay={100 + (processedNavLinks.length + 8) * 50}
          />
        </div>
      </div>
    </>
  );
};

export default Header;