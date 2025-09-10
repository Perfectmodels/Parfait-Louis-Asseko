import React from 'react';
import { motion, Variants } from 'framer-motion';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/icons/SocialIcons';
import InteractiveMap from '../components/InteractiveMap';
import ContactAndBookingForm from '../components/ContactAndBookingForm';

const Contact: React.FC = (): JSX.Element => {
    const { data } = useData();
    
    // Vérifier que data n'est pas null avant d'accéder à ses propriétés
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-12 lg:py-20 min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
            />
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div 
                    className="text-center mb-12" 
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-pm-gold mb-4">
                        Contactez-nous
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-pm-off-white/80">
                        Une question, un projet de collaboration ou une demande de booking ? Notre équipe est à votre écoute.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div 
                        className="bg-gradient-to-br from-black/80 to-black/50 p-8 border border-pm-gold/20 rounded-xl shadow-2xl backdrop-blur-sm"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-pm-gold mb-8">
                            Nos Coordonnées
                        </h2>
                        
                        <div className="space-y-8">
                            {contactInfo && (
                                <div className="space-y-6">
                                    <InfoItem 
                                        icon={MapPinIcon} 
                                        text={contactInfo.address} 
                                        className="text-lg"
                                    />
                                    <InfoItem 
                                        icon={PhoneIcon} 
                                        text={contactInfo.phone} 
                                        href={`tel:${contactInfo.phone?.replace(/\s/g, '')}`}
                                        className="text-lg hover:text-pm-gold transition-colors"
                                    />
                                    <InfoItem 
                                        icon={EnvelopeIcon} 
                                        text={contactInfo.email} 
                                        href={`mailto:${contactInfo.email}`}
                                        className="text-lg hover:text-pm-gold transition-colors"
                                    />
                                </div>
                            )}
                            
                            {/* Carte interactive */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-pm-off-white mb-4">Nous trouver</h3>
                                <InteractiveMap 
                                    address={contactInfo?.address || 'Libreville, Gabon'}
                                    className="rounded-lg border border-pm-gold/20"
                                />
                            </div>
                            
                            {/* Réseaux sociaux */}
                            <div className="pt-6 border-t border-pm-gold/10">
                                <h3 className="text-xl font-bold text-pm-off-white mb-4">Suivez-nous</h3>
                                {socialLinks && (
                                    <div className="flex space-x-4">
                                        {socialLinks.facebook && (
                                            <SocialLink 
                                                href={socialLinks.facebook} 
                                                icon={FacebookIcon} 
                                                label="Facebook"
                                            />
                                        )}
                                        {socialLinks.instagram && (
                                            <SocialLink 
                                                href={socialLinks.instagram} 
                                                icon={InstagramIcon} 
                                                label="Instagram"
                                            />
                                        )}
                                        {socialLinks.youtube && (
                                            <SocialLink 
                                                href={socialLinks.youtube} 
                                                icon={YoutubeIcon} 
                                                label="YouTube"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Formulaire unifié Contact & Booking */}
                    <motion.div 
                        className="bg-gradient-to-br from-black/80 to-black/50 p-8 border border-pm-gold/20 rounded-xl shadow-2xl backdrop-blur-sm"
                        variants={itemVariants}
                    >
                        <ContactAndBookingForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

interface InfoItemProps {
    icon: React.ElementType;
    text?: string;
    href?: string;
    className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ 
    icon: Icon, 
    text, 
    href, 
    className = '' 
}) => {
    const content = (
        <div className="flex items-start group">
            <div className="bg-pm-gold/10 p-2 rounded-lg mr-4 group-hover:bg-pm-gold/20 transition-colors">
                <Icon className="h-5 w-5 text-pm-gold flex-shrink-0" />
            </div>
            <span className={`text-pm-off-white/90 ${className} group-hover:text-pm-gold transition-colors`}>
                {text}
            </span>
        </div>
    );

    return href ? (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:no-underline"
        >
            {content}
        </a>
    ) : content;
};

interface SocialLinkProps {
    href: string;
    icon: React.ElementType;
    label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ 
    href, 
    icon: Icon, 
    label 
}) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-pm-gold/20 text-pm-off-white/80 hover:bg-pm-gold/10 hover:text-pm-gold hover:border-pm-gold/50 transition-all duration-300 group"
        aria-label={label}
    >
        <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
    </a>
);

// Composants de formulaire supprimés car intégrés directement dans le formulaire principal

export default Contact;
