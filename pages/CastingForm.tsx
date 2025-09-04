

import React, { useState } from 'react';
import SEO from '../components/SEO';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, PhotoIcon, UserIcon, ArrowsRightLeftIcon, DocumentCheckIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';

const initialFormData = {
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  nationality: '',
  city: '',
  height: '',
  weight: '',
  chest: '',
  waist: '',
  hips: '',
  shoeSize: '',
  eyeColor: '',
  hairColor: '',
  experience: 'none',
  instagram: '',
  portfolioLink: '',
  photoPortraitUrl: '',
  photoFullBodyUrl: '',
  photoProfileUrl: '',
  agreedToTerms: false,
};

type FormData = typeof initialFormData;


const CastingForm: React.FC = () => {
  const { data, saveData } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Infos Personnelles', icon: UserIcon },
    { number: 2, title: 'Mensurations', icon: ArrowsRightLeftIcon },
    { number: 3, title: 'Expérience & Photos', icon: PhotoIcon },
    { number: 4, title: 'Confirmation', icon: DocumentCheckIcon },
  ];
  
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const createHtmlBody = (data: FormData): string => {
      return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h1 style="color: #D4AF37;">Nouvelle Candidature Casting</h1>
            <p>Une nouvelle candidature a été soumise via le site web et sauvegardée dans le panel d'administration.</p>
            
            <h2 style="color: #D4AF37; border-bottom: 1px solid #eee; padding-bottom: 5px;">Informations Personnelles</h2>
            <table cellpadding="5">
                <tr><td><strong>Nom complet:</strong></td><td>${data.firstName} ${data.lastName}</td></tr>
                <tr><td><strong>Date de naissance:</strong></td><td>${data.birthDate}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
                <tr><td><strong>Téléphone:</strong></td><td>${data.phone}</td></tr>
                <tr><td><strong>Nationalité:</strong></td><td>${data.nationality}</td></tr>
                <tr><td><strong>Ville:</strong></td><td>${data.city}</td></tr>
            </table>

            <h2 style="color: #D4AF37; border-bottom: 1px solid #eee; padding-bottom: 5px;">Mensurations</h2>
            <table cellpadding="5">
                <tr><td><strong>Taille:</strong></td><td>${data.height} cm</td></tr>
                <tr><td><strong>Poids:</strong></td><td>${data.weight} kg</td></tr>
                <tr><td><strong>Pointure:</strong></td><td>${data.shoeSize} EU</td></tr>
                <tr><td><strong>Poitrine:</strong></td><td>${data.chest || 'N/A'} cm</td></tr>
                <tr><td><strong>Tour de taille:</strong></td><td>${data.waist || 'N/A'} cm</td></tr>
                <tr><td><strong>Hanches:</strong></td><td>${data.hips || 'N/A'} cm</td></tr>
                <tr><td><strong>Couleur des yeux:</strong></td><td>${data.eyeColor}</td></tr>
                <tr><td><strong>Couleur des cheveux:</strong></td><td>${data.hairColor}</td></tr>
            </table>

            <h2 style="color: #D4AF37; border-bottom: 1px solid #eee; padding-bottom: 5px;">Expérience & Liens</h2>
             <table cellpadding="5">
                <tr><td><strong>Niveau d'expérience:</strong></td><td>${data.experience}</td></tr>
                <tr><td><strong>Instagram:</strong></td><td><a href="https://instagram.com/${data.instagram.replace('@','')}">${data.instagram || 'N/A'}</a></td></tr>
                <tr><td><strong>Portfolio:</strong></td><td><a href="${data.portfolioLink}">${data.portfolioLink || 'N/A'}</a></td></tr>
            </table>

            <h2 style="color: #D4AF37; border-bottom: 1px solid #eee; padding-bottom: 5px;">Photos</h2>
            <p><strong>Portrait:</strong> ${data.photoPortraitUrl ? `<a href="${data.photoPortraitUrl}">Voir la photo</a>` : 'Non fournie'}</p>
            <p><strong>Plein-pied:</strong> ${data.photoFullBodyUrl ? `<a href="${data.photoFullBodyUrl}">Voir la photo</a>` : 'Non fournie'}</p>
            <p><strong>Profil:</strong> ${data.photoProfileUrl ? `<a href="${data.photoProfileUrl}">Voir la photo</a>` : 'Non fournie'}</p>
        </div>
      `;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!formData.agreedToTerms) {
        alert("Vous devez accepter les termes pour soumettre votre candidature.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
        const newApplication: Omit<CastingApplication, 'agreedToTerms'> = {
            id: Date.now().toString(),
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            ...formData,
        };

        const updatedApplications = [...data!.castingApplications, newApplication];
        
        // Priorité 1: Sauvegarder dans la base de données.
        await saveData({ ...data!, castingApplications: updatedApplications });

        // Priorité 2: Confirmer le succès à l'utilisateur (ce qui change la vue).
        setIsSubmitted(true);

        // Action secondaire (non bloquante): Envoyer l'email de notification.
        if (!data!.apiKeys?.emailApiKey) {
            console.warn("Clé API Octopus Mail manquante. L'email de notification n'a pas été envoyé, mais la candidature est enregistrée.");
            return;
        }

        const htmlContent = createHtmlBody(formData);
        const payload = {
            from: 'casting@perfectmodels.ga',
            to: 'contact@perfectmodels.ga',
            subject: `Nouvelle Candidature Casting - ${formData.firstName} ${formData.lastName}`,
            html: htmlContent,
        };

        // L'envoi de l'email est "fire-and-forget" pour ne pas bloquer l'UI.
        fetch('https://octopus-mail.p.rapidapi.com/mail/send', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'octopus-mail.p.rapidapi.com',
                'x-rapidapi-key': data!.apiKeys.emailApiKey,
            },
            body: JSON.stringify(payload),
        }).then(response => {
            if (!response.ok) {
                response.text().then(text => {
                    console.error("L'envoi de l'email de notification a échoué, mais la candidature a été sauvegardée.", text);
                });
            }
        }).catch(emailError => {
            console.error("Erreur réseau lors de l'envoi de l'email de notification.", emailError);
        });

    } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors de la sauvegarde de votre candidature. Veuillez réessayer.');
        setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
      return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen flex items-center justify-center">
            <div className="text-center bg-black p-12 border border-pm-gold/30 shadow-lg shadow-pm-gold/10">
                <CheckCircleIcon className="w-20 h-20 text-pm-gold mx-auto mb-6"/>
                <h1 className="text-4xl font-playfair text-pm-gold">Candidature Envoyée !</h1>
                <p className="mt-4 text-pm-off-white/80 max-w-md">
                    Merci d'avoir postulé. Votre candidature a été envoyée avec succès. Nous l'examinerons attentivement et vous contacterons si votre profil correspond.
                </p>
            </div>
        </div>
      );
  }

  if (!data) {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen flex items-center justify-center">
            <p className="text-pm-gold animate-pulse">Chargement du formulaire...</p>
        </div>
    );
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title="Postuler au Casting | Formulaire en Ligne"
        description="Prêt(e) à rejoindre l'aventure Perfect Models Management ? Soumettez votre candidature en ligne via notre formulaire sécurisé. Photos, mensurations, informations : tout est là pour vous lancer."
        keywords="formulaire casting mannequin, postuler agence mannequin, s'inscrire casting, candidature mannequin gabon"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="text-center mb-12">
            <h1 className="text-5xl font-playfair text-pm-gold">Devenez notre Prochain Talent</h1>
            <p className="mt-4 text-pm-off-white/80 max-w-2xl mx-auto">
                Remplissez ce formulaire avec attention. C'est votre première opportunité de nous montrer qui vous êtes.
            </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-12">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center text-center w-1/4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.number ? 'bg-pm-gold border-pm-gold text-pm-dark' : 'bg-black border-pm-gold/50 text-pm-gold'}`}>
                                <step.icon className="w-6 h-6"/>
                            </div>
                            <p className={`mt-2 text-[10px] sm:text-xs uppercase tracking-wider font-bold ${currentStep >= step.number ? 'text-pm-gold' : 'text-pm-off-white/60'}`}>{step.title}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${currentStep > step.number ? 'bg-pm-gold' : 'bg-pm-gold/30'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-black border border-pm-gold/20 p-8 md:p-12 shadow-lg shadow-black/30">
            {currentStep === 1 && <Step1 formData={formData} handleChange={handleChange} />}
            {currentStep === 2 && <Step2 formData={formData} handleChange={handleChange} />}
            {currentStep === 3 && <Step3 formData={formData} handleChange={handleChange} />}
            {currentStep === 4 && <Step4 formData={formData} handleChange={handleChange} />}
            
            {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Navigation */}
            <div className="mt-12 pt-6 border-t border-pm-gold/20 flex justify-between items-center">
                <button type="button" onClick={handlePrev} disabled={currentStep === 1 || isLoading} className="inline-flex items-center gap-2 px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Précédent
                </button>
                {currentStep < steps.length ? (
                     <button type="button" onClick={handleNext} disabled={isLoading} className="inline-flex items-center gap-2 px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30 disabled:opacity-50">
                        Suivant
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                ) : (
                    <button type="submit" disabled={!formData.agreedToTerms || isLoading} className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full hover:bg-white shadow-lg shadow-pm-gold/30 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Envoi en cours...' : 'Soumettre la Candidature'}
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

// --- FORM COMPONENTS ---
const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: any) => void, type?: string, required?: boolean, placeholder?: string, helpText?: string}> = ({label, name, value, onChange, type="text", required=true, placeholder, helpText}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="admin-input" />
        {helpText && <p className="mt-1 text-xs text-pm-off-white/60">{helpText}</p>}
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: (e: any) => void, children: React.ReactNode}> = ({label, name, value, onChange, children}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="admin-input">
            {children}
        </select>
    </div>
);


// --- STEP COMPONENTS ---
const Step1: React.FC<{formData: FormData, handleChange: any}> = ({formData, handleChange}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-playfair text-pm-gold border-b border-pm-gold/20 pb-3">Étape 1: Informations Personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} />
            <FormInput label="Nom de famille" name="lastName" value={formData.lastName} onChange={handleChange} />
            <FormInput label="Date de naissance" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" />
            <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
            <FormInput label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
            <FormInput label="Nationalité" name="nationality" value={formData.nationality} onChange={handleChange} />
            <FormInput label="Ville de résidence actuelle" name="city" value={formData.city} onChange={handleChange} />
        </div>
    </div>
);

const Step2: React.FC<{formData: FormData, handleChange: any}> = ({formData, handleChange}) => (
     <div className="space-y-6">
        <h2 className="text-2xl font-playfair text-pm-gold border-b border-pm-gold/20 pb-3">Étape 2: Mensurations & Attributs Physiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FormInput label="Taille (cm)" name="height" value={formData.height} onChange={handleChange} type="number" placeholder="ex: 175" />
            <FormInput label="Poids (kg)" name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="ex: 55" />
            <FormInput label="Pointure (EU)" name="shoeSize" value={formData.shoeSize} onChange={handleChange} type="number" placeholder="ex: 40" />
            <FormInput label="Poitrine (cm)" name="chest" value={formData.chest} onChange={handleChange} type="number" placeholder="ex: 85" required={false} />
            <FormInput label="Taille (cm)" name="waist" value={formData.waist} onChange={handleChange} type="number" placeholder="ex: 62" required={false} />
            <FormInput label="Hanches (cm)" name="hips" value={formData.hips} onChange={handleChange} type="number" placeholder="ex: 90" required={false} />
            <FormInput label="Couleur des yeux" name="eyeColor" value={formData.eyeColor} onChange={handleChange} />
            <FormInput label="Couleur des cheveux" name="hairColor" value={formData.hairColor} onChange={handleChange} />
        </div>
        <div className="text-xs text-pm-off-white/60 p-4 bg-pm-dark/50 border border-pm-off-white/10 rounded-md">
            <strong>Comment prendre vos mensurations :</strong> Utilisez un mètre ruban. <strong>Poitrine :</strong> au point le plus fort. <strong>Taille :</strong> au creux de la taille, la partie la plus fine. <strong>Hanches :</strong> à l'endroit le plus large des hanches et fesses.
        </div>
    </div>
);

const Step3: React.FC<{formData: FormData, handleChange: any}> = ({formData, handleChange}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-playfair text-pm-gold border-b border-pm-gold/20 pb-3">Étape 3: Expérience & Photos</h2>
        <div className="space-y-6">
             <FormSelect label="Niveau d'expérience" name="experience" value={formData.experience} onChange={handleChange}>
                <option value="none">Aucune expérience</option>
                <option value="beginner">Débutant(e) (quelques shootings)</option>
                <option value="intermediate">Intermédiaire (expérience en agence)</option>
                <option value="professional">Professionnel(le) (carrière établie)</option>
            </FormSelect>
            <FormInput label="Lien Instagram" name="instagram" value={formData.instagram} onChange={handleChange} required={false} placeholder="@votreprofil"/>
            <FormInput label="Lien Book/Portfolio en ligne" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} required={false} />
        </div>
        <div className="space-y-6 pt-6 border-t border-pm-gold/20">
            <h3 className="text-lg font-bold text-pm-off-white">Vos Photos</h3>
             <p className="text-sm text-pm-off-white/70">
                Photos récentes (moins de 3 mois), sans maquillage, sans retouches, sur fond neutre et avec des vêtements près du corps (ex: jean slim et débardeur). 
                Utilisez un service comme <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="underline text-pm-gold">Postimages</a> pour héberger vos photos et collez les liens ci-dessous.
            </p>
            <FormInput label="URL Photo Portrait" name="photoPortraitUrl" value={formData.photoPortraitUrl} onChange={handleChange} helpText="Visage de face, cheveux tirés en arrière." />
            <FormInput label="URL Photo Plein-pied" name="photoFullBodyUrl" value={formData.photoFullBodyUrl} onChange={handleChange} helpText="Corps entier, de face." />
            <FormInput label="URL Photo de Profil" name="photoProfileUrl" value={formData.photoProfileUrl} onChange={handleChange} helpText="Corps entier, de profil." />
        </div>
    </div>
);
const Step4: React.FC<{formData: FormData, handleChange: any}> = ({formData, handleChange}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-playfair text-pm-gold border-b border-pm-gold/20 pb-3">Étape 4: Vérification et Soumission</h2>
        <p className="text-pm-off-white/80">Veuillez vérifier que toutes les informations sont correctes avant de soumettre votre candidature.</p>
        <div className="space-y-2 text-sm bg-pm-dark/50 p-4 border border-pm-off-white/10 rounded-md">
            <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Taille:</strong> {formData.height} cm</p>
            <p><strong>Photos:</strong> {formData.photoPortraitUrl ? 'Portrait ✅' : 'Portrait ❌'} | {formData.photoFullBodyUrl ? 'Plein-pied ✅' : 'Plein-pied ❌'} | {formData.photoProfileUrl ? 'Profil ✅' : 'Profil ❌'}</p>
        </div>
        <div className="pt-4">
             <label htmlFor="agreedToTerms" className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" id="agreedToTerms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-gray-300 text-pm-gold focus:ring-pm-gold bg-pm-dark"/>
                <span className="text-sm text-pm-off-white/80">
                    Je certifie que les informations fournies sont exactes et j'autorise Perfect Models Management à conserver mes données pour une durée de 2 ans dans le cadre de leur processus de casting.
                </span>
            </label>
        </div>
    </div>
);

export default CastingForm;
