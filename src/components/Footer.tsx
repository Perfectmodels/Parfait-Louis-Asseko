import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './icons/SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins", icon: "👗" },
        { label: "Candidature Casting", link: "/casting-formulaire", icon: "⭐" },
        { label: "Organisation Défilés", link: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode", icon: "🎭" },
        { label: "Formation Mannequins", link: "/contact?service=Formation+Mannequins", icon: "🎓" },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-black via-pm-dark to-black text-pm-off-white/70 border-t border-pm-gold/30 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pm-gold rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pm-gold rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-6 py-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-4 lg:col-span-1">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block group">
                                <img 
                                    src={siteConfig.logo} 
                                    alt="Perfect Models Management Logo" 
                                    className="h-20 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
                                />
                            </Link>
                        )}
                        <p className="text-sm leading-relaxed text-pm-off-white/80">
                            <span className="text-pm-gold font-semibold">L'élégance redéfinie.</span><br />
                            Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.
                        </p>
                        {socialLinks && (
                            <div className="flex space-x-4 pt-2">
                                {socialLinks.facebook && (
                                    <a 
                                        href={socialLinks.facebook} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300" 
                                        aria-label="Facebook"
                                    >
                                        <FacebookIcon className="w-5 h-5 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-300" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a 
                                        href={socialLinks.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300" 
                                        aria-label="Instagram"
                                    >
                                        <InstagramIcon className="w-5 h-5 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-300" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a 
                                        href={socialLinks.youtube} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group p-3 bg-pm-off-white/5 rounded-full border border-pm-off-white/10 hover:border-pm-gold hover:bg-pm-gold/10 transition-all duration-300" 
                                        aria-label="YouTube"
                                    >
                                        <YoutubeIcon className="w-5 h-5 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-300" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Explorer */}
                    <div>
                        <h3 className="relative text-lg font-playfair font-bold text-pm-gold uppercase tracking-wider mb-4 pb-2 inline-block">
                            Explorer
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pm-gold to-transparent"></span>
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link, index) => (
                                <li key={link.path} className="group" style={{ animationDelay: `${index * 50}ms` }}>
                                    <Link 
                                        to={link.path} 
                                        className="flex items-center gap-2 text-sm hover:text-pm-gold transition-all duration-300 hover:translate-x-1"
                                    >
                                        <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span>{link.footerLabel || link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 3: Services Clés */}
                    <div>
                        <h3 className="relative text-lg font-playfair font-bold text-pm-gold uppercase tracking-wider mb-4 pb-2 inline-block">
                            Services Clés
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pm-gold to-transparent"></span>
                        </h3>
                        <ul className="space-y-2">
                            {keyServices.map((service, index) => (
                                <li key={service.label} className="group" style={{ animationDelay: `${index * 50}ms` }}>
                                    <Link 
                                        to={service.link} 
                                        className="flex items-center gap-3 text-sm hover:text-pm-gold transition-all duration-300 hover:translate-x-1"
                                    >
                                        <span className="text-lg group-hover:scale-125 transition-transform duration-300">{service.icon}</span>
                                        <span>{service.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="relative text-lg font-playfair font-bold text-pm-gold uppercase tracking-wider mb-4 pb-2 inline-block">
                            Contact
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pm-gold to-transparent"></span>
                        </h3>
                        {contactInfo && (
                            <ul className="space-y-3 text-sm">
                                <li className="group flex items-start gap-3 hover:text-pm-off-white transition-colors duration-300">
                                    <MapPinIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="leading-relaxed">{contactInfo.address}</span>
                                </li>
                                <li className="group flex items-start gap-3 hover:text-pm-off-white transition-colors duration-300">
                                    <PhoneIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                    <a href={`tel:${contactInfo.phone}`} className="hover:text-pm-gold transition-colors">
                                        {contactInfo.phone}
                                    </a>
                                </li>
                                <li className="group flex items-start gap-3 hover:text-pm-off-white transition-colors duration-300">
                                    <EnvelopeIcon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                    <a 
                                        href={`mailto:${contactInfo.email}`} 
                                        className="hover:text-pm-gold transition-colors break-all"
                                    >
                                        {contactInfo.email}
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Admin Access Section - Ultra Stylé */}
                <div className="mt-10 pt-8 border-t border-pm-gold/20">
                    <div className="relative bg-gradient-to-r from-pm-dark via-black to-pm-dark rounded-2xl p-6 lg:p-8 border border-pm-gold/30 shadow-2xl shadow-pm-gold/10 overflow-hidden">
                        {/* Background Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/5 via-transparent to-pm-gold/5 animate-pulse-slow"></div>
                        
                        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <SparklesIcon className="w-6 h-6 text-pm-gold animate-pulse" />
                                    <h3 className="text-2xl font-playfair font-bold text-pm-gold uppercase tracking-wider">
                                        Espace Professionnel
                                    </h3>
                                    <SparklesIcon className="w-6 h-6 text-pm-gold animate-pulse" />
                                </div>
                                <p className="text-sm text-pm-off-white/70 max-w-xl">
                                    Accédez à votre dashboard personnalisé et gérez votre activité en toute simplicité
                                </p>
                            </div>
                            
                            <Link 
                                to="/login" 
                                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pm-gold via-yellow-400 to-pm-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-black font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:shadow-pm-gold/60 transform"
                            >
                                <ShieldCheckIcon className="w-6 h-6 group-hover:rotate-[360deg] transition-transform duration-700" />
                                <span className="relative">
                                    Accès Panel
                                    <span className="absolute -top-1 -right-8 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                                    </span>
                                </span>
                                <svg 
                                    className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                        
                        <div className="mt-4 text-center lg:text-right">
                            <p className="text-xs text-pm-off-white/50 italic">
                                Réservé aux administrateurs, mannequins professionnels et membres du jury
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-pm-off-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-pm-off-white/60">
                        <p className="text-center md:text-left">
                            &copy; {new Date().getFullYear()} <span className="text-pm-gold font-semibold">Perfect Models Management</span>. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link 
                                to="/terms-of-use" 
                                className="hover:text-pm-gold transition-colors duration-300 relative group"
                            >
                                Conditions d'Utilisation
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pm-gold group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <span className="text-pm-off-white/30">•</span>
                            <Link 
                                to="/privacy-policy" 
                                className="hover:text-pm-gold transition-colors duration-300 relative group"
                            >
                                Politique de Confidentialité
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pm-gold group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Crée Par Graphik Studio*/}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-pm-off-white/40 flex items-center justify-center gap-2">
                            Crée Par Graphik Studio
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
