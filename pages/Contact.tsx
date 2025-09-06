import React, { useState, useEffect } from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/icons/SocialIcons';
import BookingForm from '../components/BookingForm';

const Contact: React.FC = () => {
    const { data } = useData();
    const location = ReactRouterDOM.useLocation();
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

        // Mock submission for demonstration without a real backend
        setTimeout(() => {
            if (formData.email.includes('error')) {
                setStatus('error');
                setStatusMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            } else {
                setStatus('success');
                setStatusMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-16 lg:py-24 min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
            />
            <div className="container mx-auto px-6">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold mb-4">Contactez-nous</h1>
                    <p className="max-w-2xl mx-auto text-pm-off-white/80">
                        Une question, un projet de collaboration ou une demande de booking ? Notre équipe est à votre écoute.
                    </p>
                </div>

                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-6">Nos Coordonnées</h2>
                        {contactInfo && (
                            <div className="space-y-4 text-lg">
                                <InfoItem icon={MapPinIcon} text={contactInfo.address} />
                                <InfoItem icon={PhoneIcon} text={contactInfo.phone} />
                                <InfoItem icon={EnvelopeIcon} text={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                            </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-pm-gold/10">
                            <h3 className="text-xl font-bold text-pm-off-white mb-4">Suivez-nous</h3>
                            {socialLinks && (
                                <div className="flex space-x-6">
                                    {socialLinks.facebook && <SocialLink href={socialLinks.facebook} icon={FacebookIcon} />}
                                    {socialLinks.instagram && <SocialLink href={socialLinks.instagram} icon={InstagramIcon} />}
                                    {socialLinks.youtube && <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-6">Envoyez-nous un message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                            <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} required />
                            
                            <div>
                                <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </div>
                            
                            {statusMessage && (
                                <p className={`text-center text-sm p-3 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {statusMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="mt-16 max-w-6xl mx-auto">
                    <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-6 text-center">Demande de Booking</h2>
                        <p className="text-center text-pm-off-white/80 mb-8 -mt-4">
                            Pour un ou plusieurs mannequins, ou pour tout autre projet.
                        </p>
                        <BookingForm />
                    </div>
                </div>

            </div>
        </div>
    );
};

const InfoItem: React.FC<{icon: React.ElementType, text: string, href?: string}> = ({ icon: Icon, text, href }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-pm-gold mt-1 flex-shrink-0" />
        {href ? <a href={href} className="hover:text-pm-gold transition-colors">{text}</a> : <span>{text}</span>}
    </div>
);

const SocialLink: React.FC<{ href: string, icon: React.ElementType }> = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors">
        <Icon className="w-8 h-8" />
    </a>
);

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-off-white/70 mb-2">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-off-white/70 mb-2">{props.label}</label>
        <textarea {...props} id={props.name} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default Contact;