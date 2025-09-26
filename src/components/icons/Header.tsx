import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../hooks/useAuth';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { NavLink as NavLinkType, SocialLinks } from '../../types';

const mobileTransition = "transition-all duration-300 ease-in-out";

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void; isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ to, label, onClick, isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileClasses = isMobile ? `${mobileTransition} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}` : '';

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        `relative py-2 text-pm-off-white uppercase text-sm tracking-widest group hover:text-pm-gold focus-style-self ${mobileClasses} ${isActive ? "text-pm-gold" : ""}`
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

const NavLinks: React.FC<{ onLinkClick?: () => void; navLinks: NavLinkType[]; isMobile?: boolean; isOpen?: boolean; }> = ({ onLinkClick, navLinks, isMobile = false, isOpen = false }) => (
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

const LoginButton: React.FC<{ className?: string, isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileClasses = isMobile ? `${mobileTransition} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}` : '';

  return (
    <Link
      to="/login"
      className={`flex items-center gap-1 py-1 px-2 text-pm-gold border border-pm-gold uppercase text-xs tracking-wide hover:bg-pm-gold hover:text-pm-dark focus-style-self rounded-full ${className} ${mobileClasses}`}
      aria-label="Connexion"
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4" />
      <span>Connexion</span>
    </Link>
  );
};

const LogoutButton: React.FC<{ onClick: () => void, className?: string, isMobile?: boolean; isOpen?: boolean; delay?: number; }> = ({ onClick, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  const mobileClasses = isMobile ? `${mobileTransition} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}` : '';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-2 text-pm-off-white uppercase text-sm tracking-widest hover:text-pm-gold focus-style-self ${className} ${mobileClasses}`}
      aria-label="Déconnexion"
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" />
      <span>Déconnexion</span>
    </button>
  );
};

const SocialLinksComponent: React.FC<{ socialLinks: SocialLinks | undefined; className?: string; isMobile?: boolean; isOpen?: boolean; delay?: number }> = ({ socialLinks, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
  if (!socialLinks || (!socialLinks.facebook && !socialLinks.instagram && !socialLinks.youtube)) return null;

  const mobileClasses = isMobile ? `${mobileTransition} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}` : '';

  return (
    <div className={`flex items-center gap-5 ${className} ${mobileClasses}`} style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}>
      {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold" aria-label="Facebook"><FacebookIcon className="w-6 h-6" /></a>}
      {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold" aria-label="Instagram"><InstagramIcon className="w-6 h-6" /></a>}
      {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold" aria-label="YouTube"><YoutubeIcon className="w-6 h-6" /></a>}
    </div>
  );
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const { data } = useData();

  const crumbs = useMemo(() => {
    const map: { [key: string]: string } = {
      '/agence': 'Agence', '/mannequins': 'Nos Mannequins', '/fashion-day': 'PFD',
      '/magazine': 'Magazine', '/contact': 'Contact', '/services': 'Services',
      '/casting': 'Casting', '/casting-formulaire': 'Postuler au Casting',
      '/fashion-day-application': 'Candidature PFD', '/profil': 'Mon Profil',
      '/formations': 'Classroom', '/formations/forum': 'Forum',
      '/classroom-debutant': 'Classroom Débutant'
    };

    const pathnames = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    let result: { label: string; path: string }[] = [];

    pathnames.forEach(segment => {
      currentPath += `/${segment}`;
      if (map[currentPath]) {
        result.push({ label: map[currentPath], path: currentPath });
      } else if (params.id && currentPath.startsWith('/mannequins/')) {
        const model = data?.models?.find((m: any) => m.id === params.id);
        if (model) result.push({ label: model.name, path: currentPath });
      } else if (params.slug && currentPath.startsWith('/magazine/')) {
        const article = data?.articles?.find((a: any) => a.slug === params.slug);
        if (article) result.push({ label: article.title, path: currentPath });
      } else if (params.threadId && currentPath.startsWith('/formations/forum/')) {
        const thread = data?.forumThreads?.find((t: any) => t.id === params.threadId);
        if (thread) result.push({ label: thread.title, path: currentPath });
      }
    });
    return result;
  }, [location.pathname, params, data]);

  useEffect(() => {
    const id = 'breadcrumb-schema-script';
    let el = document.getElementById(id) as HTMLScriptElement | null;

    if (crumbs.length > 1) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": crumbs.map((c, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": c.label,
          "item": `${window.location.origin}${c.path}`
        }))
      };
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.innerHTML = JSON.stringify(schema);
    } else if (el) {
      el.remove();
    }

    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, [crumbs]);

  if (crumbs.length <= 1 || location.pathname.startsWith('/login') || location.pathname.startsWith('/admin')) return null;

  return (
    <div className="bg-black border-b border-pm-gold/20 print-hide">
      <div className="container mx-auto px-6">
        <nav aria-label="Fil d'Ariane" className="py-3">
          <ol className="flex items-center space-x-1 text-sm text-pm-off-white/70 overflow-x-auto whitespace-nowrap">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={crumb.path} className="flex items-center">
                  {i > 0 && <ChevronRightIcon className="w-4 h-4 mx-1 text-pm-off-white/50" />}
                  {last ? (
                    <span className="font-bold text-pm-gold truncate" aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-pm-gold">{crumb.label}</Link>
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
  const { user, isAuthenticated, logout } = useAuth();
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { if (isOpen) setIsOpen(false); }, [location.pathname]);

  // Lock scroll + trap focus
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable || !focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') return setIsOpen(false);
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      setTimeout(() => first.focus(), 100);
      document.addEventListener('keydown', handler);
      return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = original; hamburgerButtonRef.current?.focus(); };
    } else { document.body.style.overflow = original; }
  }, [isOpen]);

  const handleLogout = () => { setIsOpen(false); logout(); };

  const siteConfig = data?.siteConfig;
  const navLinksFromData = data?.navLinks || [];
  const socialLinks = data?.socialLinks;

  const processedNavLinks = useMemo(() => {
    try {
      return navLinksFromData.map((link: any) => {
        if (link.label === 'Classroom') {
          if (user?.role === 'student') return { ...link, label: 'Mon Profil', path: '/profil' };
          if (user?.role === 'admin') return { ...link, label: 'Admin', path: '/admin' };
          return null;
        }
        if (link.path === '/admin' && user?.role !== 'admin') return null;
        return link;
      }).filter((l: any): l is NavLinkType => l !== null);
    } catch {
      return navLinksFromData;
    }
  }, [navLinksFromData, user]);

  const applyDelay = 150 + processedNavLinks.length * 50;
  const logoutDelay = 150 + (processedNavLinks.length + 1) * 50;
  const socialDelay = 150 + (isAuthenticated ? processedNavLinks.length + 2 : processedNavLinks.length + 1) * 50;

  return (
    <>
      <header className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 print-hide ${isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 h-16 lg:h-20 flex justify-between items-center">
          {siteConfig?.logo && (
            <Link to="/" className="flex-shrink-0" onClick={() => setIsOpen(false)}>
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-12 lg:h-14 w-auto hover:scale-105 transition" />
            </Link>
          )}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks navLinks={processedNavLinks} />
            <div className="flex items-center gap-4 pl-6 border-l border-pm-gold/20">
              <Link to="/casting-formulaire" className="px-5 py-2 bg-pm-gold text-pm-dark font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20 transition">Postuler</Link>
              {!isAuthenticated && <LoginButton />}
              <SocialLinksComponent socialLinks={socialLinks} />
              {isAuthenticated && <LogoutButton onClick={handleLogout} />}
            </div>
          </nav>
          <div className="lg:hidden flex items-center">
            <button ref={hamburgerButtonRef} onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2" aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu-panel">
              <AnimatedHamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>
      </header>
      <div className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-500 ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`} onClick={() => setIsOpen(false)} />
      <div id="mobile-menu-panel" ref={mobileMenuRef} className={`lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-pm-dark shadow-2xl shadow-pm-gold/10 transition-transform duration-500 z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
        <div className="flex justify-between items-center p-6 border-b border-pm-gold/20 h-24"><span id="mobile-menu-title" className="font-playfair text-xl text-pm-gold">Menu</span></div>
        <div className="flex-grow overflow-y-auto">
          <nav className="flex flex-col p-8 gap-6">
            <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} isMobile isOpen={isOpen} />
            <div className={`text-center ${mobileTransition} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: `${isOpen ? applyDelay : 0}ms` }}>
              <Link to="/casting-formulaire" onClick={() => setIsOpen(false)} className="inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white transition">Postuler</Link>
            </div>
            {!isAuthenticated && <LoginButton isMobile isOpen={isOpen} delay={applyDelay + 50} />}
            {isAuthenticated && <LogoutButton onClick={handleLogout} isMobile isOpen={isOpen} delay={logoutDelay} />}
          </nav>
        </div>
        <div className="p-8 border-t border-pm-gold/20"><SocialLinksComponent socialLinks={socialLinks} className="justify-center" isMobile isOpen={isOpen} delay={socialDelay} /></div>
      </div>
      <Breadcrumb />
    </>
  );
};

export default Header;
