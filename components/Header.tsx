import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { useData } from '../contexts/DataContext';

const NavLinkItem: React.FC<{ to: string; label: string; onClick?: () => void }> = ({ to, label, onClick }) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) =>
        `relative py-2 text-pm-off-white uppercase text-sm tracking-widest transition-colors duration-300 group
         ${isActive ? 'text-pm-gold' : 'hover:text-pm-gold'}`
      }
    >
      {label}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out
        ${({ isActive }: {isActive: boolean}) => isActive ? 'scale-x-100' : ''}`}
      />
    </NavLink>
  );
};

const NavLinks: React.FC<{ onLinkClick?: () => void; isAdmin: boolean; navLinks: any[] }> = ({ onLinkClick, isAdmin, navLinks }) => {
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
      {isAdmin && (
        <NavLink 
          to="/admin" 
          onClick={onLinkClick} 
          className={({ isActive }) => `px-4 py-2 text-sm uppercase tracking-widest rounded-md transition-colors duration-300 ${isActive ? 'bg-pm-gold text-pm-dark' : 'bg-pm-gold/10 text-pm-gold hover:bg-pm-gold/20'}`}
        >
          Admin
        </NavLink>
      )}
    </>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { data } = useData();
  const navLinks = data?.navLinks || [];
  const siteConfig = data?.siteConfig;

  useEffect(() => {
    const userRole = sessionStorage.getItem('classroom_role');
    setIsAdmin(userRole === 'admin');
  }, [location]);

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
            <NavLinks isAdmin={isAdmin} navLinks={navLinks} />
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
              <NavLinks onLinkClick={() => setIsOpen(false)} isAdmin={isAdmin} navLinks={navLinks} />
            </nav>
            <div className="mt-auto">
               <Link to="/casting" onClick={() => setIsOpen(false)} className="block w-full text-center px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full shadow-lg shadow-pm-gold/30 transition-all duration-300 hover:bg-white hover:scale-105">
                  Rejoindre l'agence
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
