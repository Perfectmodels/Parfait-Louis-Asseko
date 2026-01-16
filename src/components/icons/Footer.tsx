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
        <footer className="bg-gradient-to-b from-black via-pm-dark to-black text-pm-off-white relative overflow-hidden">
            {/* Éléments décoratifs de fond */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pm-gold rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pm-gold rounded-full blur-[120px]"></div>
            </div>

            {/* Ligne dorée supérieure */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pm-gold to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Newsletter Premium */}
                <FadeIn className="-mt-16 mb-20">
                    <div className="bg-gradient-to-br from-pm-gold via-pm-gold/90 to-yellow-600 rounded-3xl p-1 shadow-2xl shadow-pm-gold/20">
                        <div className="bg-black rounded-[22px] p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <SparklesIcon className="w-6 h-6 text-pm-gold" />
                                        <span className="text-xs uppercase tracking-widest text-pm-gold font-bold">Newsletter Exclusive</span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-playfair text-white mb-4 leading-tight">
                                        Rejoignez l'élite de la mode
                                    </h3>
                                    <p className="text-pm-off-white/70 leading-relaxed">
                                        Castings VIP, événements privés, tendances mode et opportunités exclusives directement dans votre boîte mail.
                                    </p>
                                </div>
                                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-all backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-8 py-4 bg-pm-gold text-black font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg shadow-pm-gold/20 hover:shadow-pm-gold/40 hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        {subscribeStatus === 'success' ? '✓ Inscrit avec succès !' : 'S\'abonner maintenant'}
                                        {subscribeStatus === 'idle' && <ArrowUpRightIcon className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Contenu principal du footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 py-16">

                    {/* Colonne 1: Logo & À propos */}
                    <div className="lg:col-span-4 space-y-6">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block group">
                                <img
                                    src={siteConfig.logo}
                                    alt="Perfect Models Management"
                                    className="h-24 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                                />
                            </Link>
                        )}
                        <h4 className="text-xl font-playfair text-pm-gold">Perfect Models Management</h4>
                        <p className="text-pm-off-white/60 text-sm leading-relaxed max-w-sm">
                            L'élégance redéfinie. Nous sommes bien plus qu'une agence ; nous sommes un berceau de talents et une plateforme dédiée à l'avenir de la mode africaine.
                        </p>

                        {/* Réseaux sociaux */}
                        {socialLinks && (
                            <div>
                                <p className="text-xs uppercase tracking-widest text-pm-off-white/40 mb-3 font-bold">Suivez-nous</p>
                                <div className="flex space-x-4">
                                    {socialLinks.facebook && (
                                        <a
                                            href={socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pm-off-white/50 hover:text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 hover:scale-110"
                                            aria-label="Facebook"
                                        >
                                            <FacebookIcon className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialLinks.instagram && (
                                        <a
                                            href={socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pm-off-white/50 hover:text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 hover:scale-110"
                                            aria-label="Instagram"
                                        >
                                            <InstagramIcon className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialLinks.youtube && (
                                        <a
                                            href={socialLinks.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pm-off-white/50 hover:text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 hover:scale-110"
                                            aria-label="YouTube"
                                        >
                                            <YoutubeIcon className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne 2: Navigation */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-pm-gold"></span>
                            Explorer
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-pm-gold transition-all duration-300"></span>
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3: Services */}
                    <div className="lg:col-span-3">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-pm-gold"></span>
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {keyServices.map(service => (
                                <li key={service.label}>
                                    <Link
                                        to={service.link}
                                        className="text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <ArrowUpRightIcon className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4: Contact */}
                    <div className="lg:col-span-3">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-pm-gold"></span>
                            Contact
                        </h4>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3 group">
                                    <div className="w-9 h-9 rounded-lg bg-pm-gold/10 border border-pm-gold/20 flex items-center justify-center shrink-0 group-hover:bg-pm-gold/20 transition-colors">
                                        <MapPinIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <span className="text-pm-off-white/60 leading-relaxed mt-1.5">{contactInfo.address}</span>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-lg bg-pm-gold/10 border border-pm-gold/20 flex items-center justify-center shrink-0 group-hover:bg-pm-gold/20 transition-colors">
                                        <PhoneIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <a href={`tel:${contactInfo.phone}`} className="text-pm-off-white/60 hover:text-pm-gold transition-colors">
                                        {contactInfo.phone}
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-lg bg-pm-gold/10 border border-pm-gold/20 flex items-center justify-center shrink-0 group-hover:bg-pm-gold/20 transition-colors">
                                        <EnvelopeIcon className="w-4 h-4 text-pm-gold" />
                                    </div>
                                    <a href={`mailto:${contactInfo.email}`} className="text-pm-off-white/60 hover:text-pm-gold transition-colors break-all">
                                        {contactInfo.email}
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bas de page */}
                <div className="border-t border-white/10 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p className="text-pm-off-white/40">
                            © {new Date().getFullYear()} <span className="text-pm-gold font-semibold">Perfect Models Management</span>. Tous droits réservés.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-pm-off-white/40">
                            <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">
                                Conditions d'Utilisation
                            </Link>
                            <span className="text-pm-off-white/20">•</span>
                            <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">
                                Politique de Confidentialité
                            </Link>
                            <span className="text-pm-off-white/20">•</span>
                            <Link to="/login" className="hover:text-pm-gold transition-colors flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-pm-gold animate-pulse"></span>
                                Espace Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
