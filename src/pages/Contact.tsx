import React, { useState, useEffect } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { useLocation } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/icons/SocialIcons';
<<<<<<< HEAD
import { ContactMessage, BookingRequest } from '../../types';
=======
import BookingForm from '../components/BookingForm';
import { ContactMessage } from '../types';
>>>>>>> a8e58ab7aa3753140508b09c699d8ac17bcd2b6a

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;
    
    const [purpose, setPurpose] = useState<'message' | 'booking'>('message');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [bookingForm, setBookingForm] = useState({ clientName: '', clientEmail: '', clientCompany: '', requestedModels: '', startDate: '', endDate: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        if (service) {
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}` }));
            setBookingForm(prev => ({ ...prev, requestedModels: service }));
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
            if (purpose === 'message') {
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
                setFormData({ name: '', email: '', subject: '', message: '' });
                setStatus('success');
                setStatusMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            } else {
                const newRequest: BookingRequest = {
                    id: `booking-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    clientName: bookingForm.clientName || formData.name,
                    clientEmail: bookingForm.clientEmail || formData.email,
                    clientCompany: bookingForm.clientCompany,
                    requestedModels: bookingForm.requestedModels,
                    startDate: bookingForm.startDate,
                    endDate: bookingForm.endDate,
                    message: bookingForm.message || formData.message,
                } as BookingRequest;
                const updatedRequests = [...(data.bookingRequests || []), newRequest];
                await saveData({ ...data, bookingRequests: updatedRequests });
                setBookingForm({ clientName: '', clientEmail: '', clientCompany: '', requestedModels: '', startDate: '', endDate: '', message: '' });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setStatus('success');
                setStatusMessage('Votre demande de booking a été envoyée. Notre équipe vous recontactera rapidement.');
            }
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-16 lg:py-24 min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
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

                    {/* Formulaire unifié: Contact & Booking */}
                    <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-6">Contact & Booking</h2>

                        {/* Type de demande */}
                        <div className="flex gap-3 mb-6" role="tablist" aria-label="Type de demande">
                            <button type="button" onClick={() => setPurpose('message')} aria-selected={purpose==='message'} className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest border transition-colors ${purpose==='message' ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'bg-transparent text-pm-gold border-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}>Message</button>
                            <button type="button" onClick={() => setPurpose('booking')} aria-selected={purpose==='booking'} className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest border transition-colors ${purpose==='booking' ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'bg-transparent text-pm-gold border-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}>Booking</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Champs communs */}
                            <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                            {purpose === 'message' ? (
                                <>
                                  <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                                  <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} required />
                                </>
                            ) : (
                                <>
                                  <FormInput label="Société (optionnel)" name="clientCompany" value={bookingForm.clientCompany} onChange={handleBookingChange} />
                                  <FormInput label="Mannequin(s) souhaité(s)" name="requestedModels" value={bookingForm.requestedModels} onChange={handleBookingChange} required />
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput label="Date de début (souhaitée)" name="startDate" type="date" value={bookingForm.startDate} onChange={handleBookingChange} />
                                    <FormInput label="Date de fin (souhaitée)" name="endDate" type="date" value={bookingForm.endDate} onChange={handleBookingChange} />
                                  </div>
                                  <FormTextArea label="Votre Message / Détails du projet" name="message" value={bookingForm.message} onChange={handleBookingChange} required />
                                </>
                            )}

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

                {/* FAQ Contact */}
                <section className="content-section mt-12 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-playfair text-pm-gold mb-4">FAQ Contact & Booking</h2>
                    <ul className="space-y-4 text-sm text-pm-off-white/80">
                        <li>
                          <p className="font-bold text-pm-off-white">Sous quel délai répondez-vous ?</p>
                          <p>Nous répondons généralement sous 24 à 48h ouvrées. Pour les urgences, privilégiez l'appel téléphonique.</p>
                        </li>
                        <li>
                          <p className="font-bold text-pm-off-white">Comment suivre ma demande de booking ?</p>
                          <p>Une fois votre demande envoyée, vous recevrez un email de confirmation. Nous vous recontacterons si des précisions sont nécessaires.</p>
                        </li>
                        <li>
                          <p className="font-bold text-pm-off-white">Puis-je réserver plusieurs mannequins ?</p>
                          <p>Oui. Précisez le nombre de profils souhaités et le type de prestation (défilé, shooting, événement...).</p>
                        </li>
                        <li>
                          <p className="font-bold text-pm-off-white">Avez-vous des tarifs publics ?</p>
                          <p>Nos tarifs sont adaptés à chaque projet (durée, diffusion, droits à l'image). Demandez un devis pour une estimation personnalisée.</p>
                        </li>
                    </ul>
                </section>
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
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} id={props.name} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default Contact;
