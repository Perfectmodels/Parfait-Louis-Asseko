
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

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
        <footer className="bg-black text-white relative overflow-hidden border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

            <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block">
                                <img
                                    src={siteConfig.logo}
                                    alt="Perfect Models Management"
                                    className="h-12 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </Link>
                        )}
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            L'excellence de la mode africaine. Nous découvrons et façonnons les icônes de demain, redéfinissant les standards de l'élégance à Libreville et au-delà.
                        </p>

                        {socialLinks && (
                            <div className="flex items-center gap-6">
                                {socialLinks.facebook && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                        <FacebookIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                        <InstagramIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                        <YoutubeIcon className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-playfair text-xl text-white mb-8">Explorer</h4>
                        <ul className="space-y-4">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-gray-400 hover:text-pm-gold transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-pm-gold transition-all duration-300 block" />
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className="lg:col-span-2">
                        <h4 className="font-playfair text-xl text-white mb-8">Talents</h4>
                        <ul className="space-y-4">
                            {keyServices.map(service => (
                                <li key={service.label}>
                                    <Link to={service.link} className="text-gray-400 hover:text-pm-gold transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-pm-gold transition-all duration-300 block" />
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="lg:col-span-3">
                        <h4 className="font-playfair text-xl text-white mb-8">Contact</h4>
                        {contactInfo && (
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-start gap-4 text-gray-400">
                                    <MapPinIcon className="w-5 h-5 text-pm-gold shrink-0 mt-1" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-center gap-4 text-gray-400">
                                    <PhoneIcon className="w-5 h-5 text-pm-gold shrink-0" />
                                    <span>{contactInfo.phone}</span>
                                </li>
                                <li className="flex items-center gap-4 text-gray-400">
                                    <EnvelopeIcon className="w-5 h-5 text-pm-gold shrink-0" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}

                        <div>
                            <h5 className="text-sm font-bold uppercase tracking-widest text-pm-gold mb-4">Newsletter</h5>
                            <form className="relative" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-pm-gold transition-colors"
                                />
                                <button type="submit" className="absolute right-0 top-0 h-full px-4 text-pm-gold hover:text-white transition-colors">
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management.</p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Confidentialité</Link>
                        <Link to="/terms-of-use" className="hover:text-white transition-colors">Conditions</Link>
                        <Link to="/login" className="hover:text-pm-gold transition-colors">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
