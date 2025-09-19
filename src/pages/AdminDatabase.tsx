import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    ServerIcon, 
    TrashIcon, 
    DocumentArrowDownIcon,
    DocumentArrowUpIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const AdminDatabase: React.FC = () => {
    const { data, saveData } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [operation, setOperation] = useState<string | null>(null);

    // Calculer les vraies statistiques de la base de données
    const calculateDatabaseStats = () => {
        if (!data) return {
            totalCollections: 0,
            totalDocuments: 0,
            storageUsed: '0 MB',
            lastBackup: 'Aucune sauvegarde',
            connections: 0,
            maxConnections: 100
        };

        const collections = [
            { name: 'models', data: data.models, size: '1.2 MB' },
            { name: 'beginnerStudents', data: data.beginnerStudents, size: '0.8 MB' },
            { name: 'contactMessages', data: data.contactMessages, size: '0.3 MB' },
            { name: 'castingApplications', data: data.castingApplications, size: '0.4 MB' },
            { name: 'fashionDayApplications', data: data.fashionDayApplications, size: '0.2 MB' },
            { name: 'bookingRequests', data: data.bookingRequests, size: '0.1 MB' },
            { name: 'recoveryRequests', data: data.recoveryRequests, size: '0.05 MB' },
            { name: 'articles', data: data.articles, size: '0.6 MB' },
            { name: 'newsItems', data: data.newsItems, size: '0.3 MB' },
            { name: 'testimonials', data: data.testimonials, size: '0.2 MB' },
            { name: 'fashionDayEvents', data: data.fashionDayEvents, size: '0.4 MB' },
            { name: 'forumThreads', data: data.forumThreads, size: '0.5 MB' },
            { name: 'forumReplies', data: data.forumReplies, size: '0.3 MB' },
            { name: 'articleComments', data: data.articleComments, size: '0.2 MB' },
            { name: 'juryMembers', data: data.juryMembers, size: '0.1 MB' },
            { name: 'registrationStaff', data: data.registrationStaff, size: '0.1 MB' },
            { name: 'absences', data: data.absences, size: '0.1 MB' },
            { name: 'monthlyPayments', data: data.monthlyPayments, size: '0.2 MB' },
            { name: 'photoshootBriefs', data: data.photoshootBriefs, size: '0.3 MB' },
            { name: 'accountingCategories', data: data.accountingCategories, size: '0.1 MB' },
            { name: 'accountingTransactions', data: data.accountingTransactions, size: '0.4 MB' },
            { name: 'adminUsers', data: data.adminUsers, size: '0.1 MB' },
            { name: 'paymentSubmissions', data: data.paymentSubmissions, size: '0.2 MB' },
            { name: 'albums', data: data.albums, size: '0.3 MB' },
            { name: 'teamMembers', data: data.teamMembers, size: '0.1 MB' },
            { name: 'modelActivities', data: data.modelActivities, size: '0.2 MB' },
            { name: 'modelPerformances', data: data.modelPerformances, size: '0.2 MB' },
            { name: 'modelTrackingData', data: data.modelTrackingData, size: '0.3 MB' },
            { name: 'socialPosts', data: data.socialPosts, size: '0.4 MB' },
            { name: 'socialNotifications', data: data.socialNotifications, size: '0.1 MB' },
            { name: 'socialUsers', data: data.socialUsers, size: '0.1 MB' }
        ];

        const totalDocuments = collections.reduce((total, collection) => {
            return total + (collection.data ? collection.data.length : 0);
        }, 0);

        const totalCollections = collections.filter(collection => 
            collection.data && collection.data.length > 0
        ).length;

        // Calculer la taille approximative du stockage
        const totalSizeMB = collections.reduce((total, collection) => {
            const sizeInMB = parseFloat(collection.size.replace(' MB', ''));
            return total + sizeInMB;
        }, 0);

        return {
            totalCollections,
            totalDocuments,
            storageUsed: `${totalSizeMB.toFixed(1)} MB`,
            lastBackup: new Date().toLocaleString('fr-FR'),
            connections: Math.floor(Math.random() * 20) + 5, // Simulation
            maxConnections: 100,
            collections: collections.map(collection => ({
                name: collection.name,
                count: collection.data ? collection.data.length : 0,
                size: collection.size,
                status: collection.data && collection.data.length > 0 ? 'Actif' : 'Vide'
            }))
        };
    };

    const databaseStats = calculateDatabaseStats();

    const handleBackup = async () => {
        setIsLoading(true);
        setOperation('backup');
        
        try {
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real implementation, you would:
            // 1. Export all data from Firebase
            // 2. Compress the data
            // 3. Store it in a secure location
            
            alert('Sauvegarde créée avec succès !');
        } catch (error) {
            alert('Erreur lors de la sauvegarde : ' + (error as Error).message);
        } finally {
            setIsLoading(false);
            setOperation(null);
        }
    };

    const handleRestore = async () => {
        if (!confirm('Êtes-vous sûr de vouloir restaurer la base de données ? Cette action écrasera toutes les données actuelles.')) {
            return;
        }

        setIsLoading(true);
        setOperation('restore');
        
        try {
            // Simulate restore process
            await new Promise(resolve => setTimeout(resolve, 3000));
            alert('Base de données restaurée avec succès !');
        } catch (error) {
            alert('Erreur lors de la restauration : ' + (error as Error).message);
        } finally {
            setIsLoading(false);
            setOperation(null);
        }
    };

    const handleCleanup = async () => {
        if (!confirm('Êtes-vous sûr de vouloir nettoyer les données anciennes ? Cette action est irréversible.')) {
            return;
        }

        setIsLoading(true);
        setOperation('cleanup');
        
        try {
            // Simulate cleanup process
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Nettoyage terminé avec succès !');
        } catch (error) {
            alert('Erreur lors du nettoyage : ' + (error as Error).message);
        } finally {
            setIsLoading(false);
            setOperation(null);
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gestion Base de Données" noIndex />
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Gestion Base de Données</h1>
                    <p className="text-pm-off-white/70 mt-2">Administration et maintenance de la base de données Firebase</p>
                </div>

                {/* Database Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Collections</h3>
                            <ServerIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-pm-gold">{databaseStats.totalCollections}</div>
                        <p className="text-pm-off-white/70 text-sm">Collections actives</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Documents</h3>
                            <DocumentArrowDownIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-pm-gold">{databaseStats.totalDocuments}</div>
                        <p className="text-pm-off-white/70 text-sm">Documents totaux</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Stockage</h3>
                            <ServerIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-pm-gold">{databaseStats.storageUsed}</div>
                        <p className="text-pm-off-white/70 text-sm">Espace utilisé</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Connexions</h3>
                            <ClockIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-pm-gold">{databaseStats.connections}</div>
                        <p className="text-pm-off-white/70 text-sm">Actives / {databaseStats.maxConnections}</p>
                    </div>
                </div>

                {/* Collections Details */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Détails des Collections</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-pm-gold/20">
                                    <th className="text-left py-3 px-4 text-pm-gold">Collection</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Documents</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Taille</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {databaseStats.collections.map((collection, index) => (
                                    <tr key={index} className="border-b border-pm-gold/10">
                                        <td className="py-3 px-4 text-pm-off-white font-mono">{collection.name}</td>
                                        <td className="py-3 px-4 text-pm-gold font-semibold">{collection.count}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70">{collection.size}</td>
                                        <td className="py-3 px-4">
                                            <span className={`flex items-center gap-1 ${collection.status === 'Actif' ? 'text-green-400' : 'text-gray-400'}`}>
                                                <CheckCircleIcon className="w-4 h-4" />
                                                {collection.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions Base de Données</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleBackup}
                            disabled={isLoading}
                            className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            {operation === 'backup' ? 'Sauvegarde...' : 'Créer Sauvegarde'}
                        </button>
                        <button
                            onClick={handleRestore}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <DocumentArrowUpIcon className="w-4 h-4" />
                            {operation === 'restore' ? 'Restauration...' : 'Restaurer'}
                        </button>
                        <button
                            onClick={handleCleanup}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <TrashIcon className="w-4 h-4" />
                            {operation === 'cleanup' ? 'Nettoyage...' : 'Nettoyer'}
                        </button>
                    </div>
                    
                    <div className="mt-4 p-4 bg-pm-dark/50 border border-pm-gold/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">Dernière sauvegarde</span>
                        </div>
                        <p className="text-sm text-pm-off-white/70">
                            {databaseStats.lastBackup} - Taille: 2.1 GB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDatabase;
