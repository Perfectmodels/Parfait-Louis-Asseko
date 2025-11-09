import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer 
            className="relative bg-black text-pm-off-white/70 border-t border-pm-gold/20 pt-16 pb-12"
            style={{ backgroundImage: `url('/path/to/your/subtle-pattern.png')`, backgroundRepeat: 'repeat' }}
        >
            {/* Back to top button */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <button 
                    onClick={scrollToTop}
                    className="bg-pm-gold text-pm-dark rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Retour en haut"
                >
                    <ArrowUpIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="container mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-1">
                        {siteConfig?.logo && (
                            <Link to="/" className="inline-block">
                                <img src={siteConfig.logo} alt="Perfect Models Management Logo" className="h-20 w-auto bg-black rounded-full border-4 border-pm-gold p-1 shadow-md" />
                            </Link>
                        )}
                        <p className="text-sm italic">L'élégance redéfinie. Berceau de talents et plateforme dédiée à l'avenir de la mode africaine.</p>
                         {socialLinks && (
                            <div className="flex space-x-4 pt-2">
                                {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-pm-gold/70 hover:text-pm-gold transition-colors" aria-label="Facebook"><FacebookIcon className="w-7 h-7" /></a>}
                                {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-gold/70 hover:text-pm-gold transition-colors" aria-label="Instagram"><InstagramIcon className="w-7 h-7" /></a>}
                                {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-pm-gold/70 hover:text-pm-gold transition-colors" aria-label="YouTube"><YoutubeIcon className="w-7 h-7" /></a>}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Key Services */}
                    <div>
                        <h3 className="text-base font-bold text-pm-off-white uppercase tracking-widest mb-4 font-playfair">Services Clés</h3>
                        <ul className="space-y-3">
                           {keyServices.map(service => (
                               <li key={service.label}>
                                   <Link to={service.link} className="hover:text-pm-gold transition-colors text-sm flex items-center gap-2">
                                       <span className="w-2 h-0.5 bg-pm-gold/50 transition-all duration-300 group-hover:w-4"></span>
                                       {service.label}
                                   </Link>
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Column 3: Explorer */}
                    <div>
                        <h3 className="text-base font-bold text-pm-off-white uppercase tracking-widest mb-4 font-playfair">Explorer</h3>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-pm-gold transition-colors text-sm">
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-base font-bold text-pm-off-white uppercase tracking-widest mb-4 font-playfair">Contact</h3>
                        {contactInfo && (
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <span>{contactInfo.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <PhoneIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <span>{contactInfo.phone}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <EnvelopeIcon className="w-5 h-5 mt-0.5 text-pm-gold/80 flex-shrink-0" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors break-all">{contactInfo.email}</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="text-center my-16 py-12 border-y border-pm-gold/10">
                    <h3 className="text-3xl font-playfair text-pm-gold mb-3">Restez Connecté</h3>
                    <p className="max-w-xl mx-auto text-pm-off-white/70 mb-8">
                        Recevez nos dernières actualités, dates de casting et exclusivités directement dans votre boîte mail.
                    </p>
                    <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Votre adresse email" 
                            className="admin-input flex-grow !rounded-full !bg-pm-dark/50 !border-pm-gold/30 focus:!border-pm-gold focus:!ring-pm-gold/50" 
                            required 
                        />
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase text-sm rounded-full hover:bg-white transition-colors">
                            S'abonner
                        </button>
                    </form>
                </div>

                <div className="text-center text-sm">
                     <div className="mb-6 space-x-6">
                        <Link to="/login" className="text-pm-gold/80 hover:text-pm-gold font-bold transition-colors">Accès Panel</Link>
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Conditions d'Utilisation</Link>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Politique de Confidentialité</Link>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. Conçu avec ♥. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
