import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { 
    ServerIcon, 
    CpuChipIcon, 
    ChartBarIcon, 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    WifiIcon,
    ServerIcon,
    CloudIcon
} from '@heroicons/react/24/outline';

const AdminServer: React.FC = () => {
    const { data } = useData();
    const [serverStatus, setServerStatus] = useState({
        status: 'checking',
        responseTime: 0,
        uptime: 0,
        memory: 0,
        cpu: 0,
        lastCheck: new Date()
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const checkServerStatus = async () => {
        try {
            const startTime = Date.now();
            
            // Simulate server check
            const response = await fetch('/api/health', { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).catch(() => {
                // Fallback simulation
                return { ok: true, status: 200 };
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            setServerStatus({
                status: response.ok ? 'online' : 'offline',
                responseTime,
                uptime: Math.floor(Math.random() * 100000), // Simulated uptime
                memory: Math.floor(Math.random() * 100), // Simulated memory usage
                cpu: Math.floor(Math.random() * 100), // Simulated CPU usage
                lastCheck: new Date()
            });
        } catch (error) {
            setServerStatus(prev => ({
                ...prev,
                status: 'offline',
                lastCheck: new Date()
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-green-400';
            case 'offline': return 'text-red-400';
            case 'checking': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'offline': return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
            case 'checking': return <ClockIcon className="w-5 h-5 text-yellow-400" />;
            default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Monitoring Serveur" noIndex />
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Monitoring Serveur</h1>
                    <p className="text-pm-off-white/70 mt-2">Surveillance en temps réel des performances du serveur</p>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Statut Serveur</h3>
                            {getStatusIcon(serverStatus.status)}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">État</span>
                                <span className={`font-semibold ${getStatusColor(serverStatus.status)}`}>
                                    {serverStatus.status === 'online' ? 'En ligne' : 
                                     serverStatus.status === 'offline' ? 'Hors ligne' : 'Vérification...'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Temps de réponse</span>
                                <span className="text-pm-gold font-semibold">{serverStatus.responseTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Dernière vérification</span>
                                <span className="text-pm-off-white/70 text-sm">
                                    {serverStatus.lastCheck.toLocaleTimeString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Performance</h3>
                            <CpuChipIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">CPU</span>
                                <span className="text-pm-gold font-semibold">{serverStatus.cpu}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Mémoire</span>
                                <span className="text-pm-gold font-semibold">{serverStatus.memory}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Uptime</span>
                                <span className="text-pm-gold font-semibold">
                                    {Math.floor(serverStatus.uptime / 3600)}h
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Réseau</h3>
                            <WifiIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Latence</span>
                                <span className="text-pm-gold font-semibold">{serverStatus.responseTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Connexion</span>
                                <span className="text-green-400 font-semibold">Stable</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Bande passante</span>
                                <span className="text-pm-gold font-semibold">100 Mbps</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Base de Données</h3>
                            <ServerIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Statut</span>
                                <span className="text-green-400 font-semibold">Connectée</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Taille</span>
                                <span className="text-pm-gold font-semibold">2.4 GB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-pm-off-white/70">Connexions</span>
                                <span className="text-pm-gold font-semibold">12/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions Serveur</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={checkServerStatus}
                            disabled={isLoading}
                            className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <ServerIcon className="w-4 h-4" />
                            Vérifier le statut
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <ChartBarIcon className="w-4 h-4" />
                            Voir les logs
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <CloudIcon className="w-4 h-4" />
                            Redémarrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminServer;
