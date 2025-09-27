import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import { 
    UsersIcon, NewspaperIcon, CalendarDaysIcon, ClipboardDocumentListIcon,
    ExclamationTriangleIcon, PresentationChartLineIcon,
    ChatBubbleLeftRightIcon, CurrencyDollarIcon, CalendarIcon,
    ChartBarIcon, KeyIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

// ---- Types ----
type AdminTab = 'dashboard' | 'talents' | 'content' | 'communication' | 'finance' | 'analytics';

// ---- Main Admin Component ----
const Admin: React.FC = () => {
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    // ---- Comptage notifications ----
    const newCastingApps = useMemo(() => (data as any)?.castingApplications?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);
    const newFashionDayApps = useMemo(() => (data as any)?.fashionDayApplications?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);
    const newRecoveryRequests = useMemo(() => (data as any)?.recoveryRequests?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);
    const newBookingRequests = useMemo(() => (data as any)?.bookingRequests?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);
    const newMessages = useMemo(() => (data as any)?.contactMessages?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: PresentationChartLineIcon },
        { id: 'talents', label: 'Talents', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: NewspaperIcon },
        { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
        { id: 'finance', label: 'Finance', icon: CurrencyDollarIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    ];

    // ---- Statistiques ----
    const totalModels = (data as any)?.models?.length || 0;
    const totalArticles = (data as any)?.articles?.length || 0;
    const totalCastingApps = (data as any)?.castingApplications?.length || 0;
    const totalRevenue = (data as any)?.monthlyPayments?.reduce((sum: any, payment: any) => sum + payment.amount, 0) || 0;

    return (
        <AdminLayout 
            title="Tableau de Bord" 
            description="Gestion complète de la plateforme Perfect Models Management"
            breadcrumbs={[]}
        >
            {/* Tabs de navigation */}
            <div className="mb-8">
                <nav className="border-b border-pm-gold/20 -mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`group inline-flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                ? 'border-pm-gold text-pm-gold'
                                : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:border-pm-gold/50'
                            }`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            <tab.icon className="w-5 h-5"/>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
                
            {/* Contenu des onglets */}
            <div className="min-h-screen">
                <section className="animate-fade-in">
                    <h2 className="text-2xl font-playfair text-pm-gold mb-6">Vue d'ensemble</h2>
                    
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Mannequins Actifs"
                            value={totalModels}
                            icon={UsersIcon}
                            color="gold"
                            change={{
                                value: 12,
                                type: 'increase',
                                label: 'ce mois'
                            }}
                        />
                        <StatCard
                            title="Articles Publiés"
                            value={totalArticles}
                            icon={NewspaperIcon}
                            color="blue"
                            change={{
                                value: 5,
                                type: 'increase',
                                label: 'cette semaine'
                            }}
                        />
                        <StatCard
                            title="Candidatures Casting"
                            value={totalCastingApps}
                            icon={ClipboardDocumentListIcon}
                            color="green"
                            change={{
                                value: 8,
                                type: 'increase',
                                label: 'cette semaine'
                            }}
                        />
                        <StatCard
                            title="Revenus Totaux"
                            value={`${totalRevenue.toLocaleString()} FCFA`}
                            icon={CurrencyDollarIcon}
                            color="purple"
                            change={{
                                value: 15,
                                type: 'increase',
                                label: 'ce mois'
                            }}
                        />
                    </div>

                    {/* Actions requises */}
                    {(newCastingApps > 0 || newFashionDayApps > 0 || newRecoveryRequests > 0 || newBookingRequests > 0) && (
                        <div className="mb-8">
                            <h2 className="text-xl font-playfair text-pm-gold mb-4 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-6 h-6" />
                                Actions Requises
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {newCastingApps > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <ClipboardDocumentListIcon className="w-6 h-6 text-red-400" />
                                            <div>
                                                <p className="text-red-400 font-semibold">{newCastingApps}</p>
                                                <p className="text-sm text-red-300">Nouvelles candidatures</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newFashionDayApps > 0 && (
                                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <CalendarDaysIcon className="w-6 h-6 text-orange-400" />
                                            <div>
                                                <p className="text-orange-400 font-semibold">{newFashionDayApps}</p>
                                                <p className="text-sm text-orange-300">Candidatures PFD</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newRecoveryRequests > 0 && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <KeyIcon className="w-6 h-6 text-yellow-400" />
                                            <div>
                                                <p className="text-yellow-400 font-semibold">{newRecoveryRequests}</p>
                                                <p className="text-sm text-yellow-300">Demandes récupération</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newBookingRequests > 0 && (
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="w-6 h-6 text-blue-400" />
                                            <div>
                                                <p className="text-blue-400 font-semibold">{newBookingRequests}</p>
                                                <p className="text-sm text-blue-300">Demandes booking</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newMessages > 0 && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400" />
                                            <div>
                                                <p className="text-green-400 font-semibold">{newMessages}</p>
                                                <p className="text-sm text-green-300">Messages contact</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions rapides */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AdminCard 
                            title="Gestion des Talents" 
                            icon={UsersIcon} 
                            href="/admin/models" 
                            description="Gérer les mannequins professionnels et les étudiants."
                            color="gold"
                        />
                        <AdminCard 
                            title="Gestion du Contenu" 
                            icon={NewspaperIcon} 
                            href="/admin/content" 
                            description="Créer et gérer le contenu du site et de la formation."
                            color="blue"
                        />
                        <AdminCard 
                            title="Communication" 
                            icon={ChatBubbleLeftRightIcon} 
                            href="/admin/communication" 
                            description="Gérer les messages et campagnes de communication."
                            color="green"
                        />
                        <AdminCard 
                            title="Gestion Financière" 
                            icon={CurrencyDollarIcon} 
                            href="/admin/finance" 
                            description="Suivre les paiements et rapports financiers."
                            color="purple"
                        />
                        <AdminCard 
                            title="Analytics" 
                            icon={ChartBarIcon} 
                            href="/admin/analytics" 
                            description="Surveiller les performances du système."
                            color="indigo"
                        />
                        <AdminCard 
                            title="Candidatures Casting" 
                            icon={ClipboardDocumentListIcon} 
                            href="/admin/casting-applications" 
                            description="Traiter les candidatures pour les castings."
                            notificationCount={newCastingApps}
                            color="orange"
                        />
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};

export default Admin;