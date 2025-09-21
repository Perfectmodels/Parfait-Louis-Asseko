
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import PublicPageLayout from '../components/PublicPageLayout';
import ImageUpload from '../components/ImageUpload';
import { 
    UserIcon, CakeIcon, GlobeAltIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, ArrowUpOnSquareIcon,
    ArrowRightIcon, CheckCircleIcon, SparklesIcon, LinkIcon, BeakerIcon
} from '@heroicons/react/24/outline';

const CastingForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: 'Gabonaise', city: 'Libreville',
        gender: 'Femme', height: '', weight: '', experience: 'none', instagram: ''
    });
    const [photoUrls, setPhotoUrls] = useState({
        portrait: null as string | null,
        fullBody: null as string | null,
        profile: null as string | null,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (field: 'portrait' | 'fullBody' | 'profile') => (url: string) => {
        setPhotoUrls(prev => ({ ...prev, [field]: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data || !saveData) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données. Veuillez rafraîchir la page.');
            return;
        }
        
        if (!photoUrls.portrait || !photoUrls.fullBody || !photoUrls.profile) {
            setStatus('error');
            setStatusMessage('Veuillez télécharger les trois photos requises avant de soumettre.');
            return;
        }

        const newApplication: CastingApplication = {
            id: `casting-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            ...formData,
            height: parseInt(formData.height, 10) || 0,
            weight: parseInt(formData.weight, 10) || 0,
            photoPortraitUrl: photoUrls.portrait,
            photoFullBodyUrl: photoUrls.fullBody,
            photoProfileUrl: photoUrls.profile,
        };

        try {
            const updatedApplications = [...(data.castingApplications || []), newApplication];
            await saveData({ ...data, castingApplications: updatedApplications });

            setStatus('success');
            setStatusMessage('Candidature envoyée ! Nous avons bien reçu vos informations. Notre équipe vous contactera si votre profil est retenu.');
        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
            console.error("Casting form submission error:", error);
        }
    };
    
    if (status === 'success') {
        return (
            <PublicPageLayout title="Candidature Envoyée" subtitle="">
                <div className="text-center max-w-2xl mx-auto py-20">
                    <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-playfair text-pm-gold mb-4">Merci !</h2>
                    <p className="text-lg text-pm-off-white/80">{statusMessage}</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-pm-gold font-semibold text-lg group mt-8">
                        <ArrowRightIcon className="w-5 h-5 transform rotate-180" />
                        Retour à l'accueil
                    </Link>
                </div>
            </PublicPageLayout>
        );
    }

    return (
        <PublicPageLayout 
            title="Devenez Mannequin" 
            subtitle="Remplissez ce formulaire pour soumettre votre candidature. C'est votre première étape vers une carrière exceptionnelle."
            heroImage={data?.siteImages.castingFormHero}
        >
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="sticky top-28 bg-black/30 border border-pm-gold/20 rounded-xl p-8 space-y-6">
                        <h3 className="text-2xl font-playfair text-pm-gold">Instructions</h3>
                        <p className="text-pm-off-white/70">Pour une candidature réussie, veuillez respecter les consignes suivantes.</p>
                        <InstructionItem icon={UserIcon} title="Critères de base" description="Femmes (16-25 ans, 1m75+), Hommes (18-28 ans, 1m80+)." />
                        <InstructionItem icon={ArrowUpOnSquareIcon} title="Photos requises" description="Soumettez 3 photos naturelles (polas) : portrait, plein pied et profil. Sans maquillage, sans filtres, sur fond neutre." />
                        <InstructionItem icon={SparklesIcon} title="Soyez professionnel(le)" description="Ce formulaire est votre premier contact avec nous. Remplissez-le avec sérieux et précision." />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <FormSection title="1. Informations Personnelles">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput icon={UserIcon} name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
                                <FormInput icon={UserIcon} name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput icon={CakeIcon} name="birthDate" type="date" placeholder="Date de Naissance" value={formData.birthDate} onChange={handleChange} required />
                                <FormSelect name="gender" value={formData.gender} onChange={handleChange}>
                                    <option>Femme</option>
                                    <option>Homme</option>
                                </FormSelect>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput icon={GlobeAltIcon} name="nationality" placeholder="Nationalité" value={formData.nationality} onChange={handleChange} required />
                                <FormInput icon={MapPinIcon} name="city" placeholder="Ville de résidence" value={formData.city} onChange={handleChange} required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput icon={EnvelopeIcon} name="email" type="email" placeholder="Adresse Email" value={formData.email} onChange={handleChange} required />
                                <FormInput icon={PhoneIcon} name="phone" type="tel" placeholder="Numéro de téléphone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </FormSection>

                        <FormSection title="2. Mensurations et Expérience">
                            <div className="grid md:grid-cols-3 gap-6">
                                <FormInput icon={BeakerIcon} name="height" type="number" placeholder="Taille (cm)" value={formData.height} onChange={handleChange} required />
                                <FormInput icon={BeakerIcon} name="weight" type="number" placeholder="Poids (kg)" value={formData.weight} onChange={handleChange} required />
                                 <FormSelect name="experience" value={formData.experience} onChange={handleChange}>
                                    <option value="none">Débutant(e)</option>
                                    <option value="beginner">Quelques shoots</option>
                                    <option value="intermediate">En agence locale</option>
                                    <option value="professional">Professionnel(le)</option>
                                </FormSelect>
                            </div>
                             <FormInput icon={LinkIcon} name="instagram" placeholder="Profil Instagram (ex: @perfectmodels.ga)" value={formData.instagram} onChange={handleChange} />
                        </FormSection>

                        <FormSection title="3. Photos (Polas)">
                             <p className="text-sm text-pm-off-white/60 -mt-4 mb-4">Photos naturelles, sans maquillage, sans filtres, sur fond neutre.</p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <ImageUpload label="Portrait (visage)" onUploadComplete={handlePhotoUpload('portrait')} apiKey={data?.apiKeys.imgbbApiKey} />
                                <ImageUpload label="Plein Pied (corps entier)" onUploadComplete={handlePhotoUpload('fullBody')} apiKey={data?.apiKeys.imgbbApiKey} />
                                <ImageUpload label="Profil" onUploadComplete={handlePhotoUpload('profile')} apiKey={data?.apiKeys.imgbbApiKey} />
                            </div>
                        </FormSection>

                        <div className="pt-6">
                            {statusMessage && (
                                <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg text-sm ${status === 'error' ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'}`}>
                                    <BeakerIcon className="w-5 h-5" />
                                    {statusMessage}
                                </div>
                            )}
                            <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all disabled:opacity-60">
                                {status === 'loading' ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicPageLayout>
    );
};

const InstructionItem: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-pm-gold flex-shrink-0 mt-1" />
        <div>
            <h4 className="font-semibold text-pm-off-white">{title}</h4>
            <p className="text-sm text-pm-off-white/70">{description}</p>
        </div>
    </div>
);

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="space-y-6 border-t border-pm-gold/20 pt-6">
        <legend className="text-xl font-playfair text-pm-gold font-bold px-2 -ml-2">{title}</legend>
        <div className="space-y-6">{children}</div>
    </fieldset>
);

const FormInput: React.FC<any> = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon className="w-5 h-5 text-pm-gold/50" /></div>}
        <input {...props} className={`w-full bg-black/40 border border-pm-gold/30 rounded-full py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all ${Icon ? 'pl-12 pr-4' : 'px-5'}`} />
    </div>
);

const FormSelect: React.FC<any> = ({ children, ...props }) => (
    <select {...props} className="w-full bg-black/40 border border-pm-gold/30 rounded-full px-5 py-3 text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all appearance-none">
        {children}
    </select>
);

export default CastingForm;
