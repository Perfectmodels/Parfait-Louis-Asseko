
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationRole } from '../types';
import PublicPageLayout from '../components/PublicPageLayout';
import { 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    BriefcaseIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const FashionDayApplicationForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Mannequin' as FashionDayApplicationRole,
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data || !saveData) {
            setStatus('error');
            setStatusMessage('Une erreur de configuration empêche l\'envoi. Veuillez nous contacter directement.');
            return;
        }

        const newApplication: FashionDayApplication = {
            id: `pfd-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            ...formData,
        };

        try {
            const updatedApplications = [...(data.fashionDayApplications || []), newApplication];
            await saveData({ ...data, fashionDayApplications: updatedApplications });

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée ! Nous vous remercions de votre intérêt pour le Perfect Fashion Day.');
        } catch (error) {
            setStatus('error');
            setStatusMessage('Un problème est survenu. Veuillez réessayer ou nous contacter si le problème persiste.');
            console.error("Fashion Day form submission error:", error);
        }
    };

    if (status === 'success') {
        return (
            <PublicPageLayout title="Candidature Reçue" subtitle="">
                <div className="text-center max-w-2xl mx-auto py-20">
                    <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-playfair text-pm-gold mb-4">Merci !</h2>
                    <p className="text-lg text-pm-off-white/80">{statusMessage}</p>
                    <Link to="/fashion-day" className="inline-flex items-center gap-2 text-pm-gold font-semibold text-lg group mt-8">
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:scale-110" style={{transform: 'rotate(180deg)'}}/>
                        Retour à la page Fashion Day
                    </Link>
                </div>
            </PublicPageLayout>
        );
    }

    return (
        <PublicPageLayout
            title="Participer au Fashion Day"
            subtitle="Mannequins, créateurs, photographes, partenaires... Rejoignez l'événement mode de l'année au Gabon."
            heroImage={data?.siteImages.fashionDayHero}
        >
            <div className="max-w-2xl mx-auto bg-black/30 border border-pm-gold/20 rounded-2xl p-8 md:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput icon={UserIcon} name="name" placeholder="Votre nom ou marque" value={formData.name} onChange={handleChange} required />
                        <FormSelect name="role" value={formData.role} onChange={handleChange}>
                            <option>Mannequin</option>
                            <option>Styliste</option>
                            <option>Photographe</option>
                            <option>Partenaire</option>
                            <option>MUA</option>
                            <option>Autre</option>
                        </FormSelect>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput icon={EnvelopeIcon} name="email" type="email" placeholder="Adresse Email" value={formData.email} onChange={handleChange} required />
                        <FormInput icon={PhoneIcon} name="phone" type="tel" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full bg-black/40 border border-pm-gold/30 rounded-xl p-4 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all"
                            placeholder="Votre message, lien vers votre portfolio, ou toute information pertinente..."
                            required
                        />
                    </div>
                    <div className="pt-4">
                        {statusMessage && (
                            <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg text-sm border ${status === 'error' ? 'bg-red-900/50 text-red-300 border-red-500/30' : ''}`}>
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                {statusMessage}
                            </div>
                        )}
                        <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all disabled:opacity-60">
                            {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </PublicPageLayout>
    );
};

const FormInput: React.FC<any> = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon className="w-5 h-5 text-pm-gold/50" /></div>}
        <input {...props} className={`w-full bg-black/40 border border-pm-gold/30 rounded-full py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all ${Icon ? 'pl-12 pr-4' : 'px-5'}`} />
    </div>
);

const FormSelect: React.FC<any> = ({ children, ...props }) => (
    <div className="relative">
        <BriefcaseIcon className="w-5 h-5 text-pm-gold/50 absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none" />
         <select {...props} className="w-full bg-black/40 border border-pm-gold/30 rounded-full py-3 pl-12 pr-4 text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all appearance-none">
            {children}
        </select>
    </div>
);

export default FashionDayApplicationForm;
