import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { useData } from '../contexts/DataContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void }> = ({ to, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/'}
      className={({ isActive }) =>
        "relative py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 group hover:text-pm-gold " +
        (isActive ? "text-pm-gold" : "")
      }
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


const NavLinks: React.FC<{ onLinkClick?: () => void; navLinks: any[] }> = ({ onLinkClick, navLinks }) => {
  return (
    <>
      {navLinks.map(link => (
        <NavLinkItem 
          key={link.path}
          to={link.path} 
          label={link.label}
          onClick={onLinkClick}
        />
      ))}
    </>
  );
};

const LogoutButton: React.FC<{ onClick: () => void, className?: string }> = ({ onClick, className = "" }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 hover:text-pm-gold ${className}`}
        aria-label="Déconnexion"
    >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Déconnexion</span>
    </button>
);


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useData();
  const location = useLocation();
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

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
    setIsOpen(false);
  };
  
  const siteConfig = data?.siteConfig;
  const navLinksFromData = data?.navLinks || [];

  const processedNavLinks = useMemo(() => {
    return navLinksFromData.map(link => {
        if (link.label === 'Classroom') {
            if (userRole === 'model') {
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
    <header 
      className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {siteConfig?.logo && (
          <Link to="/" className="flex-shrink-0" onClick={() => setIsOpen(false)}>
            <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-14 w-auto" />
          </Link>
        )}
        
        <nav className="hidden lg:flex items-center gap-8">
          <NavLinks navLinks={processedNavLinks} />
          {isLoggedIn && <LogoutButton onClick={handleLogout} />}
        </nav>

        <div className="lg:hidden flex items-center">
            {isLoggedIn && <LogoutButton onClick={handleLogout} className="mr-4" />}
            <button onClick={() => setIsOpen(!isOpen)} className="text-pm-off-white z-50">
                {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </div>
      </div>
      
      <div 
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black/95 backdrop-blur-lg transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="h-full flex flex-col items-center justify-center gap-8 pt-28">
          <NavLinks navLinks={processedNavLinks} onLinkClick={() => setIsOpen(false)} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
