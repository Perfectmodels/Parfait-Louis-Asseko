import React, { useState } from 'react';
import { 
    UsersIcon, 
    BookOpenIcon, 
    NewspaperIcon, 
    CalendarDaysIcon, 
    Cog6ToothIcon, 
    ClipboardDocumentListIcon,
    KeyIcon, 
    AcademicCapIcon, 
    ExclamationTriangleIcon, 
    PresentationChartLineIcon,
    BuildingStorefrontIcon, 
    SparklesIcon, 
    ChatBubbleLeftRightIcon, 
    BriefcaseIcon, 
    EnvelopeIcon,
    ClipboardDocumentCheckIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon, 
    CalendarIcon, 
    PaintBrushIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import AdminCard from '../components/AdminCard';
import SEO from '../../components/SEO';

type AdminTab = 'overview' | 'talents' | 'content' | 'operations';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'gold' | 'blue' | 'green' | 'red' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color = 'gold' }) => {
    const colorClasses = {
        gold: 'bg-pm-gold/10 border-pm-gold/30 text-pm-gold',
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        green: 'bg-green-500/10 border-green-500/30 text-green-400',
        red: 'bg-red-500/10 border-red-500/30 text-red-400',
        purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
    };

    return (
        <div className={`bg-black border rounded-lg p-6 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-pm-off-white/70">{title}</p>
                    <p className="text-3xl font-bold text-pm-off-white mt-1">{value}</p>
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${
                            trend.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                            <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
                            {trend.value}% ce mois
                        </div>
                    )}
                </div>
                <Icon className="w-8 h-8" />
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    // Calculer les statistiques
    const stats = {
        totalModels: data?.models?.length || 0,
        newCastingApps: data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0,
        newFashionDayApps: data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0,
        newRecoveryRequests: data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0,
        newBookingRequests: data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0,
        newMessages: data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0,
        totalArticles: data?.articles?.length || 0,
        totalNews: data?.newsItems?.length || 0,
    };

    const totalNotifications = stats.newCastingApps + stats.newFashionDayApps + stats.newRecoveryRequests + stats.newBookingRequests + stats.newMessages;

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
        { id: 'talents', label: 'Talents', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: NewspaperIcon },
        { id: 'operations', label: 'Opérations', icon: BriefcaseIcon },
    ];

    return (
        <div className="space-y-6">
            <SEO title="Admin Dashboard" noIndex />
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-playfair text-pm-gold font-bold">
                    Tableau de Bord
                </h1>
                <p className="text-pm-off-white/80 mt-2">
                    Vue d'ensemble de votre plateforme Perfect Models Management
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-pm-gold/20">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`group inline-flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                ? 'border-pm-gold text-pm-gold'
                                : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:border-pm-gold/50'
                            }`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Mannequins Pro"
                                value={stats.totalModels}
                                icon={UsersIcon}
                                color="gold"
                            />
                            
                            <StatsCard
                                title="Notifications"
                                value={totalNotifications}
                                icon={ExclamationTriangleIcon}
                                color={totalNotifications > 0 ? 'red' : 'green'}
                            />
                            <StatsCard
                                title="Articles Publiés"
                                value={stats.totalArticles}
                                icon={NewspaperIcon}
                                color="purple"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-xl font-semibold text-pm-off-white mb-4">Actions Rapides</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <AdminCard
                                    title="Candidatures Casting"
                                    description="Nouvelles candidatures à traiter"
                                    icon={ClipboardDocumentListIcon}
                                    link="/admin/casting-applications"
                                    notificationCount={stats.newCastingApps}
                                />
                                <AdminCard
                                    title="Messages Contact"
                                    description="Nouveaux messages clients"
                                    icon={EnvelopeIcon}
                                    link="/admin/messages"
                                    notificationCount={stats.newMessages}
                                />
                                <AdminCard
                                    title="Demandes Booking"
                                    description="Nouvelles demandes de réservation"
                                    icon={BriefcaseIcon}
                                    link="/admin/bookings"
                                    notificationCount={stats.newBookingRequests}
                                />
                                <AdminCard
                                    title="Ajouter un Article"
                                    description="Créer un nouvel article magazine"
                                    icon={NewspaperIcon}
                                    link="/admin/magazine"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'talents' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-pm-off-white">Gestion des Talents et du Recrutement</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard
                                title="Gérer les Mannequins Pro"
                                icon={UsersIcon}
                                link="/admin/models"
                                description="Ajouter, modifier ou rétrograder des profils de mannequins."
                            />
                            <AdminCard
                                title="Gérer les Débutants"
                                icon={UserGroupIcon}
                                link="/admin/beginner-students-access"
                                description="Consulter les accès et promouvoir les mannequins en formation."
                            />
                            <AdminCard
                                title="Direction Artistique"
                                icon={PaintBrushIcon}
                                link="/admin/artistic-direction"
                                description="Créer et assigner des thèmes de séance photo aux mannequins."
                            />
                            <AdminCard
                                title="Candidatures Casting"
                                icon={ClipboardDocumentListIcon}
                                link="/admin/casting-applications"
                                description="Consulter et traiter les candidatures pour les castings."
                                notificationCount={stats.newCastingApps}
                            />
                            <AdminCard
                                title="Résultats & Validation Casting"
                                icon={ClipboardDocumentCheckIcon}
                                link="/admin/casting-results"
                                description="Valider les candidats et créer leurs profils de débutant."
                            />
                            <AdminCard
                                title="Accès Mannequins Pro"
                                icon={KeyIcon}
                                link="/admin/model-access"
                                description="Consulter les identifiants des mannequins confirmés."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-pm-off-white">Gestion du Contenu et de la Formation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard
                                title="Gérer le Magazine"
                                icon={NewspaperIcon}
                                link="/admin/magazine"
                                description="Créer et administrer les articles du magazine Focus Model 241."
                            />
                            <AdminCard
                                title="Gérer les Actualités"
                                icon={PresentationChartLineIcon}
                                link="/admin/news"
                                description="Publier et gérer les actualités de la page d'accueil."
                            />
                            <AdminCard
                                title="Contenu de l'Agence"
                                icon={BuildingStorefrontIcon}
                                link="/admin/agency"
                                description="Mettre à jour les services, la chronologie et les réalisations."
                            />
                            <AdminCard
                                title="Événements PFD"
                                icon={CalendarDaysIcon}
                                link="/admin/fashion-day-events"
                                description="Configurer les éditions du Perfect Fashion Day."
                            />
                            <AdminCard
                                title="Modérer les Commentaires"
                                icon={ChatBubbleLeftRightIcon}
                                link="/admin/comments"
                                description="Gérer les commentaires laissés sur les articles du magazine."
                            />
                            <AdminCard
                                title="Gérer le Classroom Pro"
                                icon={BookOpenIcon}
                                link="/admin/classroom"
                                description="Modifier les modules et chapitres de la formation avancée."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'operations' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-pm-off-white">Comptabilité, Opérations et Suivi</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard
                                title="Comptabilité"
                                icon={CurrencyDollarIcon}
                                link="/admin/payments"
                                description="Enregistrer et suivre les paiements mensuels des mannequins."
                            />
                            <AdminCard
                                title="Suivi des Absences"
                                icon={CalendarIcon}
                                link="/admin/absences"
                                description="Enregistrer et consulter les absences des mannequins."
                            />
                            <AdminCard
                                title="Demandes de Booking"
                                icon={BriefcaseIcon}
                                link="/admin/bookings"
                                description="Consulter et gérer les demandes de booking des clients."
                                notificationCount={stats.newBookingRequests}
                            />
                            <AdminCard
                                title="Candidatures PFD"
                                icon={SparklesIcon}
                                link="/admin/fashion-day-applications"
                                description="Gérer les inscriptions pour l'événement Perfect Fashion Day."
                                notificationCount={stats.newFashionDayApps}
                            />
                            <AdminCard
                                title="Suivi Classroom Pro"
                                icon={AcademicCapIcon}
                                link="/admin/classroom-progress"
                                description="Voir la progression des mannequins confirmés aux quiz."
                            />
                            <AdminCard
                                title="Messages de Contact"
                                icon={EnvelopeIcon}
                                link="/admin/messages"
                                description="Lire et gérer les messages reçus via le formulaire de contact."
                                notificationCount={stats.newMessages}
                            />
                            <AdminCard
                                title="Demandes de Récupération"
                                icon={ExclamationTriangleIcon}
                                link="/admin/recovery-requests"
                                description="Traiter les demandes de coordonnées oubliées."
                                notificationCount={stats.newRecoveryRequests}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Card */}
            <div className="border-t border-pm-gold/20 pt-6">
                <h2 className="text-xl font-semibold text-pm-off-white mb-4">Configuration</h2>
                <div className="max-w-sm">
                    <AdminCard
                        title="Paramètres du Site"
                        icon={Cog6ToothIcon}
                        link="/admin/settings"
                        description="Modifier les informations de contact, les images et les clés API."
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;