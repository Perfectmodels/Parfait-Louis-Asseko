import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  PaperAirplaneIcon,
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
import { ContactMessage, BookingRequest } from '../types';

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;
    const models = data?.models || [];
    
    const [formType, setFormType] = useState<'contact' | 'booking'>('contact');
    const [formData, setFormData] = useState({
        // Contact fields
        name: '',
        email: '',
        subject: '',
        message: '',
        // Booking fields
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        requestedModels: '',
        startDate: '',
        endDate: '',
        bookingMessage: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        const type = params.get('type');
        
        if (service) {
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}` }));
        }
        
        if (type === 'booking') {
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
            if (formType === 'contact') {
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
            } else {
                const newBookingRequest: BookingRequest = {
                    id: `booking-${Date.now()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Nouveau',
                    clientName: formData.clientName,
                    clientEmail: formData.clientEmail,
                    clientCompany: formData.clientCompany,
                    requestedModels: formData.requestedModels,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    message: formData.bookingMessage,
                };

                const updatedRequests = [...(data.bookingRequests || []), newBookingRequest];
                await saveData({ ...data, bookingRequests: updatedRequests });
                
                setStatus('success');
                setStatusMessage('Demande de booking envoyée ! Notre équipe vous contactera prochainement.');
            }
            
            // Reset form
            setFormData({
                name: '', email: '', subject: '', message: '',
                clientName: '', clientEmail: '', clientCompany: '', requestedModels: '',
                startDate: '', endDate: '', bookingMessage: ''
            });
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
            console.error("Error saving form:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
            />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 via-transparent to-pm-gold/5"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/20 rounded-full mb-6">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-pm-gold" />
                            <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                                Contactez-nous
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair text-pm-gold mb-6 tracking-wider">
                            Nous Sommes à Votre Écoute
                        </h1>
                        
                        <p className="text-xl text-pm-off-white/90 mb-8 leading-relaxed">
                            Une question, un projet de collaboration ou une demande de booking ? Notre équipe d'experts est là pour vous accompagner dans tous vos projets.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 space-y-20 lg:space-y-28">

                {/* Contact Information Cards */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Nos Coordonnées</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <ContactCard
                                icon={MapPinIcon}
                                title="Adresse"
                                content={contactInfo?.address || "Libreville, Gabon"}
                                description="Notre agence principale"
                            />
                            <ContactCard
                                icon={PhoneIcon}
                                title="Téléphone"
                                content={contactInfo?.phone || "+241 XX XX XX XX"}
                                description="Appelez-nous directement"
                                href={`tel:${contactInfo?.phone || ''}`}
                            />
                            <ContactCard
                                icon={EnvelopeIcon}
                                title="Email"
                                content={contactInfo?.email || "contact@perfectmodelsmanagement.ga"}
                                description="Écrivez-nous un message"
                                href={`mailto:${contactInfo?.email || ''}`}
                            />
                            <ContactCard
                                icon={ClockIcon}
                                title="Horaires"
                                content="Lun - Ven: 9h - 18h"
                                description="Samedi: 9h - 14h"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Unified Form Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Envoyez-nous un Message</h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-2xl p-8 lg:p-12">
                                
                                {/* Form Type Selector */}
                                <div className="flex justify-center mb-8">
                                    <div className="bg-pm-dark/50 p-1 rounded-full border border-pm-gold/20">
                                        <button
                                            type="button"
                                            onClick={() => setFormType('contact')}
                                            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                                formType === 'contact'
                                                    ? 'bg-pm-gold text-pm-dark'
                                                    : 'text-pm-off-white/70 hover:text-pm-gold'
                                            }`}
                                        >
                                            <InformationCircleIcon className="w-4 h-4 inline mr-2" />
                                            Contact Général
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormType('booking')}
                                            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                                formType === 'booking'
                                                    ? 'bg-pm-gold text-pm-dark'
                                                    : 'text-pm-off-white/70 hover:text-pm-gold'
                                            }`}
                                        >
                                            <UserGroupIcon className="w-4 h-4 inline mr-2" />
                                            Demande de Booking
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {formType === 'contact' ? (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <FormInput 
                                                    label="Votre Nom Complet" 
                                                    name="name" 
                                                    value={formData.name} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                                <FormInput 
                                                    label="Votre Email" 
                                                    name="email" 
                                                    type="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            <FormInput 
                                                label="Sujet" 
                                                name="subject" 
                                                value={formData.subject} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                            <FormTextArea 
                                                label="Votre Message" 
                                                name="message" 
                                                value={formData.message} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <FormInput 
                                                    label="Votre Nom Complet" 
                                                    name="clientName" 
                                                    value={formData.clientName} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                                <FormInput 
                                                    label="Votre Email" 
                                                    name="clientEmail" 
                                                    type="email" 
                                                    value={formData.clientEmail} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            <FormInput 
                                                label="Société (optionnel)" 
                                                name="clientCompany" 
                                                value={formData.clientCompany} 
                                                onChange={handleChange} 
                                            />
                                            <FormSelect
                                                label="Mannequin(s) souhaité(s)"
                                                name="requestedModels"
                                                value={formData.requestedModels}
                                                onChange={handleChange}
                                                options={[
                                                    { value: '', label: 'Sélectionnez un mannequin' },
                                                    ...models.filter(m => m.isPublic).map(model => ({
                                                        value: model.name,
                                                        label: model.name
                                                    })),
                                                    { value: 'multiple', label: 'Plusieurs mannequins' },
                                                    { value: 'custom', label: 'Autre (préciser dans le message)' }
                                                ]}
                                                required
                                            />
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <FormInput 
                                                    label="Date de début souhaitée" 
                                                    name="startDate" 
                                                    type="date" 
                                                    value={formData.startDate} 
                                                    onChange={handleChange} 
                                                />
                                                <FormInput 
                                                    label="Date de fin souhaitée" 
                                                    name="endDate" 
                                                    type="date" 
                                                    value={formData.endDate} 
                                                    onChange={handleChange} 
                                                />
                                            </div>
                                            <FormTextArea 
                                                label="Détails du projet / Message" 
                                                name="bookingMessage" 
                                                value={formData.bookingMessage} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </>
                                    )}
                                    
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="pt-4"
                                    >
                                        <button 
                                            type="submit" 
                                            disabled={status === 'loading'} 
                                            className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-pm-dark border-t-transparent rounded-full animate-spin"></div>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <PaperAirplaneIcon className="w-5 h-5" />
                                                    {formType === 'contact' ? 'Envoyer le message' : 'Envoyer la demande de booking'}
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                    
                                    {statusMessage && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-center gap-3 p-4 rounded-lg ${
                                                status === 'success' 
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}
                                        >
                                            {status === 'success' ? (
                                                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                                            )}
                                            <span className="text-sm">{statusMessage}</span>
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* FAQ Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Questions Fréquentes</h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-8">
                                <FAQItem
                                    question="Combien de temps faut-il pour recevoir une réponse ?"
                                    answer="Nous nous efforçons de répondre à tous les messages dans les 24 heures ouvrées. Pour les demandes urgentes, n'hésitez pas à nous appeler directement."
                                />
                                <FAQItem
                                    question="Quels sont vos tarifs sur devis pour un booking ?"
                                    answer="Nos tarifs sur devis varient selon le type de projet, la durée et les mannequins demandés. Contactez-nous pour un devis personnalisé adapté à vos besoins."
                                />
                                <FAQItem
                                    question="Proposez-vous des services de formation ?"
                                    answer="Oui, nous proposons des formations complètes pour les mannequins débutants et avancés. Consultez notre section formations pour plus d'informations."
                                />
                                <FAQItem
                                    question="Travaillez-vous avec des clients internationaux ?"
                                    answer="Absolument ! Nous collaborons avec des clients du monde entier. Nous pouvons organiser des déplacements et des shootings internationaux."
                                />
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Social Media Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Suivez-nous sur les Réseaux</h2>
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="text-pm-off-white/80 mb-8 text-lg">
                                Restez connecté avec nous pour découvrir nos dernières actualités, 
                                les portfolios de nos mannequins et nos événements exclusifs.
                            </p>
                            {socialLinks && (
                                <div className="flex justify-center space-x-8">
                                    {socialLinks.facebook && (
                                        <SocialLink href={socialLinks.facebook} icon={FacebookIcon} label="Facebook" />
                                    )}
                                    {socialLinks.instagram && (
                                        <SocialLink href={socialLinks.instagram} icon={InstagramIcon} label="Instagram" />
                                    )}
                                    {socialLinks.youtube && (
                                        <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} label="YouTube" />
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </section>

            </div>
        </div>
    );
};

// Contact Card Component
const ContactCard: React.FC<{
    icon: React.ElementType;
    title: string;
    content: string;
    description: string;
    href?: string;
}> = ({ icon: Icon, title, content, description, href }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-6 text-center hover:border-pm-gold transition-all duration-300 group"
    >
        <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pm-gold/30 transition-colors duration-300">
            <Icon className="w-8 h-8 text-pm-gold" />
        </div>
        <h3 className="text-xl font-playfair text-pm-gold mb-2">{title}</h3>
        {href ? (
            <a href={href} className="text-pm-off-white hover:text-pm-gold transition-colors font-medium">
                {content}
            </a>
        ) : (
            <p className="text-pm-off-white font-medium">{content}</p>
        )}
        <p className="text-pm-off-white/60 text-sm mt-2">{description}</p>
    </motion.div>
);

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-6 hover:border-pm-gold transition-all duration-300"
    >
        <h3 className="text-lg font-semibold text-pm-gold mb-3">{question}</h3>
        <p className="text-pm-off-white/80 leading-relaxed">{answer}</p>
    </motion.div>
);

// Enhanced Social Link Component
const SocialLink: React.FC<{ href: string; icon: React.ElementType; label: string }> = ({ href, icon: Icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center group-hover:bg-pm-gold/30 transition-colors duration-300">
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium">{label}</span>
    </motion.a>
);

// Form Components
const FormInput: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} id={props.name} rows={5} className="admin-input admin-textarea" />
    </div>
);

const FormSelect: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
}> = ({ label, name, value, onChange, options, required }) => (
    <div>
        <label htmlFor={name} className="admin-label">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="admin-input"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default Contact;