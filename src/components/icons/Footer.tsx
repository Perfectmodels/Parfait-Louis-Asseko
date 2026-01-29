import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons/SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    const { data } = useData();
    const siteConfig = data?.siteConfig;
    const navLinks = data?.navLinks || [];
    const socialLinks = data?.socialLinks;
    const contactInfo = data?.contactInfo;
    
    const footerLinks = navLinks.filter(link => link.inFooter);

    return (
        <footer className="bg-[#050505] text-pm-off-white/40 border-t border-white/5">
            <div className="max-w-[1800px] mx-auto px-6 sm:px-12 py-32">
                
                {/* 1. BRAND MANIFESTO & NEWSLETTER */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                    <div className="space-y-12">
                         <Link to="/" className="inline-block group">
                            <img 
                                src={siteConfig?.logo} 
                                alt="PMM" 
                                className="h-20 w-auto bg-black rounded-full border border-white/10 p-2 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" 
                            />
                        </Link>
                        <h2 className="text-5xl md:text-7xl font-playfair font-black text-white italic leading-[0.9] tracking-tighter">
                            Defining the <br/>
                            <span className="text-pm-gold">Future</span> of Elegance.
                        </h2>
                        <div className="flex gap-8">
                             {socialLinks?.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-all duration-500 hover:-translate-y-1"><FacebookIcon className="w-6 h-6" /></a>}
                             {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-all duration-500 hover:-translate-y-1"><InstagramIcon className="w-6 h-6" /></a>}
                             {socialLinks?.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold transition-all duration-500 hover:-translate-y-1"><YoutubeIcon className="w-6 h-6" /></a>}
                        </div>
                    </div>

                    <div className="lg:pt-12">
                        <span className="section-label">Newsletter</span>
                        <h3 className="text-2xl font-playfair font-bold text-white mb-8">Join the inner circle for exclusive updates.</h3>
                        <form className="relative max-w-md group" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Your professional email" 
                                className="w-full bg-transparent border-b border-white/10 py-6 text-pm-off-white focus:outline-none focus:border-pm-gold transition-all duration-700 placeholder:text-white/10" 
                                required 
                            />
                            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-pm-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. NAVIGATION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 pt-20 border-t border-white/5">
                    {/* Column: Navigation */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold mb-10">Navigation</h4>
                        <ul className="space-y-4">
                            {footerLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-sm font-medium text-white/50 hover:text-pm-gold transition-colors block">
                                        {link.footerLabel || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column: Opportunities */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold mb-10">Opportunities</h4>
                        <ul className="space-y-4 text-sm font-medium text-white/50">
                           <li><Link to="/casting-formulaire" className="hover:text-pm-gold transition-colors block">Become a Model</Link></li>
                           <li><Link to="/fashion-day-application" className="hover:text-pm-gold transition-colors block">Exhibit at PFD</Link></li>
                           <li><Link to="/contact" className="hover:text-pm-gold transition-colors block">Press & Inquiries</Link></li>
                        </ul>
                    </div>

                    {/* Column: Headquarters */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold mb-10">Headquarters</h4>
                        {contactInfo && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-sm font-medium text-white/50">
                                <div className="space-y-4">
                                    <div className="flex gap-4 group">
                                        <MapPinIcon className="w-5 h-5 text-pm-gold shrink-0 transition-transform group-hover:scale-110" />
                                        <span>{contactInfo.address}</span>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <PhoneIcon className="w-5 h-5 text-pm-gold shrink-0 transition-transform group-hover:scale-110" />
                                        <span>{contactInfo.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <EnvelopeIcon className="w-5 h-5 text-pm-gold shrink-0 transition-transform group-hover:scale-110" />
                                    <a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors truncate">{contactInfo.email}</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. LEGAL & SYSTEM */}
                <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                    <p>&copy; {new Date().getFullYear()} Perfect Models Management. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                        <Link to="/terms-of-use" className="hover:text-pm-gold transition-colors">Terms of Service</Link>
                        <Link to="/privacy-policy" className="hover:text-pm-gold transition-colors">Privacy Policy</Link>
                        <Link to="/login" className="text-pm-gold hover:text-white transition-colors underline decoration-pm-gold/20 underline-offset-8">Portal Access</Link>
                    </div>
                </div>
            </div>
            
            {/* Decorative background text */}
            <div className="absolute left-0 bottom-0 text-[20vw] font-playfair font-black text-white/[0.01] leading-none pointer-events-none select-none translate-y-1/2">
                EXCELLENCE
            </div>
        </footer>
    );
};

export default Footer;