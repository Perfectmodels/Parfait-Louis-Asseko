import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import { 
    UsersIcon, 
    ClipboardDocumentListIcon,
    NewspaperIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    SparklesIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
    const { data } = useData();

    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Talents
        const totalModels = data?.models?.length || 0;
        const totalBeginners = data?.beginnerStudents?.length || 0;
        const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;

        // Finances
        const transactions = data?.accountingTransactions || [];
        const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
        const monthlyRevenue = monthlyTransactions
            .filter(t => t.category === 'revenue')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpense = monthlyTransactions
            .filter(t => t.category === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyBalance = monthlyRevenue - monthlyExpense;

        // Opérations
        const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;
        const newBookings = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
        const newRecoveries = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
        const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;

        // Contenu
        const totalArticles = data?.articles?.length || 0;
        const totalNews = data?.newsItems?.length || 0;
        const pendingComments = data?.articleComments?.filter(c => c.status === 'pending').length || 0;

        // Classroom
        const totalModules = data?.courseData?.length || 0;
        const totalChapters = data?.courseData?.reduce((sum, module) => sum + (module.chapters?.length || 0), 0) || 0;

        return {
            totalModels,
            totalBeginners,
            newCastingApps,
            monthlyRevenue,
            monthlyExpense,
            monthlyBalance,
            newMessages,
            newBookings,
            newRecoveries,
            newFashionDayApps,
            totalArticles,
            totalNews,
            pendingComments,
            totalModules,
            totalChapters,
            totalNotifications: newCastingApps + newMessages + newBookings + newRecoveries + newFashionDayApps + pendingComments
        };
    }, [data]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    return (
        <AdminLayout>
            <AdminPageHeader 
                title="Tableau de Bord"
                subtitle="Vue d'ensemble des statistiques et métriques de l'agence Perfect Models Management"
            />

            {/* Alertes / Notifications */}
            {stats.totalNotifications > 0 && (
                <div className="mb-8 p-6 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-lg font-bold text-yellow-400">
                            {stats.totalNotifications} Notification{stats.totalNotifications > 1 ? 's' : ''} en attente
                        </h3>
                                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {stats.newCastingApps > 0 && (
                            <Link to="/admin/casting-applications" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <ClipboardDocumentListIcon className="w-4 h-4" />
                                {stats.newCastingApps} Candidature{stats.newCastingApps > 1 ? 's' : ''} Casting
                            </Link>
                        )}
                        {stats.newMessages > 0 && (
                            <Link to="/admin/messages" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <EnvelopeIcon className="w-4 h-4" />
                                {stats.newMessages} Message{stats.newMessages > 1 ? 's' : ''}
                            </Link>
                        )}
                        {stats.newBookings > 0 && (
                            <Link to="/admin/bookings" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <CalendarDaysIcon className="w-4 h-4" />
                                {stats.newBookings} Booking{stats.newBookings > 1 ? 's' : ''}
                            </Link>
                        )}
                        {stats.newRecoveries > 0 && (
                            <Link to="/admin/recovery-requests" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {stats.newRecoveries} Récupération{stats.newRecoveries > 1 ? 's' : ''}
                            </Link>
                        )}
                        {stats.newFashionDayApps > 0 && (
                            <Link to="/admin/fashion-day-applications" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <SparklesIcon className="w-4 h-4" />
                                {stats.newFashionDayApps} Candidature{stats.newFashionDayApps > 1 ? 's' : ''} PFD
                            </Link>
                        )}
                        {stats.pendingComments > 0 && (
                            <Link to="/admin/comments" className="flex items-center gap-2 text-pm-off-white hover:text-pm-gold transition-colors">
                                <NewspaperIcon className="w-4 h-4" />
                                {stats.pendingComments} Commentaire{stats.pendingComments > 1 ? 's' : ''}
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Statistiques Finances */}
            <AdminSection title="Situation Financière (Ce Mois)" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={ArrowTrendingUpIcon}
                        title="Revenus"
                        value={formatCurrency(stats.monthlyRevenue)}
                        color="green"
                        link="/admin/finance"
                    />
                    <StatCard
                        icon={ArrowTrendingDownIcon}
                        title="Dépenses"
                        value={formatCurrency(stats.monthlyExpense)}
                        color="red"
                        link="/admin/expenses"
                    />
                    <StatCard
                        icon={CurrencyDollarIcon}
                        title="Balance"
                        value={formatCurrency(stats.monthlyBalance)}
                        color={stats.monthlyBalance >= 0 ? 'green' : 'red'}
                        link="/admin/financial-reports"
                    />
                    <StatCard
                        icon={ChartBarIcon}
                        title="Taux de Rentabilité"
                        value={stats.monthlyRevenue > 0 ? `${((stats.monthlyBalance / stats.monthlyRevenue) * 100).toFixed(1)}%` : '0%'}
                        color="blue"
                        link="/admin/finance"
                    />
                </div>
            </AdminSection>

            {/* Statistiques Talents */}
            <AdminSection title="Gestion des Talents" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={UsersIcon}
                        title="Mannequins Pro"
                        value={stats.totalModels.toString()}
                        color="gold"
                        link="/admin/models"
                    />
                    <StatCard
                    icon={UsersIcon} 
                        title="Étudiants Débutants"
                        value={stats.totalBeginners.toString()}
                        color="purple"
                        link="/admin/beginner-students-access"
                    />
                    <StatCard
                        icon={ClipboardDocumentListIcon}
                        title="Candidatures Casting"
                        value={stats.newCastingApps.toString()}
                        color="blue"
                        notification={stats.newCastingApps > 0}
                        link="/admin/casting-applications"
                    />
                    <StatCard
                        icon={SparklesIcon}
                        title="Total Mannequins"
                        value={(stats.totalModels + stats.totalBeginners).toString()}
                    color="gold"
                />
                </div>
            </AdminSection>

            {/* Statistiques Contenu */}
            <AdminSection title="Gestion du Contenu" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                    icon={NewspaperIcon} 
                        title="Articles Magazine"
                        value={stats.totalArticles.toString()}
                    color="blue"
                        link="/admin/magazine"
                    />
                    <StatCard
                        icon={NewspaperIcon}
                        title="Actualités"
                        value={stats.totalNews.toString()}
                    color="green"
                        link="/admin/news"
                    />
                    <StatCard
                        icon={AcademicCapIcon}
                        title="Modules Classroom"
                        value={`${stats.totalModules} (${stats.totalChapters} chapitres)`}
                    color="purple"
                        link="/admin/classroom"
                    />
                    <StatCard
                        icon={NewspaperIcon}
                        title="Commentaires Pending"
                        value={stats.pendingComments.toString()}
                        color="yellow"
                        notification={stats.pendingComments > 0}
                        link="/admin/comments"
                    />
                </div>
            </AdminSection>

            {/* Statistiques Opérations */}
            <AdminSection title="Opérations Quotidiennes">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={EnvelopeIcon}
                        title="Messages"
                        value={stats.newMessages.toString()}
                        color="blue"
                        notification={stats.newMessages > 0}
                        link="/admin/messages"
                    />
                    <StatCard
                        icon={CalendarDaysIcon}
                        title="Bookings"
                        value={stats.newBookings.toString()}
                        color="green"
                        notification={stats.newBookings > 0}
                        link="/admin/bookings"
                    />
                    <StatCard
                        icon={SparklesIcon}
                        title="Candidatures PFD"
                        value={stats.newFashionDayApps.toString()}
                        color="purple"
                        notification={stats.newFashionDayApps > 0}
                        link="/admin/fashion-day-applications"
                    />
                    <StatCard
                        icon={ExclamationTriangleIcon}
                        title="Récupérations"
                        value={stats.newRecoveries.toString()}
                        color="red"
                        notification={stats.newRecoveries > 0}
                        link="/admin/recovery-requests"
                />
            </div>
            </AdminSection>
        </AdminLayout>
    );
};

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    color: 'green' | 'red' | 'blue' | 'gold' | 'purple' | 'yellow';
    notification?: boolean;
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, notification, link }) => {
    const colorClasses = {
        green: 'text-green-400 bg-green-600/10 border-green-600/30',
        red: 'text-red-400 bg-red-600/10 border-red-600/30',
        blue: 'text-blue-400 bg-blue-600/10 border-blue-600/30',
        gold: 'text-pm-gold bg-pm-gold/10 border-pm-gold/30',
        purple: 'text-purple-400 bg-purple-600/10 border-purple-600/30',
        yellow: 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30'
    };

    const content = (
        <div className={`relative bg-black border ${colorClasses[color].split(' ')[2]} rounded-lg p-6 ${link ? 'hover:scale-105 transition-transform cursor-pointer' : ''}`}>
            {notification && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            )}
            <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]}`} />
            </div>
            <p className="text-sm text-pm-off-white/60 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</p>
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
};

export default AdminDashboard;
