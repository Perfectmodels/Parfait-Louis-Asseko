import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, UserIcon, SparklesIcon, CalendarDaysIcon, BookOpenIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

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
        <footer className="bg-gradient-to-b from-pm-dark to-black text-pm-off-white/70 border-t border-pm-gold/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}></div>
            </div>
            
            <div className="container mx-auto px-6 py-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-4">
                        {siteConfig?.logo && (
                            <Link to="/" className="block group">
                                <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
                            </Link>
                        )}
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-pm-gold">Perfect Models Management</h3>
                            <p className="text-sm leading-relaxed">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                        </div>
                        
                        {/* Bouton de connexion visible */}
                        <div className="pt-2">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/25 group"
                            >
                                <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Accès Panel</span>
                            </Link>
                        </div>

                        {/* Social Links */}
                        {socialLinks && (
                            <div className="flex space-x-4 pt-2">
                                {socialLinks.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                                       className="p-2 bg-pm-gold/10 rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-all duration-300 group" 
                                       aria-label="Facebook">
                                        <FacebookIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                                       className="p-2 bg-pm-gold/10 rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-all duration-300 group" 
                                       aria-label="Instagram">
                                        <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" 
                                       className="p-2 bg-pm-gold/10 rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-all duration-300 group" 
                                       aria-label="YouTube">
                                        <YoutubeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Explorer */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            Explorer
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="flex items-center gap-3 hover:text-pm-gold transition-colors text-sm group">
                                        <div className="w-1 h-1 bg-pm-gold/50 rounded-full group-hover:bg-pm-gold transition-colors"></div>
                                        <span>{link.footerLabel || link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 3: Key Services */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BriefcaseIcon className="w-5 h-5" />
                            Services Clés
                        </h3>
                        <ul className="space-y-3">
                           {keyServices.map((service, index) => {
                               const icons = [UserIcon, CalendarDaysIcon, SparklesIcon, BookOpenIcon];
                               const Icon = icons[index] || BriefcaseIcon;
                               return (
                                   <li key={service.label}>
                                       <Link to={service.link} className="flex items-center gap-3 hover:text-pm-gold transition-colors text-sm group">
                                           <Icon className="w-4 h-4 text-pm-gold/70 group-hover:text-pm-gold transition-colors" />
                                           <span>{service.label}</span>
                                       </Link>
                                   </li>
                               );
                           })}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <EnvelopeIcon className="w-5 h-5" />
                            Contact
                        </h3>
                        {contactInfo && (
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold transition-colors">
                                        <MapPinIcon className="w-4 h-4 text-pm-gold group-hover:text-pm-dark transition-colors" />
                                    </div>
                                    <span className="pt-1">{contactInfo.address}</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold transition-colors">
                                        <PhoneIcon className="w-4 h-4 text-pm-gold group-hover:text-pm-dark transition-colors" />
                                    </div>
                                    <a href={`tel:${contactInfo.phone}`} className="pt-1 hover:text-pm-gold transition-colors">{contactInfo.phone}</a>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold transition-colors">
                                        <EnvelopeIcon className="w-4 h-4 text-pm-gold group-hover:text-pm-dark transition-colors" />
                                    </div>
                                    <a href={`mailto:${contactInfo.email}`} className="pt-1 hover:text-pm-gold transition-colors break-all">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-8 pt-6 border-t border-pm-gold/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-pm-off-white/60">
                                &copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.
                            </p>
                            <p className="text-xs text-pm-off-white/40 mt-1">
                                Agence de mannequins d'élite au Gabon • Mode africaine • Formation professionnelle
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                            <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors flex items-center gap-2">
                                <span>Conditions d'Utilisation</span>
                            </Link>
                            <div className="w-px h-4 bg-pm-gold/30"></div>
                            <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors flex items-center gap-2">
                                <span>Politique de Confidentialité</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;