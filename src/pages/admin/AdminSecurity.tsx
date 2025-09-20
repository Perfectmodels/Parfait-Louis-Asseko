import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { 
    ShieldCheckIcon, 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
    KeyIcon,
    ServerIcon,
    EyeIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

const AdminSecurity: React.FC = () => {
    const { data } = useData();
    const [securityScore, setSecurityScore] = useState(85);
    const [threats, setThreats] = useState([
        {
            id: 1,
            type: 'Brute Force',
            severity: 'Medium',
            count: 3,
            lastSeen: '2024-01-15 14:30:00',
            status: 'Blocked'
        },
        {
            id: 2,
            type: 'Suspicious Login',
            severity: 'High',
            count: 1,
            lastSeen: '2024-01-15 12:15:00',
            status: 'Investigated'
        },
        {
            id: 3,
            type: 'SQL Injection',
            severity: 'Critical',
            count: 0,
            lastSeen: '2024-01-15 10:45:00',
            status: 'Blocked'
        }
    ]);

    const [securityChecks, setSecurityChecks] = useState([
        { name: 'HTTPS Enabled', status: 'pass', description: 'SSL/TLS encryption active' },
        { name: 'Firewall Active', status: 'pass', description: 'Protection réseau configurée' },
        { name: 'API Rate Limiting', status: 'pass', description: 'Limitation des requêtes API' },
        { name: 'Password Policy', status: 'pass', description: 'Politique de mots de passe forte' },
        { name: 'Session Management', status: 'pass', description: 'Gestion sécurisée des sessions' },
        { name: 'Data Encryption', status: 'pass', description: 'Chiffrement des données sensibles' },
        { name: 'Backup Security', status: 'warning', description: 'Sauvegardes non chiffrées' },
        { name: 'Log Monitoring', status: 'pass', description: 'Surveillance des logs active' }
    ]);

    const [recentActivity, setRecentActivity] = useState([
        { action: 'Login Admin', user: 'admin@pmm.ga', time: '14:30:00', ip: '192.168.1.100', status: 'Success' },
        { action: 'Failed Login', user: 'unknown', time: '14:25:00', ip: '203.0.113.1', status: 'Blocked' },
        { action: 'API Key Used', user: 'system', time: '14:20:00', ip: '127.0.0.1', status: 'Success' },
        { action: 'Data Export', user: 'admin@pmm.ga', time: '14:15:00', ip: '192.168.1.100', status: 'Success' },
        { action: 'Password Change', user: 'user123', time: '14:10:00', ip: '192.168.1.105', status: 'Success' }
    ]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-400 bg-red-900/20';
            case 'High': return 'text-orange-400 bg-orange-900/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
            case 'Low': return 'text-blue-400 bg-blue-900/20';
            default: return 'text-gray-400 bg-gray-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'fail': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
            case 'warning': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
            case 'fail': return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
            default: return <ClockIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Sécurité" noIndex />
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Centre de Sécurité</h1>
                    <p className="text-pm-off-white/70 mt-2">Surveillance et protection de la plateforme</p>
                </div>

                {/* Security Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Score de Sécurité</h3>
                            <ShieldCheckIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-pm-gold mb-2">{securityScore}/100</div>
                        <div className="w-full bg-pm-dark rounded-full h-2">
                            <div 
                                className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                                style={{ width: `${securityScore}%` }}
                            ></div>
                        </div>
                        <p className="text-pm-off-white/70 text-sm mt-2">Excellent niveau de sécurité</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Menaces Détectées</h3>
                            <ExclamationTriangleIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-red-400 mb-2">{threats.length}</div>
                        <p className="text-pm-off-white/70 text-sm">Dernières 24h</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Utilisateurs Actifs</h3>
                            <UserGroupIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                            {data?.models?.length || 0}
                        </div>
                        <p className="text-pm-off-white/70 text-sm">Sessions sécurisées</p>
                    </div>
                </div>

                {/* Security Checks */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Vérifications de Sécurité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {securityChecks.map((check, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-pm-dark/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(check.status)}
                                    <div>
                                        <p className="font-semibold text-pm-off-white">{check.name}</p>
                                        <p className="text-sm text-pm-off-white/70">{check.description}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${getStatusColor(check.status)}`}>
                                    {check.status === 'pass' ? 'OK' : 
                                     check.status === 'warning' ? 'Attention' : 'Échec'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Threats */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Menaces Récentes</h3>
                    <div className="space-y-3">
                        {threats.map((threat) => (
                            <div key={threat.id} className="flex items-center justify-between p-3 bg-pm-dark/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                                    <div>
                                        <p className="font-semibold text-pm-off-white">{threat.type}</p>
                                        <p className="text-sm text-pm-off-white/70">
                                            {threat.count} tentative(s) - {threat.lastSeen}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                                        {threat.severity}
                                    </span>
                                    <span className={`text-sm font-semibold ${
                                        threat.status === 'Blocked' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                        {threat.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Activité Récente</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-pm-gold/20">
                                    <th className="text-left py-3 px-4 text-pm-gold">Action</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Utilisateur</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Heure</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">IP</th>
                                    <th className="text-left py-3 px-4 text-pm-gold">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivity.map((activity, index) => (
                                    <tr key={index} className="border-b border-pm-gold/10">
                                        <td className="py-3 px-4 text-pm-off-white">{activity.action}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70">{activity.user}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70">{activity.time}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70 font-mono">{activity.ip}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                activity.status === 'Success' 
                                                    ? 'bg-green-900/20 text-green-400' 
                                                    : 'bg-red-900/20 text-red-400'
                                            }`}>
                                                {activity.status}
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
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions de Sécurité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4" />
                            Scan Complet
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <LockClosedIcon className="w-4 h-4" />
                            Renforcer Auth
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" />
                            Générer Clés
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                            <ServerIcon className="w-4 h-4" />
                            Bloquer IPs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurity;
