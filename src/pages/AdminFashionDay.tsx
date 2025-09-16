
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationStatus, FashionDayApplicationRole } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminFashionDayApps: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<FashionDayApplication[]>([]);
    const [statusFilter, setStatusFilter] = useState<FashionDayApplicationStatus | 'Toutes'>('Toutes');
    const [roleFilter, setRoleFilter] = useState<FashionDayApplicationRole | 'Tous'>('Tous');
    const [selectedApp, setSelectedApp] = useState<FashionDayApplication | null>(null);

    useEffect(() => {
        if (data?.fashionDayApplications) {
            setLocalApps([...data.fashionDayApplications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        }
    }, [data?.fashionDayApplications, isInitialized]);
    
    const filteredApps = useMemo(() => {
        return localApps
            .filter(app => statusFilter === 'Toutes' || app.status === statusFilter)
            .filter(app => roleFilter === 'Tous' || app.role === roleFilter);
    }, [statusFilter, roleFilter, localApps]);

    const handleDelete = async (appId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
            if (!data) return;
            const updatedApps = localApps.filter(app => app.id !== appId);
            await saveData({ ...data, fashionDayApplications: updatedApps });
        }
    };

    const handleUpdateStatus = async (appId: string, newStatus: FashionDayApplicationStatus) => {
        if (!data) return;
        const updatedApps = localApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        await saveData({ ...data, fashionDayApplications: updatedApps });
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
    };
    
    const getStatusColor = (status: FashionDayApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'En attente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    }

    const statusOptions: (FashionDayApplicationStatus | 'Toutes')[] = ['Toutes', 'Nouveau', 'En attente', 'Accepté', 'Refusé'];
    const roleOptions: (FashionDayApplicationRole | 'Tous')[] = ['Tous', 'Mannequin', 'Styliste', 'Partenaire', 'Photographe', 'MUA', 'Autre'];

    return (
        <>
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Candidatures Fashion Day" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Candidatures Perfect Fashion Day</h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div>
                        <label className="text-xs mr-2">Statut:</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="admin-input !w-auto !inline-block text-sm">
                            {statusOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs mr-2">Rôle:</label>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="admin-input !w-auto !inline-block text-sm">
                            {roleOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Nom</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Rôle</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Date</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                        <td className="p-4 font-semibold">{app.name}</td>
                                        <td className="p-4 hidden sm:table-cell">{app.role}</td>
                                        <td className="p-4 text-sm hidden sm:table-cell">{new Date(app.submissionDate).toLocaleDateString()}</td>
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
        </div>
        {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} getStatusColor={getStatusColor} />}
        </>
    );
};

const ApplicationModal: React.FC<{app: FashionDayApplication, onClose: () => void, onUpdateStatus: (id: string, status: FashionDayApplicationStatus) => void, getStatusColor: (status: FashionDayApplicationStatus) => string}> = ({ app, onClose, onUpdateStatus, getStatusColor }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Candidature de {app.name}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow space-y-4">
                    <Section title="Informations">
                        <InfoItem label="Nom" value={app.name} />
                        <InfoItem label="Email" value={app.email} />
                        <InfoItem label="Téléphone" value={app.phone} />
                        <InfoItem label="Rôle" value={app.role} />
                        <InfoItem label="Date" value={new Date(app.submissionDate).toLocaleString()} />
                    </Section>
                    <Section title="Message">
                        <p className="text-sm whitespace-pre-wrap">{app.message}</p>
                    </Section>
                     <Section title="Statut">
                        <div className="flex items-center gap-2 flex-wrap">
                            {(['Nouveau', 'En attente', 'Accepté', 'Refusé'] as const).map(status => (
                                <button key={status} onClick={() => onUpdateStatus(app.id, status)} className={`px-2 py-0.5 text-xs font-bold rounded-full border transition-all ${app.status === status ? getStatusColor(status) : 'border-pm-off-white/50 text-pm-off-white/80 hover:bg-pm-dark'}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </Section>
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
    <div className="grid grid-cols-3 text-sm">
        <strong className="text-pm-off-white/70 col-span-1">{label}:</strong>
        <span className="truncate col-span-2">{value}</span>
    </div>
);

export default AdminFashionDayApps;