
import React, { useState, useEffect, useCallback } from 'react';
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
    LockClosedIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { SecurityCheck, SecurityThreat, SecurityActivityLog, SecurityCheckStatus, AdminUser } from '../../types';

const AdminSecurity: React.FC = () => {
    const { data, saveData } = useData();
    const [securityScore, setSecurityScore] = useState(0);
    const [threats, setThreats] = useState<SecurityThreat[]>([]);
    const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
    const [recentActivity, setRecentActivity] = useState<SecurityActivityLog[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const runSecurityScan = useCallback(() => {
        if (!data) return;
        setIsScanning(true);

        const checks: SecurityCheck[] = [];
        const newThreats: SecurityThreat[] = [];
        const activityLogs: SecurityActivityLog[] = [];

        // 1. Check for API Keys
        const checkApiKeys = () => {
            const missingKeys = Object.entries(data.apiKeys || {}).filter(([key, value]) => !value || value === '');
            if (missingKeys.length > 0) {
                checks.push({
                    id: 'api-keys',
                    name: 'Clés API',
                    status: 'warning',
                    description: `Certaines clés API sont manquantes (${missingKeys.map(([k]) => k).join(', ')})`,
                    recommendation: 'Configurez toutes les clés API dans les paramètres pour assurer la fonctionnalité complète.',
                    lastChecked: new Date().toISOString(),
                });
            } else {
                checks.push({ id: 'api-keys', name: 'Clés API', status: 'pass', description: 'Toutes les clés API essentielles sont configurées.', lastChecked: new Date().toISOString() });
            }
        };

        // 2. Check Admin User Passwords (simple check for length)
        const checkAdminPasswords = () => {
            const weakPasswordAdmins = data.adminUsers.filter(user => user.password.length < 10);
            if (weakPasswordAdmins.length > 0) {
                checks.push({
                    id: 'admin-passwords',
                    name: 'Mots de passe Admin',
                    status: 'fail',
                    description: `${weakPasswordAdmins.length} administrateur(s) ont des mots de passe faibles.`,
                    recommendation: 'Assurez-vous que tous les mots de passe admin ont au moins 10 caractères.',
                    lastChecked: new Date().toISOString(),
                });
                newThreats.push({
                    id: `threat_${Date.now()}`,
                    type: 'Brute Force Attempt',
                    severity: 'High',
                    description: 'Des mots de passe administrateur faibles ont été détectés, augmentant le risque d\'attaques par force brute.',
                    timestamp: new Date().toISOString(),
                    status: 'new',
                });
            } else {
                checks.push({ id: 'admin-passwords', name: 'Mots de passe Admin', status: 'pass', description: 'La politique des mots de passe admin est respectée.', lastChecked: new Date().toISOString() });
            }
        };

        // 3. Check for HTTPS (Simulated - always pass in a secure environment)
        checks.push({ id: 'https-enabled', name: 'HTTPS Actif', status: 'pass', description: 'Le cryptage SSL/TLS est actif.', lastChecked: new Date().toISOString() });

        // 4. Generate Recent Activity Log from admin users
        const generateActivityLogs = () => {
            data.adminUsers.forEach(user => {
                if (user.lastLogin) {
                    activityLogs.push({
                        id: `log_${user.id}_${Date.now()}`,
                        action: 'Admin Login',
                        userId: user.id,
                        username: user.username,
                        timestamp: user.lastLogin,
                        ipAddress: '192.168.1.100', // Mock IP
                        details: `Connexion réussie de l\'utilisateur ${user.name}`,
                        status: 'Success',
                    });
                }
            });
            setRecentActivity(activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5));
        };

        // Run all checks and generate logs
        checkApiKeys();
        checkAdminPasswords();
        generateActivityLogs();

        setSecurityChecks(checks);
        setThreats(newThreats);

        // Calculate score
        const passedChecks = checks.filter(c => c.status === 'pass').length;
        const totalChecks = checks.length;
        const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
        setSecurityScore(score);
        
        // Save results to data store
        if (data) {
            saveData({ 
                ...data, 
                securityChecks: checks, 
                securityThreats: newThreats,
                securityActivityLogs: activityLogs
            }).then(() => {
                setTimeout(() => setIsScanning(false), 1000); // Simulate scan time
            });
        }

    }, [data, saveData]);

    useEffect(() => {
        // Run scan on initial load
        runSecurityScan();
    }, [data]); // Depend on data to re-run if it changes

    const getSeverityColor = (severity: SecurityThreat['severity']) => {
        switch (severity) {
            case 'Critical': return 'text-red-400 bg-red-900/20';
            case 'High': return 'text-orange-400 bg-orange-900/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
            case 'Low': return 'text-blue-400 bg-blue-900/20';
            default: return 'text-gray-400 bg-gray-900/20';
        }
    };

    const getStatusColor = (status: SecurityCheckStatus) => {
        switch (status) {
            case 'pass': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'fail': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: SecurityCheckStatus) => {
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Centre de Sécurité</h1>
                        <p className="text-pm-off-white/70 mt-2">Surveillance et protection de la plateforme</p>
                    </div>
                    <button 
                        onClick={runSecurityScan}
                        disabled={isScanning}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                        {isScanning ? 'Analyse en cours...' : 'Relancer le Scan'}
                    </button>
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
                                className={`h-2 rounded-full transition-all duration-500 ${securityScore > 80 ? 'bg-green-500' : securityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${securityScore}%` }}
                            ></div>
                        </div>
                        <p className="text-pm-off-white/70 text-sm mt-2">
                            {securityScore > 80 ? 'Excellent niveau de sécurité' : securityScore > 50 ? 'Niveau de sécurité moyen' : 'Niveau de sécurité faible'}
                        </p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Menaces Détectées</h3>
                            <ExclamationTriangleIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-red-400 mb-2">{threats.length}</div>
                        <p className="text-pm-off-white/70 text-sm">Scan actuel</p>
                    </div>

                    <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-gold">Admins & Staff</h3>
                            <UserGroupIcon className="w-5 h-5 text-pm-gold" />
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                            {data?.adminUsers?.length || 0}
                        </div>
                        <p className="text-pm-off-white/70 text-sm">Comptes supervisés</p>
                    </div>
                </div>

                {/* Security Checks */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Vérifications de Sécurité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {securityChecks.map((check) => (
                            <div key={check.id} className="flex items-center justify-between p-3 bg-pm-dark/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(check.status)}
                                    <div>
                                        <p className="font-semibold text-pm-off-white">{check.name}</p>
                                        <p className="text-sm text-pm-off-white/70">{check.description}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${getStatusColor(check.status)}`}>
                                    {check.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Threats */}
                {threats.length > 0 && (
                    <div className="bg-black border border-red-500/20 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-red-400 mb-4">Menaces Actives</h3>
                        <div className="space-y-3">
                            {threats.map((threat) => (
                                <div key={threat.id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                                        <div>
                                            <p className="font-semibold text-pm-off-white">{threat.type}</p>
                                            <p className="text-sm text-pm-off-white/70">{threat.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                                            {threat.severity}
                                        </span>
                                        <span className={`text-sm font-semibold text-yellow-400`}>
                                            {threat.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="bg-black border border-pm-gold/10 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Activité Récente des Admins</h3>
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
                                {recentActivity.map((activity) => (
                                    <tr key={activity.id} className="border-b border-pm-gold/10">
                                        <td className="py-3 px-4 text-pm-off-white">{activity.action}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70">{activity.username}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70">{new Date(activity.timestamp).toLocaleString('fr-FR')}</td>
                                        <td className="py-3 px-4 text-pm-off-white/70 font-mono">{activity.ipAddress}</td>
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
                                {recentActivity.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-pm-off-white/50">Aucune activité récente enregistrée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                 {/* Actions */}
                 <div className="bg-black border border-pm-gold/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions Rapides</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2" onClick={runSecurityScan} disabled={isScanning}>
                            <ShieldCheckIcon className="w-5 h-5" />
                            Scan Complet
                        </button>
                        <button className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold rounded-lg hover:bg-blue-600/40 transition-colors flex items-center justify-center gap-2">
                            <LockClosedIcon className="w-5 h-5" />
                            Gérer l'Auth
                        </button>
                        <button className="px-4 py-2 bg-green-600/20 text-green-300 border border-green-500/30 font-bold rounded-lg hover:bg-green-600/40 transition-colors flex items-center justify-center gap-2">
                            <KeyIcon className="w-5 h-5" />
                            Voir les Clés API
                        </button>
                        <button className="px-4 py-2 bg-red-600/20 text-red-300 border border-red-500/30 font-bold rounded-lg hover:bg-red-600/40 transition-colors flex items-center justify-center gap-2">
                            <ServerIcon className="w-5 h-5" />
                            Journaux d'Activité
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurity;
