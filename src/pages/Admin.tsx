import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon, Bars3Icon, XMarkIcon, BellIcon, ChartBarIcon, UserCircleIcon, ClockIcon, PlusIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

type AdminTab = 'dashboard' | 'talents' | 'content' | 'accounting' | 'analytics';

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

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState<AdminStats>({
        totalModels: 0,
        totalBeginners: 0,
        newApplications: 0,
        pendingTasks: 0
    });

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

    useEffect(() => {
        if (data) {
            const newCastingApps = data.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newFashionDayApps = data.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newRecoveryRequests = data.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
            const newBookingRequests = data.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
            const newMessages = data.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

            setStats({
                totalModels: data.models?.length || 0,
                totalBeginners: data.beginnerStudents?.length || 0,
                newApplications: newCastingApps + newFashionDayApps,
                pendingTasks: newRecoveryRequests + newBookingRequests + newMessages
            });
        }
    }, [data]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    const navigationItems: { id: AdminTab; label: string; icon: React.ElementType; description: string }[] = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: HomeIcon, description: 'Vue d\'ensemble et statistiques' },
        { id: 'talents', label: 'Gestion des Talents', icon: UsersIcon, description: 'Mannequins et recrutement' },
        { id: 'content', label: 'Contenu & Formation', icon: BookOpenIcon, description: 'Magazine et formations' },
        { id: 'accounting', label: 'Comptabilité & Suivi', icon: BriefcaseIcon, description: 'Paiements et opérations' },
        { id: 'analytics', label: 'Analytiques', icon: ChartBarIcon, description: 'Statistiques et rapports' },
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
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
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
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        activeTab === item.id
                                            ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                            : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                    }`}
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
                        {activeTab === 'dashboard' && <DashboardView stats={stats} activeUsers={activeUsers} />}
                        {activeTab === 'talents' && <TalentsView newCastingApps={newCastingApps} />}
                        {activeTab === 'content' && <ContentView />}
                        {activeTab === 'accounting' && <AccountingView newBookingRequests={newBookingRequests} newFashionDayApps={newFashionDayApps} newMessages={newMessages} newRecoveryRequests={newRecoveryRequests} />}
                        {activeTab === 'analytics' && <AnalyticsView data={data} />}
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

// Dashboard View Component
const DashboardView: React.FC<{ stats: AdminStats; activeUsers: ActiveUser[] }> = ({ stats, activeUsers }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-pm-gold">Tableau de Bord</h2>
                <p className="text-pm-off-white/60">Vue d'ensemble de la plateforme</p>
            </div>
            <div className="text-sm text-pm-off-white/60">
                Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Mannequins Pro" 
                value={stats.totalModels} 
                icon={UsersIcon} 
                color="text-pm-gold" 
                bgColor="bg-pm-gold/10" 
            />
            <StatCard 
                title="Débutants" 
                value={stats.totalBeginners} 
                icon={UserGroupIcon} 
                color="text-blue-400" 
                bgColor="bg-blue-500/10" 
            />
            <StatCard 
                title="Nouvelles Candidatures" 
                value={stats.newApplications} 
                icon={ClipboardDocumentListIcon} 
                color="text-green-400" 
                bgColor="bg-green-500/10" 
            />
            <StatCard 
                title="Tâches en Attente" 
                value={stats.pendingTasks} 
                icon={ClockIcon} 
                color="text-orange-400" 
                bgColor="bg-orange-500/10" 
            />
        </div>

        {/* Quick Actions */}
        <div className="bg-black/50 rounded-lg p-6 border border-pm-gold/20">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard 
                    title="Nouvelle Candidature" 
                    description="Traiter les candidatures en attente"
                    icon={ClipboardDocumentListIcon}
                    link="/admin/casting-applications"
                    count={stats.newApplications}
                />
                <QuickActionCard 
                    title="Messages" 
                    description="Répondre aux messages clients"
                    icon={EnvelopeIcon}
                    link="/admin/messages"
                />
                <QuickActionCard 
                    title="Paramètres" 
                    description="Configurer la plateforme"
                    icon={Cog6ToothIcon}
                    link="/admin/settings"
                />
            </div>
        </div>
    </div>
);

// Talents View Component
const TalentsView: React.FC<{ newCastingApps: number }> = ({ newCastingApps }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Gestion des Talents</h2>
            <p className="text-pm-off-white/60">Recrutement et gestion des mannequins</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Créer des Utilisateurs" icon={PlusIcon} link="/admin/user-creation" description="Créer de nouveaux mannequins ou étudiants débutants avec accès personnalisé."/>
            <DashboardCard title="Gérer les Mannequins Pro" icon={UsersIcon} link="/admin/models" description="Ajouter, modifier ou rétrograder des profils de mannequins."/>
            <DashboardCard title="Gérer les Débutants" icon={UserGroupIcon} link="/admin/beginner-students-access" description="Consulter les accès et promouvoir les mannequins en formation."/>
            <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Créer et assigner des thèmes de séance photo aux mannequins."/>
            <DashboardCard title="Candidatures Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Consulter et traiter les candidatures pour les castings." notificationCount={newCastingApps} />
            <DashboardCard title="Résultats & Validation Casting" icon={ClipboardDocumentCheckIcon} link="/admin/casting-results" description="Valider les candidats et créer leurs profils de débutant." />
            <DashboardCard title="Accès Mannequins Pro" icon={KeyIcon} link="/admin/model-access" description="Consulter les identifiants des mannequins confirmés." />
        </div>
    </div>
);

// Content View Component
const ContentView: React.FC = () => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Contenu & Formation</h2>
            <p className="text-pm-off-white/60">Gestion du contenu et des formations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Gérer le Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Créer et administrer les articles du magazine Focus Model 241." />
            <DashboardCard title="Gérer les Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Publier et gérer les actualités de la page d'accueil." />
            <DashboardCard title="Contenu de l'Agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Mettre à jour les services, la chronologie et les réalisations." />
            <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
            <DashboardCard title="Modérer les Commentaires" icon={ChatBubbleLeftRightIcon} link="/admin/comments" description="Gérer les commentaires laissés sur les articles du magazine." />
            <DashboardCard title="Gérer le Classroom Pro" icon={BookOpenIcon} link="/admin/classroom" description="Modifier les modules et chapitres de la formation avancée." />
            <DashboardCard title="Paramètres du Site" icon={Cog6ToothIcon} link="/admin/settings" description="Modifier les informations de contact, les images et les clés API." />
        </div>
    </div>
);

// Accounting View Component
const AccountingView: React.FC<{ 
    newBookingRequests: number; 
    newFashionDayApps: number; 
    newMessages: number; 
    newRecoveryRequests: number; 
}> = ({ newBookingRequests, newFashionDayApps, newMessages, newRecoveryRequests }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Comptabilité & Suivi</h2>
            <p className="text-pm-off-white/60">Gestion financière et opérationnelle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Enregistrer et suivre les paiements mensuels des mannequins." />
            <DashboardCard title="Suivi des Absences" icon={CalendarIcon} link="/admin/absences" description="Enregistrer et consulter les absences des mannequins." />
            <DashboardCard title="Demandes de Booking" icon={BriefcaseIcon} link="/admin/bookings" description="Consulter et gérer les demandes de booking des clients." notificationCount={newBookingRequests} />
            <DashboardCard title="Candidatures PFD" icon={SparklesIcon} link="/admin/fashion-day-applications" description="Gérer les inscriptions pour l'événement Perfect Fashion Day." notificationCount={newFashionDayApps} />
            <DashboardCard title="Suivi Classroom Pro" icon={AcademicCapIcon} link="/admin/classroom-progress" description="Voir la progression des mannequins confirmés aux quiz." />
            <DashboardCard title="Messages de Contact" icon={EnvelopeIcon} link="/admin/messages" description="Lire et gérer les messages reçus via le formulaire de contact." notificationCount={newMessages} />
            <DashboardCard title="Demandes de Récupération" icon={ExclamationTriangleIcon} link="/admin/recovery-requests" description="Traiter les demandes de coordonnées oubliées." notificationCount={newRecoveryRequests} />
            <DashboardCard title="Livre Comptable" icon={CurrencyDollarIcon} link="/admin/accounting" description="Gérer les revenus, dépenses et générer des rapports PDF." />
        </div>
    </div>
);

// Analytics View Component
const AnalyticsView: React.FC<{ data: any }> = ({ data }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Analytiques</h2>
            <p className="text-pm-off-white/60">Statistiques et rapports de la plateforme</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/50 rounded-lg p-6 border border-pm-gold/20">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">Statistiques Générales</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-pm-off-white/70">Total Mannequins</span>
                        <span className="text-pm-gold font-semibold">{data?.models?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-pm-off-white/70">Total Débutants</span>
                        <span className="text-pm-gold font-semibold">{data?.beginnerStudents?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-pm-off-white/70">Articles Magazine</span>
                        <span className="text-pm-gold font-semibold">{data?.articles?.length || 0}</span>
                    </div>
                </div>
            </div>
            <div className="bg-black/50 rounded-lg p-6 border border-pm-gold/20">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">Activité Récente</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-pm-off-white/70">Candidatures en Attente</span>
                        <span className="text-orange-400 font-semibold">{(data?.castingApplications?.filter((app: any) => app.status === 'Nouveau').length || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-pm-off-white/70">Messages Non Lus</span>
                        <span className="text-red-400 font-semibold">{(data?.contactMessages?.filter((msg: any) => msg.status === 'Nouveau').length || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Stat Card Component
const StatCard: React.FC<{ 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string; 
    bgColor: string; 
}> = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-black/50 rounded-lg p-6 border border-pm-gold/20">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-pm-off-white/60 text-sm">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${bgColor}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

// Quick Action Card Component
const QuickActionCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ElementType; 
    link: string; 
    count?: number; 
}> = ({ title, description, icon: Icon, link, count }) => (
    <Link to={link} className="group block p-4 rounded-lg border border-pm-gold/20 hover:border-pm-gold hover:bg-pm-gold/5 transition-all duration-200">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pm-gold/10 group-hover:bg-pm-gold/20 transition-colors">
                <Icon className="w-5 h-5 text-pm-gold" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-pm-off-white group-hover:text-pm-gold transition-colors">{title}</h4>
                <p className="text-sm text-pm-off-white/60">{description}</p>
            </div>
            {count && count > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {count}
                </span>
            )}
        </div>
    </Link>
);

// Dashboard Card Component
interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <Link to={link} className="relative group block bg-black/50 p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h2>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;