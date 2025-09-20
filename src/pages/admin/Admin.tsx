import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
    UsersIcon, BookOpenIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon,
    ChatBubbleLeftRightIcon,
    HomeIcon, CurrencyDollarIcon,
    SignalIcon, Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon,
    ServerIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import { useRealData } from '../../hooks/useRealData';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';
import { useAdminDataSync } from '../../services/adminDataSync';
import { useAdminCache } from '../../hooks/useAdminCache';
import AdminNavigationDebug from '../../components/AdminNavigationDebug';
import { ComptabiliteView } from './AdminComptabilite';
import { ParametresView } from './AdminParametres';
import { MannequinsView, CastingView, ContentView, TechniqueView, MessagerieView } from './AdminViews';
import RealDataDashboard from '../../components/RealDataDashboard';
import AdminDataIntegrity from '../../components/AdminDataIntegrity';


type AdminTab = 'dashboard' | 'mannequins' | 'casting' | 'content' | 'comptabilite' | 'parametres' | 'technique' | 'messagerie';

interface ActiveUser {
    name: string;
    role: string;
    loginTime: number;
}

interface AdminStats {
    totalModels: number;
    totalBeginners: number;
    newApplications: number;
    pendingTasks: number;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Administrateur';
        case 'student': return 'Mannequin Pro';
        case 'beginner': return 'Débutant';
        case 'jury': return 'Jury';
        case 'registration': return 'Enregistrement';
        default: return role;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-500/20 text-red-300';
        case 'student': return 'bg-pm-gold/20 text-pm-gold';
        case 'beginner': return 'bg-blue-500/20 text-blue-300';
        case 'jury': return 'bg-purple-500/20 text-purple-300';
        case 'registration': return 'bg-teal-500/20 text-teal-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

// Helper function to generate notifications for different sections
const generateNotifications = (data: any, section: string): any[] => {
    const notifications: any[] = [];

    switch (section) {
        case 'casting':
            const castingApps = data?.castingApplications || [];
            castingApps.forEach((app: any, index: number) => {
                if (index < 3) { // Show only first 3
                    notifications.push({
                        id: `casting-${app.id}`,
                        title: `Nouvelle candidature`,
                        message: `${app.firstName} ${app.lastName} a postulé pour le casting`,
                        type: 'info' as const,
                        timestamp: new Date(app.createdAt).toLocaleDateString('fr-FR'),
                        link: '/admin/casting-applications'
                    });
                }
            });
            break;

        case 'booking':
            const bookings = data?.bookingRequests || [];
            bookings.forEach((booking: any, index: number) => {
                if (index < 3) {
                    notifications.push({
                        id: `booking-${booking.id}`,
                        title: `Demande de booking`,
                        message: `Nouvelle demande de ${booking.clientName} pour ${booking.eventType}`,
                        type: 'warning' as const,
                        timestamp: new Date(booking.createdAt).toLocaleDateString('fr-FR'),
                        link: '/admin/bookings'
                    });
                }
            });
            break;

        case 'fashion-day':
            const fashionApps = data?.fashionDayApplications || [];
            fashionApps.forEach((app: any, index: number) => {
                if (index < 3) {
                    notifications.push({
                        id: `fashion-${app.id}`,
                        title: `Candidature PFD`,
                        message: `${app.firstName} ${app.lastName} souhaite participer au Perfect Fashion Day`,
                        type: 'success' as const,
                        timestamp: new Date(app.createdAt).toLocaleDateString('fr-FR'),
                        link: '/admin/fashion-day-applications'
                    });
                }
            });
            break;

        case 'messages':
            const messages = data?.contactMessages || [];
            messages.forEach((message: any, index: number) => {
                if (index < 3) {
                    notifications.push({
                        id: `message-${message.id}`,
                        title: `Message de ${message.name}`,
                        message: message.message.substring(0, 100) + '...',
                        type: 'info' as const,
                        timestamp: new Date(message.createdAt).toLocaleDateString('fr-FR'),
                        link: '/admin/messages'
                    });
                }
            });
            break;

        case 'recovery':
            const recoveries = data?.recoveryRequests || [];
            recoveries.forEach((recovery: any, index: number) => {
                if (index < 3) {
                    notifications.push({
                        id: `recovery-${recovery.id}`,
                        title: `Demande de récupération`,
                        message: `${recovery.name} a oublié ses identifiants`,
                        type: 'error' as const,
                        timestamp: new Date(recovery.createdAt).toLocaleDateString('fr-FR'),
                        link: '/admin/recovery-requests'
                    });
                }
            });
            break;
    }

    return notifications;
};

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const { getRealStats } = useRealData();
    const { syncAllData, generateReport } = useAdminDataSync();
    const { isInitialized: cacheInitialized, getCachedData, forceUpdateCache } = useAdminCache();
    const { activeTab, sidebarOpen, handleTabChange, toggleSidebar, closeSidebar } = useAdminNavigation();
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [showDebug, setShowDebug] = useState(false);
    const [stats, setStats] = useState<AdminStats>({
        totalModels: 0,
        totalBeginners: 0,
        newApplications: 0,
        pendingTasks: 0
    });

    // Utiliser les vraies données
    const realStats = getRealStats();

    useEffect(() => {
        const checkActivity = () => {
            const now = Date.now();
            const fifteenMinutes = 15 * 60 * 1000;
            const currentActivityJSON = localStorage.getItem('pmm_active_users');
            const allUsers: ActiveUser[] = currentActivityJSON ? JSON.parse(currentActivityJSON) : [];
            const recentUsers = allUsers.filter(user => (now - user.loginTime) < fifteenMinutes);
            setActiveUsers(recentUsers);
        };

        checkActivity();
        const interval = setInterval(checkActivity, 5000);

        return () => clearInterval(interval);
    }, []);

    // État pour contrôler la synchronisation
    const [lastSyncTime, setLastSyncTime] = useState<number>(0);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (data && !isInitialized && cacheInitialized) {
            // Synchronisation initiale uniquement
            syncAllData().then((syncData) => {
                console.log('Données admin synchronisées:', syncData);
                const report = generateReport(syncData);
                console.log('Rapport de synchronisation:', report);
                setLastSyncTime(Date.now());
                setIsInitialized(true);
            }).catch((error) => {
                console.error('Erreur lors de la synchronisation:', error);
                setIsInitialized(true);
            });
        }

        if (data) {
            setStats({
                totalModels: realStats.totalModels,
                totalBeginners: realStats.totalBeginnerStudents,
                newApplications: realStats.totalCastingApplications + realStats.totalFashionDayApplications,
                pendingTasks: realStats.totalRecoveryRequests + realStats.totalBookingRequests + realStats.totalContactMessages
            });
        }
    }, [data, realStats, isInitialized, cacheInitialized]);


    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Fonction de synchronisation manuelle
    const handleManualSync = async () => {
        try {
            // Forcer la mise à jour du cache
            forceUpdateCache();
            
            const syncData = await syncAllData(true); // Force la synchronisation
            console.log('Synchronisation manuelle effectuée:', syncData);
            const report = generateReport(syncData);
            console.log('Rapport de synchronisation:', report);
            setLastSyncTime(Date.now());
        } catch (error) {
            console.error('Erreur lors de la synchronisation manuelle:', error);
        }
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    const navigationItems: { id: AdminTab; label: string; icon: React.ElementType; description: string }[] = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: HomeIcon, description: 'Vue d\'ensemble et notifications' },
        { id: 'mannequins', label: 'Mannequins', icon: UsersIcon, description: 'Gestion des mannequins et accès' },
        { id: 'casting', label: 'Casting & Événements', icon: ClipboardDocumentListIcon, description: 'Candidatures et Fashion Day' },
        { id: 'content', label: 'Contenu', icon: BookOpenIcon, description: 'Magazine et formations' },
        { id: 'comptabilite', label: 'Comptabilité', icon: CurrencyDollarIcon, description: 'Paiements et finances' },
        { id: 'messagerie', label: 'Messagerie', icon: ChatBubbleLeftRightIcon, description: 'Communication et campagnes' },
        { id: 'parametres', label: 'Paramètres', icon: Cog6ToothIcon, description: 'Configuration du site' },
        { id: 'technique', label: 'Technique', icon: ServerIcon, description: 'Monitoring et maintenance' },
    ];

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO title="Admin Dashboard" noIndex />
            
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-sm border-b border-pm-gold/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleSidebar();
                                }}
                                onMouseDown={(e) => e.preventDefault()}
                                className="lg:hidden p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors cursor-pointer select-none"
                                style={{ 
                                    WebkitTapHighlightColor: 'transparent',
                                    touchAction: 'manipulation'
                                }}
                                aria-label="Toggle navigation menu"
                            >
                                {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-pm-gold rounded-lg flex items-center justify-center">
                                    <UserCircleIcon className="w-5 h-5 text-black" />
                                </div>
                    <div>
                                    <h1 className="text-lg font-bold text-pm-gold">Admin Panel</h1>
                                    <p className="text-xs text-pm-off-white/60">Perfect Models Management</p>
                                </div>
                            </div>
                    </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Synchronisation manuelle */}
                            <button
                                onClick={handleManualSync}
                                className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                title={`Synchroniser les données${lastSyncTime ? ` (Dernière sync: ${new Date(lastSyncTime).toLocaleTimeString()})` : ''}`}
                            >
                                <SignalIcon className="w-5 h-5" />
                            </button>

                            {/* Debug Toggle */}
                            <button
                                onClick={() => setShowDebug(!showDebug)}
                                className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                title="Toggle Debug Panel"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors relative">
                                    <BellIcon className="w-5 h-5" />
                                    {(stats.newApplications + stats.pendingTasks) > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {stats.newApplications + stats.pendingTasks}
                                        </span>
                                    )}
                                </button>
                </div>

                            {/* User Info */}
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <div className="text-right">
                                    <p className="text-pm-gold font-medium">Administrateur</p>
                                    <p className="text-pm-off-white/60 text-xs">Connecté</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                    title="Déconnexion"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/80 backdrop-blur-sm border-r border-pm-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full pt-16 lg:pt-0">
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navigationItems.map((item) => (
                            <button
                                    key={item.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleTabChange(item.id);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent focus issues
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer select-none ${
                                        activeTab === item.id
                                            ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30 shadow-lg'
                                            : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 hover:shadow-md'
                                    }`}
                                    style={{ 
                                        WebkitTapHighlightColor: 'transparent',
                                        touchAction: 'manipulation'
                                    }}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-xs opacity-60">{item.description}</p>
                                    </div>
                            </button>
                        ))}
                    </nav>
                        
                        {/* Active Users */}
                        <div className="p-4 border-t border-pm-gold/20">
                            <h3 className="text-sm font-medium text-pm-gold mb-3 flex items-center gap-2">
                                <SignalIcon className="w-4 h-4" />
                                Utilisateurs Actifs
                            </h3>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {activeUsers.length > 0 ? (
                                    activeUsers.map(user => (
                                        <div key={user.name} className="flex items-center gap-2 p-2 rounded-md bg-pm-dark/50">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-pm-off-white truncate">{user.name}</p>
                                                <p className={`text-xs px-1 py-0.5 rounded-full inline-block ${getRoleColor(user.role)}`}>
                                                    {getRoleDisplayName(user.role)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-pm-off-white/60">Aucun utilisateur actif</p>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                       {/* Main Content */}
                       <main className="flex-1 lg:ml-0">
                           <div className="p-4">
                        {activeTab === 'dashboard' && <RealDataDashboard />}
                        {activeTab === 'mannequins' && <MannequinsView data={data} />}
                        {activeTab === 'casting' && <CastingView newCastingApps={newCastingApps} newFashionDayApps={newFashionDayApps} data={data} generateNotifications={generateNotifications} />}
                        {activeTab === 'content' && <ContentView />}
                        {activeTab === 'comptabilite' && <ComptabiliteView newBookingRequests={newBookingRequests} newMessages={newMessages} newRecoveryRequests={newRecoveryRequests} data={data} generateNotifications={generateNotifications} />}
                        {activeTab === 'messagerie' && <MessagerieView data={data} />}
                        {activeTab === 'parametres' && <ParametresView data={data} />}
                        {activeTab === 'technique' && <TechniqueView data={data} />}
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeSidebar();
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                    }}
                />
            )}

            {/* Debug Panel */}
            {showDebug && (
                <AdminNavigationDebug
                    activeTab={activeTab}
                    sidebarOpen={sidebarOpen}
                    onTabChange={handleTabChange}
                    onToggleSidebar={toggleSidebar}
                />
            )}
        </div>
    );
};

// Dashboard View Component - Supprimé car non utilisé

// Composants supprimés car non utilisés

export default Admin;
