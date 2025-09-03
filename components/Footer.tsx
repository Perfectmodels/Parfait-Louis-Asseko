
import React from 'react';
import { Link } from 'react-router-dom';
import { socialLinks } from '../constants/data';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-pm-gold/20 text-pm-off-white/70">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-playfair text-pm-gold mb-4">Perfect Models Management</h3>
            <p className="text-sm">
              Fondée en 2021 à Libreville, notre agence se consacre à la formation, la valorisation et l'accompagnement des talents de la mode africaine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-pm-off-white mb-4 uppercase tracking-wider">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/agence" className="hover:text-pm-gold transition-colors">L'Agence</Link></li>
              <li><Link to="/mannequins" className="hover:text-pm-gold transition-colors">Nos Mannequins</Link></li>
              <li><Link to="/fashion-day" className="hover:text-pm-gold transition-colors">Perfect Fashion Day</Link></li>
              <li><Link to="/casting" className="hover:text-pm-gold transition-colors">Casting 2025</Link></li>
              <li><Link to="/activite" className="hover:text-pm-gold transition-colors">Nos Activités</Link></li>
              <li><Link to="/contact" className="hover:text-pm-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-lg font-bold text-pm-off-white mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 Contact@perfectmodels.ga</li>
              <li>📱 +241 074066461</li>
              <li>📍 Ancien Sobraga (Libreville)</li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors"><FacebookIcon /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors"><InstagramIcon /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors"><YoutubeIcon /></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-pm-gold/10 text-xs">
          <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
