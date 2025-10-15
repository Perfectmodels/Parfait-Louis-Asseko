import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
import { ContactMessage, BookingRequest } from '../types';

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;
    
    // Unified form: message or booking
    const [formType, setFormType] = useState<'message' | 'booking'>('message');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        clientCompany: '',
        requestedModels: '',
        startDate: '',
        endDate: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        const model = params.get('model');
        if (service) {
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}` }));
        }
        if (model) {
            setFormData(prev => ({ ...prev, requestedModels: model }));
            setFormType('booking');
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
            if (formType === 'booking') {
                const newRequest: BookingRequest = {
                    id: `booking-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    clientName: formData.name,
                    clientEmail: formData.email,
                    clientCompany: formData.clientCompany,
                    requestedModels: formData.requestedModels,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    message: formData.message,
                };
                const updatedRequests = [...(data.bookingRequests || []), newRequest];
                await saveData({ ...data, bookingRequests: updatedRequests });
                setStatus('success');
                setStatusMessage('Demande de booking envoyée ! Notre équipe vous contactera prochainement.');
            } else {
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
                setStatus('success');
                setStatusMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            }

            setFormData({ name: '', email: '', subject: '', message: '', clientCompany: '', requestedModels: '', startDate: '', endDate: '' });
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
            console.error("Error saving contact submission:", error);
        }
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
                image={data?.siteImages.about}
            />
            <div className="container mx-auto px-6">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold mb-4">Contactez-nous</h1>
                    <p className="max-w-2xl mx-auto text-pm-off-white/80">
                        Une question, un projet de collaboration ou une demande de booking ? Notre équipe est à votre écoute.
                    </p>
                </div>

                <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg lg:col-span-1">
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

                    {/* Unified Form: Message or Booking */}
                    <div className="lg:col-span-2">
                      <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <h2 className="text-3xl font-playfair text-pm-gold">Nous Contacter</h2>
                          <div className="ml-auto flex items-center gap-2 text-sm">
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" name="formType" value="message" checked={formType==='message'} onChange={() => setFormType('message')} />
                              Message
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" name="formType" value="booking" checked={formType==='booking'} onChange={() => setFormType('booking')} />
                              Booking
                            </label>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                          </div>

                          {formType === 'booking' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormInput label="Société (optionnel)" name="clientCompany" value={formData.clientCompany} onChange={handleChange} />
                              <FormInput label="Mannequin(s) souhaité(s)" name="requestedModels" value={formData.requestedModels} onChange={handleChange} required={formType==='booking'} />
                            </div>
                          )}

                          <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required={formType==='message'} />

                          {formType === 'booking' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormInput label="Date de début (souhaitée)" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                              <FormInput label="Date de fin (souhaitée)" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                            </div>
                          )}

                          <FormTextArea label={formType==='booking' ? 'Détails du projet' : 'Votre Message'} name="message" value={formData.message} onChange={handleChange} required />

                          <div className="flex justify-end">
                            <button type="submit" disabled={status === 'loading'} className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                              {status === 'loading' ? 'Envoi en cours...' : (formType==='booking' ? 'Envoyer la demande' : 'Envoyer')}
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
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-5xl mx-auto">
                  <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-playfair text-pm-gold mb-6 text-center">FAQ</h2>
                    <p className="text-center text-pm-off-white/70 mb-8">Les réponses aux questions fréquentes.</p>
                    <div className="divide-y divide-pm-gold/10">
                      {(data?.faqData || []).slice(0, 6).map((cat) => (
                        <div key={cat.category} className="py-4">
                          <h3 className="text-xl font-semibold text-pm-gold mb-2">{cat.category}</h3>
                          <ul className="space-y-2">
                            {cat.items.slice(0, 3).map((item, idx) => (
                              <li key={idx}>
                                <details className="group">
                                  <summary className="cursor-pointer list-none flex justify-between items-center py-2 text-pm-off-white/90">
                                    <span className="font-medium">{item.question}</span>
                                    <span className="text-pm-gold group-open:rotate-45 transition-transform">+</span>
                                  </summary>
                                  <p className="text-pm-off-white/70 pl-0 md:pl-4 mt-1">{item.answer}</p>
                                </details>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
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