import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useRealData } from '../hooks/useRealData';
import SEO from '../components/SEO';
import { 
    ChartBarIcon, 
    UsersIcon, 
    CurrencyDollarIcon, 
    CalendarDaysIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
    revenue: {
        total: number;
        monthly: number;
        growth: number;
        trend: 'up' | 'down';
    };
    models: {
        total: number;
        active: number;
        newThisMonth: number;
        growth: number;
        trend: 'up' | 'down';
    };
    events: {
        total: number;
        upcoming: number;
        completed: number;
        growth: number;
        trend: 'up' | 'down';
    };
    payments: {
        total: number;
        pending: number;
        overdue: number;
        growth: number;
        trend: 'up' | 'down';
    };
    performance: {
        averageRating: number;
        totalBookings: number;
        conversionRate: number;
        growth: number;
        trend: 'up' | 'down';
    };
}

const AdminAnalytics: React.FC = () => {
    const { data } = useData();
    const { getRealStats, getRecentActivity, getDatabaseHealth } = useRealData();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    useEffect(() => {
        // Simuler le chargement des données analytics
        const loadAnalytics = async () => {
            setLoading(true);
            
            // Calculer les métriques basées sur les données existantes
            const models = data?.models || [];
            const beginnerStudents = data?.beginnerStudents || [];
            const accountingTransactions = data?.accountingTransactions || [];
            const events = data?.events || [];
            
            // Calculer les revenus
            const revenueTransactions = accountingTransactions.filter(t => t.category === 'revenue');
            const totalRevenue = revenueTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
            const monthlyRevenue = revenueTransactions
                .filter(t => {
                    const transactionDate = new Date(t.date);
                    const now = new Date();
                    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return transactionDate >= thirtyDaysAgo;
                })
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            // Calculer les métriques des mannequins
            const activeModels = models.filter(m => m.isActive);
            const newModelsThisMonth = models.filter(m => {
                const modelDate = new Date(m.createdAt || m.dateAdded);
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return modelDate >= thirtyDaysAgo;
            });

            // Calculer les événements
            const upcomingEvents = events.filter(e => {
                const eventDate = new Date(e.date);
                return eventDate > new Date();
            });

            // Calculer les paiements
            const pendingPayments = models.filter(m => 
                m.paymentStatus?.status === 'pending' || 
                m.paymentStatus?.status === 'overdue'
            );

            const overduePayments = models.filter(m => 
                m.paymentStatus?.status === 'overdue'
            );

            const analytics: AnalyticsData = {
                revenue: {
                    total: totalRevenue,
                    monthly: monthlyRevenue,
                    growth: 12.5, // Simulation
                    trend: 'up'
                },
                models: {
                    total: models.length + beginnerStudents.length,
                    active: activeModels.length,
                    newThisMonth: newModelsThisMonth.length,
                    growth: 8.3, // Simulation
                    trend: 'up'
                },
                events: {
                    total: events.length,
                    upcoming: upcomingEvents.length,
                    completed: events.length - upcomingEvents.length,
                    growth: 15.2, // Simulation
                    trend: 'up'
                },
                payments: {
                    total: models.length,
                    pending: pendingPayments.length,
                    overdue: overduePayments.length,
                    growth: -5.1, // Simulation
                    trend: 'down'
                },
                performance: {
                    averageRating: 4.7, // Simulation
                    totalBookings: 156, // Simulation
                    conversionRate: 23.5, // Simulation
                    growth: 18.9, // Simulation
                    trend: 'up'
                }
            };

            setAnalyticsData(analytics);
            setLoading(false);
        };

        loadAnalytics();
    }, [data, timeRange]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const MetricCard: React.FC<{
        title: string;
        value: string | number;
        growth: number;
        trend: 'up' | 'down';
        icon: React.ComponentType<any>;
        color: string;
        subtitle?: string;
    }> = ({ title, value, growth, trend, icon: Icon, color, subtitle }) => (
        <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                    {trend === 'up' ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-400" />
                    ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                        trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {formatPercentage(growth)}
                    </span>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-pm-gold mb-1">{value}</h3>
                <p className="text-pm-off-white/60 text-sm">{title}</p>
                {subtitle && (
                    <p className="text-pm-off-white/40 text-xs mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p className="text-pm-off-white">Chargement des analytics...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-pm-off-white">Erreur lors du chargement des données</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title="Analytics - Perfect Models"
                description="Tableau de bord analytics avec métriques en temps réel"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-pm-gold mb-2">Analytics</h1>
                            <p className="text-pm-off-white/60">Métriques et performances en temps réel</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as any)}
                                className="bg-gray-900 border border-pm-gold/20 rounded-lg px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            >
                                <option value="7d">7 derniers jours</option>
                                <option value="30d">30 derniers jours</option>
                                <option value="90d">90 derniers jours</option>
                                <option value="1y">1 an</option>
                            </select>
                            <button className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors">
                                <ChartBarIcon className="w-4 h-4" />
                                Exporter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Métriques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Revenus Totaux"
                        value={formatCurrency(analyticsData.revenue.total)}
                        growth={analyticsData.revenue.growth}
                        trend={analyticsData.revenue.trend}
                        icon={CurrencyDollarIcon}
                        color="bg-green-500"
                        subtitle={`${formatCurrency(analyticsData.revenue.monthly)} ce mois`}
                    />
                    <MetricCard
                        title="Mannequins Actifs"
                        value={analyticsData.models.active}
                        growth={analyticsData.models.growth}
                        trend={analyticsData.models.trend}
                        icon={UsersIcon}
                        color="bg-blue-500"
                        subtitle={`${analyticsData.models.newThisMonth} nouveaux ce mois`}
                    />
                    <MetricCard
                        title="Événements"
                        value={analyticsData.events.upcoming}
                        growth={analyticsData.events.growth}
                        trend={analyticsData.events.trend}
                        icon={CalendarDaysIcon}
                        color="bg-purple-500"
                        subtitle={`${analyticsData.events.completed} terminés`}
                    />
                    <MetricCard
                        title="Paiements en Attente"
                        value={analyticsData.payments.pending}
                        growth={analyticsData.payments.growth}
                        trend={analyticsData.payments.trend}
                        icon={ClockIcon}
                        color="bg-yellow-500"
                        subtitle={`${analyticsData.payments.overdue} en retard`}
                    />
                </div>

                {/* Graphiques et détails */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance */}
                    <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-pm-gold mb-6">Performance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white">Note moyenne</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-pm-gold">
                                        {analyticsData.performance.averageRating}
                                    </span>
                                    <span className="text-pm-off-white/60">/5</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white">Réservations totales</span>
                                <span className="text-xl font-bold text-pm-gold">
                                    {analyticsData.performance.totalBookings}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white">Taux de conversion</span>
                                <span className="text-xl font-bold text-pm-gold">
                                    {analyticsData.performance.conversionRate}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Alertes et actions */}
                    <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-pm-gold mb-6">Alertes</h3>
                        <div className="space-y-4">
                            {analyticsData.payments.overdue > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                                    <div>
                                        <p className="text-red-400 font-medium">
                                            {analyticsData.payments.overdue} paiements en retard
                                        </p>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Action requise
                                        </p>
                                    </div>
                                </div>
                            )}
                            {analyticsData.events.upcoming > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <CalendarDaysIcon className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-blue-400 font-medium">
                                            {analyticsData.events.upcoming} événements à venir
                                        </p>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Préparation requise
                                        </p>
                                    </div>
                                </div>
                            )}
                            {analyticsData.models.newThisMonth > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-green-400 font-medium">
                                            {analyticsData.models.newThisMonth} nouveaux mannequins
                                        </p>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Croissance positive
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-pm-gold mb-6">Actions Rapides</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center gap-3 p-4 bg-pm-gold/10 border border-pm-gold/20 rounded-lg hover:bg-pm-gold/20 transition-colors">
                            <CurrencyDollarIcon className="w-5 h-5 text-pm-gold" />
                            <span className="text-pm-gold font-medium">Gérer les Paiements</span>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                            <UsersIcon className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">Nouveaux Mannequins</span>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
                            <CalendarDaysIcon className="w-5 h-5 text-purple-400" />
                            <span className="text-purple-400 font-medium">Planifier Événement</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
