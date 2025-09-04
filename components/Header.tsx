
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { useData } from '../contexts/DataContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void }> = ({ to, label, onClick }) => {
  return (
    <NavLink
      end={to === '/'}
      to={to}
      onClick={onClick}
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
        <span className="hidden md:inline">Déconnexion</span>
    </button>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useData();
  const siteConfig = data?.siteConfig;
  
  const [currentNavLinks, setCurrentNavLinks] = useState(data?.navLinks || []);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem('classroom_role');
    const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';
    setUserRole(hasAccess ? role : null);
  }, [location.pathname]);

  useEffect(() => {
    if (!data?.navLinks) return;

    let newNavLinks = [...data.navLinks];

    if (userRole === 'model') {
        const formationsIndex = newNavLinks.findIndex(link => link.path === '/formations');
        if (formationsIndex !== -1) {
            newNavLinks[formationsIndex] = { ...newNavLinks[formationsIndex], label: 'Mon Profil', path: '/profil' };
        }
    }
    setCurrentNavLinks(newNavLinks);
  }, [userRole, data?.navLinks]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <header className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-pm-dark/95 backdrop-blur-md shadow-lg shadow-pm-gold/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <Link to="/">
            {siteConfig?.logo && <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-14 w-auto" />}
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks navLinks={currentNavLinks} />
            {userRole && <LogoutButton onClick={handleLogout} />}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-pm-gold focus:outline-none" aria-label="Ouvrir le menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
        
        <div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-pm-dark transform shadow-2xl shadow-pm-gold/20 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-end items-center mb-10">
              <button onClick={() => setIsOpen(false)} className="text-pm-gold focus:outline-none" aria-label="Fermer le menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-pm-off-white text-lg uppercase tracking-wider flex-grow">
              <NavLinks onLinkClick={() => setIsOpen(false)} navLinks={currentNavLinks} />
            </nav>
            <div className="mt-auto">
              {userRole ? (
                 <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
                   <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                 </button>
              ) : (
                <Link to="/casting" onClick={() => setIsOpen(false)} className="block w-full text-center px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full shadow-lg shadow-pm-gold/30 transition-all duration-300 hover:bg-white hover:scale-105">
                   Rejoindre l'agence
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
