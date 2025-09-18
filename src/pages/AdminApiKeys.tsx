import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    KeyIcon, 
    EyeIcon, 
    EyeSlashIcon,
    ClipboardDocumentIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    ServerIcon
} from '@heroicons/react/24/outline';

const AdminApiKeys: React.FC = () => {
    const { data, saveData } = useData();
    const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const apiKeys = [
        {
            id: 'brevo',
            name: 'Brevo API',
            description: 'Envoi d\'emails et notifications',
            value: data?.apiKeys?.brevoApiKey || '',
            status: data?.apiKeys?.brevoApiKey ? 'configured' : 'missing',
            lastUsed: '2024-01-15 14:30:00',
            usage: 'Active'
        },
        {
            id: 'firebase',
            name: 'Firebase Config',
            description: 'Configuration de la base de données',
            value: '***hidden***',
            status: 'configured',
            lastUsed: '2024-01-15 14:25:00',
            usage: 'Active'
        },
        {
            id: 'cloudinary',
            name: 'Cloudinary API',
            description: 'Gestion et optimisation des images',
            value: data?.apiKeys?.cloudinaryApiKey || '',
            status: data?.apiKeys?.cloudinaryApiKey ? 'configured' : 'missing',
            lastUsed: '2024-01-15 12:15:00',
            usage: 'Active'
        },
        {
            id: 'google',
            name: 'Google Analytics',
            description: 'Suivi et analytics du site',
            value: data?.apiKeys?.googleAnalyticsId || '',
            status: data?.apiKeys?.googleAnalyticsId ? 'configured' : 'missing',
            lastUsed: '2024-01-15 10:45:00',
            usage: 'Active'
        }
    ];

    const toggleKeyVisibility = (keyId: string) => {
        setShowKeys(prev => ({
            ...prev,
            [keyId]: !prev[keyId]
        }));
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Clé copiée dans le presse-papiers !');
        } catch (error) {
            alert('Erreur lors de la copie : ' + (error as Error).message);
        }
    };

    const startEditing = (keyId: string, currentValue: string) => {
        setIsEditing(keyId);
        setEditValue(currentValue);
    };

    const saveKey = async (keyId: string) => {
        if (!data) return;

        const updatedData = {
            ...data,
            apiKeys: {
                ...data.apiKeys,
                [keyId + 'ApiKey']: editValue
            }
        };

        await saveData(updatedData as any);
        setIsEditing(null);
        setEditValue('');
        alert('Clé API mise à jour avec succès !');
    };

    const cancelEditing = () => {
        setIsEditing(null);
        setEditValue('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'configured': return 'text-green-400';
            case 'missing': return 'text-red-400';
            case 'expired': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'configured': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
            case 'missing': return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
            case 'expired': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
            default: return <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gestion des Clés API" noIndex />
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Gestion des Clés API</h1>
                    <p className="text-pm-off-white/70 mt-2">Configuration et surveillance des clés API du système</p>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheckIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold text-yellow-400">Sécurité</span>
                    </div>
                    <p className="text-sm text-yellow-200">
                        Les clés API sont sensibles. Ne les partagez jamais et changez-les régulièrement.
                    </p>
                </div>

                {/* API Keys List */}
                <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="bg-black border border-pm-gold/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <KeyIcon className="w-5 h-5 text-pm-gold" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-pm-gold">{apiKey.name}</h3>
                                        <p className="text-sm text-pm-off-white/70">{apiKey.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(apiKey.status)}
                                    <span className={`text-sm font-semibold ${getStatusColor(apiKey.status)}`}>
                                        {apiKey.status === 'configured' ? 'Configurée' : 
                                         apiKey.status === 'missing' ? 'Manquante' : 'Expirée'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                                        Clé API
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {isEditing === apiKey.id ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                placeholder="Entrez la nouvelle clé API"
                                            />
                                        ) : (
                                            <div className="flex-1 px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white font-mono text-sm">
                                                {showKeys[apiKey.id] ? apiKey.value : '••••••••••••••••'}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => toggleKeyVisibility(apiKey.id)}
                                            className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                                        >
                                            {showKeys[apiKey.id] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(apiKey.value)}
                                            className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                                        >
                                            <ClipboardDocumentIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                                        Dernière utilisation
                                    </label>
                                    <div className="px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white text-sm">
                                        {apiKey.lastUsed}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-pm-off-white/70">
                                    <span>Usage: {apiKey.usage}</span>
                                    <span>•</span>
                                    <span>Status: {apiKey.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    {isEditing === apiKey.id ? (
                                        <>
                                            <button
                                                onClick={() => saveKey(apiKey.id)}
                                                className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Sauvegarder
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="px-3 py-1 bg-gray-600 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => startEditing(apiKey.id, apiKey.value)}
                                            className="px-3 py-1 bg-pm-gold text-pm-dark text-sm font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                        >
                                            Modifier
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-8 bg-black border border-pm-gold/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2">
                            <ServerIcon className="w-4 h-4" />
                            Tester toutes les clés
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4" />
                            Audit de sécurité
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" />
                            Régénérer toutes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminApiKeys;
