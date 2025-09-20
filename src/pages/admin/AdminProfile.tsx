import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { 
    UserIcon, 
    BuildingOfficeIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    GlobeAltIcon,
    CameraIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    ShieldCheckIcon,
    KeyIcon,
    BellIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface AdminProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: 'super_admin' | 'admin' | 'manager';
    organization: {
        name: string;
        address: string;
        city: string;
        country: string;
        phone: string;
        email: string;
        website: string;
        logo?: string;
        description: string;
    };
    preferences: {
        language: string;
        timezone: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
        theme: 'dark' | 'light' | 'auto';
    };
    security: {
        twoFactorEnabled: boolean;
        lastLogin: string;
        loginHistory: Array<{
            date: string;
            ip: string;
            location: string;
        }>;
    };
    createdAt: string;
    updatedAt: string;
}

const AdminProfile: React.FC = () => {
    const { data, saveData } = useData();
    const [activeTab, setActiveTab] = useState<'personal' | 'organization' | 'preferences' | 'security'>('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [profile, setProfile] = useState<AdminProfile>({
        id: 'admin-001',
        name: 'Administrateur Principal',
        email: 'admin@perfectmodels.ga',
        phone: '+241 01 23 45 67',
        role: 'super_admin',
        organization: {
            name: 'Perfect Models Management',
            address: 'Avenue Léon Mba',
            city: 'Libreville',
            country: 'Gabon',
            phone: '+241 01 23 45 67',
            email: 'contact@perfectmodels.ga',
            website: 'https://perfectmodels.ga',
            description: 'L\'agence de mannequins de référence à Libreville, Gabon. Nous révélons les talents, organisons des événements mode d\'exception et façonnons l\'avenir du mannequinat africain.'
        },
        preferences: {
            language: 'fr',
            timezone: 'Africa/Libreville',
            notifications: {
                email: true,
                sms: true,
                push: true
            },
            theme: 'dark'
        },
        security: {
            twoFactorEnabled: false,
            lastLogin: new Date().toISOString(),
            loginHistory: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    const [formData, setFormData] = useState<Partial<AdminProfile>>({});

    useEffect(() => {
        // Charger les données du profil depuis le contexte
        if (data?.adminProfile) {
            setProfile(data.adminProfile);
        }
    }, [data]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedProfile = { ...profile, ...formData, updatedAt: new Date().toISOString() };
            await saveData({ ...data, adminProfile: updatedProfile });
            setProfile(updatedProfile);
            setIsEditing(false);
            setFormData({});
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOrganizationChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            organization: {
                ...prev.organization,
                [field]: value
            }
        }));
    };

    const handlePreferencesChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value
            }
        }));
    };

    const tabs = [
        { id: 'personal', label: 'Informations Personnelles', icon: UserIcon },
        { id: 'organization', label: 'Organisation', icon: BuildingOfficeIcon },
        { id: 'preferences', label: 'Préférences', icon: Cog6ToothIcon },
        { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon }
    ];

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title="Profil Administrateur - Perfect Models"
                description="Gérez votre profil administrateur et les paramètres de l'organisation"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-pm-gold mb-2">Profil Administrateur</h1>
                    <p className="text-pm-off-white/60">Gérez vos informations personnelles et les paramètres de l'organisation</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-pm-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-12 h-12 text-pm-gold" />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button className="absolute bottom-0 right-0 bg-pm-gold text-black p-2 rounded-full hover:bg-pm-gold/80 transition-colors">
                                            <CameraIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-pm-gold">{profile.name}</h3>
                                <p className="text-pm-off-white/60 capitalize">{profile.role.replace('_', ' ')}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                                : 'text-pm-off-white/70 hover:bg-gray-800/50 hover:text-pm-gold'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-8">
                            {/* Header avec boutons d'action */}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-pm-gold">
                                        {tabs.find(tab => tab.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-pm-off-white/60 mt-1">
                                        {activeTab === 'personal' && 'Gérez vos informations personnelles'}
                                        {activeTab === 'organization' && 'Configurez les informations de l\'organisation'}
                                        {activeTab === 'preferences' && 'Personnalisez vos préférences'}
                                        {activeTab === 'security' && 'Gérez la sécurité de votre compte'}
                                    </p>
                                </div>
                                
                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                                Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            Modifier
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contenu des onglets */}
                            {activeTab === 'personal' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="admin-label">Nom complet</label>
                                            <input
                                                type="text"
                                                value={formData.name || profile.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email || profile.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Téléphone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone || profile.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Rôle</label>
                                            <select
                                                value={formData.role || profile.role}
                                                onChange={(e) => handleInputChange('role', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            >
                                                <option value="super_admin">Super Administrateur</option>
                                                <option value="admin">Administrateur</option>
                                                <option value="manager">Gestionnaire</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'organization' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="admin-label">Nom de l'organisation</label>
                                            <input
                                                type="text"
                                                value={formData.organization?.name || profile.organization.name}
                                                onChange={(e) => handleOrganizationChange('name', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Adresse</label>
                                            <input
                                                type="text"
                                                value={formData.organization?.address || profile.organization.address}
                                                onChange={(e) => handleOrganizationChange('address', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Ville</label>
                                            <input
                                                type="text"
                                                value={formData.organization?.city || profile.organization.city}
                                                onChange={(e) => handleOrganizationChange('city', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Pays</label>
                                            <input
                                                type="text"
                                                value={formData.organization?.country || profile.organization.country}
                                                onChange={(e) => handleOrganizationChange('country', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Téléphone</label>
                                            <input
                                                type="tel"
                                                value={formData.organization?.phone || profile.organization.phone}
                                                onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Email</label>
                                            <input
                                                type="email"
                                                value={formData.organization?.email || profile.organization.email}
                                                onChange={(e) => handleOrganizationChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="admin-label">Site web</label>
                                            <input
                                                type="url"
                                                value={formData.organization?.website || profile.organization.website}
                                                onChange={(e) => handleOrganizationChange('website', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="admin-label">Description</label>
                                            <textarea
                                                value={formData.organization?.description || profile.organization.description}
                                                onChange={(e) => handleOrganizationChange('description', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-textarea"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="admin-label">Langue</label>
                                            <select
                                                value={formData.preferences?.language || profile.preferences.language}
                                                onChange={(e) => handlePreferencesChange('language', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            >
                                                <option value="fr">Français</option>
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="admin-label">Fuseau horaire</label>
                                            <select
                                                value={formData.preferences?.timezone || profile.preferences.timezone}
                                                onChange={(e) => handlePreferencesChange('timezone', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            >
                                                <option value="Africa/Libreville">Libreville (GMT+1)</option>
                                                <option value="Africa/Paris">Paris (GMT+1)</option>
                                                <option value="America/New_York">New York (GMT-5)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="admin-label">Thème</label>
                                            <select
                                                value={formData.preferences?.theme || profile.preferences.theme}
                                                onChange={(e) => handlePreferencesChange('theme', e.target.value)}
                                                disabled={!isEditing}
                                                className="admin-input"
                                            >
                                                <option value="dark">Sombre</option>
                                                <option value="light">Clair</option>
                                                <option value="auto">Automatique</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-pm-gold/20 pt-6">
                                        <h3 className="text-lg font-semibold text-pm-gold mb-4">Notifications</h3>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.preferences?.notifications?.email ?? profile.preferences.notifications.email}
                                                    onChange={(e) => handlePreferencesChange('notifications', {
                                                        ...profile.preferences.notifications,
                                                        email: e.target.checked
                                                    })}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-pm-gold bg-gray-900 border-gray-600 rounded focus:ring-pm-gold"
                                                />
                                                <span className="text-pm-off-white">Notifications par email</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.preferences?.notifications?.sms ?? profile.preferences.notifications.sms}
                                                    onChange={(e) => handlePreferencesChange('notifications', {
                                                        ...profile.preferences.notifications,
                                                        sms: e.target.checked
                                                    })}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-pm-gold bg-gray-900 border-gray-600 rounded focus:ring-pm-gold"
                                                />
                                                <span className="text-pm-off-white">Notifications SMS</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.preferences?.notifications?.push ?? profile.preferences.notifications.push}
                                                    onChange={(e) => handlePreferencesChange('notifications', {
                                                        ...profile.preferences.notifications,
                                                        push: e.target.checked
                                                    })}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-pm-gold bg-gray-900 border-gray-600 rounded focus:ring-pm-gold"
                                                />
                                                <span className="text-pm-off-white">Notifications push</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-yellow-400">Sécurité du compte</h3>
                                                <p className="text-pm-off-white/60 text-sm">Gérez la sécurité de votre compte administrateur</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="admin-label">Dernière connexion</label>
                                            <input
                                                type="text"
                                                value={new Date(profile.security.lastLogin).toLocaleString('fr-FR')}
                                                disabled
                                                className="admin-input bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label">Authentification à deux facteurs</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={profile.security.twoFactorEnabled}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-pm-gold bg-gray-900 border-gray-600 rounded focus:ring-pm-gold"
                                                />
                                                <span className="text-pm-off-white">
                                                    {profile.security.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-pm-gold/20 pt-6">
                                        <h3 className="text-lg font-semibold text-pm-gold mb-4">Historique des connexions</h3>
                                        <div className="space-y-3">
                                            {profile.security.loginHistory.length > 0 ? (
                                                profile.security.loginHistory.map((login, index) => (
                                                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-pm-off-white font-medium">
                                                                    {new Date(login.date).toLocaleString('fr-FR')}
                                                                </p>
                                                                <p className="text-pm-off-white/60 text-sm">
                                                                    IP: {login.ip} • {login.location}
                                                                </p>
                                                            </div>
                                                            <span className="text-green-400 text-sm">✓ Connexion réussie</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-pm-off-white/60 text-center py-8">
                                                    Aucun historique de connexion disponible
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-pm-gold/20 pt-6">
                                        <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions de sécurité</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
                                                <KeyIcon className="w-5 h-5 text-red-400" />
                                                <div className="text-left">
                                                    <p className="text-red-400 font-medium">Changer le mot de passe</p>
                                                    <p className="text-pm-off-white/60 text-sm">Mettre à jour votre mot de passe</p>
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                                                <BellIcon className="w-5 h-5 text-blue-400" />
                                                <div className="text-left">
                                                    <p className="text-blue-400 font-medium">Notifications de sécurité</p>
                                                    <p className="text-pm-off-white/60 text-sm">Configurer les alertes</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
