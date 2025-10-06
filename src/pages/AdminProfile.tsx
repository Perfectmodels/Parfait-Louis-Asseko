import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import { 
    UserIcon, 
    PencilIcon, 
    KeyIcon,
    EnvelopeIcon,
    PhoneIcon,
    ShieldCheckIcon,
    CalendarIcon,
    CameraIcon
} from '@heroicons/react/24/outline';

interface AdminProfileData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profileImage: string;
    bio: string;
    lastLogin: string;
    createdAt: string;
    permissions: string[];
}

const AdminProfile: React.FC = () => {
    const { data, saveData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<AdminProfileData>({
        id: 'admin_001',
        name: 'Administrateur Principal',
        email: 'admin@perfectmodels.ga',
        phone: '+241 XX XX XX XX',
        role: 'Administrateur',
        profileImage: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
        bio: 'Administrateur principal de Perfect Models Management',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        permissions: ['all']
    });

    const [formData, setFormData] = useState(profileData);

    useEffect(() => {
        // Charger les données du profil admin depuis le localStorage ou la base de données
        const savedProfile = localStorage.getItem('admin_profile');
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(parsedProfile);
            setFormData(parsedProfile);
        }
    }, []);

    const handleSave = async () => {
        const updatedProfile = { ...formData, lastLogin: new Date().toISOString() };
        
        // Sauvegarder dans le localStorage
        localStorage.setItem('admin_profile', JSON.stringify(updatedProfile));
        
        // Mettre à jour l'état local
        setProfileData(updatedProfile);
        setIsEditing(false);
        
        alert('Profil mis à jour avec succès !');
    };

    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
    };

    const handleChange = (field: keyof AdminProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const permissions = [
        { name: 'Gestion des Utilisateurs', description: 'Créer, modifier et supprimer des utilisateurs' },
        { name: 'Gestion du Contenu', description: 'Modifier le contenu des pages du site' },
        { name: 'Gestion des Paiements', description: 'Approuver et gérer les paiements' },
        { name: 'Gestion des Médias', description: 'Uploader et gérer les images' },
        { name: 'Messagerie', description: 'Communiquer avec les utilisateurs' },
        { name: 'Rapports', description: 'Consulter les statistiques et rapports' },
        { name: 'Configuration', description: 'Modifier les paramètres du système' }
    ];

    return (
        <AdminSidebarLayout 
            title="Mon Profil" 
            description="Gérez vos informations personnelles et paramètres"
            breadcrumbs={[
                { label: "Profil" }
            ]}
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header du Profil */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Photo de Profil */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-pm-gold/20 flex items-center justify-center overflow-hidden border-4 border-pm-gold/30">
                                {profileData.profileImage ? (
                                    <img 
                                        src={profileData.profileImage} 
                                        alt="Photo de profil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-pm-gold" />
                                )}
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-pm-gold text-pm-dark rounded-full hover:bg-yellow-400 transition-colors duration-200">
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Informations Principales */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-playfair text-pm-gold mb-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="bg-transparent border-b border-pm-gold/50 text-pm-gold text-3xl font-playfair focus:outline-none focus:border-pm-gold"
                                    />
                                ) : (
                                    profileData.name
                                )}
                            </h1>
                            <p className="text-pm-off-white/70 mb-4">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => handleChange('role', e.target.value)}
                                        className="bg-transparent border-b border-pm-gold/50 text-pm-off-white/70 focus:outline-none focus:border-pm-gold"
                                    />
                                ) : (
                                    profileData.role
                                )}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-semibold rounded-full border border-green-500/30">
                                    <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                                    Actif
                                </span>
                                <span className="text-sm text-pm-off-white/60">
                                    Dernière connexion: {new Date(profileData.lastLogin).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                                    >
                                        Sauvegarder
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                                    >
                                        Annuler
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Modifier
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations Détaillées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Informations Personnelles */}
                    <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                            <UserIcon className="w-6 h-6" />
                            Informations Personnelles
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-pm-off-white/5 rounded-lg">
                                        <EnvelopeIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white">{profileData.email}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">
                                    Téléphone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-pm-off-white/5 rounded-lg">
                                        <PhoneIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white">{profileData.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">
                                    Image de Profil
                                </label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={formData.profileImage}
                                        onChange={(e) => handleChange('profileImage', e.target.value)}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="URL de l'image"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-pm-off-white/5 rounded-lg">
                                        <CameraIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white truncate">{profileData.profileImage}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">
                                    Biographie
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        rows={4}
                                    />
                                ) : (
                                    <div className="p-3 bg-pm-off-white/5 rounded-lg">
                                        <p className="text-pm-off-white">{profileData.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Permissions et Accès */}
                    <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                            <KeyIcon className="w-6 h-6" />
                            Permissions
                        </h2>
                        
                        <div className="space-y-4">
                            {permissions.map((permission, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-pm-off-white/5 rounded-lg">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-300 mt-1">
                                        <ShieldCheckIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-pm-off-white">{permission.name}</h3>
                                        <p className="text-sm text-pm-off-white/60">{permission.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <CalendarIcon className="w-5 h-5 text-pm-gold" />
                                <span className="font-semibold text-pm-gold">Membre depuis</span>
                            </div>
                            <p className="text-pm-off-white">
                                {new Date(profileData.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions de Sécurité */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6">
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                        <ShieldCheckIcon className="w-6 h-6" />
                        Sécurité
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 transition-colors duration-200 text-left">
                            <h3 className="font-semibold text-pm-gold mb-2">Changer le Mot de Passe</h3>
                            <p className="text-sm text-pm-off-white/60">Mettre à jour votre mot de passe de sécurité</p>
                        </button>
                        
                        <button className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 transition-colors duration-200 text-left">
                            <h3 className="font-semibold text-pm-gold mb-2">Authentification à Deux Facteurs</h3>
                            <p className="text-sm text-pm-off-white/60">Activer la sécurité renforcée</p>
                        </button>
                        
                        <button className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 transition-colors duration-200 text-left">
                            <h3 className="font-semibold text-pm-gold mb-2">Sessions Actives</h3>
                            <p className="text-sm text-pm-off-white/60">Gérer vos connexions actives</p>
                        </button>
                        
                        <button className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 transition-colors duration-200 text-left">
                            <h3 className="font-semibold text-pm-gold mb-2">Logs de Connexion</h3>
                            <p className="text-sm text-pm-off-white/60">Consulter l'historique des connexions</p>
                        </button>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
};

export default AdminProfile;
