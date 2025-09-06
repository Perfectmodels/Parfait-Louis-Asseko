import React, { useState, useEffect, useMemo } from 'react';
// FIX: Updated react-router-dom imports for v6 compatibility. Replaced `useHistory` with `useNavigate`.
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './icons/AnimatedHamburgerIcon';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './icons/SocialIcons';

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
        `relative py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 group hover:text-pm-gold ${mobileAnimationClasses} ` +
        (isActive ? "text-pm-gold" : "")
      }
      style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
    >
      {({ isActive }) => (
        <>
          {label}
          <span 
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold transform transition-transform duration-300 ease-out ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} 
          />
        </>
      )}
    </NavLink>
  );
};


const NavLinks: React.FC<{ onLinkClick?: () => void; navLinks: any[]; isMobile?: boolean; isOpen?: boolean; }> = ({ onLinkClick, navLinks, isMobile = false, isOpen = false }) => {
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
            className={`flex items-center gap-2 py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 hover:text-pm-gold ${className} ${mobileAnimationClasses}`}
            aria-label="Déconnexion"
            style={isMobile ? { transitionDelay: `${isOpen ? delay : 0}ms` } : {}}
        >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Déconnexion</span>
        </button>
    );
};

const SocialLinksComponent: React.FC<{ socialLinks: any; className?: string; isMobile?: boolean; isOpen?: boolean; delay?: number }> = ({ socialLinks, className = "", isMobile = false, isOpen = false, delay = 0 }) => {
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


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useData();
  const location = useLocation();
  // FIX: Use useNavigate for react-router-dom v6 compatibility.
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('classroom_role');
    const access = sessionStorage.getItem('classroom_access') === 'granted';
    setUserRole(role);
    setIsLoggedIn(access);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);
  
  // Close mobile menu on navigation change
  useEffect(() => {
    if (isOpen) {
        setIsOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setIsOpen(false); // Ensure menu closes on logout
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    // FIX: Use navigate for navigation in react-router-dom v6.
    navigate('/login');
  };
  
  const siteConfig = data?.siteConfig;
  const navLinksFromData = data?.navLinks || [];
  const socialLinks = data?.socialLinks;

  const processedNavLinks = useMemo(() => {
    return navLinksFromData.map(link => {
        if (link.label === 'Classroom') {
            if (userRole === 'student') {
                return { ...link, label: 'Mon Profil', path: '/profil' };
            }
            if (userRole === 'admin') {
                return { ...link, path: '/admin/classroom' };
            }
            return null;
        }
        return link;
    }).filter((link): link is { path: string; label: string; inFooter: boolean; footerLabel?: string; } => link !== null);
  }, [navLinksFromData, userRole]);

  return (
    <>
      <header 
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
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
              <button onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50 p-2 -mr-2" aria-label="Ouvrir le menu">
                  <AnimatedHamburgerIcon isOpen={isOpen} />
              </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      
      {/* Mobile Menu Panel */}
      <div 
        className={`lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-pm-dark shadow-2xl shadow-pm-gold/10 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-40 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
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