
import React, { useState, useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model } from '../../../types';
import SEO from '../../../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminCasting: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<CastingApplicationStatus | 'Toutes'>('Nouveau');
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);

    const applications = useMemo(() => {
        if (!data?.castingApplications) return [];
        return [...data.castingApplications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.castingApplications]);

    const filteredApps = useMemo(() => {
        return applications
            .filter(app => filter === 'Toutes' || app.status === filter)
            .filter(app => 
                `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [applications, filter, searchTerm]);

    const handleDelete = async (appId: string) => {
        if (!data) return;
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
            const updatedApps = data.castingApplications.filter(app => app.id !== appId);
            try {
                await saveData({ ...data, castingApplications: updatedApps });
                toast.success("Candidature supprimée avec succès.");
            } catch {
                toast.error("Erreur lors de la suppression.");
            }
        }
    };

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        if (!data) return;
        const updatedApps = data.castingApplications.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        try {
            await saveData({ ...data, castingApplications: updatedApps });
            toast.success(`Statut de la candidature mis à jour: ${newStatus}`);
            if (selectedApp?.id === appId) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        } catch {
            toast.error("Erreur lors de la mise à jour du statut.");
        }
    };

    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        if (data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase())) {
            toast.error("Un mannequin avec ce nom existe déjà.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");
        const username = `Man-PMM${app.firstName.charAt(0).toUpperCase()}${String(data.models.length + 1).padStart(2, '0')}`;
        const password = `${sanitize(app.firstName)}${currentYear}`;
        const id = `${sanitize(app.lastName)}-${sanitize(app.firstName)}-${app.id.slice(0,4)}`;

        const newModel: Model = {
            id: id,
            name: `${app.firstName} ${app.lastName}`,
            username,
            password,
            email: app.email,
            phone: app.phone,
            age: app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : undefined,
            height: `${app.height}cm`,
            gender: app.gender,
            location: app.city,
            imageUrl: `https://i.ibb.co/fVBxPNTP/T-shirt.png`, // Placeholder
            isPublic: false,
            measurements: {
                chest: `${app.chest || '0'}cm`,
                waist: `${app.waist || '0'}cm`,
                hips: `${app.hips || '0'}cm`,
                shoeSize: `${app.shoeSize || '0'}`,
            },
            categories: ['Défilé', 'Commercial'],
            experience: app.experience || 'N/A',
            journey: "Parcours à renseigner.",
            quizScores: {}
        };

        try {
            const updatedModels = [...data.models, newModel];
            const updatedApps = data.castingApplications.map(a => a.id === app.id ? { ...a, status: 'Accepté' as const } : a);
            await saveData({ ...data, models: updatedModels, castingApplications: updatedApps });
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-pm-dark-green shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <p className="font-bold text-white">Mannequin Créé!</p>
                        <p className="text-sm text-gray-300">{newModel.name} a été ajouté(e).</p>
                    </div>
                    <div className="flex border-l border-gray-600">
                        <button onClick={() => navigate(`/admin/models?edit=${newModel.id}`)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-pm-gold hover:text-pm-gold-dark focus:outline-none focus:ring-2 focus:ring-pm-gold">
                            Voir Profil
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
            setSelectedApp(null);
        } catch (error) {
            toast.error("Erreur lors de la création du mannequin.");
            console.error(error);
        }
    };
    
    const statusOptions: (CastingApplicationStatus | 'Toutes')[] = ['Toutes', 'Nouveau', 'Présélectionné', 'Accepté', 'Refusé'];

    return (
        <>
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <SEO title="Admin - Candidatures Casting" noIndex />
                <div className="container mx-auto px-6">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour au Tableau de Bord
                    </Link>
                    <h1 className="admin-page-title">Candidatures Casting</h1>
                    <p className="admin-page-subtitle">Gérez les candidatures pour devenir mannequin.</p>

                    {/* Search and Filter Bar */}
                    <div className="my-8 p-4 bg-black/30 rounded-lg flex flex-wrap items-center gap-4">
                        <div className="relative flex-grow w-full md:w-auto">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-pm-off-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="admin-input pl-10 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-pm-off-white/50" />
                            <select value={filter} onChange={e => setFilter(e.target.value as any)} className="admin-input">
                                {statusOptions.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th className="hidden sm:table-cell">Âge</th>
                                        <th className="hidden sm:table-cell">Taille</th>
                                        <th>Statut</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApps.map(app => (
                                        <tr key={app.id}>
                                            <td className="font-semibold">{app.firstName} {app.lastName}</td>
                                            <td className="hidden sm:table-cell">{app.birthDate ? `${new Date().getFullYear() - new Date(app.birthDate).getFullYear()} ans` : 'N/A'}</td>
                                            <td className="hidden sm:table-cell">{app.height} cm</td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td>
                                                <div className="flex items-center justify-end gap-4">
                                                    <button onClick={() => setSelectedApp(app)} className="text-pm-gold/70 hover:text-pm-gold" title="Voir les détails">
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(app.id)} className="text-red-500/70 hover:text-red-500" title="Supprimer">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredApps.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune candidature trouvée pour les filtres actuels.</p>}
                        </div>
                    </div>
                </div>
            </div>
            {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} onValidateAndCreateModel={handleValidateAndCreateModel} />}
        </>
    );
};

const StatusBadge: React.FC<{ status: CastingApplicationStatus }> = ({ status }) => {
    const colors = {
        Nouveau: 'bg-blue-500/20 text-blue-300 border-blue-500',
        Présélectionné: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
        Accepté: 'bg-green-500/20 text-green-300 border-green-500',
        Refusé: 'bg-red-500/20 text-red-300 border-red-500',
    };
    return <span className={`px-2 py-1 text-xs font-bold rounded-full border ${colors[status] || 'bg-gray-500/20'}`}>{status}</span>;
};


const ApplicationModal: React.FC<{
    app: CastingApplication, 
    onClose: () => void, 
    onUpdateStatus: (id: string, status: CastingApplicationStatus) => void, 
    onValidateAndCreateModel: (app: CastingApplication) => void,
}> = ({ app, onClose, onUpdateStatus, onValidateAndCreateModel }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const age = app.birthDate ? `${app.birthDate} (${new Date().getFullYear() - new Date(app.birthDate).getFullYear()} ans)` : 'N/A';
    const photoFields = ['photoHead', 'photoFull', 'photoProfile'];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Candidature de {app.firstName} {app.lastName}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {/* Tabs for details */}
                         <div className="border-b border-pm-gold/20 mb-6">
                             <nav className="flex -mb-px space-x-6">
                                 <TabButton name="Infos Personnelles" isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
                                 <TabButton name="Mensurations" isActive={activeTab === 'measurements'} onClick={() => setActiveTab('measurements')} />
                                 <TabButton name="Expérience" isActive={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
                             </nav>
                         </div>
                         <div className="animate-fade-in">
                            {activeTab === 'personal' && <InfoSectionPersonal app={app} age={age} />}
                            {activeTab === 'measurements' && <InfoSectionMeasurements app={app} />}
                            {activeTab === 'experience' && <InfoSectionExperience app={app} />}
                        </div>
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="text-lg font-bold text-pm-gold border-b border-pm-gold/20 pb-1">Photos</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {photoFields.map(field => (
                                app[field as keyof CastingApplication] ? (
                                    <a href={app[field as keyof CastingApplication]} target="_blank" rel="noopener noreferrer" key={field}>
                                        <img src={app[field as keyof CastingApplication]} alt={field} className="w-full h-auto aspect-square object-cover rounded-lg" />
                                    </a>
                                ) : null
                            ))}
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-lg font-bold text-pm-gold border-b border-pm-gold/20 pb-1 mb-3">Statut</h3>
                            <div className="flex flex-wrap gap-2">
                                {(['Nouveau', 'Présélectionné', 'Accepté', 'Refusé'] as const).map(status => (
                                    <button key={status} onClick={() => onUpdateStatus(app.id, status)} className={`px-2 py-1 text-xs font-bold rounded-full border transition-all ${app.status === status ? 'ring-2 ring-offset-2 ring-offset-pm-dark ring-pm-gold' : 'border-pm-off-white/50 text-pm-off-white/80 hover:bg-pm-dark'}`}>
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t border-pm-gold/20 flex justify-end items-center gap-4">
                    {app.status === 'Présélectionné' && (
                        <button onClick={() => onValidateAndCreateModel(app)} className="action-btn !bg-green-600 !text-white">
                            Valider & Créer Profil
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: string, isActive: boolean, onClick: () => void }> = ({ name, isActive, onClick }) => (
    <button type="button" onClick={onClick} className={`relative px-1 py-2 font-medium text-sm transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/70 hover:text-pm-gold'}`}>
        {name}
        <span className={`absolute bottom-[-1px] left-0 w-full h-0.5 bg-pm-gold transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
);

const InfoItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 text-sm py-2 border-b border-black/20">
        <strong className="text-pm-off-white/70 col-span-1">{label}</strong>
        <div className="truncate col-span-2">{value || 'N/A'}</div>
    </div>
);

const InfoSectionPersonal: React.FC<{ app: CastingApplication, age: string }> = ({ app, age }) => (
    <div className="space-y-1">
        <InfoItem label="Nom" value={`${app.firstName} ${app.lastName}`} />
        <InfoItem label="Naissance" value={age} />
        <InfoItem label="Email" value={<a href={`mailto:${app.email}`} className="text-pm-gold hover:underline">{app.email}</a>} />
        <InfoItem label="Téléphone" value={<a href={`tel:${app.phone}`} className="text-pm-gold hover:underline">{app.phone}</a>} />
        <InfoItem label="Nationalité" value={app.nationality} />
        <InfoItem label="Ville" value={app.city} />
        <InfoItem label="Genre" value={app.gender} />
    </div>
);

const InfoSectionMeasurements: React.FC<{ app: CastingApplication }> = ({ app }) => (
    <div className="space-y-1">
        <InfoItem label="Taille" value={`${app.height} cm`} />
        <InfoItem label="Poids" value={`${app.weight} kg`} />
        <InfoItem label="Poitrine" value={`${app.chest} cm`} />
        <InfoItem label="Taille (vêt.)" value={`${app.waist} cm`} />
        <InfoItem label="Hanches" value={`${app.hips} cm`} />
        <InfoItem label="Pointure" value={app.shoeSize} />
        <InfoItem label="Yeux" value={app.eyeColor} />
        <InfoItem label="Cheveux" value={app.hairColor} />
    </div>
);

const InfoSectionExperience: React.FC<{ app: CastingApplication }> = ({ app }) => (
    <div className="space-y-1">
        <InfoItem label="Niveau" value={app.experience} />
        <InfoItem label="Instagram" value={app.instagram ? <a href={`https://instagram.com/${app.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pm-gold underline">{app.instagram}</a> : 'N/A'} />
        <InfoItem label="Portfolio" value={app.portfolioLink ? <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-pm-gold underline truncate block">{app.portfolioLink}</a> : 'N/A'} />
    </div>
);

export default AdminCasting;
