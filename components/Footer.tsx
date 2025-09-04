
import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './icons/SocialIcons';
import { useData } from '../contexts/DataContext';

const Footer: React.FC = () => {
  const { data } = useData();

  if (!data) {
    return <footer className="bg-black border-t border-pm-gold/20"></footer>;
  }
  
  const { navLinks, socialLinks, siteConfig, contactInfo } = data;

  return (
    <footer className="bg-black border-t border-pm-gold/20 text-pm-off-white/70">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <Link to="/">
              <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-14 w-auto mb-4" />
            </Link>
            <p className="text-sm max-w-md">
              Fondée en 2021 à Libreville, notre agence se consacre à la formation, la valorisation et l'accompagnement des talents de la mode africaine.
            </p>
             <div className="flex space-x-4 mt-6">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37]" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37]" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37]" aria-label="YouTube">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-pm-off-white mb-4 uppercase tracking-wider">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              {navLinks.filter(link => link.inFooter).map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-pm-gold transition-colors">
                    {link.footerLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-pm-off-white mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 {contactInfo.email}</li>
              <li>📱 {contactInfo.phone}</li>
              <li>📍 {contactInfo.address}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-pm-dark py-4 border-t border-pm-gold/10">
        <div className="container mx-auto px-6 text-center text-xs text-pm-off-white/50">
          <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
           <Link to="/login" className="mt-2 inline-block hover:text-pm-gold transition-colors text-pm-off-white/40">
            Accès Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
