
import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { FashionDayApplication, FashionDayApplicationRole } from '../types';

const FashionDayApplicationForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Mannequin' as FashionDayApplicationRole,
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data?.apiKeys?.emailApiKey) {
            setError("La configuration du service d'envoi d'email est manquante. Veuillez contacter l'administrateur.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const newApplication: FashionDayApplication = {
                id: Date.now().toString(),
                submissionDate: new Date().toISOString(),
                status: 'Nouveau',
                ...formData
            };

            const currentApplications = data.fashionDayApplications ? Object.values(data.fashionDayApplications) : [];
            const updatedApplications = [...currentApplications, newApplication];
            
            await saveData({ ...data, fashionDayApplications: updatedApplications });

            const emailHtmlBody = `
                <div style="font-family: sans-serif;">
                    <h2>Nouvelle Candidature - Perfect Fashion Day</h2>
                    <p><strong>Nom:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Téléphone:</strong> ${formData.phone}</p>
                    <p><strong>Rôle souhaité:</strong> ${formData.role}</p>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px; color: #333;">${formData.message}</p>
                </div>`;
            
            const payload = {
                from: 'event@perfectmodels.ga',
                to: data.contactInfo.email,
                subject: `Nouvelle Candidature PFD - ${formData.role}: ${formData.name}`,
                html: emailHtmlBody,
            };

            const response = await fetch('https://octopus-mail.p.rapidapi.com/mail/send', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'octopus-mail.p.rapidapi.com',
                    'x-rapidapi-key': data.apiKeys.emailApiKey,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("L'envoi de l'email de notification a échoué.");

            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
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
                      Merci pour votre intérêt. Votre candidature a été reçue. Nous l'examinerons et vous contacterons si votre profil correspond à nos besoins pour l'événement.
                  </p>
              </div>
          </div>
        );
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO 
                title="Participer au Perfect Fashion Day | Candidature"
                description="Vous êtes mannequin, styliste, partenaire ou photographe ? Postulez pour participer à la prochaine édition du Perfect Fashion Day et contribuez au plus grand événement mode du Gabon."
                keywords="participer défilé de mode, postuler fashion day, candidature styliste gabon, inscription événement mode"
            />
            <div className="container mx-auto px-6 max-w-2xl">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-playfair text-pm-gold">Participer à l'Événement</h1>
                    <p className="mt-4 text-pm-off-white/80 max-w-2xl mx-auto">
                        Remplissez ce formulaire pour soumettre votre candidature pour le prochain Perfect Fashion Day.
                    </p>
                </header>
                <form onSubmit={handleSubmit} className="bg-black border border-pm-gold/20 p-8 md:p-12 shadow-lg shadow-black/30 space-y-6">
                    <FormInput label="Nom complet" name="name" value={formData.name} onChange={handleChange} required />
                    <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} type="email" required />
                    <FormInput label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} type="tel" required />
                    <FormSelect label="Je postule en tant que..." name="role" value={formData.role} onChange={handleChange}>
                        <option>Mannequin</option>
                        <option>Styliste</option>
                        <option>Partenaire</option>
                        <option>Photographe</option>
                        <option>MUA</option>
                        <option>Autre</option>
                    </FormSelect>
                    <FormTextArea label="Votre message" name="message" value={formData.message} onChange={handleChange} placeholder="Présentez-vous, décrivez votre projet, vos motivations..." required />
                    
                    {error && (
                        <div className="p-3 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button type="submit" disabled={isLoading} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: any, type?: string, required?: boolean}> = ({label, name, value, onChange, type="text", required=true}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="admin-input" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: any, children: React.ReactNode}> = ({label, name, value, onChange, children}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="admin-input">
            {children}
        </select>
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: any, required?: boolean, placeholder?: string}> = ({label, name, value, onChange, required=true, placeholder}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={5} placeholder={placeholder} className="admin-input admin-textarea" />
    </div>
);

export default FashionDayApplicationForm;