import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import ModernTabs from '../components/ModernTabs';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
import { ContactMessage } from '../types';

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const contactInfo = data?.contactInfo;
    const socialLinks = data?.socialLinks;
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '',
        subject: '', 
        message: '',
        serviceType: 'general',
        projectDate: '',
        budget: '',
        location: '',
        additionalInfo: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'team'>('contact');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    
    // FAQ Data
    const faqData = [
        {
            question: "Comment puis-je réserver un mannequin ?",
            answer: "Vous pouvez réserver un mannequin via notre formulaire de booking en ligne, par téléphone ou par email. Nous vous répondrons dans les 24h pour confirmer la disponibilité et discuter des détails de votre projet."
        },
        {
            question: "Quels sont vos tarifs ?",
            answer: "Nos tarifs varient selon le type de projet, la durée, et le mannequin choisi. Contactez-nous pour un devis personnalisé adapté à votre budget et vos besoins spécifiques."
        },
        {
            question: "Proposez-vous des formations ?",
            answer: "Oui ! Nous proposons des formations complètes via notre PMM Classroom, incluant les techniques de podium, la photographie, et le développement personnel. Consultez notre page formations pour plus d'informations."
        },
        {
            question: "Travaillez-vous avec des créateurs internationaux ?",
            answer: "Absolument ! Nous collaborons avec des créateurs et marques du Gabon, d'Afrique et d'ailleurs. Nous organisons également des déplacements pour nos mannequins selon les projets."
        },
        {
            question: "Comment devenir mannequin chez PMM ?",
            answer: "Rejoignez-nous via notre formulaire de casting en ligne. Nous recherchons des talents diversifiés, motivés et prêts à s'investir dans leur développement professionnel."
        },
        {
            question: "Quels sont vos horaires d'ouverture ?",
            answer: "Notre bureau est ouvert du lundi au vendredi de 9h à 18h, et le samedi de 9h à 14h. Pour les urgences, vous pouvez nous contacter 24h/24 via WhatsApp."
        }
    ];

    // Team Data
    const teamData = [
        {
            name: "Parfait Asseko",
            role: "Fondateur & Directeur",
            description: "Visionnaire de la mode gabonaise, Parfait a créé PMM pour élever les standards du mannequinat en Afrique Centrale.",
            image: "https://i.ibb.co/3WfK9Xg/about-img.jpg"
        },
        {
            name: "Équipe Artistique",
            role: "Direction Créative",
            description: "Nos directeurs artistiques accompagnent chaque mannequin dans son développement et sa carrière.",
            image: "https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg"
        },
        {
            name: "Service Client",
            role: "Relations Clients",
            description: "Notre équipe dédiée vous accompagne dans tous vos projets et répond à vos besoins spécifiques.",
            image: "https://i.ibb.co/s5zW7gZ/testimonial-1.jpg"
        }
    ];
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        if (service) {
            setFormData(prev => ({ ...prev, subject: `Demande de devis pour : ${service}` }));
        }
    }, [location.search]);

    // Form validation - only on submit
    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!formData.name.trim()) errors.name = 'Le nom est requis';
        if (!formData.email.trim()) {
            errors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'L\'email n\'est pas valide';
        }
        if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
        if (!formData.subject.trim()) errors.subject = 'Le sujet est requis';
        if (!formData.message.trim()) errors.message = 'Le message est requis';
        
        // Validation conditionnelle selon le type de service
        if (formData.serviceType === 'booking') {
            if (!formData.projectDate.trim()) errors.projectDate = 'La date du projet est requise';
            if (!formData.budget.trim()) errors.budget = 'Le budget est requis';
        }
        
        return errors;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setStatus('error');
            setStatusMessage('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        setStatus('loading');
        setStatusMessage('');
        setFormErrors({});

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
            setFormData({ 
                name: '', 
                email: '', 
                phone: '',
                subject: '', 
                message: '',
                serviceType: 'general',
                projectDate: '',
                budget: '',
                location: '',
                additionalInfo: ''
            });
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
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
            />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pm-dark via-black to-pm-dark">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 0L35 20L55 20L40 30L45 50L30 40L15 50L20 30L5 20L25 20Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-pm-gold/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-20 w-40 h-40 bg-pm-gold/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pm-gold/4 rounded-full blur-2xl animate-pulse delay-2000"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-pm-gold/10 border border-pm-gold/30 rounded-full px-6 py-3 text-pm-gold text-sm font-semibold"
                        >
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            Service Client Premium
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-playfair text-pm-off-white leading-tight"
                        >
                            <span className="block">Contactez</span>
                            <span className="block text-pm-gold">Notre Équipe</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl md:text-2xl text-pm-off-white/80 max-w-3xl mx-auto leading-relaxed"
                        >
                            Une question, un projet de collaboration ou une demande de booking ? 
                            Notre équipe experte est à votre écoute pour vous accompagner.
                        </motion.p>

                        {/* Contact Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-pm-gold">24h</div>
                                <div className="text-pm-off-white/70">Réponse garantie</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-pm-gold">100%</div>
                                <div className="text-pm-off-white/70">Personnalisé</div>
                            </div>
                <div className="text-center">
                                <div className="text-3xl font-bold text-pm-gold">5★</div>
                                <div className="text-pm-off-white/70">Satisfaction</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-pm-gold/50 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-3 bg-pm-gold rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </section>
            
            <div className="page-container relative z-10">
                {/* Navigation Tabs */}
                <ModernTabs
                    tabs={[
                        { id: 'contact', label: 'Contact & Booking', icon: ChatBubbleLeftRightIcon },
                        { id: 'faq', label: 'FAQ', icon: QuestionMarkCircleIcon },
                        { id: 'team', label: 'Équipe', icon: UserGroupIcon }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as any)}
                    className="pt-16"
                />

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-16"
                        >
                            {/* Contact Info & Form */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 shadow-lg"
                                >
                                    <h2 className="text-3xl font-playfair text-pm-gold mb-8 flex items-center gap-3">
                                        <InformationCircleIcon className="w-8 h-8" />
                                        Nos Coordonnées
                                    </h2>
                                    
                        {contactInfo && (
                                        <div className="space-y-6 mb-8">
                                            <ContactInfoCard 
                                                icon={MapPinIcon} 
                                                title="Adresse" 
                                                content={contactInfo.address}
                                                color="blue"
                                            />
                                            <ContactInfoCard 
                                                icon={PhoneIcon} 
                                                title="Téléphone" 
                                                content={contactInfo.phone}
                                                href={`tel:${contactInfo.phone}`}
                                                color="green"
                                            />
                                            <ContactInfoCard 
                                                icon={EnvelopeIcon} 
                                                title="Email" 
                                                content={contactInfo.email}
                                                href={`mailto:${contactInfo.email}`}
                                                color="purple"
                                            />
                            </div>
                        )}

                                    {/* Business Hours */}
                                    <div className="bg-pm-gold/10 border border-pm-gold/30 rounded-xl p-6 mb-8">
                                        <h3 className="text-xl font-playfair text-pm-gold mb-4 flex items-center gap-2">
                                            <ClockIcon className="w-6 h-6" />
                                            Horaires d'ouverture
                                        </h3>
                                        <div className="space-y-2 text-pm-off-white/80">
                                            <div className="flex justify-between">
                                                <span>Lun - Ven</span>
                                                <span className="text-pm-gold">9h - 18h</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Samedi</span>
                                                <span className="text-pm-gold">9h - 14h</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Dimanche</span>
                                                <span className="text-red-400">Fermé</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="border-t border-pm-gold/20 pt-6">
                                        <h3 className="text-xl font-bold text-pm-off-white mb-4 flex items-center gap-2">
                                            <GlobeAltIcon className="w-6 h-6" />
                                            Suivez-nous
                                        </h3>
                            {socialLinks && (
                                            <div className="flex space-x-4">
                                                {socialLinks.facebook && <EnhancedSocialLink href={socialLinks.facebook} icon={FacebookIcon} platform="Facebook" />}
                                                {socialLinks.instagram && <EnhancedSocialLink href={socialLinks.instagram} icon={InstagramIcon} platform="Instagram" />}
                                                {socialLinks.youtube && <EnhancedSocialLink href={socialLinks.youtube} icon={YoutubeIcon} platform="YouTube" />}
                                </div>
                            )}
                        </div>
                                </motion.div>

                                {/* Unified Contact & Booking Form */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 shadow-lg"
                                >
                                    <h2 className="text-3xl font-playfair text-pm-gold mb-8 flex items-center gap-3">
                                        <PaperAirplaneIcon className="w-8 h-8" />
                                        Contact & Booking
                                    </h2>
                                    
                        <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Service Type Selection */}
                            <div>
                                            <label className="block text-sm font-medium text-pm-gold mb-3">
                                                Type de demande <span className="text-red-400">*</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, serviceType: 'general' }))}
                                                    className={`p-3 rounded-lg border transition-all duration-300 ${
                                                        formData.serviceType === 'general'
                                                            ? 'border-pm-gold bg-pm-gold/10 text-pm-gold'
                                                            : 'border-pm-gold/30 text-pm-off-white/70 hover:border-pm-gold/50'
                                                    }`}
                                                >
                                                    <ChatBubbleLeftRightIcon className="w-5 h-5 mx-auto mb-1" />
                                                    <span className="text-sm font-medium">Contact général</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, serviceType: 'booking' }))}
                                                    className={`p-3 rounded-lg border transition-all duration-300 ${
                                                        formData.serviceType === 'booking'
                                                            ? 'border-pm-gold bg-pm-gold/10 text-pm-gold'
                                                            : 'border-pm-gold/30 text-pm-off-white/70 hover:border-pm-gold/50'
                                                    }`}
                                                >
                                                    <CalendarDaysIcon className="w-5 h-5 mx-auto mb-1" />
                                                    <span className="text-sm font-medium">Réservation</span>
                                </button>
                            </div>
                                        </div>

                                        {/* Basic Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <EnhancedFormInput 
                                                label="Votre Nom" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                error={formErrors.name}
                                                required 
                                            />
                                            <EnhancedFormInput 
                                                label="Téléphone" 
                                                name="phone" 
                                                type="tel"
                                                value={formData.phone} 
                                                onChange={handleChange} 
                                                error={formErrors.phone}
                                                required 
                                            />
                                        </div>

                                        <EnhancedFormInput 
                                            label="Email" 
                                            name="email" 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            error={formErrors.email}
                                            required 
                                        />

                                        <EnhancedFormInput 
                                            label="Sujet" 
                                            name="subject" 
                                            value={formData.subject} 
                                            onChange={handleChange} 
                                            error={formErrors.subject}
                                            required 
                                        />

                                        {/* Booking-specific fields */}
                                        {formData.serviceType === 'booking' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4 p-4 bg-pm-gold/5 border border-pm-gold/20 rounded-lg"
                                            >
                                                <h3 className="text-lg font-semibold text-pm-gold mb-3 flex items-center gap-2">
                                                    <CalendarDaysIcon className="w-5 h-5" />
                                                    Détails du projet
                                                </h3>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <EnhancedFormInput 
                                                        label="Date du projet" 
                                                        name="projectDate" 
                                                        type="date"
                                                        value={formData.projectDate} 
                                                        onChange={handleChange} 
                                                        error={formErrors.projectDate}
                                                        required 
                                                    />
                                                    <EnhancedFormInput 
                                                        label="Budget estimé" 
                                                        name="budget" 
                                                        value={formData.budget} 
                                                        onChange={handleChange} 
                                                        error={formErrors.budget}
                                                        placeholder="Ex: 500 000 FCFA"
                                                        required 
                                                    />
                                                </div>

                                                <EnhancedFormInput 
                                                    label="Lieu du projet" 
                                                    name="location" 
                                                    value={formData.location} 
                                                    onChange={handleChange} 
                                                    placeholder="Ex: Libreville, Port-Gentil..."
                                                />
                                            </motion.div>
                                        )}

                                        <EnhancedFormTextArea 
                                            label="Message détaillé" 
                                            name="message" 
                                            value={formData.message} 
                                            onChange={handleChange} 
                                            error={formErrors.message}
                                            required 
                                        />

                                        {formData.serviceType === 'booking' && (
                                            <EnhancedFormTextArea 
                                                label="Informations complémentaires" 
                                                name="additionalInfo" 
                                                value={formData.additionalInfo} 
                                                onChange={handleChange} 
                                                placeholder="Type de mannequin souhaité, style de shooting, références..."
                                            />
                                        )}
                                        
                                        <motion.button 
                                            type="submit" 
                                            disabled={status === 'loading'}
                                            className={`w-full px-8 py-4 font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-3 ${
                                                status !== 'loading'
                                                    ? 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/30'
                                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            }`}
                                            whileHover={status !== 'loading' ? { scale: 1.05 } : {}}
                                            whileTap={status !== 'loading' ? { scale: 0.95 } : {}}
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                                    />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <PaperAirplaneIcon className="w-5 h-5" />
                                                    {formData.serviceType === 'booking' ? 'Envoyer la demande de réservation' : 'Envoyer le message'}
                                                </>
                                            )}
                                        </motion.button>
                                        
                                        <AnimatePresence>
                            {statusMessage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className={`p-4 rounded-lg flex items-center gap-3 ${
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
                                    {statusMessage}
                                                </motion.div>
                            )}
                                        </AnimatePresence>
                        </form>
                                </motion.div>
                    </div>
                        </motion.div>
                    )}


                    {activeTab === 'faq' && (
                        <motion.div
                            key="faq"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-playfair text-pm-gold mb-4 flex items-center justify-center gap-3">
                                    <QuestionMarkCircleIcon className="w-10 h-10" />
                                    Questions Fréquentes
                                </h2>
                                <p className="text-pm-off-white/80 text-lg">
                                    Trouvez rapidement les réponses à vos questions les plus courantes.
                                </p>
                </div>

                            <div className="space-y-4">
                                {faqData.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        question={faq.question}
                                        answer={faq.answer}
                                        isOpen={openFaqIndex === index}
                                        onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'team' && (
                        <motion.div
                            key="team"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-playfair text-pm-gold mb-4 flex items-center justify-center gap-3">
                                    <UserGroupIcon className="w-10 h-10" />
                                    Notre Équipe
                                </h2>
                                <p className="text-pm-off-white/80 text-lg">
                                    Rencontrez les professionnels qui font de PMM une référence en Afrique Centrale.
                                </p>
                </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teamData.map((member, index) => (
                                    <TeamMemberCard
                                        key={index}
                                        name={member.name}
                                        role={member.role}
                                        description={member.description}
                                        image={member.image}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Enhanced Components
const ContactInfoCard: React.FC<{
    icon: React.ElementType;
    title: string;
    content: string;
    href?: string;
    color: 'blue' | 'green' | 'purple' | 'red' | 'orange';
}> = ({ icon: Icon, title, content, href, color }) => {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        green: 'text-green-400 bg-green-500/10 border-green-500/30',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        red: 'text-red-400 bg-red-500/10 border-red-500/30',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border ${colorClasses[color]} transition-all duration-300`}
        >
    <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-pm-off-white mb-1">{title}</h4>
                    {href ? (
                        <a href={href} className="hover:text-pm-gold transition-colors text-sm">
                            {content}
                        </a>
                    ) : (
                        <p className="text-pm-off-white/80 text-sm">{content}</p>
                    )}
                </div>
    </div>
        </motion.div>
    );
};

const EnhancedSocialLink: React.FC<{ href: string, icon: React.ElementType, platform: string }> = ({ href, icon: Icon, platform }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-4 py-3 bg-black/30 border border-pm-gold/20 rounded-lg hover:border-pm-gold/40 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <Icon className="w-6 h-6 text-pm-off-white/70 group-hover:text-pm-gold transition-colors" />
        <span className="text-sm font-medium text-pm-off-white/70 group-hover:text-pm-gold transition-colors">
            {platform}
        </span>
    </motion.a>
);

const EnhancedFormInput: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required, error, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-gold mb-2">
            {label} {required && <span className="text-pm-gold/70">*</span>}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-black/30 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                error 
                    ? 'border-pm-gold/50 focus:border-pm-gold' 
                    : 'border-pm-gold/30 focus:border-pm-gold'
            } text-pm-off-white placeholder:text-pm-off-white/50`}
            placeholder={placeholder || `Entrez votre ${label.toLowerCase()}`}
        />
    </div>
);

const EnhancedFormTextArea: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
}> = ({ label, name, value, onChange, required, error, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-gold mb-2">
            {label} {required && <span className="text-pm-gold/70">*</span>}
        </label>
        <textarea
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            rows={5}
            className={`w-full px-4 py-3 bg-black/30 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 resize-none ${
                error 
                    ? 'border-pm-gold/50 focus:border-pm-gold' 
                    : 'border-pm-gold/30 focus:border-pm-gold'
            } text-pm-off-white placeholder:text-pm-off-white/50`}
            placeholder={placeholder || `Décrivez votre ${label.toLowerCase()}`}
        />
    </div>
);

const FAQItem: React.FC<{
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => (
    <motion.div
        className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
    >
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-pm-gold/5 transition-all duration-300"
        >
            <h3 className="text-lg font-semibold text-pm-off-white pr-4">{question}</h3>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <ChevronDownIcon className="w-6 h-6 text-pm-gold flex-shrink-0" />
            </motion.div>
        </button>
        <motion.div
            initial={false}
            animate={{ 
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
        >
            <div className="px-6 pb-6 border-t border-pm-gold/20">
                <p className="text-pm-off-white/80 leading-relaxed">{answer}</p>
            </div>
        </motion.div>
    </motion.div>
);

const TeamMemberCard: React.FC<{
    name: string;
    role: string;
    description: string;
    image: string;
    index: number;
}> = ({ name, role, description, image, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-6 text-center hover:border-pm-gold/40 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
    >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-pm-gold/30">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
            />
        </div>
        <h3 className="text-xl font-playfair text-pm-gold mb-2">{name}</h3>
        <p className="text-pm-gold/80 font-semibold mb-3">{role}</p>
        <p className="text-pm-off-white/70 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default Contact;