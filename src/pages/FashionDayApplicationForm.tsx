import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  CalendarIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationRole } from '../types';
import { emailConfirmationService } from '../services/emailConfirmationService';

const FashionDayApplicationForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        role: FashionDayApplicationRole;
        message: string;
        age: string;
        gender: 'Homme' | 'Femme' | '';
        location: string;
        experience: string;
        portfolioUrl: string;
        instagram: string;
        facebook: string;
        website: string;
        availability: string;
        motivation: string;
        previousParticipation: boolean;
        specialRequirements: string;
    }>({
        name: '',
        email: '',
        phone: '',
        role: 'Mannequin',
        message: '',
        age: '',
        gender: '',
        location: '',
        experience: '',
        portfolioUrl: '',
        instagram: '',
        facebook: '',
        website: '',
        availability: '',
        motivation: '',
        previousParticipation: false,
        specialRequirements: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        const newApplication: FashionDayApplication = {
            id: `pfd-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            message: formData.message,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender || undefined,
            location: formData.location || undefined,
            experience: formData.experience || undefined,
            portfolioUrl: formData.portfolioUrl || undefined,
            socialMedia: {
                instagram: formData.instagram || undefined,
                facebook: formData.facebook || undefined,
                website: formData.website || undefined,
            },
            availability: formData.availability || undefined,
            motivation: formData.motivation || undefined,
            previousParticipation: formData.previousParticipation,
            specialRequirements: formData.specialRequirements || undefined,
        };

        try {
            const updatedApplications = [...(data.fashionDayApplications || []), newApplication];
            await saveData({ ...data, fashionDayApplications: updatedApplications });

            // Envoyer notification admin
            await sendFashionDayEmailNotification(newApplication, data.apiKeys.brevoApiKey, data.contactInfo.notificationEmail);
            
            // Envoyer confirmation à l'utilisateur
            try {
                await emailConfirmationService.sendFashionDayConfirmation({
                    recipientEmail: formData.email,
                    recipientName: formData.name,
                    formType: 'fashion-day',
                    submissionData: newApplication,
                    submissionId: newApplication.id
                });
            } catch (error) {
                console.warn('Erreur lors de l\'envoi de la confirmation:', error);
            }

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée ! L\'équipe du Perfect Fashion Day vous recontactera prochainement.');
            setFormData({ 
                name: '', email: '', phone: '', role: 'Mannequin', message: '',
                age: '', gender: '', location: '', experience: '', portfolioUrl: '',
                instagram: '', facebook: '', website: '', availability: '', motivation: '',
                previousParticipation: false, specialRequirements: ''
            });

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre candidature.");
            console.error(error);
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Candidature Perfect Fashion Day" description="Postulez pour participer à la prochaine édition du Perfect Fashion Day. Mannequins, stylistes, photographes, partenaires, rejoignez l'aventure." noIndex />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 via-transparent to-pm-gold/5"></div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/20 rounded-full mb-6">
                            <SparklesIcon className="w-5 h-5 text-pm-gold" />
                            <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                                Inscriptions Ouvertes
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6">
                            Rejoignez l'Aventure
                        </h1>
                        <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Participez à la prochaine édition du Perfect Fashion Day et donnez vie au thème 
                            <span className="text-pm-gold font-semibold"> "L'Art de Se Révéler"</span>
                        </p>
                        
                        {/* Avantages */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                            <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                                <UserGroupIcon className="w-8 h-8 text-pm-gold mx-auto mb-3" />
                                <h3 className="text-pm-gold font-semibold mb-2">Réseautage</h3>
                                <p className="text-pm-off-white/70 text-sm">Rencontrez des professionnels</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                                <StarIcon className="w-8 h-8 text-pm-gold mx-auto mb-3" />
                                <h3 className="text-pm-gold font-semibold mb-2">Visibilité</h3>
                                <p className="text-pm-off-white/70 text-sm">Exposez votre talent</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                                <HeartIcon className="w-8 h-8 text-pm-gold mx-auto mb-3" />
                                <h3 className="text-pm-gold font-semibold mb-2">Passion</h3>
                                <p className="text-pm-off-white/70 text-sm">Événement unique</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Formulaire */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-2xl p-8 md:p-12"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-playfair text-pm-gold mb-4">Formulaire de Candidature</h2>
                            <p className="text-pm-off-white/70">
                                Remplissez ce formulaire pour postuler à l'édition 2 du Perfect Fashion Day
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Informations personnelles */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-pm-gold flex items-center gap-2">
                                    <UserIcon className="w-5 h-5" />
                                    Informations Personnelles
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label="Nom Complet ou Nom de la Marque" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                        icon={UserIcon}
                                    />
                                    <FormInput 
                                        label="Email" 
                                        name="email" 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        icon={EnvelopeIcon}
                                    />
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label="Téléphone" 
                                        name="phone" 
                                        type="tel" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        required 
                                        icon={PhoneIcon}
                                    />
                                    <FormSelect 
                                        label="Je postule en tant que" 
                                        name="role" 
                                        value={formData.role} 
                                        onChange={handleChange} 
                                        required
                                        icon={BriefcaseIcon}
                                    >
                                        <option value="Mannequin">Mannequin</option>
                                        <option value="Styliste">Styliste / Créateur</option>
                                        <option value="Partenaire">Partenaire / Sponsor</option>
                                        <option value="Photographe">Photographe / Vidéaste</option>
                                        <option value="MUA">Maquilleur(se) / Coiffeur(se) (MUA)</option>
                                        <option value="Autre">Autre (précisez dans le message)</option>
                                    </FormSelect>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-pm-gold flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5" />
                                    Présentation
                                </h3>
                                
                                <FormTextArea
                                    label="Message de candidature"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Présentez-vous, décrivez votre projet, votre expérience, ou laissez un lien vers votre portfolio..."
                                    required
                                />
                            </div>

                            {/* Bouton de soumission */}
                            <div className="pt-6">
                                <motion.button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50 shadow-lg shadow-pm-gold/20"
                                >
                                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                                </motion.button>
                            </div>

                            {/* Message de statut */}
                            {statusMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg border ${
                                        status === 'success' 
                                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {status === 'success' ? (
                                            <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <XCircleIcon className="w-6 h-6 text-red-400" />
                                        )}
                                        <div>
                                            <p className="font-semibold">
                                                {status === 'success' ? 'Candidature envoyée !' : 'Erreur'}
                                            </p>
                                            <p className="text-sm mt-1">{statusMessage}</p>
                                            {status === 'success' && (
                                                <Link to="/fashion-day" className="text-pm-gold hover:underline mt-2 inline-block">
                                                    Retour à la page de l'événement
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FormInput: React.FC<{
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    type?: string, 
    required?: boolean, 
    placeholder?: string,
    icon?: React.ElementType
}> = ({ icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-gold">
            {props.label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Icon className="w-5 h-5 text-pm-gold/60" />
                </div>
            )}
            <input 
                {...props} 
                id={props.name} 
                className={`w-full px-4 py-3 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-colors ${Icon ? 'pl-12' : ''}`}
            />
        </div>
    </div>
);

const FormSelect: React.FC<{
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, 
    required?: boolean, 
    children: React.ReactNode,
    icon?: React.ElementType
}> = ({ icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-gold">
            {props.label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Icon className="w-5 h-5 text-pm-gold/60" />
                </div>
            )}
            <select 
                {...props} 
                id={props.name} 
                className={`w-full px-4 py-3 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-colors appearance-none ${Icon ? 'pl-12' : ''}`}
            >
                {props.children}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-pm-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

const FormTextArea: React.FC<{
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
    rows: number, 
    required?: boolean, 
    placeholder?: string
}> = (props) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-gold">
            {props.label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <textarea 
            {...props} 
            id={props.name} 
            className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-colors resize-none"
        />
    </div>
);

export default FashionDayApplicationForm;

async function sendFashionDayEmailNotification(application: FashionDayApplication, apiKey?: string, notificationEmail?: string) {
    if (!apiKey || !notificationEmail) {
        console.warn("Brevo API key or notification email is not configured.");
        return;
    }

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #D4AF37;">Nouvelle Candidature - Perfect Fashion Day</h1>
            <p>Une nouvelle candidature a été soumise pour le PFD.</p>
            
            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Informations du Candidat</h2>
            <ul>
                <li><strong>Nom / Marque:</strong> ${application.name}</li>
                <li><strong>Email:</strong> ${application.email}</li>
                <li><strong>Téléphone:</strong> ${application.phone}</li>
                <li><strong>Postule en tant que:</strong> ${application.role}</li>
            </ul>

            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Message de Candidature</h2>
            <p style="background-color: #f4f4f4; border-left: 4px solid #D4AF37; padding: 15px; white-space: pre-wrap;">${application.message}</p>
            
            <hr>
            <p style="font-size: 0.8em; color: #888;">Cet e-mail a été envoyé automatiquement depuis le site Perfect Models Management.</p>
        </div>
    `;

    const emailData = {
        sender: { name: "PMM Site Web", email: "noreply@perfectmodels.ga" },
        to: [{ email: notificationEmail, name: "Admin PMM" }],
        subject: `Nouvelle Candidature PFD: ${application.name} (${application.role})`,
        htmlContent: emailHtml
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
            body: JSON.stringify(emailData)
        });
        if (!response.ok) throw new Error(`Erreur API Brevo: ${response.status}`);
        console.log("Email de notification PFD envoyé !");
    } catch (error) {
        console.error("Erreur d'envoi de l'e-mail PFD:", error);
    }
}