
import React from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    return (
        <footer className="bg-black text-pm-off-white/70 border-t-2 border-pm-gold">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and About */}
                    <div className="md:col-span-1">
                        {siteConfig?.logo && (
                            <Link to="/">
                                <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-16 w-auto mb-4" />
                            </Link>
                        )}
                        <p className="text-sm">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-pm-gold transition-colors text-sm">
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                             <li>
                                <Link to="/login" className="hover:text-pm-gold transition-colors text-sm">
                                    Accès Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Contacts</h3>
                        {contactInfo && (
                            <ul className="space-y-2 text-sm">
                                <li>{contactInfo.address}</li>
                                <li>{contactInfo.phone}</li>
                                <li><a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors">{contactInfo.email}</a></li>
                            </ul>
                        )}
                    </div>
                    
                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Suivez-nous</h3>
                         {socialLinks && (
                            <div className="flex space-x-4">
                                {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="Facebook"><FacebookIcon className="w-6 h-6 md:w-7 md:h-7" /></a>}
                                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="Instagram"><InstagramIcon className="w-6 h-6 md:w-7 md:h-7" /></a>}
                                {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="YouTube"><YoutubeIcon className="w-6 h-6 md:w-7 md:h-7" /></a>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-pm-off-white/10 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
                     <div className="mt-2 space-x-4">
                        <Link to="/terms-of-use" className="hover:text-pm-gold">Conditions d'Utilisation</Link>
                        <span>|</span>
                        <Link to="/privacy-policy" className="hover:text-pm-gold">Politique de Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;