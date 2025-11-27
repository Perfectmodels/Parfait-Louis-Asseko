import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalModels: number;
  activeModels: number;
  totalCastingApplications: number;
  newApplicationsThisMonth: number;
  totalBookings: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
}

const AdminAnalytics: React.FC = () => {
  const { data } = useData();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      
      // Calcul des analytics (remplacer par vrai appel API)
      setTimeout(() => {
        const analyticsData: AnalyticsData = {
          totalModels: data.models?.length || 0,
          activeModels: data.models?.filter(m => m.level === 'Pro').length || 0,
          totalCastingApplications: data.castingApplications?.length || 0,
          newApplicationsThisMonth: data.castingApplications?.filter((app: any) => {
            const appDate = new Date(app.submissionDate);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return appDate >= thirtyDaysAgo;
          }).length || 0,
          totalBookings: data.bookingRequests?.length || 0,
          monthlyRevenue: calculateMonthlyRevenue(),
          conversionRate: calculateConversionRate(),
          averageResponseTime: calculateAverageResponseTime()
        };
        
        setAnalytics(analyticsData);
        setIsLoading(false);
      }, 1000);
    }
  }, [data, timeRange]);

  const calculateMonthlyRevenue = (): number => {
    // Simulation de calcul de revenus mensuels
    const completedBookings = data?.bookingRequests?.filter((b: any) => b.status === 'Confirmé') || [];
    return completedBookings.length * 150000; // 150k FCFA par booking moyen
  };

  const calculateConversionRate = (): number => {
    const totalApps = data?.castingApplications?.length || 0;
    const acceptedApps = data?.castingApplications?.filter((app: any) => app.status === 'Accepté').length || 0;
    return totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;
  };

  const calculateAverageResponseTime = (): number => {
    // Simulation: temps de réponse moyen en heures
    return 24; // 24 heures moyen
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, change, icon: Icon, trend = 'neutral' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend === 'up' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
              <span>{change}% vs période précédente</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-pm-gold/10 rounded-lg">
          <Icon className="w-6 h-6 text-pm-gold" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Impossible de charger les analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-pm-gold text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 jours' : range === '30d' ? '30 jours' : '90 jours'}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Mannequins"
          value={analytics.totalModels}
          change={12}
          icon={UserGroupIcon}
          trend="up"
        />
        <MetricCard
          title="Candidatures Casting"
          value={analytics.newApplicationsThisMonth}
          change={8}
          icon={CalendarIcon}
          trend="up"
        />
        <MetricCard
          title="Revenus Mensuels"
          value={`${analytics.monthlyRevenue.toLocaleString()} FCFA`}
          change={15}
          icon={CurrencyDollarIcon}
          trend="up"
        />
        <MetricCard
          title="Taux de Conversion"
          value={`${analytics.conversionRate}%`}
          change={-3}
          icon={ChartBarIcon}
          trend="down"
        />
      </div>

      {/* Graphiques et statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques des mannequins */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Statistiques des Mannequins</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Mannequins actifs</span>
              <span className="font-medium">{analytics.activeModels} / {analytics.totalModels}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pm-gold h-2 rounded-full"
                style={{ width: `${(analytics.activeModels / analytics.totalModels) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Temps de réponse moyen</span>
              <span className="font-medium">{analytics.averageResponseTime}h</span>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Nouvelles candidatures aujourd'hui</span>
              <span className="text-sm font-medium ml-auto">3</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Bookings confirmés cette semaine</span>
              <span className="text-sm font-medium ml-auto">7</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Messages non lus</span>
              <span className="text-sm font-medium ml-auto">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
