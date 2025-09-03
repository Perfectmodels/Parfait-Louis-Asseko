import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { siteConfig, navLinks } from '../constants/data';

const NavLinks: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  const activeLinkStyle = {
    color: '#D4AF37',
    textShadow: '0 0 5px #D4AF37',
  };

  return (
    <>
      {navLinks.map(link => (
        <NavLink 
          key={link.path}
          to={link.path} 
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} 
          onClick={onLinkClick} 
          className="hover:text-pm-gold transition-colors duration-300"
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-pm-dark/95 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <Link to="/">
            <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-14 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-pm-off-white uppercase text-sm tracking-widest">
            <NavLinks />
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-pm-gold focus:outline-none" aria-label="Ouvrir le menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* --- New Mobile Menu --- */}
      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
        
        {/* Mobile Menu Drawer */}
        <div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-pm-dark transform shadow-2xl shadow-pm-gold/20 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-end items-center mb-10">
              <button onClick={() => setIsOpen(false)} className="text-pm-gold focus:outline-none" aria-label="Fermer le menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 text-pm-off-white text-lg uppercase tracking-wider flex-grow">
              <NavLinks onLinkClick={() => setIsOpen(false)} />
            </nav>
            <div className="mt-auto">
               <Link to="/casting" onClick={() => setIsOpen(false)} className="block w-full text-center px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white">
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
