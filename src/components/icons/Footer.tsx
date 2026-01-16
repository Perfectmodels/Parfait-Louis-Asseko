import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;

    const footerLinks = navLinks.filter(link => link.inFooter);

    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins" },
        { label: "Candidature Casting", link: "/casting-formulaire" },
        { label: "Organisation Défilés", link: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode" },
        { label: "Formation Mannequins", link: "/contact?service=Formation+Mannequins" },
    ];

    return (
        <footer className="bg-black text-pm-off-white border-t border-pm-gold/30 relative overflow-hidden font-montserrat">
            {/* Élément décoratif supérieur */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pm-gold to-transparent opacity-50"></div>

            <div className="container mx-auto px-6 pt-20 pb-10">

                {/* Section Newsletter - Style "Carte" */}
                <div className="relative z-10 bg-pm-dark/40 border border-pm-gold/10 rounded-2xl p-8 md:p-12 mb-20 backdrop-blur-sm">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-3xl font-playfair text-pm-gold mb-3">Restez à l'avant-garde</h3>
                            <p className="text-pm-off-white/70 font-light text-sm leading-relaxed">
                                Rejoignez notre liste exclusive pour recevoir les actualités des castings, les événements VIP et les tendances mode directement dans votre boîte mail.
                            </p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                className="flex-grow bg-black/40 border border-pm-gold/20 rounded-full px-6 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pm-gold transition-colors"
                                required
                            />
                            <button type="submit" className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-wider text-xs rounded-full hover:bg-white transition-all duration-300 shadow-lg shadow-pm-gold/10">
                                S'abonner
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Colonne 1: Marque & Social (4 colonnes) */}
                    <div className="lg:col-span-4 space-y-6">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block">
                                <img src={siteConfig.logo} alt="Perfect Models Management" className="h-20 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
                            </Link>
                        )}
                        <p className="text-pm-off-white/60 text-sm leading-relaxed max-w-sm">
                            L'élégance redéfinie. Nous sommes bien plus qu'une agence ; nous sommes un berceau de talents et une plateforme dédiée à l'avenir de la mode africaine.
                        </p>
                        {socialLinks && (
                            <div className="flex space-x-5 pt-2">
                                {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="Facebook"><FacebookIcon className="w-5 h-5" /></a>}
                                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="Instagram"><InstagramIcon className="w-5 h-5" /></a>}
                                {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors transform hover:scale-110 duration-300" aria-label="YouTube"><YoutubeIcon className="w-5 h-5" /></a>}
                            </div>
                        )}
                    </div>

                    {/* Colonne 2: Explorer (2 colonnes) */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Explorer
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-pm-gold"></span>
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="group flex items-center text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-pm-gold mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3: Services (3 colonnes) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Services
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-pm-gold"></span>
                        </h4>
                        <ul className="space-y-3">
                            {keyServices.map(service => (
                                <li key={service.label}>
                                    <Link to={service.link} className="group flex items-center text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors">
                                        <ArrowRightIcon className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-pm-gold" />
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4: Contact (3 colonnes) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Contact
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-pm-gold"></span>
                        </h4>
                        {contactInfo && (
                            <ul className="space-y-5 text-sm text-pm-off-white/60">
                                <li className="flex items-start gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-pm-gold/20 transition-colors shrink-0">
                                        <MapPinIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <span className="mt-1.5 leading-tight">{contactInfo.address}</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-pm-gold/20 transition-colors shrink-0">
                                        <PhoneIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <span>{contactInfo.phone}</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-pm-gold/20 transition-colors shrink-0">
                                        <EnvelopeIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors break-all">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bas de page */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-pm-off-white/40">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Conditions d'Utilisation</Link>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Politique de Confidentialité</Link>
                        <Link to="/login" className="hover:text-pm-gold transition-colors flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pm-gold/50"></span>
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
