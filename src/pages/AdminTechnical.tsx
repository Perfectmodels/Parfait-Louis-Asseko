import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import StatusCard from '../components/admin/StatusCard';
import StatCard from '../components/admin/StatCard';
import LoadingSkeleton from '../components/admin/LoadingSkeleton';
import { 
    ServerIcon, 
    CircleStackIcon as DatabaseIcon,
    CloudIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    DocumentTextIcon,
    UserIcon,
    DocumentIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { getStatusColor, getStatusIcon, getStatusText } from '../utils/status';

const AdminTechnical: React.FC = () => {
    const { data } = useData();
    const [systemStatus, setSystemStatus] = useState({
        database: 'connected',
        api: 'operational',
        storage: 'healthy',
        performance: 'good'
    });

    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        totalPages: 0,
        totalImages: 0,
        storageUsed: '2.3 GB',
        uptime: '99.9%',
        lastBackup: '2024-01-15 14:30'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (data) {
            setSystemStats({
                totalUsers: (data.models?.length || 0) + (data.beginnerStudents?.length || 0),
                totalPages: data.pageContents?.length || 0,
                totalImages: data.siteImages ? Object.keys(data.siteImages).length : 0,
                storageUsed: '2.3 GB',
                uptime: '99.9%',
                lastBackup: new Date().toLocaleDateString('fr-FR')
            });
            setIsLoading(false);
        }
    }, [data]);

    const technicalInfo = {
        version: '1.0.0',
        buildDate: '2024-01-15',
        nodeVersion: '18.17.0',
        reactVersion: '19.1.1',
        viteVersion: '7.1.7',
        tailwindVersion: '3.4.0',
        firebaseVersion: '12.2.1'
    };

    const apiEndpoints = [
        { name: 'Authentication', url: '/api/auth', status: 'operational', method: 'POST' },
        { name: 'Models API', url: '/api/models', status: 'operational', method: 'GET' },
        { name: 'Content API', url: '/api/content', status: 'operational', method: 'GET' },
        { name: 'Upload API', url: '/api/upload', status: 'operational', method: 'POST' },
        { name: 'Email API', url: '/api/email', status: 'operational', method: 'POST' }
    ];

    const securityChecks = [
        { name: 'HTTPS', status: 'enabled', description: 'Connexion sécurisée activée' },
        { name: 'Firewall', status: 'active', description: 'Protection réseau active' },
        { name: 'Backup', status: 'enabled', description: 'Sauvegarde automatique' },
        { name: 'Updates', status: 'current', description: 'Système à jour' }
    ];

    const maintenanceActions = [
        {
            title: 'Sauvegarde',
            description: 'Créer une sauvegarde manuelle',
            icon: <ArrowDownTrayIcon className="w-6 h-6" />,
            action: () => console.log('Backup initiated')
        },
        {
            title: 'Cache',
            description: 'Vider le cache du système',
            icon: <TrashIcon className="w-6 h-6" />,
            action: () => console.log('Cache cleared')
        },
        {
            title: 'Logs',
            description: 'Consulter les logs système',
            icon: <DocumentTextIcon className="w-6 h-6" />,
            action: () => console.log('Logs opened')
        }
    ];

    return (
        <AdminLayout 
            title="Section Technique" 
            description="Informations techniques et maintenance du système"
            breadcrumbs={[
                { label: "Technique" }
            ]}
        >
            <div className="space-y-8">
                {/* Statut du Système */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <ServerIcon className="w-8 h-8" />
                        Statut du Système
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <LoadingSkeleton key={index} className="h-32" lines={2} />
                            ))
                        ) : (
                            Object.entries(systemStatus).map(([key, status]) => (
                                <StatusCard
                                    key={key}
                                    title={key === 'database' ? 'Base de Données' :
                                           key === 'api' ? 'API' :
                                           key === 'storage' ? 'Stockage' :
                                           key === 'performance' ? 'Performance' : key}
                                    status={status}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* Statistiques */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <ChartBarIcon className="w-8 h-8" />
                        Statistiques
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <LoadingSkeleton key={index} className="h-32" lines={3} />
                            ))
                        ) : (
                            <>
                                <StatCard
                                    title="Utilisateurs"
                                    value={systemStats.totalUsers}
                                    subtitle="Total des utilisateurs"
                                    icon={<UserIcon className="w-6 h-6" />}
                                />
                                <StatCard
                                    title="Pages"
                                    value={systemStats.totalPages}
                                    subtitle="Pages du site"
                                    icon={<DocumentIcon className="w-6 h-6" />}
                                />
                                <StatCard
                                    title="Images"
                                    value={systemStats.totalImages}
                                    subtitle="Images stockées"
                                    icon={<PhotoIcon className="w-6 h-6" />}
                                />
                                <StatCard
                                    title="Stockage"
                                    value={systemStats.storageUsed}
                                    subtitle="Espace utilisé"
                                    icon={<DatabaseIcon className="w-6 h-6" />}
                                />
                                <StatCard
                                    title="Uptime"
                                    value={systemStats.uptime}
                                    subtitle="Disponibilité"
                                    icon={<ServerIcon className="w-6 h-6" />}
                                />
                                <StatCard
                                    title="Sauvegarde"
                                    value={systemStats.lastBackup}
                                    subtitle="Dernière sauvegarde"
                                    icon={<ArrowDownTrayIcon className="w-6 h-6" />}
                                />
                            </>
                        )}
                    </div>
                </section>

                {/* Informations Techniques */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <WrenchScrewdriverIcon className="w-8 h-8" />
                        Informations Techniques
                    </h2>
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-pm-off-white mb-4">Versions</h3>
                                <div className="space-y-3">
                                    {Object.entries(technicalInfo).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center">
                                            <span className="text-pm-off-white/80 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <span className="text-pm-gold font-mono">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-pm-off-white mb-4">Configuration</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-pm-off-white/80">Mode:</span>
                                        <span className="text-pm-gold">Production</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-pm-off-white/80">Environnement:</span>
                                        <span className="text-pm-gold">Vite + React</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-pm-off-white/80">Base de données:</span>
                                        <span className="text-pm-gold">Firebase Firestore</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-pm-off-white/80">Authentification:</span>
                                        <span className="text-pm-gold">Firebase Auth</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Endpoints */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <CloudIcon className="w-8 h-8" />
                        API Endpoints
                    </h2>
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <div className="space-y-4">
                            {apiEndpoints.map((endpoint, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-pm-off-white/5 rounded-lg hover:bg-pm-off-white/10 transition-colors duration-200">
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs font-semibold rounded-full">
                                            {endpoint.method}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-pm-off-white">{endpoint.name}</h4>
                                            <p className="text-sm text-pm-off-white/60 font-mono">{endpoint.url}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(endpoint.status)}`}>
                                        {getStatusIcon(endpoint.status)}
                                        <span className="text-sm font-medium">
                                            {getStatusText(endpoint.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Sécurité */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8" />
                        Sécurité
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {securityChecks.map((check, index) => (
                            <StatusCard
                                key={index}
                                title={check.name}
                                status={check.status}
                                description={check.description}
                            />
                        ))}
                    </div>
                </section>

                {/* Actions de Maintenance */}
                <section>
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <DatabaseIcon className="w-8 h-8" />
                        Maintenance
                    </h2>
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {maintenanceActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-200 text-left group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-full bg-pm-gold/20 text-pm-gold group-hover:bg-pm-gold/30 transition-colors duration-200">
                                            {action.icon}
                                        </div>
                                        <h3 className="font-semibold text-pm-gold">{action.title}</h3>
                                    </div>
                                    <p className="text-sm text-pm-off-white/60">{action.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};

export default AdminTechnical;
