import React, { useState, useMemo } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import AnalyticsChart from '../components/admin/AnalyticsChart';
import AnalyticsReport from '../components/admin/AnalyticsReport';
import StatsigDebug from '../components/admin/StatsigDebug';
import { 
    UsersIcon, DocumentTextIcon, CameraIcon, CogIcon, Cog6ToothIcon,
    ChartBarIcon, ClockIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const AdminAnalytics: React.FC = () => {
    const { data } = useData();
    const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'content' | 'technical'>('overview');

    // ---- Statistiques système ----
    const totalModels = useMemo(() => (data as any)?.models?.length || 0, [data]);
    const totalBeginnerStudents = useMemo(() => (data as any)?.beginnerStudents?.length || 0, [data]);
    const totalPages = useMemo(() => (data as any)?.pageContents?.length || 0, [data]);
    const totalMedia = useMemo(() => data?.siteImages ? Object.keys(data.siteImages).length : 0, [data]);
    const totalArticles = useMemo(() => (data as any)?.articles?.length || 0, [data]);

    // Données d'analytics simulées
    const userActivityData = useMemo(() => [
        { label: 'Lun', value: 45, color: 'bg-pm-gold' },
        { label: 'Mar', value: 52, color: 'bg-blue-500' },
        { label: 'Mer', value: 38, color: 'bg-green-500' },
        { label: 'Jeu', value: 61, color: 'bg-purple-500' },
        { label: 'Ven', value: 48, color: 'bg-orange-500' },
        { label: 'Sam', value: 35, color: 'bg-red-500' },
        { label: 'Dim', value: 28, color: 'bg-teal-500' }
    ], []);

    const contentPerformanceData = useMemo(() => [
        { label: 'Articles', value: totalArticles, color: 'bg-pm-gold' },
        { label: 'Pages', value: totalPages, color: 'bg-blue-500' },
        { label: 'Médias', value: totalMedia, color: 'bg-green-500' },
        { label: 'Formations', value: 0, color: 'bg-purple-500' }
    ], [totalArticles, totalPages, totalMedia]);

    const userEngagementData = useMemo(() => [
        { label: 'Visiteurs uniques', value: 1250 },
        { label: 'Pages vues', value: 3420 },
        { label: 'Temps moyen', value: '3m 45s' },
        { label: 'Taux de rebond', value: '32%' }
    ], []);

    const recentActivity = useMemo(() => [
        { id: 1, type: 'Nouveau mannequin', user: 'Marie Dubois', time: '2h', status: 'Actif' },
        { id: 2, type: 'Candidature casting', user: 'Sophie Martin', time: '4h', status: 'En attente' },
        { id: 3, type: 'Article publié', user: 'Admin', time: '6h', status: 'Publié' },
        { id: 4, type: 'Message contact', user: 'Jean Dupont', time: '8h', status: 'Nouveau' },
        { id: 5, type: 'Promotion étudiant', user: 'Lisa Johnson', time: '12h', status: 'Pro' }
    ], []);

    const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
        console.log(`Export des données en format ${format.toUpperCase()}`);
        alert(`Export des données en format ${format.toUpperCase()} - Fonctionnalité en développement`);
    };

    const handleViewDetails = (item: any) => {
        console.log('Détails de l\'activité:', item);
        alert(`Détails de l'activité: ${item.type} - ${item.user}`);
    };

    const sections = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
        { id: 'users', label: 'Utilisateurs', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: DocumentTextIcon },
        { id: 'technical', label: 'Technique', icon: CogIcon },
    ];

    return (
        <AdminPageWrapper>
            {/* Statistiques système */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Utilisateurs Actifs"
                    value={totalModels + totalBeginnerStudents}
                    icon={UsersIcon}
                    color="blue"
                    change={{
                        value: 8,
                        type: 'increase',
                        label: 'ce mois'
                    }}
                />
                <StatCard
                    title="Pages Créées"
                    value={totalPages}
                    icon={DocumentTextIcon}
                    color="green"
                />
                <StatCard
                    title="Articles Publiés"
                    value={totalArticles}
                    icon={DocumentTextIcon}
                    color="purple"
                />
                <StatCard
                    title="Médias Stockés"
                    value={totalMedia}
                    icon={CameraIcon}
                    color="orange"
                />
            </div>

            {/* Navigation des sections */}
            <div className="mb-8">
                <nav className="flex space-x-1 bg-black/30 p-1 rounded-lg">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                            }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AdminCard 
                    title="Gestion des Utilisateurs" 
                    icon={UsersIcon} 
                    href="/admin/users"
                    description="Créer et gérer les utilisateurs du système."
                    color="blue"
                />
                <AdminCard 
                    title="Section Technique" 
                    icon={CogIcon} 
                    href="/admin/technical"
                    description="Configuration technique et maintenance."
                    color="indigo"
                />
                <AdminCard 
                    title="Paramètres du Site" 
                    icon={Cog6ToothIcon} 
                    href="/admin/settings"
                    description="Modifier infos de contact, images et clés API."
                    color="gold"
                />
            </div>

            {/* Contenu selon la section active */}
            {activeSection === 'overview' && (
                <div className="space-y-6">
                    {/* Graphiques de performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsChart
                            title="Activité des Utilisateurs (7 derniers jours)"
                            data={userActivityData}
                            type="line"
                            showTrend={true}
                            trendValue={12}
                            trendLabel="vs semaine dernière"
                        />
                        
                        <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                            <h3 className="text-xl font-playfair text-pm-gold mb-4">Performance du Site</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-pm-off-white/70">Temps de chargement</span>
                                    <span className="text-green-400 font-semibold">1.2s</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-pm-off-white/70">Uptime</span>
                                    <span className="text-green-400 font-semibold">99.9%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-pm-off-white/70">Erreurs 500</span>
                                    <span className="text-red-400 font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-pm-off-white/70">Visiteurs uniques</span>
                                    <span className="text-pm-gold font-semibold">1,250</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graphiques de contenu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsChart
                            title="Performance du Contenu"
                            data={contentPerformanceData}
                            type="pie"
                        />
                        
                        <AnalyticsChart
                            title="Engagement des Utilisateurs"
                            data={userEngagementData.map(item => ({ 
                                label: item.label, 
                                value: typeof item.value === 'string' ? 0 : item.value 
                            }))}
                            type="bar"
                        />
                    </div>

                    {/* Rapport d'activité récente */}
                    <AnalyticsReport
                        title="Activité Récente"
                        data={recentActivity}
                        columns={[
                            { key: 'type', label: 'Type d\'activité' },
                            { key: 'user', label: 'Utilisateur' },
                            { key: 'time', label: 'Il y a' },
                            { key: 'status', label: 'Statut', type: 'status' }
                        ]}
                        onExport={handleExportData}
                        onViewDetails={handleViewDetails}
                    />

                    {/* Debug Statsig */}
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-pm-gold mb-4">Debug Statsig</h3>
                        <StatsigDebug />
                    </div>
                </div>
            )}

            {activeSection === 'users' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Statistiques des Utilisateurs
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-pm-gold">Mannequins Professionnels</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Total inscrits</span>
                                    <span className="text-pm-gold font-semibold">{totalModels}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Actifs ce mois</span>
                                    <span className="text-green-400 font-semibold">{Math.floor(totalModels * 0.8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Nouveaux cette semaine</span>
                                    <span className="text-blue-400 font-semibold">{Math.floor(totalModels * 0.1)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-pm-gold">Étudiants Débutants</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Total inscrits</span>
                                    <span className="text-pm-gold font-semibold">{totalBeginnerStudents}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">En formation</span>
                                    <span className="text-yellow-400 font-semibold">{Math.floor(totalBeginnerStudents * 0.6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Promus ce mois</span>
                                    <span className="text-green-400 font-semibold">{Math.floor(totalBeginnerStudents * 0.2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'content' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Statistiques du Contenu
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-pm-gold">Articles</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Total</span>
                                    <span className="text-pm-gold font-semibold">{totalArticles}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Publiés</span>
                                    <span className="text-green-400 font-semibold">{Math.floor(totalArticles * 0.8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Brouillons</span>
                                    <span className="text-yellow-400 font-semibold">{Math.floor(totalArticles * 0.2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-pm-gold">Pages</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Total</span>
                                    <span className="text-pm-gold font-semibold">{totalPages}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Actives</span>
                                    <span className="text-green-400 font-semibold">{totalPages}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-pm-gold">Médias</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Total</span>
                                    <span className="text-pm-gold font-semibold">{totalMedia}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Images</span>
                                    <span className="text-blue-400 font-semibold">{Math.floor(totalMedia * 0.9)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-pm-off-white/70">Vidéos</span>
                                    <span className="text-purple-400 font-semibold">{Math.floor(totalMedia * 0.1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'technical' && (
                <div className="space-y-6">
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-pm-gold mb-4">
                            État du Système
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-pm-gold">Performance</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Temps de réponse</span>
                                        <span className="text-green-400 font-semibold">120ms</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Mémoire utilisée</span>
                                        <span className="text-yellow-400 font-semibold">45%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">CPU</span>
                                        <span className="text-green-400 font-semibold">23%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-pm-gold">Sécurité</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Tentatives de connexion</span>
                                        <span className="text-green-400 font-semibold">Normales</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Erreurs 404</span>
                                        <span className="text-yellow-400 font-semibold">12</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Erreurs 500</span>
                                        <span className="text-green-400 font-semibold">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-pm-gold mb-4">
                            Actions Techniques
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                                <CogIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <p className="text-pm-gold font-medium">Redémarrer Services</p>
                            </button>
                            
                            <button className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                                <ClockIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-pm-gold font-medium">Sauvegarder</p>
                            </button>
                            
                            <button className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors">
                                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                <p className="text-pm-gold font-medium">Vérifier Logs</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageWrapper>
    );
};

export default AdminAnalytics;
