
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;

    // Filter out Home from footer links to reduce redundancy if desired, or keep specific ones
    const footerLinks = navLinks.filter(link => link.inFooter);

    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins" },
        { label: "Devenir Mannequin", link: "/casting-formulaire" },
        { label: "Fashion Day", link: "/fashion-day" },
        { label: "Formation", link: "/formations" },
    ];

    return (
        <footer className="bg-black text-white relative overflow-hidden border-t-2 border-pm-gold/20">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />

            {/* Background Texture - Optional, kept from previous design but subtler */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />

            <div className="container mx-auto px-6 pt-20 pb-10 relative z-10">

                {/* Top Section: Logo & Newsletter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10 border-b border-white/10 pb-12">
                    <div className="flex-shrink-0">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block group">
                                <img
                                    src={siteConfig.logo}
                                    alt="Perfect Models Management"
                                    className="h-20 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                            </Link>
                        )}
                    </div>

                    <div className="w-full max-w-md">
                        <h3 className="text-xl font-playfair text-white mb-4 text-center md:text-right">
                            Restez informé de nos exclusivités
                        </h3>
                        <form className="relative flex items-center border-b border-pm-gold/50 focus-within:border-pm-gold transition-colors pb-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                className="w-full bg-transparent border-none p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                            />
                            <button type="submit" className="text-pm-gold hover:text-white transition-colors p-2" aria-label="S'inscrire">
                                <ArrowRightIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* About Column */}
                    <div className="space-y-6">
                        <h4 className="font-playfair text-2xl text-pm-gold">À Propos</h4>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            L'excellence de la mode africaine. Nous découvrons et façonnons les icônes de demain, redéfinissant les standards de l'élégance à Libreville et au-delà.
                        </p>
                        {socialLinks && (
                            <div className="flex items-center gap-6 pt-2">
                                {socialLinks.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pm-gold hover:-translate-y-1 transition-all duration-300">
                                        <FacebookIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pm-gold hover:-translate-y-1 transition-all duration-300">
                                        <InstagramIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pm-gold hover:-translate-y-1 transition-all duration-300">
                                        <YoutubeIcon className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h4 className="font-playfair text-2xl text-pm-gold mb-6">Navigation</h4>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block text-sm">
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="font-playfair text-2xl text-pm-gold mb-6">Services Clés</h4>
                        <ul className="space-y-3">
                            {keyServices.map(service => (
                                <li key={service.label}>
                                    <Link to={service.link} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block text-sm">
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-playfair text-2xl text-pm-gold mb-6">Nous Contacter</h4>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3 text-gray-400 group">
                                    <MapPinIcon className="w-5 h-5 text-pm-gold shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 group">
                                    <PhoneIcon className="w-5 h-5 text-pm-gold shrink-0 group-hover:text-white transition-colors" />
                                    <span>{contactInfo.phone}</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 group">
                                    <EnvelopeIcon className="w-5 h-5 text-pm-gold shrink-0 group-hover:text-white transition-colors" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}

                        {/* Prominent Admin Access Button */}
                        <div className="mt-8">
                            <Link to="/login" className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 border border-pm-gold/30 bg-pm-gold/5 hover:bg-pm-gold text-pm-gold hover:text-black font-bold uppercase tracking-widest text-xs rounded transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                <LockClosedIcon className="w-4 h-4" />
                                <span>Espace Admin</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Politique de Confidentialité</Link>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Conditions d'Utilisation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
