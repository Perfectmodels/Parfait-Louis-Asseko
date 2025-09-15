

import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PrintableCastingSheet from '../components/icons/PrintableCastingSheet';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [filter, setFilter] = useState<CastingApplicationStatus | 'Toutes'>('Nouveau');
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [printingApp, setPrintingApp] = useState<CastingApplication | null>(null);

    useEffect(() => {
        if (data?.castingApplications) {
            setLocalApps([...data.castingApplications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        }
    }, [data?.castingApplications, isInitialized]);
    
    const filteredApps = useMemo(() => {
        if (filter === 'Toutes') return localApps;
        return localApps.filter(app => app.status === filter);
    }, [filter, localApps]);

    const handleDelete = async (appId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
            if (!data) return;
            const updatedApps = localApps.filter(app => app.id !== appId);
            await saveData({ ...data, castingApplications: updatedApps });
        }
    };

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        if (!data) return;
        const updatedApps: CastingApplication[] = localApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        await saveData({ ...data, castingApplications: updatedApps });
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
    };

    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        const modelExists = data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());
        if (modelExists) {
            alert("Un mannequin avec ce nom existe déjà. Impossible de créer un duplicata.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");

        const initial = app.firstName.charAt(0).toUpperCase();
        const modelsWithSameInitial = data.models.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
        const existingNumbers = modelsWithSameInitial.map(m => {
            const numPart = m.username.replace(`Man-PMM${initial}`, '');
            return parseInt(numPart, 10) || 0;
        });
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
        const password = `${sanitizeForPassword(app.firstName)}${currentYear}`;
        const id = `${app.lastName.toLowerCase()}-${app.firstName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '') + `-${app.id}`;

        let experienceText = "Expérience à renseigner par l'administrateur.";
        switch (app.experience) {
            case 'none': experienceText = "Débutant(e) sans expérience préalable, prêt(e) à apprendre les bases du métier."; break;
            case 'beginner': experienceText = "A déjà participé à quelques shootings photo en amateur ou pour de petites marques."; break;
            case 'intermediate': experienceText = "A une expérience préalable en agence et a participé à des défilés ou des campagnes locales."; break;
            case 'professional': experienceText = "Carrière de mannequin professionnel(le) établie avec un portfolio solide."; break;
        }
        
        const age = app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : undefined;

        const newModel: Model = {
            id: id,
            name: `${app.firstName} ${app.lastName}`,
            username: username,
            password: password,
            email: app.email,
            phone: app.phone,
            age: age,
            height: `${app.height}cm`,
            gender: app.gender,
            location: app.city,
            imageUrl: `https://i.ibb.co/fVBxPNTP/T-shirt.png`, // Placeholder image
            isPublic: false, // Default to private
            distinctions: [],
            measurements: {
                chest: `${app.chest || '0'}cm`,
                waist: `${app.waist || '0'}cm`,
                hips: `${app.hips || '0'}cm`,
                shoeSize: `${app.shoeSize || '0'}`,
            },
            categories: ['Défilé', 'Commercial'],
            experience: experienceText,
            journey: "Parcours à renseigner par l'administrateur.",
            quizScores: {}
        };

        const updatedModels = [...data.models, newModel];
        const updatedApps: CastingApplication[] = data.castingApplications.map(localApp => localApp.id === app.id ? { ...localApp, status: 'Accepté' } : localApp);

        try {
            await saveData({ ...data, models: updatedModels, castingApplications: updatedApps });
            alert(`Le mannequin ${newModel.name} a été créé avec succès et la candidature a été marquée comme "Accepté".`);
            setSelectedApp(null); // Close modal on success
        } catch (error) {
            console.error("Erreur lors de la création du mannequin:", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };
    
    const getStatusColor = (status: CastingApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Présélectionné': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    }

    const statusOptions: (CastingApplicationStatus | 'Toutes')[] = ['Toutes', 'Nouveau', 'Présélectionné', 'Accepté', 'Refusé'];

    if (printingApp) {
        return <PrintableCastingSheet app={printingApp} juryMembers={data?.juryMembers || []} onDonePrinting={() => setPrintingApp(null)} />;
    }

    return (
        <>
            <SEO title="Admin - Candidatures Casting" noIndex />
            <div>
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Candidatures Casting</h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    {statusOptions.map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Nom</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Âge</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Taille</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                        <td className="p-4 font-semibold">{app.firstName} {app.lastName}</td>
                                        <td className="p-4 hidden sm:table-cell">{app.birthDate ? `${new Date().getFullYear() - new Date(app.birthDate).getFullYear()} ans` : 'N/A'}</td>
                                        <td className="p-4 hidden sm:table-cell">{app.height} cm</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-4">
                                                <button onClick={() => setSelectedApp(app)} className="text-pm-gold/70 hover:text-pm-gold"><EyeIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(app.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredApps.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune candidature trouvée.</p>}
                    </div>
                </div>
            </div>
        {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} getStatusColor={getStatusColor} onValidateAndCreateModel={handleValidateAndCreateModel} />}
        </>
    );
};

const ApplicationModal: React.FC<{
    app: CastingApplication, 
    onClose: () => void, 
    onUpdateStatus: (id: string, status: CastingApplicationStatus) => void, 
    getStatusColor: (status: CastingApplicationStatus) => string,
    onValidateAndCreateModel: (app: CastingApplication) => void,
}> = ({ app, onClose, onUpdateStatus, getStatusColor, onValidateAndCreateModel }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Candidature de {app.firstName} {app.lastName}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section title="Informations Personnelles">
                        <InfoItem label="Nom complet" value={`${app.firstName} ${app.lastName}`} />
                        <InfoItem label="Date de naissance" value={app.birthDate} />
                        <InfoItem label="Email" value={app.email} />
                        <InfoItem label="Téléphone" value={app.phone} />
                        <InfoItem label="Nationalité" value={app.nationality} />
                        <InfoItem label="Ville" value={app.city} />
                        <InfoItem label="Genre" value={app.gender} />
                    </Section>
                     <Section title="Mensurations & Physique">
                        <InfoItem label="Taille" value={`${app.height} cm`} />
                        <InfoItem label="Poids" value={`${app.weight} kg`} />
                        <InfoItem label="Poitrine" value={`${app.chest} cm`} />
                        <InfoItem label="Taille (vêtement)" value={`${app.waist} cm`} />
                        <InfoItem label="Hanches" value={`${app.hips} cm`} />
                        <InfoItem label="Pointure" value={app.shoeSize} />
                        <InfoItem label="Couleur des yeux" value={app.eyeColor} />
                        <InfoItem label="Couleur des cheveux" value={app.hairColor} />
                    </Section>
                    <div className="md:col-span-2">
                        <Section title="Expérience & Portfolio">
                            <InfoItem label="Niveau d'expérience" value={app.experience} />
                            <InfoItem label="Instagram" value={app.instagram} />
                            <InfoItem label="Portfolio" value={app.portfolioLink} />
                        </Section>
                    </div>
                     <div className="md:col-span-2">
                        <Section title="Statut">
                            <div className="flex items-center gap-2 flex-wrap">
                                {(['Nouveau', 'Présélectionné', 'Accepté', 'Refusé'] as const).map(status => (
                                    <button key={status} onClick={() => onUpdateStatus(app.id, status)} className={`px-2 py-0.5 text-xs font-bold rounded-full border transition-all ${app.status === status ? getStatusColor(status) : 'border-pm-off-white/50 text-pm-off-white/80 hover:bg-pm-dark'}`}>
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </Section>
                    </div>
                </main>
                 <footer className="p-4 border-t border-pm-gold/20 flex justify-end items-center gap-4">
                    {app.status === 'Présélectionné' && (
                        <button onClick={() => onValidateAndCreateModel(app)} className="px-4 py-2 text-sm bg-green-600 text-white font-bold rounded-full hover:bg-green-500">
                            Valider & Créer Profil Mannequin
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h3 className="text-lg font-bold text-pm-gold mb-3 border-b border-pm-gold/20 pb-1">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const InfoItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-3 text-sm">
        <strong className="text-pm-off-white/70 col-span-1">{label}:</strong>
        <span className="truncate col-span-2">{value}</span>
    </div>
);

export default AdminCasting;
