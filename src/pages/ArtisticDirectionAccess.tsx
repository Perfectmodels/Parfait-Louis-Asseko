import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    PaintBrushIcon, 
    CameraIcon, 
    PhotoIcon,
    UserIcon,
    CalendarDaysIcon,
    DocumentTextIcon,
    EyeIcon,
    PencilIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface ArtisticDirector {
    id: string;
    name: string;
    role: 'principal' | 'adjointe';
    email: string;
    permissions: string[];
    avatar?: string;
    lastLogin?: string;
    isActive: boolean;
}

const ArtisticDirectionAccess: React.FC = () => {
    const { data } = useData();
    const [currentUser, setCurrentUser] = useState<ArtisticDirector | null>(null);
    const [loading, setLoading] = useState(true);

    // Simuler l'authentification des directrices artistiques
    useEffect(() => {
        const loadUser = () => {
            // En réalité, cela viendrait de l'authentification
            const userType = localStorage.getItem('artistic_director_type') || 'adjointe';
            
            const directors: ArtisticDirector[] = [
                {
                    id: 'fave-gloa',
                    name: 'Fave GLOA',
                    role: 'principal',
                    email: 'fave.gloa@perfectmodels.ga',
                    permissions: [
                        'view_all_briefs',
                        'create_briefs',
                        'edit_briefs',
                        'delete_briefs',
                        'manage_models',
                        'view_analytics',
                        'manage_team'
                    ],
                    avatar: '/images/fave-gloa.jpg',
                    lastLogin: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 'aj-caramela',
                    name: 'AJ Caramela',
                    role: 'adjointe',
                    email: 'aj.caramela@perfectmodels.ga',
                    permissions: [
                        'view_all_briefs',
                        'create_briefs',
                        'edit_briefs',
                        'manage_models'
                    ],
                    avatar: '/images/aj-caramela.jpg',
                    lastLogin: new Date().toISOString(),
                    isActive: true
                }
            ];

            const user = directors.find(d => d.role === userType);
            setCurrentUser(user || directors[1]); // Par défaut AJ Caramela
            setLoading(false);
        };

        loadUser();
    }, []);

    const hasPermission = (permission: string): boolean => {
        return currentUser?.permissions.includes(permission) || false;
    };

    const getRoleColor = (role: string) => {
        return role === 'principal' 
            ? 'bg-pm-gold/20 text-pm-gold border-pm-gold/30'
            : 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    };

    const getRoleLabel = (role: string) => {
        return role === 'principal' ? 'Directrice Artistique Principale' : 'Directrice Artistique Adjointe';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p className="text-pm-off-white">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pm-gold mb-2">Accès non autorisé</h2>
                    <p className="text-pm-off-white/60 mb-6">Vous n'avez pas les permissions nécessaires.</p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title={`Direction Artistique - ${currentUser.name}`}
                description="Interface de direction artistique pour Perfect Models"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {currentUser.avatar ? (
                                <img 
                                    src={currentUser.avatar} 
                                    alt={currentUser.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-pm-gold/50"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-pm-gold/20 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-pm-gold" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-bold text-pm-gold">{currentUser.name}</h1>
                                <p className="text-pm-off-white/60">{getRoleLabel(currentUser.role)}</p>
                            </div>
                        </div>
                        
                        <div className={`px-4 py-2 rounded-full border ${getRoleColor(currentUser.role)}`}>
                            <span className="font-semibold">{getRoleLabel(currentUser.role)}</span>
                        </div>
                    </div>
                </div>

                {/* Tableau de bord */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Briefings */}
                    <Link 
                        to="/admin/artistic-direction" 
                        className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-pm-gold/20 rounded-lg">
                                <DocumentTextIcon className="w-6 h-6 text-pm-gold" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-pm-gold">Briefings</h3>
                                <p className="text-pm-off-white/60 text-sm">Gérer les briefings</p>
                            </div>
                        </div>
                        <p className="text-pm-off-white/70 text-sm mb-4">
                            Créez et assignez des briefings de séance photo
                        </p>
                        <div className="flex items-center text-pm-gold group-hover:text-pm-gold/80">
                            <span className="text-sm font-medium">Accéder</span>
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </div>
                    </Link>

                    {/* Gestion des Photos */}
                    <Link 
                        to="/admin/photo-upload" 
                        className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-pm-gold/20 rounded-lg">
                                <CameraIcon className="w-6 h-6 text-pm-gold" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-pm-gold">Photos</h3>
                                <p className="text-pm-off-white/60 text-sm">Gérer les photos</p>
                            </div>
                        </div>
                        <p className="text-pm-off-white/70 text-sm mb-4">
                            Uploadez et organisez les photos des mannequins
                        </p>
                        <div className="flex items-center text-pm-gold group-hover:text-pm-gold/80">
                            <span className="text-sm font-medium">Accéder</span>
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </div>
                    </Link>

                    {/* Mannequins */}
                    {hasPermission('manage_models') && (
                        <Link 
                            to="/admin/models" 
                            className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-pm-gold/20 rounded-lg">
                                    <UserIcon className="w-6 h-6 text-pm-gold" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-pm-gold">Mannequins</h3>
                                    <p className="text-pm-off-white/60 text-sm">Gérer les mannequins</p>
                                </div>
                            </div>
                            <p className="text-pm-off-white/70 text-sm mb-4">
                                Consultez et gérez les profils des mannequins
                            </p>
                            <div className="flex items-center text-pm-gold group-hover:text-pm-gold/80">
                                <span className="text-sm font-medium">Accéder</span>
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </div>
                        </Link>
                    )}

                    {/* Analytics (Principal seulement) */}
                    {hasPermission('view_analytics') && (
                        <Link 
                            to="/admin/analytics" 
                            className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-pm-gold/20 rounded-lg">
                                    <PaintBrushIcon className="w-6 h-6 text-pm-gold" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-pm-gold">Analytics</h3>
                                    <p className="text-pm-off-white/60 text-sm">Métriques et performances</p>
                                </div>
                            </div>
                            <p className="text-pm-off-white/70 text-sm mb-4">
                                Consultez les métriques et performances
                            </p>
                            <div className="flex items-center text-pm-gold group-hover:text-pm-gold/80">
                                <span className="text-sm font-medium">Accéder</span>
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </div>
                        </Link>
                    )}
                </div>

                {/* Permissions */}
                <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-pm-gold mb-4">Vos Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentUser.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                <span className="text-pm-off-white">
                                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtisticDirectionAccess;
