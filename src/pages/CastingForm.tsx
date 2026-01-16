import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import { Link } from 'react-router-dom';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';
import MultiImageUploader from '../components/MultiImageUploader';

const CastingForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
        gender: 'Femme' as 'Homme' | 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
    });
    const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
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
            photoFullBodyUrl: null,
            photoPortraitUrl: null,
            photoProfileUrl: null,
            portfolioPhotos: portfolioPhotos, // Add portfolio photos array
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
            setPortfolioPhotos([]); // Reset portfolio photos

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre candidature.");
            console.error(error);
        }
    };

    // Fallback image for casting page
    const heroImage = data?.siteImages?.hero || "https://i.ibb.co/1Jq0zYw/casting.jpg";

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Formulaire de Casting" description="Postulez en ligne pour rejoindre Perfect Models Management. Remplissez notre formulaire pour soumettre votre candidature." noIndex />

            <ParallaxHero
                image={heroImage}
                title="Postuler au Casting"
                subtitle="Rejoignez l'élite. Devenez le visage de demain."
                height="h-[50vh]"
            />

            <div className="page-container -mt-20 relative z-20 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-10">
                        <p className="text-lg text-pm-off-white/80 max-w-2xl mx-auto bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-pm-gold/20">
                            Remplissez ce formulaire avec attention. C'est votre première étape pour peut-être nous rejoindre au sein de <strong>Perfect Models Management</strong>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-black/80 backdrop-blur-md p-8 md:p-12 border border-white/10 rounded-2xl shadow-2xl space-y-10">
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
                                <FormInput label="Lien vers portfolio (optionnel)" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </Section>

                        <Section title="Photos Portfolio">
                            <MultiImageUploader
                                label="Vos Photos"
                                description="Ajoutez jusqu'à 10 photos qui constitueront votre portfolio. Ces photos nous permettront de mieux évaluer votre profil. Privilégiez des photos de qualité professionnelle ou semi-professionnelle."
                                maxImages={10}
                                values={portfolioPhotos}
                                onChange={setPortfolioPhotos}
                            />
                            <div className="text-sm text-pm-off-white/70 bg-pm-gold/10 p-4 rounded-lg border-l-4 border-pm-gold mt-4">
                                <p><strong>💡 Conseils :</strong></p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Incluez au moins 3 photos : portrait, corps entier, et profil</li>
                                    <li>Privilégiez un éclairage naturel et un fond neutre</li>
                                    <li>Évitez les filtres et retouches excessives</li>
                                    <li>Portez des vêtements simples qui mettent en valeur votre silhouette</li>
                                </ul>
                            </div>
                        </Section>

                        <div className="pt-6">
                            <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white hover:scale-[1.01] shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none">
                                {status === 'loading' ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                            </button>
                        </div>

                        {statusMessage && (
                            <div className={`text-center text-sm p-4 rounded-md border ${status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                {statusMessage}
                                {status === 'success' && <div className="mt-2"><Link to="/" className="text-white underline hover:text-pm-gold">Retour à l'accueil</Link></div>}
                            </div>
                        )}
                    </form>
                </FadeIn>
            </div>
        </div>
    );
};

// Reusable components with improved styling
const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-6 pt-8 border-t border-white/5 first:pt-0 first:border-none">
        <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
            <span className="w-8 h-[1px] bg-pm-gold/50 inline-block"></span>
            {title}
        </h2>
        <div className="space-y-6">{children}</div>
    </div>
);
const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, placeholder?: string }> = (props) => (
    <div className='group'>
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label} {props.required && <span className="text-red-500">*</span>}</label>
        <input {...props} id={props.name} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all placeholder:text-white/20" />
    </div>
);
const FormSelect: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode }> = (props) => (
    <div className='group'>
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label} {props.required && <span className="text-red-500">*</span>}</label>
        <select {...props} id={props.name} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all">{props.children}</select>
    </div>
);

export default CastingForm;
