import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    // Select a few key services to highlight in the footer
    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins" },
        { label: "Candidature Casting", link: "/casting-formulaire" },
        { label: "Organisation Défilés", link: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode" },
        { label: "Formation Mannequins", link: "/contact?service=Formation+Mannequins" },
    ];

    return (
        <footer className="bg-black text-pm-off-white/70 border-t border-pm-gold/20">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-4">
                        {siteConfig?.logo && (
                            <Link to="/">
                                <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-16 w-auto" />
                            </Link>
                        )}
                        <p className="text-sm">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                         {socialLinks && (
                            <div className="flex space-x-4 pt-2">
                                {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="Facebook"><FacebookIcon className="w-6 h-6" /></a>}
                                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="Instagram"><InstagramIcon className="w-6 h-6" /></a>}
                                {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-colors" aria-label="YouTube"><YoutubeIcon className="w-6 h-6" /></a>}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Explorer */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Explorer</h3>
                        <ul className="space-y-3">
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
                    
                    {/* Column 3: Key Services */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Services Clés</h3>
                        <ul className="space-y-3">
                           {keyServices.map(service => (
                               <li key={service.label}>
                                   <Link to={service.link} className="hover:text-pm-gold transition-colors text-sm">
                                       {service.label}
                                   </Link>
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Contact</h3>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <PhoneIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0" />
                                    <span>{contactInfo.phone}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <EnvelopeIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors break-all">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-pm-off-white/10 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
                     <div className="mt-2 space-x-4">
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Conditions d'Utilisation</Link>
                        <span>|</span>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Politique de Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;