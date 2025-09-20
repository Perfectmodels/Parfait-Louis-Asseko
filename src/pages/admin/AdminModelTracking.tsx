import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import { Model, ModelActivity, ModelPerformance, ModelTrackingData } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getModelsWithRealActivity } from '../../utils/modelTrackingUtils';

const AdminModelTracking: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'performance' | 'notes'>('overview');
  const [sortField, setSortField] = useState<'name' | 'overallScore' | 'lastLogin' | 'paymentCompliance'>('overallScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Vérifier si les données sont initialisées
  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
        <p className="text-pm-off-white/70 mt-4">Chargement des données de tracking...</p>
      </div>
    );
  }

  // Récupérer tous les mannequins avec leurs données de suivi
  const allModels = useMemo(() => {
    if (!data) return [];
    
    // Utiliser les vraies données d'activité
    const modelsWithRealActivity = getModelsWithRealActivity(
      data.models || [],
      data.beginnerStudents || [],
      data.modelActivities || []
    );

    return modelsWithRealActivity.map(model => ({
      ...model,
      trackingData: {
        modelId: model.id,
        activities: model.activities,
        performance: model.performance,
        notes: '',
        tags: [],
        status: model.status,
        lastAdminReview: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
  }, [data]);

  // Filtrer et trier les modèles
  const filteredAndSortedModels = useMemo(() => {
    let filtered = allModels;

    // Filtrage par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(model => model.trackingData.status === filterStatus);
    }

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'overallScore':
          aValue = a.trackingData.performance.overallScore;
          bValue = b.trackingData.performance.overallScore;
          break;
        case 'lastLogin':
          aValue = new Date(a.trackingData.performance.lastLoginDate);
          bValue = new Date(b.trackingData.performance.lastLoginDate);
          break;
        case 'paymentCompliance':
          aValue = a.trackingData.performance.paymentCompliance;
          bValue = b.trackingData.performance.paymentCompliance;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allModels, filterStatus, searchTerm, sortField, sortDirection]);

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 80) return <ArrowTrendingUpIcon className="w-4 h-4" />;
    if (score >= 60) return <ArrowTrendingUpIcon className="w-4 h-4" />;
    return <ArrowTrendingDownIcon className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-gray-500/20 text-gray-300';
      case 'suspended': return 'bg-red-500/20 text-red-300';
      case 'graduated': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      case 'graduated': return 'Diplômé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="admin-page">
      <SEO title="Admin - Suivi des Mannequins" noIndex />
      
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Dashboard
          </Link>
          <h1 className="admin-page-title">Suivi des Mannequins</h1>
          <p className="admin-page-subtitle">Tableau de bord basé sur les vraies données d'activité des mannequins</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-pm-gold/80">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Données en temps réel • {allModels.length} mannequin(s) avec activité</span>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="admin-section-wrapper">
        <h2 className="admin-section-title">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Mannequins"
            value={allModels.length}
            icon={UserIcon}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            title="Actifs"
            value={allModels.filter(m => m.trackingData.status === 'active').length}
            icon={CheckCircleIcon}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
          <StatCard
            title="Score Moyen"
            value={`${Math.round(allModels.reduce((acc, m) => acc + m.trackingData.performance.overallScore, 0) / allModels.length || 0)}%`}
            icon={ChartBarIcon}
            color="text-pm-gold"
            bgColor="bg-pm-gold/10"
          />
          <StatCard
            title="Paiements à jour"
            value={`${Math.round(allModels.reduce((acc, m) => acc + m.trackingData.performance.paymentCompliance, 0) / allModels.length || 0)}%`}
            icon={CurrencyDollarIcon}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
        </div>

        {/* Indicateurs d'activité réelle */}
        <div className="mt-6 p-4 bg-black/30 rounded-lg border border-pm-gold/20">
          <h3 className="text-lg font-semibold text-pm-gold mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            Types d'Activité Détectée
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-pm-off-white/70">
                Connexions: {allModels.filter(m => m.lastLogin).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-pm-off-white/70">
                Quiz complétés: {allModels.reduce((acc, m) => acc + Object.keys(m.quizScores || {}).length, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-pm-off-white/70">
                Paiements: {allModels.filter(m => m.paymentStatus?.isUpToDate).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-pm-off-white/70">
                Activités totales: {allModels.reduce((acc, m) => acc + m.activities.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="admin-section-wrapper">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-pm-off-white/50" />
              <input
                type="text"
                placeholder="Rechercher un mannequin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-input"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="suspended">Suspendus</option>
              <option value="graduated">Diplômés</option>
            </select>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field as any);
                setSortDirection(direction as any);
              }}
              className="admin-input"
            >
              <option value="overallScore-desc">Score global (↓)</option>
              <option value="overallScore-asc">Score global (↑)</option>
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="lastLogin-desc">Dernière connexion (↓)</option>
              <option value="lastLogin-asc">Dernière connexion (↑)</option>
              <option value="paymentCompliance-desc">Paiements (↓)</option>
              <option value="paymentCompliance-asc">Paiements (↑)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des mannequins */}
      <div className="admin-section-wrapper">
        <h2 className="admin-section-title">Liste des Mannequins ({filteredAndSortedModels.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedModels.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-6 hover:border-pm-gold transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center overflow-hidden">
                    {model.imageUrl ? (
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-pm-gold" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-pm-gold">{model.name}</h3>
                    <p className="text-sm text-pm-off-white/80">@{model.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.trackingData.status)}`}>
                    {getStatusLabel(model.trackingData.status)}
                  </span>
                  <button
                    onClick={() => setSelectedModel(model)}
                    className="p-2 text-pm-gold hover:bg-pm-gold/20 rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Métriques de performance */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pm-off-white/70">Score global</span>
                  <div className={`flex items-center gap-1 ${getPerformanceColor(model.trackingData.performance.overallScore)}`}>
                    {getPerformanceIcon(model.trackingData.performance.overallScore)}
                    <span className="font-semibold">{model.trackingData.performance.overallScore}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pm-off-white/70">Quiz complétés</span>
                  <span className="text-pm-gold font-semibold">{model.trackingData.performance.totalQuizAttempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pm-off-white/70">Score moyen quiz</span>
                  <span className="text-pm-gold font-semibold">{model.trackingData.performance.averageQuizScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pm-off-white/70">Paiements</span>
                  <span className={`font-semibold ${model.trackingData.performance.paymentCompliance >= 80 ? 'text-green-400' : 'text-red-400'}`}>
                    {model.trackingData.performance.paymentCompliance}%
                  </span>
                </div>
              </div>

              {/* Dernière activité */}
              <div className="pt-4 border-t border-pm-gold/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-pm-off-white/70">Dernière connexion</span>
                  <span className="text-pm-off-white">
                    {new Date(model.trackingData.performance.lastLoginDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {model.trackingData.activities.length > 0 && (
                  <div className="mt-2 text-sm text-pm-off-white/70">
                    Dernière activité: {model.trackingData.activities[0]?.title}
                  </div>
                )}
              </div>

              {/* Tags */}
              {model.trackingData.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {model.trackingData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de détails du mannequin */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

// Composant pour les cartes de statistiques
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-6">
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

// Modal de détails du mannequin
const ModelDetailModal: React.FC<{
  model: any;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ model, onClose, activeTab, setActiveTab }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-pm-dark border border-pm-gold/20 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-playfair text-pm-gold">
            Détails - {model.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/20 rounded-lg transition-colors"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 border-b border-pm-gold/20">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
            { id: 'activities', label: 'Activités', icon: ClockIcon },
            { id: 'performance', label: 'Performance', icon: ArrowTrendingUpIcon },
            { id: 'notes', label: 'Notes', icon: PencilIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-pm-gold border-b-2 border-pm-gold'
                  : 'text-pm-off-white/70 hover:text-pm-gold'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <OverviewTab model={model} />}
          {activeTab === 'activities' && <ActivitiesTab model={model} />}
          {activeTab === 'performance' && <PerformanceTab model={model} />}
          {activeTab === 'notes' && <NotesTab model={model} />}
        </div>
      </motion.div>
    </div>
  );
};

// Composants des onglets
const OverviewTab: React.FC<{ model: any }> = ({ model }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="text-pm-gold font-semibold mb-3">Informations générales</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Nom:</span>
            <span className="text-pm-off-white">{model.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Username:</span>
            <span className="text-pm-off-white">@{model.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Statut:</span>
            <span className="text-pm-gold">{model.trackingData.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Dernière connexion:</span>
            <span className="text-pm-off-white">
              {new Date(model.trackingData.performance.lastLoginDate).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="text-pm-gold font-semibold mb-3">Métriques clés</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Score global:</span>
            <span className="text-pm-gold font-semibold">{model.trackingData.performance.overallScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Quiz complétés:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalQuizAttempts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Bookings:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalBookings}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Castings:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalCastings}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActivitiesTab: React.FC<{ model: any }> = ({ model }) => (
  <div className="space-y-4">
    <h4 className="text-pm-gold font-semibold">Activités récentes</h4>
    {model.trackingData.activities.length > 0 ? (
      <div className="space-y-3">
        {model.trackingData.activities.slice(0, 10).map((activity: any) => (
          <div key={activity.id} className="bg-black/30 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-pm-gold font-medium">{activity.title}</h5>
                <p className="text-pm-off-white/80 text-sm mt-1">{activity.description}</p>
              </div>
              <span className="text-xs text-pm-off-white/50">
                {new Date(activity.timestamp).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-pm-off-white/60 text-center py-8">Aucune activité enregistrée</p>
    )}
  </div>
);

const PerformanceTab: React.FC<{ model: any }> = ({ model }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="text-pm-gold font-semibold mb-3">Performance académique</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Quiz complétés:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalQuizAttempts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Score moyen:</span>
            <span className="text-pm-gold">{model.trackingData.performance.averageQuizScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Posts forum:</span>
            <span className="text-pm-gold">{model.trackingData.performance.forumPosts}</span>
          </div>
        </div>
      </div>
      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="text-pm-gold font-semibold mb-3">Performance professionnelle</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Bookings:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalBookings}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Castings:</span>
            <span className="text-pm-gold">{model.trackingData.performance.totalCastings}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pm-off-white/70">Conformité paiements:</span>
            <span className="text-pm-gold">{model.trackingData.performance.paymentCompliance}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotesTab: React.FC<{ model: any }> = ({ model }) => (
  <div className="space-y-4">
    <h4 className="text-pm-gold font-semibold">Notes et observations</h4>
    <div className="bg-black/30 rounded-lg p-4">
      <textarea
        value={model.trackingData.notes}
        readOnly
        className="w-full h-32 bg-transparent text-pm-off-white resize-none"
        placeholder="Aucune note pour ce mannequin..."
      />
    </div>
    <div className="flex gap-2">
      <button className="admin-button-primary">
        <PencilIcon className="w-4 h-4 mr-2" />
        Modifier les notes
      </button>
      <button className="admin-button-secondary">
        <TagIcon className="w-4 h-4 mr-2" />
        Gérer les tags
      </button>
    </div>
  </div>
);

export default AdminModelTracking;
