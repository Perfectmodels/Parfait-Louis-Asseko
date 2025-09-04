


import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus } from '../types';
import SEO from '../components/SEO';
// FIX: Changed react-router-dom import to use a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [filter, setFilter] = useState<CastingApplicationStatus | 'Toutes'>('Toutes');
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);

    useEffect(() => {
        if (data?.castingApplications) {
            // FIX: Explicitly type appsArray as CastingApplication[] to resolve type inference issues with Object.values and the sort method.
            const appsArray: CastingApplication[] = Array.isArray(data.castingApplications) 
                ? data.castingApplications 
                : Object.values(data.castingApplications);
            setLocalApps(appsArray.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
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
        const updatedApps = localApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        await saveData({ ...data, castingApplications: updatedApps });
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
    };
    
    const getStatusColor = (status: CastingApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Présélectionné': return 'bg-green-500/20 text-green-300 border-green-500';
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
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Candidatures Casting</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Présélectionné', 'Refusé'] as const).map(f => (
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
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Âge</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Taille</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden sm:table-cell">Date</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-4 font-semibold">{app.firstName} {app.lastName}</td>
                                        <td className="p-4 text-pm-off-white/80 hidden md:table-cell">{calculateAge(app.birthDate)}</td>
                                        <td className="p-4 text-pm-off-white/80 hidden md:table-cell">{app.height} cm</td>
                                        <td className="p-4 text-pm-off-white/80 text-sm hidden sm:table-cell">{new Date(app.submissionDate).toLocaleDateString()}</td>
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
                        {filteredApps.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune candidature trouvée pour ce filtre.</p>}
                    </div>
                </div>
            </div>
        </div>
        {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} getStatusColor={getStatusColor} />}
        </>
    );
};

const ApplicationModal: React.FC<{app: CastingApplication, onClose: () => void, onUpdateStatus: (id: string, status: CastingApplicationStatus) => void, getStatusColor: (status: CastingApplicationStatus) => string}> = ({ app, onClose, onUpdateStatus, getStatusColor }) => {
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
                                <InfoItem label="Nom" value={`${app.firstName} ${app.lastName}`} />
                                <InfoItem label="Email" value={app.email} />
                                <InfoItem label="Téléphone" value={app.phone} />
                                <InfoItem label="Date de Naissance" value={app.birthDate} />
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
                            <Section title="Statut">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {(['Nouveau', 'Présélectionné', 'Refusé'] as const).map(status => (
                                        <button key={status} onClick={() => onUpdateStatus(app.id, status)} className={`px-2 py-0.5 text-xs font-bold rounded-full border transition-all ${app.status === status ? getStatusColor(status) : 'border-pm-off-white/50 text-pm-off-white/80 hover:bg-pm-dark'}`}>
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </Section>
                            <Section title="Photos">
                                <PhotoItem label="Portrait" url={app.photoPortraitUrl} />
                                <PhotoItem label="Plein-pied" url={app.photoFullBodyUrl} />
                                <PhotoItem label="Profil" url={app.photoProfileUrl} />
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
const PhotoItem: React.FC<{label: string, url: string | null}> = ({label, url}) => (
    <div>
        <p className="text-sm font-bold mb-1">{label}</p>
        {url ? (
            <a href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={label} className="w-full h-auto object-cover rounded-md border-2 border-pm-gold/50 hover:border-pm-gold" />
            </a>
        ) : <p className="text-xs text-pm-off-white/60">Non fournie</p>}
    </div>
);

export default AdminCasting;