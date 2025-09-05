import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import SEO from '../components/SEO';
import { UserPlusIcon, PrinterIcon } from '@heroicons/react/24/outline';

const RegistrationCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const staffName = sessionStorage.getItem('userName');

    const registeredApplicants = useMemo(() => {
        return data?.castingApplications
            .filter(app => app.passageNumber)
            .sort((a, b) => a.passageNumber! - b.passageNumber!) || [];
    }, [data?.castingApplications]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !formData.firstName.trim() || !formData.lastName.trim()) return;

        setIsSubmitting(true);

        const existingPassageNumbers = data.castingApplications
            .map(app => app.passageNumber)
            .filter((num): num is number => num !== undefined && num !== null);
        
        const nextPassageNumber = existingPassageNumbers.length > 0 ? Math.max(...existingPassageNumbers) + 1 : 1;

        const newApplicant: Partial<CastingApplication> = {
            id: `reg-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Présélectionné', // Automatically prescreened as they are on-site
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            passageNumber: nextPassageNumber,
            // Fill with default/empty values
            birthDate: '', email: '', nationality: '', city: '', gender: 'Femme', height: '', weight: '',
            chest: '', waist: '', hips: '', shoeSize: '', eyeColor: '', hairColor: '', experience: 'none',
            instagram: '', portfolioLink: ''
        };

        const updatedApplications = [...data.castingApplications, newApplicant as CastingApplication];

        try {
            await saveData({ ...data, castingApplications: updatedApplications });
            setFormData({ firstName: '', lastName: '', phone: '' });
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isInitialized) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Chargement...</div>;
    }

    return (
        <>
            <SEO title={`Enregistrement Casting - ${staffName}`} noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-playfair text-pm-gold">Enregistrement Casting</h1>
                    <p className="text-pm-off-white/80 mb-8">Connecté en tant que {staffName}.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Registration Form */}
                        <div className="lg:col-span-1">
                            <form onSubmit={handleRegister} className="bg-black p-6 border border-pm-gold/20 rounded-lg space-y-4">
                                <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-2">
                                    <UserPlusIcon className="w-6 h-6" />
                                    Ajouter un Postulant
                                </h2>
                                <FormInput label="Prénom" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                <FormInput label="Nom" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                <FormInput label="Téléphone (Optionnel)" name="phone" value={formData.phone} onChange={handleInputChange} />
                                <button type="submit" disabled={isSubmitting} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </form>
                        </div>

                        {/* Registered List */}
                        <div className="lg:col-span-2">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-playfair text-pm-gold">Liste des Passages</h2>
                                <button onClick={handlePrint} className="print-hide inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                                    <PrinterIcon className="w-5 h-5"/> Imprimer la Liste
                                </button>
                            </div>
                            <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden printable-content">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-pm-dark/50">
                                            <tr className="border-b border-pm-gold/20">
                                                <th className="p-3 uppercase text-xs tracking-wider">Passage #</th>
                                                <th className="p-3 uppercase text-xs tracking-wider">Nom Complet</th>
                                                <th className="p-3 uppercase text-xs tracking-wider hidden sm:table-cell">Téléphone</th>
                                                <th className="p-3 uppercase text-xs tracking-wider hidden sm:table-cell">Heure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredApplicants.map(app => (
                                                <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                                    <td className="p-3 font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</td>
                                                    <td className="p-3 font-semibold">{app.firstName} {app.lastName}</td>
                                                    <td className="p-3 text-sm hidden sm:table-cell">{app.phone || 'N/A'}</td>
                                                    <td className="p-3 text-xs hidden sm:table-cell">{new Date(app.submissionDate).toLocaleTimeString('fr-FR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {registeredApplicants.length === 0 && (
                                        <p className="text-center p-8 text-pm-off-white/60">Aucun postulant enregistré pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-pm-off-white/70 mb-2">{props.label}</label>
        <input {...props} id={props.name} type="text" className="admin-input" />
    </div>
);


export default RegistrationCasting;