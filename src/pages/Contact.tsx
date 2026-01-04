import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, PaperAirplaneIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
import { ContactMessage, BookingRequest } from '../types';
import Button from '../components/ui/Button';
import { sendEmail } from '../services/emailService';

// --- Sub-components ---

const ContactHero: React.FC<{ image: string }> = ({ image }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={ref} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            <motion.div
                style={{ y, backgroundImage: `url('${image}')` }}
                className="absolute inset-0 bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            <div className="relative z-10 text-center px-4">
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="block text-pm-gold uppercase tracking-[0.3em] mb-4 text-sm font-bold"
                >
                    Nous sommes à votre écoute
                </motion.span>
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-playfair text-white mb-6"
                >
                    Contactez-nous
                </motion.h1>
            </div>
        </div>
    );
};

const ContactInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="relative group">
        <input
            {...props}
            className="w-full bg-transparent border-b border-white/20 py-4 text-lg text-white placeholder-transparent focus:outline-none focus:border-pm-gold transition-colors peer"
            placeholder={label}
        />
        <label
            className="absolute left-0 top-4 text-gray-500 text-lg transition-all duration-300 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pm-gold peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400"
        >
            {label}
        </label>
        <div className="absolute bottom-0 left-0 w-0 h-px bg-pm-gold transition-all duration-500 group-hover:w-full peer-focus:w-full" />
    </div>
);

const ContactTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="relative group">
        <textarea
            {...props}
            rows={4}
            className="w-full bg-transparent border-b border-white/20 py-4 text-lg text-white placeholder-transparent focus:outline-none focus:border-pm-gold transition-colors peer resize-none"
            placeholder={label}
        />
        <label
            className="absolute left-0 top-4 text-gray-500 text-lg transition-all duration-300 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pm-gold peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400"
        >
            {label}
        </label>
        <div className="absolute bottom-0 left-0 w-0 h-px bg-pm-gold transition-all duration-500 group-hover:w-full peer-focus:w-full" />
    </div>
);

const InfoCard: React.FC<{ icon: any, title: string, content: React.ReactNode, delay: number }> = ({ icon: Icon, title, content, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm hover:border-pm-gold/30 transition-colors group"
    >
        <div className="w-12 h-12 bg-pm-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-pm-gold group-hover:text-black transition-colors text-pm-gold">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-playfair text-white mb-2">{title}</h3>
        <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {content}
        </div>
    </motion.div>
);

// --- Main Component ---

const Contact: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const location = useLocation();

    // Safety check
    const contactInfo = data?.contactInfo || { address: "Libreville, Gabon", phone: "+241 00 00 00 00", email: "contact@example.com" };
    const socialLinks = data?.socialLinks;

    // Form State
    const [requestType, setRequestType] = useState<'general' | 'booking' | 'partnership'>('general');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        company: '',
        requestedModels: '',
        startDate: '',
        endDate: '',
        projectDetails: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        if (service) {
            setRequestType('booking');
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}`, projectDetails: `Demande concernant le service : ${service}` }));
        }
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données.');
            return;
        }

        try {
            let emailSubject = '';
            let emailContent = '';

            if (requestType === 'booking') {
                const newBooking: BookingRequest = {
                    id: `booking-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    clientName: formData.name,
                    clientEmail: formData.email,
                    clientCompany: formData.company,
                    requestedModels: formData.requestedModels || 'Non spécifié',
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    message: formData.message + (formData.projectDetails ? `\n\nDétails: ${formData.projectDetails}` : '')
                };
                const updatedBookings = [...(data.bookingRequests || []), newBooking];
                await saveData({ ...data, bookingRequests: updatedBookings });

                emailSubject = `Nouvelle demande de Booking : ${formData.name}`;
                emailContent = `
                    <h1>Nouvelle demande de Booking</h1>
                    <p><strong>Nom:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Société:</strong> ${formData.company || 'Non spécifié'}</p>
                    <p><strong>Mannequins souhaités:</strong> ${formData.requestedModels}</p>
                    <p><strong>Dates:</strong> ${formData.startDate} - ${formData.endDate}</p>
                    <h2>Message / Détails :</h2>
                    <p>${formData.message}</p>
                    ${formData.projectDetails ? `<p><strong>Détails supplémentaires:</strong> ${formData.projectDetails}</p>` : ''}
                `;
            } else {
                const newMessage: ContactMessage = {
                    id: `contact-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    name: formData.name,
                    email: formData.email,
                    subject: requestType === 'partnership' ? 'Demande de Partenariat' : formData.subject,
                    message: formData.message
                };
                const updatedMessages = [...(data.contactMessages || []), newMessage];
                await saveData({ ...data, contactMessages: updatedMessages });

                emailSubject = `Nouveau message contact : ${newMessage.subject}`;
                emailContent = `
                    <h1>Nouveau message de contact</h1>
                    <p><strong>Nom:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Sujet:</strong> ${newMessage.subject}</p>
                    <h2>Message :</h2>
                    <p>${formData.message}</p>
                `;
            }

            // Send Email Notification
            if (data.apiKeys?.brevoApiKey) {
                await sendEmail({
                    to: [{ email: data.contactInfo.notificationEmail || 'contact@perfectmodels.ga', name: 'Perfect Models Admin' }],
                    subject: emailSubject,
                    htmlContent: emailContent,
                    apiKey: data.apiKeys.brevoApiKey,
                    sender: { email: 'notifications@perfectmodels.ga', name: 'Site Web PMM' }
                });
            }

            setStatus('success');
            setStatusMessage('Votre demande a été envoyée avec succès !');
            setFormData({
                name: '', email: '', subject: '', message: '',
                company: '', requestedModels: '', startDate: '', endDate: '', projectDetails: ''
            });
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue. Veuillez réessayer.');
            console.error("Error saving message:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isInitialized) return null;

    return (
        <div className="bg-black min-h-screen text-white selection:bg-pm-gold selection:text-black">
            <SEO
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information."
                keywords="contact, agence mannequin, booking, libreville"
                image={data?.siteImages.contact}
            />

            <ContactHero image={data?.siteImages.contact || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80'} />

            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Column: Contact Info */}
                    <div className="lg:w-1/3 space-y-8">
                        <div>
                            <h2 className="section-title text-left mb-6">Nos Coordonnées</h2>
                            <p className="text-gray-400 mb-8">
                                Une question ou un projet ? Choisissez le type de demande ci-contre et contactez-nous.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <InfoCard icon={MapPinIcon} title="Adresse" content={contactInfo.address} delay={0.1} />
                            <InfoCard icon={PhoneIcon} title="Téléphone" content={contactInfo.phone} delay={0.2} />
                            <InfoCard icon={EnvelopeIcon} title="Email" content={<a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold transition-colors">{contactInfo.email}</a>} delay={0.3} />
                        </div>
                        <div className="pt-8 border-t border-white/10">
                            <h3 className="text-lg font-playfair text-white mb-4">Réseaux Sociaux</h3>
                            <div className="flex gap-4">
                                {socialLinks?.facebook && <a href={socialLinks.facebook} className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-all hover:scale-110"><FacebookIcon className="w-5 h-5" /></a>}
                                {socialLinks?.instagram && <a href={socialLinks.instagram} className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-all hover:scale-110"><InstagramIcon className="w-5 h-5" /></a>}
                                {socialLinks?.youtube && <a href={socialLinks.youtube} className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-all hover:scale-110"><YoutubeIcon className="w-5 h-5" /></a>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Unified Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-2/3 bg-pm-dark/50 p-8 md:p-12 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl shadow-black/50"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-pm-gold" />
                            <h2 className="text-2xl font-playfair text-white">Nous écrire</h2>
                        </div>

                        {/* Request Type Selector */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            {[
                                { id: 'general', label: 'Renseignement' },
                                { id: 'booking', label: 'Booking / Devis' },
                                { id: 'partnership', label: 'Partenariat' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setRequestType(type.id as any)}
                                    className={`px-6 py-2 rounded-full border transition-all duration-300 ${requestType === type.id
                                        ? 'bg-pm-gold text-black border-pm-gold font-bold shadow-lg shadow-pm-gold/20'
                                        : 'bg-transparent text-gray-400 border-white/20 hover:border-pm-gold hover:text-white'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Common Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ContactInput
                                    label="Votre Nom Complet"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <ContactInput
                                    label="Votre Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Booking Specific Fields */}
                            {requestType === 'booking' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-8 overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ContactInput
                                            label="Nom de la Société (Optionnel)"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                        <ContactInput
                                            label="Mannequin(s) souhaité(s)"
                                            name="requestedModels"
                                            value={formData.requestedModels}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative group">
                                            <label className="block text-gray-400 text-sm mb-2">Date de début</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border-b border-white/20 py-2 text-white focus:outline-none focus:border-pm-gold transition-colors"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label className="block text-gray-400 text-sm mb-2">Date de fin</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border-b border-white/20 py-2 text-white focus:outline-none focus:border-pm-gold transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Subject Field */}
                            {requestType === 'general' && (
                                <ContactInput
                                    label="Sujet"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            )}

                            <ContactTextArea
                                label={requestType === 'booking' ? "Détails du projet" : "Votre Message"}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />

                            <div className="pt-4 flex items-center justify-between">
                                <Button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    isLoading={status === 'loading'}
                                    icon={!status.startsWith('load') && <PaperAirplaneIcon className="w-5 h-5" />}
                                    className="w-full md:w-auto min-w-[180px]"
                                >
                                    Envoyer
                                </Button>

                                {statusMessage && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}
                                    >
                                        {statusMessage}
                                    </motion.span>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
