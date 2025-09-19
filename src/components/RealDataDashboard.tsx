import React from 'react';
import { useRealData } from '../hooks/useRealData';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    ChatBubbleLeftRightIcon, 
    DocumentTextIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const RealDataDashboard: React.FC = () => {
    const { getRealStats, getRecentActivity, getDatabaseHealth } = useRealData();
    const stats = getRealStats();
    const recentActivity = getRecentActivity();
    const databaseHealth = getDatabaseHealth();

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'healthy': return <CheckCircleIcon className="w-5 h-5" />;
            case 'warning': return <ExclamationTriangleIcon className="w-5 h-5" />;
            case 'error': return <ExclamationTriangleIcon className="w-5 h-5" />;
            default: return <ClockIcon className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-pm-gold">Mannequins</h3>
                        <UsersIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div className="text-3xl font-bold text-pm-gold">{stats.totalModels}</div>
                    <p className="text-pm-off-white/70 text-sm">Mannequins actifs</p>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-pm-gold">Étudiants</h3>
                        <AcademicCapIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div className="text-3xl font-bold text-pm-gold">{stats.totalBeginnerStudents}</div>
                    <p className="text-pm-off-white/70 text-sm">Étudiants débutants</p>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-pm-gold">Messages</h3>
                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div className="text-3xl font-bold text-pm-gold">{stats.totalContactMessages}</div>
                    <p className="text-pm-off-white/70 text-sm">Messages de contact</p>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-pm-gold">Candidatures</h3>
                        <DocumentTextIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div className="text-3xl font-bold text-pm-gold">{stats.totalCastingApplications + stats.totalFashionDayApplications}</div>
                    <p className="text-pm-off-white/70 text-sm">Candidatures totales</p>
                </div>
            </div>

            {/* Santé de la base de données */}
            <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-pm-gold">État de la Base de Données</h3>
                    <div className={`flex items-center gap-2 ${getHealthColor(databaseHealth.status)}`}>
                        {getHealthIcon(databaseHealth.status)}
                        <span className="text-sm font-medium">{databaseHealth.message}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pm-gold">{stats.totalModels + stats.totalBeginnerStudents}</div>
                        <p className="text-sm text-pm-off-white/70">Utilisateurs</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pm-gold">{stats.totalArticles}</div>
                        <p className="text-sm text-pm-off-white/70">Articles</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pm-gold">{stats.totalFashionDayEvents}</div>
                        <p className="text-sm text-pm-off-white/70">Événements</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pm-gold">{stats.totalAccountingTransactions}</div>
                        <p className="text-sm text-pm-off-white/70">Transactions</p>
                    </div>
                </div>
            </div>

            {/* Activité récente */}
            {recentActivity.length > 0 && (
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Activité Récente</h3>
                    <div className="space-y-3">
                        {recentActivity.slice(0, 5).map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-pm-dark/50 rounded-lg">
                                <div className="w-2 h-2 bg-pm-gold rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-pm-off-white">{activity.title}</p>
                                    <p className="text-xs text-pm-off-white/70">{activity.description}</p>
                                </div>
                                <div className="text-xs text-pm-off-white/50">
                                    {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Contenu</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Articles</span>
                            <span className="text-pm-gold font-semibold">{stats.totalArticles}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Actualités</span>
                            <span className="text-pm-gold font-semibold">{stats.totalNewsItems}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Témoignages</span>
                            <span className="text-pm-gold font-semibold">{stats.totalTestimonials}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Événements</span>
                            <span className="text-pm-gold font-semibold">{stats.totalFashionDayEvents}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pm-gold mb-4">Interactions</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Messages Forum</span>
                            <span className="text-pm-gold font-semibold">{stats.totalForumReplies}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Commentaires</span>
                            <span className="text-pm-gold font-semibold">{stats.totalArticleComments}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Posts Sociaux</span>
                            <span className="text-pm-gold font-semibold">{stats.totalSocialPosts}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-pm-off-white/70">Utilisateurs Sociaux</span>
                            <span className="text-pm-gold font-semibold">{stats.totalSocialUsers}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealDataDashboard;
