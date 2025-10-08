import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardKPI, ChartDataPoint } from '../../types';
import { TrendingUp, TrendingDown, Minus, Users, Calendar, DollarSign, Award, Eye, MessageSquare, UserCheck, Activity } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const { data } = useData();

  // Calcul des KPIs
  const kpis: DashboardKPI[] = useMemo(() => {
    if (!data) return [];

    const totalModels = data.models?.length || 0;
    const activeModels = data.models?.filter(m => m.lastLogin && 
      new Date(m.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

    const currentMonthPayments = data.monthlyPayments?.filter(p => p.month === currentMonth) || [];
    const lastMonthPayments = data.monthlyPayments?.filter(p => p.month === lastMonth) || [];
    const totalRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const revenueChange = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const newCastings = data.castingApplications?.filter(a => a.status === 'Nouveau').length || 0;
    const totalCastings = data.castingApplications?.length || 0;

    const totalArticles = data.articles?.length || 0;
    const totalViews = data.articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0;

    const newMessages = data.contactMessages?.filter(m => m.status === 'Nouveau').length || 0;

    const upcomingEvents = data.fashionDayEvents?.filter(e => 
      new Date(e.date) > new Date()
    ).length || 0;

    return [
      {
        title: 'Mannequins Actifs',
        value: activeModels,
        change: totalModels > 0 ? (activeModels / totalModels) * 100 : 0,
        trend: activeModels > totalModels * 0.7 ? 'up' : activeModels > totalModels * 0.4 ? 'stable' : 'down',
        icon: 'users',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Revenus du Mois',
        value: `${totalRevenue.toLocaleString()} FCFA`,
        change: revenueChange,
        trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
        icon: 'dollar',
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Nouveaux Castings',
        value: newCastings,
        change: totalCastings > 0 ? (newCastings / totalCastings) * 100 : 0,
        trend: newCastings > 0 ? 'up' : 'stable',
        icon: 'user-check',
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Événements à Venir',
        value: upcomingEvents,
        change: 0,
        trend: 'stable',
        icon: 'calendar',
        color: 'from-orange-500 to-orange-600'
      },
      {
        title: 'Vues Magazine',
        value: totalViews,
        change: 0,
        trend: totalViews > 1000 ? 'up' : 'stable',
        icon: 'eye',
        color: 'from-pink-500 to-pink-600'
      },
      {
        title: 'Messages Non Lus',
        value: newMessages,
        change: 0,
        trend: newMessages > 5 ? 'down' : 'stable',
        icon: 'message',
        color: 'from-red-500 to-red-600'
      }
    ];
  }, [data]);

  // Données pour les graphiques - Revenus mensuels
  const revenueChartData: ChartDataPoint[] = useMemo(() => {
    if (!data?.monthlyPayments) return [];

    const monthlyData: { [key: string]: number } = {};
    data.monthlyPayments.forEach(payment => {
      const month = payment.month;
      monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Derniers 6 mois
      .map(([date, value]) => ({
        date,
        value,
        label: new Date(date + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      }));
  }, [data]);

  // Données pour les castings
  const castingStats = useMemo(() => {
    if (!data?.castingApplications) return null;

    const total = data.castingApplications.length;
    const accepted = data.castingApplications.filter(a => a.status === 'Accepté').length;
    const rejected = data.castingApplications.filter(a => a.status === 'Refusé').length;
    const pending = data.castingApplications.filter(a => a.status === 'Nouveau').length;
    const preselected = data.castingApplications.filter(a => a.status === 'Présélectionné').length;

    return {
      total,
      accepted,
      rejected,
      pending,
      preselected,
      conversionRate: total > 0 ? ((accepted / total) * 100).toFixed(1) : 0
    };
  }, [data]);

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'dollar':
        return <DollarSign className="w-6 h-6" />;
      case 'user-check':
        return <UserCheck className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      case 'eye':
        return <Eye className="w-6 h-6" />;
      case 'message':
        return <MessageSquare className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const maxRevenue = Math.max(...revenueChartData.map(d => d.value), 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Statistiques</h1>
          <p className="mt-2 text-gray-600">Vue d'ensemble de vos performances</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${kpi.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} bg-opacity-10`}>
                    <div className="text-white">
                      {getIcon(kpi.icon)}
                    </div>
                  </div>
                  {kpi.change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {getTrendIcon(kpi.trend)}
                      <span>{Math.abs(kpi.change).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique des revenus */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Évolution des Revenus</h2>
            {revenueChartData.length > 0 ? (
              <div className="space-y-4">
                {revenueChartData.map((point, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{point.label}</span>
                      <span className="font-bold text-gray-900">
                        {point.value.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(point.value / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>

          {/* Statistiques des castings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Castings - Aperçu</h2>
            {castingStats ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-purple-600">{castingStats.conversionRate}%</p>
                  <p className="text-gray-600 mt-2">Taux de conversion</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{castingStats.total}</p>
                    <p className="text-sm text-gray-600 mt-1">Total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{castingStats.accepted}</p>
                    <p className="text-sm text-gray-600 mt-1">Acceptés</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{castingStats.preselected}</p>
                    <p className="text-sm text-gray-600 mt-1">Présélectionnés</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{castingStats.rejected}</p>
                    <p className="text-sm text-gray-600 mt-1">Refusés</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-700">{castingStats.pending}</p>
                    <p className="text-sm text-gray-600 mt-1">En attente de traitement</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Activité Récente</h2>
          <div className="space-y-3">
            {data?.models?.slice(0, 5).map((model, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <img 
                    src={model.imageUrl || '/placeholder-avatar.png'} 
                    alt={model.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{model.name}</p>
                    <p className="text-sm text-gray-500">
                      {model.lastLogin ? 
                        `Dernière connexion: ${new Date(model.lastLogin).toLocaleDateString('fr-FR')}` : 
                        'Jamais connecté'
                      }
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  model.level === 'Pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {model.level || 'Pro'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

