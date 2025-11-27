
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/SocialIcons';
// FIX: Corrected import path for BookingForm.
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
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO 
                title="Contact | Perfect Models Management"
                description="Contactez-nous pour toute demande de booking, de partenariat ou d'information. L'équipe de Perfect Models Management est à votre disposition à Libreville, Gabon."
                keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
                image={data?.siteImages.about}
            />
            
            {/* Hero Section */}
            <motion.section 
                className="relative py-20 lg:py-32 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 to-transparent"></div>
                <div className="relative container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair text-pm-gold mb-6">
                            Contactez-nous
                        </h1>
                        <p className="text-lg md:text-xl text-pm-off-white/80 leading-relaxed max-w-3xl mx-auto">
                            Une question, un projet de collaboration ou une demande de booking ? Notre équipe est à votre écoute.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            <div className="container mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    
                    {/* Contact Info */}
                    <motion.div 
                        className="bg-black/50 backdrop-blur-sm p-8 lg:p-10 border border-pm-gold/20 rounded-2xl shadow-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-playfair text-pm-gold mb-8">Nos Coordonnées</h2>
                        {contactInfo && (
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <InfoItem icon={MapPinIcon} text={contactInfo.address} />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <InfoItem icon={PhoneIcon} text={contactInfo.phone} />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <InfoItem icon={EnvelopeIcon} text={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                                </motion.div>
                            </div>
                        )}
                        
                        <motion.div 
                            className="mt-10 pt-8 border-t border-pm-gold/10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-bold text-pm-off-white mb-6">Suivez-nous</h3>
                            {socialLinks && (
                                <div className="flex space-x-6">
                                    {socialLinks.facebook && <SocialLink href={socialLinks.facebook} icon={FacebookIcon} />}
                                    {socialLinks.instagram && <SocialLink href={socialLinks.instagram} icon={InstagramIcon} />}
                                    {socialLinks.youtube && <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} />}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        className="bg-black/50 backdrop-blur-sm p-8 lg:p-10 border border-pm-gold/20 rounded-2xl shadow-2xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-playfair text-pm-gold mb-8">Envoyez-nous un message</h2>
                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FormInput label="Votre Nom" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <FormInput label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                            <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} required />
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'} 
                                    className="w-full px-8 py-4 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pm-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </motion.div>
                            
                            {statusMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-center text-sm p-4 rounded-lg ${status === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
                                >
                                    {statusMessage}
                                </motion.div>
                            )}
                        </motion.form>
                    </motion.div>
                </div>

                {/* Booking Section */}
                <motion.div 
                    className="mt-16 max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-black/50 backdrop-blur-sm p-8 lg:p-12 border border-pm-gold/20 rounded-2xl shadow-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl lg:text-4xl font-playfair text-pm-gold mb-4">Demande de Booking</h2>
                            <p className="text-pm-off-white/80 mb-8 text-lg">
                                Pour un ou plusieurs mannequins, ou pour tout autre projet.
                            </p>
                        </motion.div>
                        <BookingForm />
                    </div>
                </motion.div>
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
