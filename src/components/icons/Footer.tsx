import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    const formspree = data?.apiKeys?.formspreeEndpoint;
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    // Select a few key services to highlight in the footer
    const keyServices = [
        { label: "Booking Mannequins", link: "/contact?service=Booking+Mannequins" },
        { label: "Candidature Casting", link: "/casting-formulaire" },
        { label: "Organisation Défilés", link: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode" },
        { label: "Formation Mannequins", link: "/contact?service=Formation+Mannequins" },
    ];

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        if (!formspree) {
            window.location.href = `mailto:${contactInfo?.notificationEmail || contactInfo?.email}?subject=Inscription%20newsletter&body=${encodeURIComponent(email)}`;
            return;
        }
        try {
            setIsSubmitting(true);
            const resp = await fetch(formspree, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, _subject: 'PMM Newsletter' })
            });
            if (resp.ok) {
                setSubmitted(true);
                setEmail('');
            } else {
                alert("Impossible d'enregistrer votre email pour le moment.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-pm-off-white/80 border-t border-pm-gold/20">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-pm-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-white/5 blur-3xl" />

            {/* Accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-pm-gold/50 to-transparent" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-6">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block">
                                <span className="inline-flex p-1 rounded-full bg-gradient-to-r from-pm-gold/40 via-white/10 to-pm-gold/40">
                                    <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-16 w-16 object-cover rounded-full shadow-[0_0_30px_rgba(212,175,55,0.25)]" />
                                </span>
                            </Link>
                        )}
                        <p className="text-sm leading-relaxed max-w-sm text-pm-off-white/70">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                        {socialLinks && (
                            <div className="flex space-x-4 pt-1">
                                {socialLinks.facebook && (
                                   <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="group" aria-label="Facebook">
                                        <span className="inline-flex p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-pm-gold/40 transition-colors">
                                            <FacebookIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-gold transition-colors" />
                                        </span>
                                   </a>
                                )}
                                {socialLinks.instagram && (
                                   <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
                                        <span className="inline-flex p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-pm-gold/40 transition-colors">
                                            <InstagramIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-gold transition-colors" />
                                        </span>
                                   </a>
                                )}
                                {socialLinks.youtube && (
                                   <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="group" aria-label="YouTube">
                                        <span className="inline-flex p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-pm-gold/40 transition-colors">
                                            <YoutubeIcon className="w-5 h-5 text-pm-off-white group-hover:text-pm-gold transition-colors" />
                                        </span>
                                   </a>
                                )}
                            </div>
                        )}

                        {/* Newsletter */}
                        <div className="mt-4 p-0.5 rounded-xl bg-gradient-to-r from-pm-gold/30 via-white/10 to-pm-gold/30">
                            <div className="bg-black/60 p-4 rounded-xl">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-pm-gold mb-2">Newsletter</h4>
                                {submitted ? (
                                    <p className="text-xs text-green-400">Merci, votre inscription est confirmée.</p>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Votre email"
                                            className="flex-1 admin-input !py-2 !text-sm"
                                        />
                                        <button disabled={isSubmitting} className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full bg-pm-gold text-pm-dark hover:bg-white disabled:opacity-60">
                                            {isSubmitting ? '...': 'S’inscrire'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Explorer */}
                    <div>
                        <h3 className="text-lg font-bold text-pm-off-white uppercase tracking-wider mb-4">Explorer</h3>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-pm-gold transition-colors text-sm inline-flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-pm-gold/60" />
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                             <li className="pt-2">
                                <Link to="/login" className="inline-flex items-center gap-3 px-4 py-2 rounded-full border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-xs hover:bg-pm-gold hover:text-pm-dark transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                                    <span className="inline-block w-2 h-2 rounded-full bg-pm-gold" />
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
                    <p className="text-pm-off-white/60">&copy; {new Date().getFullYear()} Perfect Models Management — Crafted with <span className="text-pm-gold">❤</span> in Libreville.</p>
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Conditions d'Utilisation</Link>
                        <span className="text-pm-off-white/30">•</span>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Politique de Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;