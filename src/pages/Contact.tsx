import React, { useState, useEffect } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { useLocation } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '@/components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/icons/SocialIcons';
import BookingForm from '../components/BookingForm';
import { ContactMessage } from '../types';

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;
    
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        if (service) {
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}` }));
        }
    }, [location.search]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        const newContactMessage: ContactMessage = {
            id: `contact-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
        };

        try {
            const updatedMessages = [...(data.contactMessages || []), newContactMessage];
            await saveData({ ...data, contactMessages: updatedMessages });
            
            setStatus('success');
            setStatusMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
            console.error("Error saving contact message:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gradient-to-b from-pm-dark to-black text-pm-off-white py-20 lg:py-28 min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
            />
            <div className="container mx-auto px-6">
                <div className="text-center animate-on-scroll">
                    <h1 className="text-5xl sm:text-6xl font-playfair text-pm-gold mb-6 relative inline-block">
                        Échangeons Ensemble
                        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-pm-gold/30"></span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-pm-off-white/80 text-lg mt-8">
                        Vous avez une question, un projet de collaboration ou une demande de booking pour nos talents ? Notre équipe basée à Libreville est disponible pour vous accompagner et répondre à toutes vos attentes avec professionnalisme et réactivité.
                    </p>
                </div>

                <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-gradient-to-br from-black to-pm-dark p-8 lg:p-10 border border-pm-gold/30 rounded-lg shadow-xl animate-on-scroll delay-100">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-8 relative after:content-[''] after:absolute after:w-16 after:h-[2px] after:bg-pm-gold/50 after:bottom-[-10px] after:left-0">Nos Coordonnées</h2>
                        {contactInfo && (
                            <div className="space-y-6 text-lg mt-10">
                                <InfoItem icon={MapPinIcon} text={contactInfo.address || "Quartier Batterie IV, Libreville, Gabon"} />
                                <InfoItem icon={PhoneIcon} text={contactInfo.phone || "+241 77 98 23 14"} />
                                <InfoItem icon={EnvelopeIcon} text={contactInfo.email || "contact@perfectmodelsmanagement.com"} href={`mailto:${contactInfo.email || "contact@perfectmodelsmanagement.com"}`} />
                            </div>
                        )}
                        <div className="mt-10 pt-8 border-t border-pm-gold/20">
                            <h3 className="text-xl font-bold text-pm-gold mb-6">Rejoignez Notre Communauté</h3>
                            {socialLinks && (
                                <div className="flex space-x-8">
                                    {socialLinks.facebook && <SocialLink href={socialLinks.facebook} icon={FacebookIcon} />}
                                    {socialLinks.instagram && <SocialLink href={socialLinks.instagram} icon={InstagramIcon} />}
                                    {socialLinks.youtube && <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-black to-pm-dark p-8 lg:p-10 border border-pm-gold/30 rounded-lg shadow-xl animate-on-scroll delay-200">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-8 relative after:content-[''] after:absolute after:w-16 after:h-[2px] after:bg-pm-gold/50 after:bottom-[-10px] after:left-0">Votre Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                            <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                            <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} required rows={5} />
                            
                            <div className="mt-8">
                                <button type="submit" disabled={status === 'loading'} className="w-full px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:scale-105 disabled:opacity-50 shadow-lg shadow-pm-gold/20">
                                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer votre message'}
                                </button>
                            </div>
                            
                            {statusMessage && (
                                <p className={`text-center text-sm p-4 rounded-md mt-4 ${status === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                    {statusMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="mt-24 max-w-6xl mx-auto animate-on-scroll delay-300">
                    <div className="bg-gradient-to-br from-black to-pm-dark p-10 border border-pm-gold/30 rounded-lg shadow-xl">
                        <h2 className="text-4xl font-playfair text-pm-gold mb-8 text-center relative inline-block w-full">
                            Réservez Nos Talents
                            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-pm-gold/30"></span>
                        </h2>
                        <p className="text-center text-pm-off-white/80 mb-10 max-w-3xl mx-auto text-lg">
                            Besoin de mannequins professionnels pour votre défilé, shooting photo, campagne publicitaire ou événement ? Complétez le formulaire ci-dessous pour réserver un ou plusieurs de nos talents d'exception.
                        </p>
                        <BookingForm />
                    </div>
                </div>

            </div>
        </div>
    );
};

const InfoItem: React.FC<{icon: React.ElementType, text: string, href?: string}> = ({ icon: Icon, text, href }) => (
    <div className="flex items-start gap-5 group transition-all duration-300 hover:translate-x-1">
        <div className="bg-pm-gold/10 p-3 rounded-full border border-pm-gold/30 group-hover:bg-pm-gold/20 transition-all duration-300">
            <Icon className="w-6 h-6 text-pm-gold flex-shrink-0" />
        </div>
        <div className="mt-2">
            {href ? 
                <a href={href} className="text-pm-off-white hover:text-pm-gold transition-colors">{text}</a> 
                : 
                <span className="text-pm-off-white/90">{text}</span>
            }
        </div>
    </div>
);

const SocialLink: React.FC<{ href: string, icon: React.ElementType }> = ({ href, icon: Icon }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-pm-off-white/70 hover:text-pm-gold transition-all duration-300 transform hover:scale-110"
    >
        <div className="bg-pm-gold/10 p-3 rounded-full border border-pm-gold/30 hover:bg-pm-gold/20 transition-all duration-300">
            <Icon className="w-6 h-6" />
        </div>
    </a>
);

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = (props) => (
    <div className="group">
        <label htmlFor={props.name} className="block text-pm-off-white mb-2 font-medium transition-all duration-300 group-focus-within:text-pm-gold">{props.label}</label>
        <input 
            {...props} 
            id={props.name} 
            className="w-full bg-black/50 border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300" 
            placeholder={`Votre ${props.label.toLowerCase()}...`}
        />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean, rows?: number}> = (props) => (
    <div className="group">
        <label htmlFor={props.name} className="block text-pm-off-white mb-2 font-medium transition-all duration-300 group-focus-within:text-pm-gold">{props.label}</label>
        <textarea 
            {...props} 
            id={props.name} 
            rows={props.rows || 5} 
            className="w-full bg-black/50 border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300 resize-y" 
            placeholder={`Votre ${props.label.toLowerCase()}...`}
        />
    </div>
);

export default Contact;
