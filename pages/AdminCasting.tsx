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
    PrinterIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import PrintableCastingSheet from '../components/PrintableCastingSheet';
import ApplicationModal from '../components/ApplicationModal';

type ApplicationStatus = CastingApplicationStatus | 'Toutes';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [statusFilter, setStatusFilter] = useState<CastingApplicationStatus | null>(null);
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [printingApp, setPrintingApp] = useState<CastingApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les candidatures
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (data?.castingApplications) {
                    const sortedApps = [...data.castingApplications].sort((a, b) => 
                        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
                    );
                    setLocalApps(sortedApps);
                }
            } catch (err) {
                setError('Erreur lors du chargement des candidatures');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data?.castingApplications, isInitialized]);
    
    // Filtrer les candidatures par statut
    const filteredApplications = useMemo(() => {
        if (!statusFilter) return localApps;
        // Vérifier que le statut est valide avant de filtrer
        const validStatuses: CastingApplicationStatus[] = ['Nouveau', 'Présélectionné', 'Accepté', 'Refusé'];
        if (validStatuses.includes(statusFilter)) {
            return localApps.filter(app => app.status === statusFilter);
        }
        return localApps;
    }, [localApps, statusFilter]);

    // Calculer les statistiques
    const stats = useMemo(() => {
        return {
            total: localApps.length,
            new: localApps.filter(a => a.status === 'Nouveau').length,
            selected: localApps.filter(a => a.status === 'Présélectionné').length,
            validated: localApps.filter(a => a.status === 'Accepté').length,
            rejected: localApps.filter(a => a.status === 'Refusé').length
        };
    }, [localApps]);

    // Gérer la suppression d'une candidature
    const handleDelete = async (appId: string): Promise<boolean> => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) return false;
        
        try {
            setIsLoading(true);
            if (!data) return false;
            
            const updatedApps = localApps.filter(app => app.id !== appId);
            await saveData({ ...data, castingApplications: updatedApps });
            
            setLocalApps(updatedApps);
            if (selectedApp?.id === appId) {
                setSelectedApp(null);
            }
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Erreur lors de la suppression de la candidature');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Mettre à jour le statut d'une candidature
    const updateStatus = async (appId: string, newStatus: CastingApplicationStatus): Promise<void> => {
        try {
            setIsLoading(true);
            if (!data) return;
            
            const updatedApps = localApps.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            );
            
            await saveData({ ...data, castingApplications: updatedApps });
            setLocalApps(updatedApps);
            
            // Mettre à jour l'application sélectionnée si elle est modifiée
            if (selectedApp?.id === appId) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            setError('Erreur lors de la mise à jour du statut');
        } finally {
            setIsLoading(false);
        }
    };

    // Valider et créer un modèle
    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        const modelExists = data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());
        if (modelExists) {
            alert("Un mannequin avec ce nom existe déjà. Impossible de créer un duplicata.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => 
            name.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f\u0027]/g, "") // Supprime les accents et les apostrophes
                .replace(/\s+/g, '') // Supprime les espaces
                .substring(0, 6); // Limite à 6 caractères

        const username = `${app.firstName.toLowerCase().charAt(0)}${app.lastName.toLowerCase().replace(/\s+/g, '')}`;
        const password = `${sanitizeForPassword(app.lastName)}${currentYear.toString().slice(-2)}`;

        const newModel: Model = {
            id: `model-${Date.now()}`,
            name: `${app.firstName} ${app.lastName}`,
            username,
            password,
            email: app.email,
            phone: app.phone || '',
            gender: app.gender,
            height: app.height,
            imageUrl: app.photoPortraitUrl || app.photoProfileUrl || '',
            portfolioImages: app.photoFullBodyUrl ? [app.photoFullBodyUrl] : [],
            isPublic: false,
            level: 'Débutant',
            categories: [],
            journey: '',
            quizScores: {},
            measurements: {
                chest: app.chest,
                waist: app.waist,
                hips: app.hips,
                shoeSize: app.shoeSize
            },
            experience: app.experience || '',
            distinctions: []
        };

        try {
            // Mettre à jour le statut de la candidature
            const updatedApps = localApps.map(a => 
                a.id === app.id ? { ...a, status: 'Accepté' } : a
            ) as CastingApplication[];
            
            // Ajouter le nouveau modèle
            const updatedModels = [...data.models, newModel];
            
            // Sauvegarder les modifications
            await saveData({
                ...data,
                castingApplications: updatedApps,
                models: updatedModels
            });
            
            alert(`Le modèle ${newModel.name} a été créé avec succès.\nIdentifiants de connexion :\nNom d'utilisateur: ${username}\nMot de passe: ${password}`);
            
            // Mettre à jour l'état local
            setLocalApps(updatedApps);
            if (selectedApp?.id === app.id) {
                setSelectedApp({ ...selectedApp, status: 'Accepté' });
            }
            
        } catch (error) {
            console.error('Erreur lors de la création du modèle :', error);
            alert('Une erreur est survenue lors de la création du modèle.');
        } finally {
            setIsLoading(false);
        }
    };

    // Obtenir la couleur du statut
    const getStatusColor = (status: CastingApplicationStatus): string => {
        switch (status) {
            case 'Nouveau':
                return 'bg-blue-900/30 text-blue-300 border-blue-700';
            case 'Présélectionné':
                return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
            case 'Accepté':
                return 'bg-green-900/30 text-green-300 border-green-700';
            case 'Refusé':
                return 'bg-red-900/30 text-red-300 border-red-700';
            default:
                return 'bg-gray-800 text-gray-300 border-gray-700';
        }
    };

    // Composant pour afficher une section avec un titre
    const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-pm-gold">{title}</h3>
            <div className="bg-pm-dark-light p-4 rounded-lg">
                {children}
            </div>
        </div>
    );

    // La déclaration de statusFilter est déjà faite plus haut dans le composant

    // Composant pour afficher une paire clé-valeur
    const InfoItem: React.FC<{label: string, value: React.ReactNode}> = ({ label, value }) => (
        <div className="mb-2">
            <dt className="text-sm font-medium text-pm-off-white/70">{label}</dt>
            <dd className="mt-1 text-sm text-pm-off-white">{value}</dd>
        </div>
    );

    // Composant pour afficher une carte de statistique
    const StatCard: React.FC<{
        title: string;
        value: number;
        color: 'blue' | 'yellow' | 'green' | 'red' | 'gray';
        icon: React.ElementType;
        onClick?: () => void;
    }> = ({ title, value, color, icon: Icon, onClick }) => {
        const colors = {
            blue: 'bg-blue-900/30 text-blue-300 border-blue-700',
            yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
            green: 'bg-green-900/30 text-green-300 border-green-700',
            red: 'bg-red-900/30 text-red-300 border-red-700',
            gray: 'bg-gray-800/30 text-gray-300 border-gray-700',
        };

        const iconColors = {
            blue: 'text-blue-400',
            yellow: 'text-yellow-400',
            green: 'text-green-400',
            red: 'text-red-400',
            gray: 'text-gray-400',
        };

        return (
            <div 
                className={`p-4 rounded-lg border transition-all duration-200 ${
                    colors[color]
                } ${
                    onClick ? 'cursor-pointer hover:opacity-90 hover:scale-[1.02]' : ''
                }`}
                onClick={onClick}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-pm-off-white/70">{title}</p>
                        <p className="text-2xl font-bold text-pm-off-white">{value}</p>
                    </div>
                    <div className={`p-2 rounded-full ${iconColors[color]} bg-pm-dark/30`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </div>
        );
    };

    // Rendu principal
    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white p-4 md:p-6">
            <SEO title="Gestion des candidatures" />
            
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-pm-gold">Gestion des candidatures</h1>
                        <p className="text-pm-off-white/70">
                            {filteredApplications.length} candidature{filteredApplications.length !== 1 ? 's' : ''} 
                            {statusFilter ? `avec le statut "${statusFilter}"` : 'au total'}
                        </p>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Link 
                            to="/admin" 
                            className="flex items-center px-4 py-2 bg-pm-dark-light hover:bg-pm-dark-lighter rounded-lg transition-colors"
                        >
                            <ChevronLeftIcon className="h-5 w-5 mr-2" />
                            Retour
                        </Link>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard 
                        title="Total" 
                        value={stats.total} 
                        color="blue" 
                        icon={ClipboardDocumentListIcon} 
                        onClick={() => setStatusFilter(null)}
                    />
                    <StatCard 
                        title="Nouvelles" 
                        value={stats.new} 
                        color="yellow" 
                        icon={ClockIcon}
                        onClick={() => setStatusFilter('Nouveau')}
                    />
                    <StatCard 
                        title="Présélectionnés" 
                        value={stats.selected} 
                        color="yellow" 
                        icon={CheckCircleIcon}
                        onClick={() => setStatusFilter('Présélectionné')}
                    />
                    <StatCard 
                        title="Validés" 
                        value={stats.validated} 
                        color="green" 
                        icon={CheckCircleIcon}
                        onClick={() => setStatusFilter('Accepté')}
                    />
                    <StatCard 
                        title="Refusés" 
                        value={stats.rejected} 
                        color="red" 
                        icon={XCircleIcon}
                        onClick={() => setStatusFilter('Refusé')}
                    />
                </div>

                {/* Liste des candidatures */}
                <div className="bg-pm-dark-light rounded-xl overflow-hidden shadow-lg">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pm-gold mx-auto"></div>
                            <p className="mt-4 text-pm-off-white/70">Chargement des candidatures...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">
                            <p>Erreur: {error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="mt-4 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-pm-off-white/70">Aucune candidature trouvée</p>
                            {statusFilter && (
                                <button 
                                    onClick={() => setStatusFilter(null)}
                                    className="mt-2 text-pm-gold hover:underline"
                                >
                                    Afficher toutes les candidatures
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-pm-gray-dark">
                                <thead className="bg-pm-darker">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/70 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/70 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/70 uppercase tracking-wider">
                                            Téléphone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/70 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-pm-off-white/70 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-pm-dark-light divide-y divide-pm-gray-dark">
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-pm-darker/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-pm-off-white">
                                                    {app.firstName} {app.lastName}
                                                </div>
                                                <div className="text-xs text-pm-off-white/50">
                                                    {new Date(app.submissionDate).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white">
                                                {app.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white">
                                                {app.phone || 'Non renseigné'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setPrintingApp(app)}
                                                        className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                                                        title="Imprimer la fiche"
                                                    >
                                                        <PrinterIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(app.id)}
                                                        className="text-pm-off-white/70 hover:text-red-400 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {selectedApp && (
                    <ApplicationModal
                        app={selectedApp}
                        onClose={() => setSelectedApp(null)}
                        onUpdateStatus={updateStatus}
                        onDelete={handleDelete}
                    />
                )}

                {printingApp && data?.juryMembers && (
                    <PrintableCastingSheet
                        app={printingApp}
                        juryMembers={data.juryMembers}
                        onDonePrinting={() => setPrintingApp(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminCasting;
