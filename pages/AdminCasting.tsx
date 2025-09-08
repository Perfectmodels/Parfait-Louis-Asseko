import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    TrashIcon, 
    EyeIcon, 
    XMarkIcon, 
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

type ApplicationStatus = CastingApplicationStatus | 'Toutes';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [statusFilter, setStatusFilter] = useState<CastingApplicationStatus | null>(null);
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les candidatures
    useEffect(() => {
        if (isInitialized && data) {
            setLocalApps(data.castingApplications || []);
            setIsLoading(false);
        }
    }, [data, isInitialized]);

    // Filtrer les candidatures par statut
    const filteredApps = useMemo(() => {
        if (!statusFilter) return localApps;
        return localApps.filter(app => app.status === statusFilter);
    }, [localApps, statusFilter]);

    // Mettre à jour le statut d'une candidature
    const handleStatusUpdate = async (appId: string, newStatus: CastingApplicationStatus) => {
        try {
            const updatedApps = localApps.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            );
            
            if (data) {
                await saveData({ ...data, castingApplications: updatedApps });
                setLocalApps(updatedApps);
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour du statut');
            console.error(err);
        }
    };

    // Supprimer une candidature
    const handleDelete = async (appId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            try {
                const updatedApps = localApps.filter(app => app.id !== appId);
                
                if (data) {
                    await saveData({ ...data, castingApplications: updatedApps });
                    setLocalApps(updatedApps);
                    if (selectedApp?.id === appId) {
                        setSelectedApp(null);
                    }
                }
            } catch (err) {
                setError('Erreur lors de la suppression');
                console.error(err);
            }
        }
    };

    // Exporter les candidatures
    const exportToCSV = () => {
        const headers = [
            'ID', 'Date', 'Statut', 'Prénom', 'Nom', 'Email', 'Téléphone',
            'Ville', 'Genre', 'Taille', 'Poids', 'Taille de chaussure', 'Expérience'
        ];
        
        const csvContent = [
            headers.join(';'),
            ...filteredApps.map(app => [
                app.id,
                new Date(app.submissionDate).toLocaleDateString(),
                app.status,
                `"${app.firstName}"`,
                `"${app.lastName}"`,
                app.email,
                `"${app.phone}"`,
                `"${app.city}"`,
                app.gender,
                app.height,
                app.weight,
                app.shoeSize,
                `"${app.experience}"`
            ].join(';'))
        ].join('\n');
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `casting_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Imprimer une candidature
    const handlePrintApplication = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pm-gold mx-auto"></div>
                    <p className="mt-4 text-pm-off-white">Chargement des candidatures...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur ! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen p-6">
            <SEO title="Gestion des Candidatures" />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/admin" className="flex items-center text-pm-gold hover:text-pm-gold/80">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Retour
                    </Link>
                    <h1 className="text-2xl font-bold">Gestion des Candidatures</h1>
                    <div className="w-24"></div> {/* Pour l'alignement */}
                </div>

                <div className="bg-pm-darker rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    statusFilter === null
                                        ? 'bg-pm-gold text-pm-dark'
                                        : 'bg-pm-dark border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold/10'
                                }`}
                            >
                                Toutes ({localApps.length})
                            </button>
                            {['en_attente', 'acceptee', 'refusee', 'en_cours', 'terminee'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status as CastingApplicationStatus)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                                        statusFilter === status
                                            ? 'bg-pm-gold text-pm-dark'
                                            : 'bg-pm-dark border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold/10'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} 
                                    ({localApps.filter(a => a.status === status).length})
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold/30 text-pm-gold rounded-full hover:bg-pm-gold/10"
                            >
                                <ClipboardDocumentListIcon className="h-5 w-5" />
                                Exporter (CSV)
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-pm-gold/20">
                            <thead className="bg-pm-gold/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Téléphone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-pm-gold uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-pm-darker divide-y divide-pm-gold/10">
                                {filteredApps.length > 0 ? (
                                    filteredApps.map((app) => (
                                        <tr key={app.id} className="hover:bg-pm-gold/5">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-pm-dark border border-pm-gold/20">
                                                        {app.photoPortraitUrl ? (
                                                            <img 
                                                                className="h-full w-full object-cover"
                                                                src={app.photoPortraitUrl}
                                                                alt={`${app.firstName} ${app.lastName}`}
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = 'https://via.placeholder.com/150?text=Photo';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-pm-gold/10 text-pm-gold">
                                                                {app.firstName[0]}{app.lastName[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-pm-off-white">
                                                            {app.firstName} {app.lastName}
                                                        </div>
                                                        <div className="text-xs text-pm-off-white/70">
                                                            {app.city}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white/80">
                                                {app.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white/80">
                                                {app.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    app.status === 'acceptee' || app.status === 'accepted' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : app.status === 'refusee' || app.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : app.status === 'en_attente' || app.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {app.status === 'acceptee' || app.status === 'accepted' 
                                                        ? 'Accepté(e)' 
                                                        : app.status === 'refusee' || app.status === 'rejected'
                                                            ? 'Refusé(e)'
                                                            : app.status === 'en_attente' || app.status === 'pending'
                                                                ? 'En attente'
                                                                : app.status === 'en_cours'
                                                                    ? 'En cours'
                                                                    : 'Terminé(e)'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white/80">
                                                {new Date(app.submissionDate).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="text-pm-gold hover:text-pm-gold/80"
                                                        title="Voir les détails"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={handlePrintApplication}
                                                        className="text-pm-gold hover:text-pm-gold/80"
                                                        title="Imprimer la fiche"
                                                    >
                                                        <span className="h-5 w-5">🖨️</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(app.id)}
                                                        className="text-red-500 hover:text-red-400"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-pm-off-white/70">
                                            Aucune candidature trouvée
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de détail */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-pm-darker rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-pm-gold">
                                    Détails de la candidature
                                </h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-pm-off-white/70 hover:text-pm-gold"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-pm-gold">Informations personnelles</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Nom complet</p>
                                            <p className="text-pm-off-white">{selectedApp.firstName} {selectedApp.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Date de naissance</p>
                                            <p className="text-pm-off-white">
                                                {new Date(selectedApp.birthDate).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Email</p>
                                            <p className="text-pm-off-white">{selectedApp.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Téléphone</p>
                                            <p className="text-pm-off-white">{selectedApp.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Ville</p>
                                            <p className="text-pm-off-white">{selectedApp.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-pm-gold">Caractéristiques</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Genre</p>
                                            <p className="text-pm-off-white">{selectedApp.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Taille</p>
                                            <p className="text-pm-off-white">{selectedApp.height} cm</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Poids</p>
                                            <p className="text-pm-off-white">{selectedApp.weight} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white/70">Taille de chaussure</p>
                                            <p className="text-pm-off-white">{selectedApp.shoeSize}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-pm-off-white/70">Expérience</p>
                                            <p className="text-pm-off-white">{selectedApp.experience || 'Non renseignée'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-4 text-pm-gold">Photos</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedApp.photoPortraitUrl && (
                                                <div>
                                                    <p className="text-sm text-pm-off-white/70 mb-2">Portrait</p>
                                                    <img 
                                                        src={selectedApp.photoPortraitUrl}
                                                        alt="Portrait"
                                                        className="w-full h-48 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/300x400?text=Portrait+non+disponible';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {selectedApp.photoFullBodyUrl && (
                                                <div>
                                                    <p className="text-sm text-pm-off-white/70 mb-2">Pieds nus</p>
                                                    <img 
                                                        src={selectedApp.photoFullBodyUrl}
                                                        alt="Pieds nus"
                                                        className="w-full h-48 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/300x400?text=Photo+corps+entier+non+disponible';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {selectedApp.photoProfileUrl && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-pm-off-white/70 mb-2">Profil</p>
                                                    <img 
                                                        src={selectedApp.photoProfileUrl}
                                                        alt="Profil"
                                                        className="w-full h-48 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/600x400?text=Photo+de+profil+non+disponible';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {selectedApp.photos?.map((photo, index) => (
                                                <div key={index} className="col-span-2">
                                                    <p className="text-sm text-pm-off-white/70 mb-2">Photo supplémentaire {index + 1}</p>
                                                    <img 
                                                        src={photo}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-48 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/600x400?text=Image+non+disponible';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-4 text-pm-gold">Statut</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedApp.id, 'en_attente');
                                                    setSelectedApp({...selectedApp, status: 'en_attente'});
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                    selectedApp.status === 'en_attente' || selectedApp.status === 'pending'
                                                        ? 'bg-yellow-500 text-white'
                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                }`}
                                            >
                                                En attente
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedApp.id, 'acceptee');
                                                    setSelectedApp({...selectedApp, status: 'acceptee'});
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                    selectedApp.status === 'acceptee' || selectedApp.status === 'accepted'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                }`}
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedApp.id, 'refusee');
                                                    setSelectedApp({...selectedApp, status: 'refusee'});
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                    selectedApp.status === 'refusee' || selectedApp.status === 'rejected'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                Refuser
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedApp.id, 'en_cours');
                                                    setSelectedApp({...selectedApp, status: 'en_cours'});
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                    selectedApp.status === 'en_cours'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                }`}
                                            >
                                                En cours
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedApp.id, 'terminee');
                                                    setSelectedApp({...selectedApp, status: 'terminee'});
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                    selectedApp.status === 'terminee'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                                }`}
                                            >
                                                Terminé
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="px-4 py-2 border border-pm-gold/30 text-pm-gold rounded hover:bg-pm-gold/10"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'impression */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Fiche de candidature</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => window.print()}
                                        className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                                        title="Imprimer"
                                    >
                                        <span className="h-6 w-6">🖨️</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow">
                                <p className="text-center text-gray-600">Fonctionnalité d'impression simplifiée</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCasting;
