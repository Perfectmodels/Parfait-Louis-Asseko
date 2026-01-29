import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const { data } = useData();

  const crumbs = useMemo(() => {
    const breadcrumbNameMap: { [key: string]: string } = {
      '/agence': 'Agence', '/mannequins': 'Nos Mannequins', '/fashion-day': 'PFD',
      '/magazine': 'Magazine', '/contact': 'Contact', '/services': 'Services',
      '/casting': 'Casting', '/casting-formulaire': 'Postuler',
      '/fashion-day-application': 'Candidature PFD', '/profil': 'Mon Profil',
      '/formations': 'Classroom', '/formations/forum': 'Forum',
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
      }
    });
    return currentCrumbs;
  }, [location.pathname, params, data]);

  if (crumbs.length <= 1 || location.pathname.startsWith('/login') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="bg-black/20 border-b border-white/5 py-4 mb-8 print-hide">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">
            <li><Link to="/" className="hover:text-pm-gold transition-colors text-xs font-bold">Home</Link></li>
            {crumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center gap-3">
                <span className="opacity-30">/</span>
                {index === crumbs.length - 1 ? (
                  <span className="text-pm-gold text-xs font-bold">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-pm-gold transition-colors text-xs font-bold">{crumb.label}</Link>
                )}
              </li>
            ))}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(sessionStorage.getItem('classroom_access') === 'granted');
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = data?.navLinks || [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${isScrolled ? 'bg-pm-dark/60 backdrop-blur-2xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-10'
        }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 flex justify-between items-center">
        <Link to="/" className="z-50 group flex items-center gap-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow effect background */}
            <div className="absolute inset-0 bg-pm-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Logo with stylish border */}
            <div className="relative p-2 rounded-xl border-2 border-pm-gold/30 bg-gradient-to-br from-pm-dark via-pm-gray to-pm-dark group-hover:border-pm-gold transition-all duration-500 shadow-lg shadow-pm-gold/10">
              <img
                src={data?.siteConfig.logo}
                alt="PMM"
                className="h-12 w-12 object-contain filter drop-shadow-lg"
              />
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pm-gold/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </motion.div>
          <div className="hidden sm:block">
            <span className="block text-[11px] font-black tracking-[0.5em] text-pm-gold uppercase">Perfect Models</span>
            <span className="block text-[7px] font-bold tracking-[0.3em] text-white/40 uppercase mt-1">Management</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 hover:text-pm-gold ${isActive ? 'text-pm-gold' : 'text-white/40'
                }`
              }
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-pm-gold" />
              )}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.4em] font-black text-pm-gold flex items-center gap-2 hover:text-white transition-colors">
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 hover:text-pm-gold">Client Space</Link>
          )}
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link to="/casting-formulaire" className="btn-premium !py-3 !px-8 text-[9px]">
            Apply Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden z-50 text-pm-gold focus:outline-none">
          <AnimatedHamburgerIcon isOpen={isOpen} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-pm-dark z-40 flex flex-col items-center justify-center p-12"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-playfair font-black text-pm-off-white hover:text-pm-gold transition-colors italic"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-col items-center gap-6"
              >
                <Link to="/casting-formulaire" onClick={() => setIsOpen(false)} className="btn-premium !px-16 !py-6 text-sm">Join the Elite</Link>
                {isLoggedIn && <button onClick={handleLogout} className="text-xs font-black text-pm-gold uppercase tracking-[0.4em]">Sign Out</button>}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;