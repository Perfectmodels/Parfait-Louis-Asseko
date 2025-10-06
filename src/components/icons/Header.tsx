import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from '../../../components/icons/AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../../../components/SocialIcons';
// FIX: The NavLink type should be imported from the centralized types.ts file, not from useDataStore.
import { NavLink as NavLinkType, SocialLinks } from '../../types';

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

    const breadcrumbNameMap: { [key: string]: string } = {
        '/agence': 'Agence',
        '/mannequins': 'Nos Mannequins',
        '/fashion-day': 'PFD',
        '/magazine': 'Magazine',
        '/contact': 'Contact',
        '/services': 'Services',
        '/casting': 'Casting',
        '/casting-formulaire': 'Postuler au Casting',
        '/fashion-day-application': 'Candidature PFD',
    };
    
    const pathnames = location.pathname.split('/').filter(Boolean);
    
    if (pathnames.length === 0 || location.pathname.startsWith('/login') || location.pathname.startsWith('/admin')) {
        return null;
    }

    let crumbs = [{ label: 'Accueil', path: '/' }];

    // Specific route structures
    if (location.pathname.startsWith('/mannequins/')) {
        crumbs.push({ label: 'Nos Mannequins', path: '/mannequins' });
        const model = data?.models.find(m => m.id === params.id);
        if (model) crumbs.push({ label: model.name, path: location.pathname });
    } else if (location.pathname.startsWith('/magazine/')) {
        crumbs.push({ label: 'Magazine', path: '/magazine' });
        const article = data?.articles.find(a => a.slug === params.slug);
        if (article) crumbs.push({ label: article.title, path: location.pathname });
    } else if (location.pathname.startsWith('/formations/forum/')) {
        crumbs.push({ label: 'Classroom', path: '/formations' });
        crumbs.push({ label: 'Forum', path: '/formations/forum' });
        const thread = data?.forumThreads.find(t => t.id === params.threadId);
        if (thread) crumbs.push({ label: thread.title, path: location.pathname });
    } else if (location.pathname.startsWith('/formations/') && params.moduleSlug && params.chapterSlug) {
        crumbs.push({ label: 'Classroom', path: '/formations' });
        const module = data?.courseData.find(m => m.slug === params.moduleSlug);
        if (module) {
            const chapter = module.chapters.find(c => c.slug === params.chapterSlug);
            const firstChapterSlug = module.chapters[0]?.slug;
            crumbs.push({ label: module.title, path: `/formations/${module.slug}/${firstChapterSlug}` });
            if (chapter) crumbs.push({ label: chapter.title, path: location.pathname });
        }
    } else if (location.pathname.startsWith('/classroom-debutant/') && params.moduleSlug && params.chapterSlug) {
        crumbs.push({ label: 'Classroom Débutant', path: '/classroom-debutant' });
        const module = data?.beginnerCourseData.find(m => m.slug === params.moduleSlug);
        if (module) {
            const chapter = module.chapters.find(c => c.slug === params.chapterSlug);
            const firstChapterSlug = module.chapters[0]?.slug;
            crumbs.push({ label: module.title, path: `/classroom-debutant/${module.slug}/${firstChapterSlug}` });
            if (chapter) crumbs.push({ label: chapter.title, path: location.pathname });
        }
    } else if (location.pathname === '/profil') {
        crumbs.push({ label: 'Classroom', path: '/formations' });
        crumbs.push({ label: 'Mon Profil', path: '/profil' });
    } else {
        // Generic handling for simple, non-nested routes
        let currentPath = '';
        pathnames.forEach(segment => {
            currentPath += `/${segment}`;
            if (breadcrumbNameMap[currentPath]) {
                crumbs.push({ label: breadcrumbNameMap[currentPath], path: currentPath });
            }
        });
    }

    if (crumbs.length <= 1) return null;

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
          
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks navLinks={processedNavLinks} />
            {(isLoggedIn || socialLinks) && (
              <div className="flex items-center gap-6 pl-6 border-l border-pm-gold/20">
                  <SocialLinksComponent socialLinks={socialLinks} />
                  {isLoggedIn && <LogoutButton onClick={handleLogout} />}
              </div>
            )}
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
        <div className="flex-grow overflow-y-auto">
            <nav className="flex flex-col p-8 gap-6">
              <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile={true} isOpen={isOpen}/>
              {isLoggedIn && <LogoutButton onClick={handleLogout} isMobile={true} isOpen={isOpen} delay={150 + processedNavLinks.length * 50} />}
            </nav>
        </div>
        <div className="p-8 border-t border-pm-gold/20 flex-shrink-0">
             <SocialLinksComponent 
                socialLinks={socialLinks} 
                className="justify-center"
                isMobile={true}
                isOpen={isOpen}
                delay={150 + (isLoggedIn ? processedNavLinks.length + 1 : processedNavLinks.length) * 50}
             />
        </div>
      </div>
    </>
  );
};

export default Header;
