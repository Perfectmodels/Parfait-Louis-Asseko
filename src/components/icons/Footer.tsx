
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { version } from '../../../package.json';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks?.filter(link => link.inFooter) || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;

    return (
        <footer className="bg-black/80 backdrop-blur-lg border-t border-pm-gold/10 text-pm-off-white/60 print-hide">
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Brand & Motto */}
                    <div className="md:col-span-2 lg:col-span-1">
                        {siteConfig?.logo && (
                            <Link to="/">
                                <img src={siteConfig.logo} alt="Perfect Models Logo" className="h-12 w-auto mb-4" />
                            </Link>
                        )}
                        <p className="max-w-xs text-sm leading-relaxed">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h3 className="text-md font-bold text-pm-gold uppercase tracking-widest mb-4">Explorer</h3>
                        <ul className="space-y-3">
                            {navLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-white transition-colors text-sm">
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-md font-bold text-pm-gold uppercase tracking-widest mb-4">Contact</h3>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <PhoneIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">{contactInfo.phone}</a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <EnvelopeIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors break-all">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                    
                    {/* Column 4: Social & Legal */}
                    <div>
                         <h3 className="text-md font-bold text-pm-gold uppercase tracking-widest mb-4">Suivez-nous</h3>
                         {socialLinks && (
                            <div className="flex space-x-4 mb-8">
                                {socialLinks.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-pm-off-white/70 hover:text-white transition-colors">
                                        <FacebookIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pm-off-white/70 hover:text-white transition-colors">
                                        <InstagramIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-pm-off-white/70 hover:text-white transition-colors">
                                        <YoutubeIcon className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        )}

                        <Link to="/casting" className="inline-block px-6 py-3 bg-pm-gold text-pm-dark font-bold text-sm rounded-full hover:bg-white transition-all shadow-lg hover:shadow-pm-gold/20">
                            Devenir Mannequin
                        </Link>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-pm-gold/10 text-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
                        <div className="flex items-center gap-6">
                            <Link to="/terms-of-use" className="hover:text-white transition-colors">Conditions d'Utilisation</Link>
                            <Link to="/privacy-policy" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
                        </div>
                        <p className="text-xs text-pm-off-white/40">v{version}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
