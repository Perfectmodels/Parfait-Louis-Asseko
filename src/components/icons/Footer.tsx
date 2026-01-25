import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowUpRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import FadeIn from '../ui/FadeIn';

const Footer: React.FC = () => {
    const { data } = useData();
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;

    const footerLinks = navLinks.filter(link => link.inFooter);

    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=booking" },
        { label: "Candidature Casting", link: "/casting-formulaire" },
        { label: "Organisation Défilés", link: "/services/organisation-defiles-mode" },
        { label: "Formation Mannequins", link: "/services/formation-mannequins" },
    ];

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simuler l'inscription
        setSubscribeStatus('success');
        setEmail('');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
    };

    return (
        <footer className="bg-pm-dark text-pm-off-white relative overflow-hidden">
            {/* Background Decorations */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pm-gold to-transparent opacity-50"></div>
                <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-pm-gold/5 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-pm-gold/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-20 pb-10">
                {/* Newsletter Section */}
                <FadeIn className="mb-20">
                    <div className="relative overflow-hidden rounded-3xl border border-pm-gold/20 bg-white/5 backdrop-blur-md p-8 md:p-12 shadow-2xl">
                         <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pm-gold/10 rounded-full blur-2xl"></div>
                        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <SparklesIcon className="w-5 h-5 text-pm-gold" />
                                    <span className="text-xs uppercase tracking-widest text-pm-gold font-bold">Newsletter Exclusive</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-playfair text-white mb-3">
                                    Restez au cœur de la mode
                                </h3>
                                <p className="text-pm-off-white/70 leading-relaxed text-sm md:text-base">
                                    Inscrivez-vous pour recevoir les dernières actualités, dates de castings et invitations exclusives.
                                </p>
                            </div>
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Votre adresse email"
                                    className="flex-grow bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-pm-gold/10 whitespace-nowrap"
                                >
                                    {subscribeStatus === 'success' ? 'Inscrit !' : "S'abonner"}
                                </button>
                            </form>
                        </div>
                    </div>
                </FadeIn>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block">
                                <img
                                    src={siteConfig.logo}
                                    alt="Perfect Models Management"
                                    className="h-20 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </Link>
                        )}
                        <p className="text-pm-off-white/60 text-sm leading-relaxed">
                            L'excellence et l'élégance au service de la mode africaine. Nous révélons les talents de demain.
                        </p>
                        {socialLinks && (
                            <div className="flex gap-4 pt-2">
                                {socialLinks.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors">
                                        <FacebookIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors">
                                        <InstagramIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/50 hover:text-pm-gold transition-colors">
                                        <YoutubeIcon className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Explorer
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pm-gold"></span>
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-pm-gold/50"></span>
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Services
                             <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pm-gold"></span>
                        </h4>
                        <ul className="space-y-3">
                            {keyServices.map(service => (
                                <li key={service.label}>
                                    <Link
                                        to={service.link}
                                        className="text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors group flex items-center gap-1"
                                    >
                                        <ArrowUpRightIcon className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                         <h4 className="text-lg font-playfair text-white mb-6 relative inline-block">
                            Contact
                             <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pm-gold"></span>
                        </h4>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3 text-pm-off-white/60">
                                    <MapPinIcon className="w-5 h-5 text-pm-gold flex-shrink-0 mt-0.5" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-center gap-3 text-pm-off-white/60">
                                    <PhoneIcon className="w-5 h-5 text-pm-gold flex-shrink-0" />
                                    <a href={`tel:${contactInfo.phone}`} className="hover:text-pm-gold transition-colors">{contactInfo.phone}</a>
                                </li>
                                <li className="flex items-center gap-3 text-pm-off-white/60">
                                    <EnvelopeIcon className="w-5 h-5 text-pm-gold flex-shrink-0" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-pm-off-white/30 text-center md:text-left">
                        © {new Date().getFullYear()} Perfect Models Management. Tous droits réservés.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-pm-off-white/40">
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">CGU</Link>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Confidentialité</Link>
                        <Link to="/login" className="hover:text-pm-gold transition-colors">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
