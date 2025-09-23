import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    // Select a few key services to highlight in the footer
    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins", icon: "👥" },
        { label: "Candidature Casting", link: "/casting-formulaire", icon: "✨" },
        { label: "Organisation Défilés", link: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode", icon: "👗" },
        { label: "Formation Mannequins", link: "/contact?service=Formation+Mannequins", icon: "🎓" },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-black via-pm-dark to-black text-pm-off-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>
            
            {/* Main Footer Content */}
            <div className="relative z-10">
                {/* Top Section with Newsletter */}
                <div className="border-b border-pm-gold/20">
                    <div className="container mx-auto px-6 py-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <SparklesIcon className="w-6 h-6 text-pm-gold" />
                                <h2 className="text-2xl font-playfair text-pm-gold">Restez Connecté</h2>
                                <SparklesIcon className="w-6 h-6 text-pm-gold" />
                            </div>
                            <p className="text-pm-off-white/80 mb-6">
                                Recevez les dernières actualités de l'agence et les opportunités de casting exclusives
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    className="flex-1 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-all"
                                />
                                <button className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-wider rounded-lg hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300 transform hover:scale-105">
                                    S'abonner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Column 1: Brand & Social */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {siteConfig?.logo && (
                                    <Link to="/" className="block group">
                                        <img 
                                            src={siteConfig.logo} 
                                            alt="Perfect Models Management Logo" 
                                            className="h-16 w-auto transition-transform duration-300 group-hover:scale-105" 
                                        />
                                    </Link>
                                )}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-playfair text-pm-gold">Perfect Models Management</h3>
                                    <p className="text-sm leading-relaxed text-pm-off-white/80">
                                        L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.
                                    </p>
                                </div>
                            </div>
                            
                            {socialLinks && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-pm-gold uppercase tracking-wider">Suivez-nous</h4>
                                    <div className="flex space-x-4">
                                        {socialLinks.facebook && (
                                            <a 
                                                href={socialLinks.facebook} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="group p-2 bg-pm-off-white/5 border border-pm-gold/20 rounded-lg hover:bg-pm-gold hover:border-pm-gold transition-all duration-300 transform hover:scale-110" 
                                                aria-label="Facebook"
                                            >
                                                <FacebookIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-dark transition-colors" />
                                            </a>
                                        )}
                                        {socialLinks.instagram && (
                                            <a 
                                                href={socialLinks.instagram} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="group p-2 bg-pm-off-white/5 border border-pm-gold/20 rounded-lg hover:bg-pm-gold hover:border-pm-gold transition-all duration-300 transform hover:scale-110" 
                                                aria-label="Instagram"
                                            >
                                                <InstagramIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-dark transition-colors" />
                                            </a>
                                        )}
                                        {socialLinks.youtube && (
                                            <a 
                                                href={socialLinks.youtube} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="group p-2 bg-pm-off-white/5 border border-pm-gold/20 rounded-lg hover:bg-pm-gold hover:border-pm-gold transition-all duration-300 transform hover:scale-110" 
                                                aria-label="YouTube"
                                            >
                                                <YoutubeIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-dark transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Column 2: Navigation */}
                        <div>
                            <h3 className="text-lg font-playfair text-pm-gold mb-6 relative">
                                Navigation
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-pm-gold"></div>
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.map(link => (
                                    <li key={link.path}>
                                        <Link 
                                            to={link.path} 
                                            className="group flex items-center gap-2 text-sm text-pm-off-white/80 hover:text-pm-gold transition-all duration-300 hover:translate-x-1"
                                        >
                                            <span className="w-1 h-1 bg-pm-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {link.footerLabel || link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link 
                                        to="/login" 
                                        className="group flex items-center gap-2 text-sm text-pm-gold hover:text-white transition-all duration-300 hover:translate-x-1 font-semibold"
                                    >
                                        <span className="w-1 h-1 bg-pm-gold rounded-full"></span>
                                        Accès Panel
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Column 3: Services */}
                        <div>
                            <h3 className="text-lg font-playfair text-pm-gold mb-6 relative">
                                Services Clés
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-pm-gold"></div>
                            </h3>
                            <ul className="space-y-3">
                               {keyServices.map(service => (
                                   <li key={service.label}>
                                       <Link 
                                           to={service.link} 
                                           className="group flex items-center gap-3 text-sm text-pm-off-white/80 hover:text-pm-gold transition-all duration-300 hover:translate-x-1"
                                       >
                                           <span className="text-lg group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                                           {service.label}
                                       </Link>
                                   </li>
                               ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact Info */}
                        <div>
                            <h3 className="text-lg font-playfair text-pm-gold mb-6 relative">
                                Contact
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-pm-gold"></div>
                            </h3>
                            {contactInfo && (
                                <ul className="space-y-4">
                                    <li className="group flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                                        <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold/20 transition-colors">
                                            <MapPinIcon className="w-4 h-4 text-pm-gold" />
                                        </div>
                                        <span className="text-sm text-pm-off-white/80 group-hover:text-pm-gold transition-colors">{contactInfo.address}</span>
                                    </li>
                                    <li className="group flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                                        <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold/20 transition-colors">
                                            <PhoneIcon className="w-4 h-4 text-pm-gold" />
                                        </div>
                                        <a 
                                            href={`tel:${contactInfo.phone}`} 
                                            className="text-sm text-pm-off-white/80 group-hover:text-pm-gold transition-colors hover:underline"
                                        >
                                            {contactInfo.phone}
                                        </a>
                                    </li>
                                    <li className="group flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                                        <div className="p-2 bg-pm-gold/10 rounded-lg group-hover:bg-pm-gold/20 transition-colors">
                                            <EnvelopeIcon className="w-4 h-4 text-pm-gold" />
                                        </div>
                                        <a 
                                            href={`mailto:${contactInfo.email}`} 
                                            className="text-sm text-pm-off-white/80 group-hover:text-pm-gold transition-colors hover:underline break-all"
                                        >
                                            {contactInfo.email}
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-pm-gold/20 bg-black/50">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-pm-off-white/60">
                                <span>&copy; {new Date().getFullYear()} Perfect Models Management</span>
                                <span>•</span>
                                <span>Tous droits réservés</span>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm">
                                <Link 
                                    to="/terms-of-use" 
                                    className="text-pm-off-white/60 hover:text-pm-gold transition-colors hover:underline"
                                >
                                    Conditions d'Utilisation
                                </Link>
                                <span className="text-pm-gold/40">|</span>
                                <Link 
                                    to="/privacy-policy" 
                                    className="text-pm-off-white/60 hover:text-pm-gold transition-colors hover:underline"
                                >
                                    Politique de Confidentialité
                                </Link>
                            </div>
                            
                            <div className="flex items-center gap-1 text-pm-gold/60 text-sm">
                                <span>Fait avec</span>
                                <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
                                <span>au Gabon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;