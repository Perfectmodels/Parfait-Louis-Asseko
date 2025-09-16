

import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../../types';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';

const CastingForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
        gender: 'Femme' as 'Homme' | 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        const newApplication: CastingApplication = {
            ...formData,
            id: `casting-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
        };

        try {
            const updatedApplications = [...(data.castingApplications || []), newApplication];
            await saveData({ ...data, castingApplications: updatedApplications });

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée avec succès ! Nous vous contacterons si votre profil est retenu.');
            setFormData({ // Reset form
                firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
                gender: 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
                eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
            });

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre candidature.");
            console.error(error);
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Formulaire de Casting" description="Postulez en ligne pour rejoindre Perfect Models Management. Remplissez notre formulaire pour soumettre votre candidature." noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Postuler au Casting</h1>
                <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
                    Remplissez ce formulaire avec attention. C'est votre première étape pour peut-être nous rejoindre.
                </p>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-8 rounded-lg shadow-lg">
                    <Section title="Informations Personnelles">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            <FormInput label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Date de Naissance" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                            <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="Femme">Femme</option>
                                <option value="Homme">Homme</option>
                            </FormSelect>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <FormInput label="Nationalité" name="nationality" value={formData.nationality} onChange={handleChange} required />
                           <FormInput label="Ville de résidence" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <FormInput label="Téléphone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                        </div>
                    </Section>

                    <Section title="Mensurations & Physique">
                        <div className="grid md:grid-cols-3 gap-6">
                            <FormInput label="Taille (cm)" name="height" type="number" value={formData.height} onChange={handleChange} required />
                            <FormInput label="Poids (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} required />
                             <FormInput label="Pointure (EU)" name="shoeSize" type="number" value={formData.shoeSize} onChange={handleChange} required />
                        </div>
                         <div className="grid md:grid-cols-3 gap-6">
                            <FormInput label="Poitrine (cm)" name="chest" type="number" value={formData.chest} onChange={handleChange} />
                            <FormInput label="Taille (vêtement, cm)" name="waist" type="number" value={formData.waist} onChange={handleChange} />
                            <FormInput label="Hanches (cm)" name="hips" type="number" value={formData.hips} onChange={handleChange} />
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Couleur des yeux" name="eyeColor" value={formData.eyeColor} onChange={handleChange} />
                            <FormInput label="Couleur des cheveux" name="hairColor" value={formData.hairColor} onChange={handleChange} />
                        </div>
                    </Section>
                    
                     <Section title="Expérience & Portfolio">
                        <FormSelect label="Niveau d'expérience" name="experience" value={formData.experience} onChange={handleChange} required>
                            <option value="none">Aucune expérience</option>
                            <option value="beginner">Débutant(e) (shootings amateurs)</option>
                            <option value="intermediate">Intermédiaire (agence locale, défilés)</option>
                            <option value="professional">Professionnel(le)</option>
                        </FormSelect>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormInput label="Profil Instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@pseudo" />
                            <FormInput label="Lien vers portfolio (optionnel)" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
                        </div>
                        <p className="text-sm text-pm-off-white/60 bg-pm-dark/50 p-3 rounded-md border border-pm-off-white/10">
                            Note : Pour simplifier cette première étape, nous ne demandons pas de photos immédiatement. Si votre profil est présélectionné, nous vous contacterons par email pour vous demander de nous envoyer vos polas (photos naturelles).
                        </p>
                    </Section>

                    <div className="pt-6">
                        <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                            {status === 'loading' ? 'Envoi...' : 'Soumettre ma candidature'}
                        </button>
                    </div>

                    {statusMessage && (
                        <p className={`text-center text-sm p-4 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {statusMessage}
                            {status === 'success' && <Link to="/" className="underline ml-2">Retour à l'accueil</Link>}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

// Reusable components
const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="space-y-6 pt-6 border-t border-pm-gold/10 first:pt-0 first:border-none">
        <h2 className="text-xl font-playfair text-pm-gold">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);
const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, placeholder?: string}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} id={props.name} className="admin-input">{props.children}</select>
    </div>
);

export default CastingForm;