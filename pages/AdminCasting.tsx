
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { CastingApplication, CastingApplicationStatus, Model } from '../types';
import SEO from '../components/SEO';
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [filter, setFilter] = useState<CastingApplicationStatus | 'Toutes'>('Toutes');
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);

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
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u0027]/g, "").replace(/[^a-z0-9-]/g, "");

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
            imageUrl: `https://picsum.photos/seed/${id}/800/1200`,
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
        const updatedApps: CastingApplication[] = localApps.map(localApp => localApp.id === app.id ? { ...localApp, status: 'Accepté' } : localApp);

        try {
            await saveData({ ...data, models: updatedModels, castingApplications: updatedApps });
            alert(`Le mannequin ${newModel.name} a été créé avec succès et la candidature a été marquée comme "Accepté".`);
            setSelectedApp(null);
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
    
    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return age > 0 ? `${age} ans` : 'N/A';
    };

    return (
        <>
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Candidatures" noIndex />
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <ReactRouterDOM.Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </ReactRouterDOM.Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Candidatures Casting</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Présélectionné', 'Accepté', 'Refusé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all duration-300 ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom</th>
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Âge</th>
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Taille</th>
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden sm:table-cell">Date</th>
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Statut</th>
                                    <th className="p-3 md:p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-3 md:p-4 font-semibold">{app.firstName} {app.lastName}</td>
                                        <td className="p-3 md:p-4 text-pm-off-white/80 hidden md:table-cell">{calculateAge(app.birthDate)}</td>
                                        <td className="p-3 md:p-4 text-pm-off-white/80 hidden md:table-cell">{app.height} cm</td>
                                        <td className="p-3 md:p-4 text-pm-off-white/80 text-sm hidden sm:table-cell">{new Date(app.submissionDate).toLocaleDateString()}</td>
                                        <td className="p-3 md:p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                        <td className="p-3 md:p-4">
                                            <div className="flex items-center justify-end gap-4">
                                                <button onClick={() => setSelectedApp(app)} className="text-pm-gold/70 hover:text-pm-gold"><EyeIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(app.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredApps.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune candidature trouvée pour ce filtre.</p>}
                    </div>
                </div>
            </div>
        </div>
        {selectedApp && <ApplicationModal app={selectedApp} data={data} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} onValidateAndCreateModel={handleValidateAndCreateModel} getStatusColor={getStatusColor} />}
        </>
    );
};

const ApplicationModal: React.FC<{app: CastingApplication, data: AppData | null, onClose: () => void, onUpdateStatus: (id: string, status: CastingApplicationStatus) => void, onValidateAndCreateModel: (app: CastingApplication) => void, getStatusColor: (status: CastingApplicationStatus) => string}> = ({ app, data, onClose, onUpdateStatus, onValidateAndCreateModel, getStatusColor }) => {
    
    const actionButtonClasses = "w-full text-center p-2 rounded-md font-bold uppercase text-xs tracking-wider border transition-colors hover:bg-opacity-30";
    
    const juryScores = app.scores ? Object.entries(app.scores) : [];
    const overallScores = juryScores.map(([, score]) => score.overall);
    const averageScore = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length).toFixed(1) : null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl shadow-pm-gold/10 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Candidature de {app.firstName} {app.lastName}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                             <Section title="Informations Personnelles">
                                {app.passageNumber && <InfoItem label="N° de Passage" value={`#${String(app.passageNumber).padStart(3, '0')}`} />}
                                <InfoItem label="Nom" value={`${app.firstName} ${app.lastName}`} />
                                <InfoItem label="Email" value={app.email} />
                                <InfoItem label="Téléphone" value={app.phone} />
                                <InfoItem label="Date de Naissance" value={app.birthDate} />
                                <InfoItem label="Genre" value={app.gender} />
                                <InfoItem label="Nationalité" value={app.nationality} />
                                <InfoItem label="Ville" value={app.city} />
                             </Section>
                             <Section title="Mensurations">
                                <InfoItem label="Taille" value={`${app.height} cm`} />
                                <InfoItem label="Poids" value={`${app.weight} kg`} />
                                <InfoItem label="Pointure" value={`${app.shoeSize} EU`} />
                                <InfoItem label="Poitrine" value={app.chest ? `${app.chest} cm` : 'N/A'} />
                                <InfoItem label="Taille (vêtement)" value={app.waist ? `${app.waist} cm` : 'N/A'} />
                                <InfoItem label="Hanches" value={app.hips ? `${app.hips} cm` : 'N/A'} />
                                <InfoItem label="Yeux" value={app.eyeColor} />
                                <InfoItem label="Cheveux" value={app.hairColor} />
                             </Section>
                             <Section title="Expérience">
                                <InfoItem label="Niveau" value={app.experience} />
                                <InfoItem label="Instagram" value={app.instagram || 'N/A'} />
                                <InfoItem label="Portfolio" value={app.portfolioLink ? <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-pm-gold underline">{app.portfolioLink}</a> : 'N/A'} />
                             </Section>
                        </div>
                        <div className="space-y-4">
                            <Section title="Actions">
                                <div className="flex flex-col gap-2">
                                    {app.status === 'Nouveau' && (
                                        <button onClick={() => onUpdateStatus(app.id, 'Présélectionné')} className={`${actionButtonClasses} bg-yellow-500/10 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/20`}>
                                            Présélectionner
                                        </button>
                                    )}
                                    {app.status === 'Présélectionné' && (
                                        <button onClick={() => onValidateAndCreateModel(app)} className={`${actionButtonClasses} bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20`}>
                                            Accepter & Créer Profil Mannequin
                                        </button>
                                    )}
                                    {app.status !== 'Refusé' && app.status !== 'Accepté' && (
                                        <button onClick={() => onUpdateStatus(app.id, 'Refusé')} className={`${actionButtonClasses} bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20`}>
                                            Refuser
                                        </button>
                                    )}
                                    <p className="text-xs text-center text-pm-off-white/60 pt-2">
                                        Statut actuel: <span className={`font-bold px-2 py-1 rounded ${getStatusColor(app.status).replace('border', '')}`}>{app.status}</span>
                                    </p>
                                </div>
                            </Section>
                            <Section title={`Notes du Jury ${averageScore ? `(Moyenne: ${averageScore}/10)` : ''}`}>
                                {juryScores.length > 0 ? (
                                    juryScores.map(([juryId, score]) => {
                                        const juryMember = data?.juryMembers.find(j => j.id === juryId);
                                        return (
                                            <div key={juryId} className="p-2 bg-pm-dark/50 rounded mt-2">
                                                <p className="font-bold text-pm-off-white/80">{juryMember?.name || juryId}</p>
                                                <div className="text-xs grid grid-cols-2 gap-x-2">
                                                    <span>Physique: {score.physique}/10</span>
                                                    <span>Présence: {score.presence}/10</span>
                                                    <span>Photogénie: {score.photogenie}/10</span>
                                                    <span>Potentiel: {score.potentiel}/10</span>
                                                </div>
                                                {score.notes && <p className="text-xs italic mt-1 text-pm-off-white/60">Notes: {score.notes}</p>}
                                                <p className="text-right font-bold text-pm-gold">Note Globale: {score.overall.toFixed(1)}/10</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-pm-off-white/60">Aucune note n'a encore été attribuée.</p>
                                )}
                            </Section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-black p-4 border border-pm-gold/10 rounded-md">
        <h3 className="text-lg font-bold text-pm-gold mb-3">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);
const InfoItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-2 text-sm">
        <strong className="text-pm-off-white/70">{label}:</strong>
        <span className="truncate">{value}</span>
    </div>
);

export default AdminCasting;