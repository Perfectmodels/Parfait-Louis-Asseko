import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    UsersIcon, 
    UserGroupIcon,
    NewspaperIcon,
    BookOpenIcon,
    CalendarDaysIcon, 
    SparklesIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightOnRectangleIcon,
    KeyIcon,
    AcademicCapIcon,
    ExclamationTriangleIcon,
    PresentationChartLineIcon,
    ChartBarIcon,
    BuildingStorefrontIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

// Interface pour les propriétés de la carte de statistique
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    link: string;
    color?: string;
    description?: string;
    notificationCount?: number;
}

// Composant de tuile de statistique
const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    link,
    color = 'blue',
    description,
    notificationCount
}) => (
    <Link 
        to={link}
        className={`relative block bg-${color}-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
    >
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
            </span>
        )}
        <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${color}-100 dark:bg-gray-700`}>
                <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                {value && (
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {value}
                    </p>
                )}
            </div>
        </div>
        {description && (
            <div className="mt-2 text-sm text-gray-400">
                <span>{description}</span>
            </div>
        )}
    </Link>
);

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Mettre à jour l'onglet actif en fonction de l'URL actuelle
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const currentTab = navItems.find((item) => item.path === currentPath)?.id || 'dashboard';
        setActiveTab(currentTab);
    }, [window.location.pathname, navItems]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fonction de déconnexion
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Données pour les statistiques
    const stats = {
        totalModels: data?.models?.length || 0,
        newCastingApps: data?.castingApplications?.filter((app: { status: string }) => app.status === 'Nouveau').length || 0,
        pendingBookings: data?.bookingRequests?.filter((req: { status: string }) => req.status === 'En attente').length || 0,
        newMessages: data?.contactMessages?.filter((msg: { read: boolean }) => !msg.read).length || 0,
        proModels: data?.models?.filter((m: { level: string }) => m.level === 'Pro').length || 0,
        beginnerModels: data?.models?.filter((m: { level: string }) => m.level === 'Débutant').length || 0,
        activeEvents: data?.fashionDayEvents?.filter((e: { date: string }) => new Date(e.date) >= new Date()).length || 0
    };

    // Définition du type pour les éléments de navigation
    interface NavItem {
        id: string;
        icon: React.ElementType;
        label: string;
        path: string;
    }

    // Menu de navigation
    const navItems: NavItem[] = [
        { id: 'dashboard', icon: PresentationChartLineIcon, label: 'Tableau de bord', path: '/admin' },
        { id: 'models', icon: UsersIcon, label: 'Mannequins', path: '/admin/models' },
        { id: 'content', icon: NewspaperIcon, label: 'Contenu', path: '/admin/magazine' },
        { id: 'services', icon: BriefcaseIcon, label: 'Services', path: '/admin/services' },
        { id: 'events', icon: CalendarDaysIcon, label: 'Événements', path: '/admin/fashion-day-events' },
        { id: 'classroom', icon: AcademicCapIcon, label: 'Formation', path: '/admin/classroom' },
        { id: 'settings', icon: Cog6ToothIcon, label: 'Paramètres', path: '/admin/settings' }
    ];

    // Fonction pour formater les nombres
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white flex">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-pm-darker p-4 border-r border-pm-gold/10">
                <div className="flex items-center space-x-2 p-4 mb-8">
                    <SparklesIcon className="w-8 h-8 text-pm-gold" />
                    <span className="text-xl font-bold">PMM Admin</span>
                </div>
                
                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === item.id
                                    ? 'bg-pm-gold/10 text-pm-gold'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-pm-gold/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-pm-darker/95 backdrop-blur-sm z-50 p-4 flex items-center justify-between border-b border-pm-gold/10">
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-bold">Tableau de bord</span>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed top-0 left-0 bottom-0 w-72 bg-pm-darker p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2">
                                <SparklesIcon className="w-8 h-8 text-pm-gold" />
                                <span className="text-xl font-bold">PMM Admin</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        activeTab === item.id
                                            ? 'bg-pm-gold/10 text-pm-gold'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 pt-16 md:pt-6 pb-6 md:ml-64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Tableau de bord</h1>
                        <p className="text-pm-gold/80 mt-1">Bienvenue dans l'administration de Perfect Models Management</p>
                    </header>
                
                    <div className="space-y-12">
                        {/* Section: Gestion des Talents */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Gestion des Talents</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Gérer les Mannequins" 
                                    value={stats.totalModels}
                                    icon={UsersIcon} 
                                    link="/admin/models" 
                                    description={`${stats.proModels} Pro • ${stats.beginnerModels} Débutants`}
                                />
                                <StatCard 
                                    title="Candidatures Casting" 
                                    value={stats.newCastingApps}
                                    icon={ClipboardDocumentListIcon} 
                                    link="/admin/casting-applications"
                                    description="Consulter et traiter les candidatures pour les castings."
                                    notificationCount={stats.newCastingApps}
                                />
                                <StatCard 
                                    title="Résultats & Validation Casting" 
                                    value=""
                                    icon={ClipboardDocumentCheckIcon} 
                                    link="/admin/casting-results"
                                    description="Valider les candidats et créer leurs profils de mannequin."
                                />
                            </div>
                        </section>
                        
                        {/* Section: Gestion du Contenu */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Gestion du Contenu</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Gérer le Magazine" 
                                    value=""
                                    icon={NewspaperIcon} 
                                    link="/admin/magazine"
                                    description="Créer et administrer les articles du magazine Focus Model 241."
                                />
                                <StatCard 
                                    title="Modérer les Commentaires" 
                                    value=""
                                    icon={ChatBubbleLeftRightIcon} 
                                    link="/admin/comments"
                                    description="Gérer les commentaires laissés sur les articles du magazine."
                                />
                                <StatCard 
                                    title="Gérer les Actualités" 
                                    value=""
                                    icon={PresentationChartLineIcon} 
                                    link="/admin/news"
                                    description="Publier et gérer les actualités du site."
                                />
                                <StatCard 
                                    title="Gérer les Services" 
                                    value={data?.agencyServices?.length || 0}
                                    icon={BriefcaseIcon} 
                                    link="/admin/services"
                                    description="Gérer les services proposés par l'agence."
                                />
                            </div>
                        </section>
                        
                        {/* Section: Administration & Système */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Administration & Système</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Messages de Contact" 
                                    value={stats.newMessages}
                                    icon={EnvelopeIcon} 
                                    link="/admin/messages"
                                    description="Lire et gérer les messages reçus via le formulaire de contact."
                                    notificationCount={stats.newMessages}
                                />
                                <StatCard 
                                    title="Paramètres du Site" 
                                    value=""
                                    icon={Cog6ToothIcon} 
                                    link="/admin/settings"
                                    description="Modifier les informations de contact, les images et les clés API."
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
