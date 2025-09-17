

import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload'; // Importer le composant
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const ApplicationGuide: React.FC = () => (
    <div className="bg-pm-dark/50 border border-pm-gold/20 p-6 rounded-lg mb-12 shadow-inner">
        <div className="flex items-start gap-4">
            <InformationCircleIcon className="w-8 h-8 text-pm-gold mt-1 flex-shrink-0" />
            <div>
                <h2 className="text-xl font-playfair text-pm-gold mb-3">Avant de commencer, lisez attentivement :</h2>
                <p className="text-pm-off-white/80 mb-4 text-sm">Pour que votre candidature soit considérée, vous devez remplir les critères suivants. Assurez-vous d'avoir des photos naturelles (polas) prêtes.</p>
                <ul className="list-disc list-inside space-y-2 text-pm-off-white/90 text-sm">
                    <li><span className="font-semibold">Âge :</span> Ouvert aux candidats de 16 à 25 ans.</li>
                    <li><span className="font-semibold">Taille minimale :</span> 175cm pour les femmes, 180cm pour les hommes.</li>
                    <li><span className="font-semibold">Photos :</span> Des photos récentes, sans maquillage, sans filtres et sur fond neutre sont requises.
                        <ul className="list-['-_'] list-inside ml-4 mt-1 text-pm-off-white/70">
                            <li>Un portrait (visage et épaules)</li>
                            <li>Une photo en pied (corps entier)</li>
                            <li>Une photo de profil</li>
                        </ul>
                    </li>
                    <li><span className="font-semibold">Attitude :</span> Nous recherchons des personnes sérieuses, motivées et professionnelles.</li>
                </ul>
            </div>
        </div>
    </div>
);

const CastingForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
        gender: 'Femme' as 'Homme' | 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
    });
    const [photoUrls, setPhotoUrls] = useState({
        portrait: null,
        fullBody: null,
        profile: null,
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
            photoPortraitUrl: photoUrls.portrait,
            photoFullBodyUrl: photoUrls.fullBody,
            photoProfileUrl: photoUrls.profile,
        };

        try {
            const updatedApplications = [...(data.castingApplications || []), newApplication];
            await saveData({ ...data, castingApplications: updatedApplications });
            
            // Envoyer la notification par e-mail
            await sendEmailNotification(newApplication, data.apiKeys.brevoApiKey, data.contactInfo.notificationEmail);

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée avec succès ! Nous vous contacterons si votre profil est retenu.');
            setFormData({ // Reset form
                firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
                gender: 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
                eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
            });
            setPhotoUrls({ portrait: null, fullBody: null, profile: null }); // Reset photos

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
                
                <ApplicationGuide />

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
                        <div className="space-y-6 pt-4">
                            <h3 className="text-lg font-semibold text-pm-off-white/90">Photos Requises</h3>
                            <p className="text-sm text-pm-off-white/60">Veuillez soumettre des photos récentes, claires et non retouchées (polas).</p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <ImageUpload
                                    placeholder="Photo Portrait (visage)"
                                    onImageUploaded={handlePhotoUpload('portrait')}
                                />
                                <ImageUpload
                                    placeholder="Photo Plein Pied"
                                    onImageUploaded={handlePhotoUpload('fullBody')}
                                />
                                <ImageUpload
                                    placeholder="Photo de Profil"
                                    onImageUploaded={handlePhotoUpload('profile')}
                                />
                            </div>
                        </div>
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

async function sendEmailNotification(application: CastingApplication, apiKey?: string, notificationEmail?: string) {
    if (!apiKey || !notificationEmail) {
        console.warn("Brevo API key or notification email is not configured. Skipping email notification.");
        return;
    }

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #D4AF37;">Nouvelle Candidature au Casting</h1>
            <p>Une nouvelle candidature a été soumise via le formulaire du site.</p>
            
            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Informations Personnelles</h2>
            <ul>
                <li><strong>Nom:</strong> ${application.firstName} ${application.lastName}</li>
                <li><strong>Date de naissance:</strong> ${application.birthDate}</li>
                <li><strong>Email:</strong> ${application.email}</li>
                <li><strong>Téléphone:</strong> ${application.phone}</li>
                <li><strong>Nationalité:</strong> ${application.nationality}</li>
                <li><strong>Ville:</strong> ${application.city}</li>
            </ul>

            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Mensurations & Physique</h2>
            <ul>
                <li><strong>Genre:</strong> ${application.gender}</li>
                <li><strong>Taille:</strong> ${application.height} cm</li>
                <li><strong>Poids:</strong> ${application.weight} kg</li>
                <li><strong>Poitrine:</strong> ${application.chest} cm</li>
                <li><strong>Taille (vêtement):</strong> ${application.waist} cm</li>
                <li><strong>Hanches:</strong> ${application.hips} cm</li>
                <li><strong>Pointure:</strong> ${application.shoeSize}</li>
                <li><strong>Couleur des yeux:</strong> ${application.eyeColor}</li>
                <li><strong>Couleur des cheveux:</strong> ${application.hairColor}</li>
            </ul>

            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Expérience & Portfolio</h2>
            <ul>
                <li><strong>Expérience:</strong> ${application.experience}</li>
                <li><strong>Instagram:</strong> <a href="https://instagram.com/${application.instagram.replace('@', '')}">${application.instagram}</a></li>
                <li><strong>Portfolio:</strong> <a href="${application.portfolioLink}">${application.portfolioLink}</a></li>
            </ul>
            
            <h2 style="border-bottom: 2px solid #D4AF37; padding-bottom: 5px;">Photos Soumises</h2>
            <p>
                <a href="${application.photoPortraitUrl}">Voir le portrait</a> | 
                <a href="${application.photoFullBodyUrl}">Voir la photo plein pied</a> | 
                <a href="${application.photoProfileUrl}">Voir la photo de profil</a>
            </p>

            <hr>
            <p style="font-size: 0.8em; color: #888;">Cet e-mail a été envoyé automatiquement depuis le site Perfect Models Management.</p>
        </div>
    `;

    const emailData = {
        sender: {
            name: "PMM Site Web",
            email: "noreply@perfectmodels.ga"
        },
        to: [
            {
                email: notificationEmail,
                name: "Admin PMM"
            }
        ],
        subject: `Nouvelle Candidature Casting: ${application.firstName} ${application.lastName}`,
        htmlContent: emailHtml
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur API Brevo: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        console.log("Email de notification envoyé avec succès !");

    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail de notification:", error);
    }
}