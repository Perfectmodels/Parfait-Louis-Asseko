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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-pm-dark/95 backdrop-blur-sm shadow-lg shadow-pm-gold/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/">
          <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-14 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-pm-off-white uppercase text-sm tracking-widest">
          <NavLinks />
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-pm-gold focus:outline-none">
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full bg-pm-dark z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-pm-off-white text-xl uppercase tracking-widest">
          <NavLinks onLinkClick={() => setIsOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
