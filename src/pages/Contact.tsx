import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
import { ContactMessage, BookingRequest } from '../types';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

const Contact: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const location = useLocation();

    const contactInfo = data?.contactInfo || { address: '', phone: '', email: '' };
    const socialLinks = data?.socialLinks;
    const siteImages = data?.siteImages;

    const [inquiryType, setInquiryType] = useState<'general' | 'booking'>('general');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        company: '',
        models: '',
        startDate: '',
        endDate: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        const booking = params.get('booking'); // for pre-selecting booking
        const model = params.get('model'); // for pre-filling model name

        if (service) {
            setInquiryType('general');
            setFormData(prev => ({ ...prev, subject: `Demande d'information pour : ${service}` }));
        }
        if (booking) {
            setInquiryType('booking');
        }
        if (model) {
            setInquiryType('booking');
            setFormData(prev => ({ ...prev, models: model }));
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

        try {
            if (inquiryType === 'general') {
                const newContactMessage: ContactMessage = {
                    id: `contact-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                };
                const updatedMessages = [...(data.contactMessages || []), newContactMessage];
                await saveData({ ...data, contactMessages: updatedMessages });
            } else { // booking
                const newBookingRequest: BookingRequest = {
                    id: `booking-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    clientName: formData.name,
                    clientEmail: formData.email,
                    clientCompany: formData.company,
                    requestedModels: formData.models,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    message: formData.message,
                };
                const updatedRequests = [...(data.bookingRequests || []), newBookingRequest];
                await saveData({ ...data, bookingRequests: updatedRequests });
            }

            setStatus('success');
            setStatusMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            setFormData({ name: '', email: '', subject: '', message: '', company: '', models: '', startDate: '', endDate: '' });

        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
            console.error("Error saving contact/booking message:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isInitialized) return <div className="min-h-screen bg-pm-dark"></div>;
    
    const isBooking = inquiryType === 'booking';

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d\'information. L\'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={siteImages?.about}
            />

            <ParallaxHero
                image={siteImages?.about || ''}
                title="Contactez-nous"
                subtitle="Une question, un projet de collaboration ou une demande de booking ? Notre équipe est à votre écoute."
                height="h-[60vh]"
            />

            <div className="page-container -mt-20 relative z-20 space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Contact Info */}
                    <FadeIn delay={0.2} className="lg:col-span-1">
                        <div className="bg-black/90 backdrop-blur-md p-8 lg:p-10 border border-white/10 rounded-xl shadow-2xl h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-playfair text-white mb-8 border-b border-white/10 pb-4">Nos Coordonnées</h2>
                                <div className="space-y-8">
                                    <InfoItem icon={MapPinIcon} label="Adresse" text={contactInfo.address} />
                                    <InfoItem icon={PhoneIcon} label="Téléphone" text={contactInfo.phone} />
                                    <InfoItem icon={EnvelopeIcon} label="Email" text={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-lg font-bold text-pm-gold mb-6 uppercase tracking-widest">Suivez-nous</h3>
                                {socialLinks && (
                                    <div className="flex space-x-6">
                                        {socialLinks.facebook && <SocialLink href={socialLinks.facebook} icon={FacebookIcon} />}
                                        {socialLinks.instagram && <SocialLink href={socialLinks.instagram} icon={InstagramIcon} />}
                                        {socialLinks.youtube && <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Unified Form */}
                    <FadeIn delay={0.4} className="lg:col-span-2">
                        <div className="bg-pm-dark-light/90 backdrop-blur-md p-8 lg:p-10 border border-white/5 rounded-xl shadow-2xl">
                            <h2 className="text-3xl font-playfair text-pm-gold mb-6">Formulaire de contact</h2>
                            
                            {/* Inquiry Type Selector */}
                            <div className="mb-8 grid grid-cols-2 gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                                <button onClick={() => setInquiryType('general')} className={`px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-colors ${!isBooking ? 'bg-pm-gold text-pm-dark' : 'text-white/50 hover:bg-white/5'}`}>
                                    Message Général
                                </button>
                                <button onClick={() => setInquiryType('booking')} className={`px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-md transition-colors ${isBooking ? 'bg-pm-gold text-pm-dark' : 'text-white/50 hover:bg-white/5'}`}>
                                    Demande de Booking
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                                    <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                
                                {!isBooking ? (
                                    // Fields for General Contact
                                    <>
                                        <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                                        <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} required />
                                    </>
                                ) : (
                                    // Fields for Booking
                                    <>
                                        <FormInput label="Société (optionnel)" name="company" value={formData.company} onChange={handleChange} />
                                        <FormInput label="Mannequin(s) souhaité(s)" name="models" value={formData.models} onChange={handleChange} required />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label="Date de début" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                                            <FormInput label="Date de fin" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                                        </div>
                                        <FormTextArea label="Détails du projet" name="message" value={formData.message} onChange={handleChange} required />
                                    </>
                                )}

                                <div className="pt-4">
                                    <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-md transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                                        {status === 'loading' ? 'Envoi en cours...' : (isBooking ? 'Envoyer la demande de booking' : 'Envoyer le message')}
                                    </button>
                                </div>

                                {statusMessage && (
                                    <div className={`text-center text-sm p-4 rounded-md border ${status === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-red-900/20 border-red-500/30 text-red-300'}`}>
                                        {statusMessage}
                                    </div>
                                )}
                            </form>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

// Re-usable components from original file, can be kept as is or moved to a separate file.
const InfoItem: React.FC<{ icon: React.ElementType, label: string, text: string, href?: string }> = ({ icon: Icon, label, text, href }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-pm-gold/10 flex items-center justify-center group-hover:bg-pm-gold/20 transition-colors flex-shrink-0">
            <Icon className="w-6 h-6 text-pm-gold" />
        </div>
        <div>
            <span className="block text-xs uppercase tracking-widest text-pm-off-white/50 mb-1">{label}</span>
            {href ? <a href={href} className="text-white font-medium hover:text-pm-gold transition-colors">{text}</a> : <span className="text-white font-medium">{text}</span>}
        </div>
    </div>
);

const SocialLink: React.FC<{ href: string, icon: React.ElementType }> = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-pm-gold hover:border-pm-gold hover:text-pm-dark transition-all duration-300 group">
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </a>
);

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean }> = (props) => (
    <div className="group">
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/70 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label}</label>
        <input
            {...props}
            id={props.name}
            className="w-full bg-black/40 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold transition-all"
        />
    </div>
);

const FormTextArea: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean }> = (props) => (
    <div className="group">
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/70 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label}</label>
        <textarea
            {...props}
            id={props.name}
            rows={5}
            className="w-full bg-black/40 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold transition-all resize-none"
        />
    </div>
);

export default Contact;