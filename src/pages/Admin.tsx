import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/admin/AdminCard';
import AdminStats from '../components/admin/AdminStats';
import StatsigDebug from '../components/admin/StatsigDebug';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    PhotoIcon, ChartBarIcon, DocumentTextIcon, CogIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

// ---- Types ----
type AdminTab = 'dashboard' | 'talents' | 'content' | 'communication' | 'finance' | 'analytics';
interface ActiveUser { name: string; role: string; loginTime: number; }

// ---- Utils ----

// ---- Main Admin Component ----
const Admin: React.FC = () => {
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    // ---- Utilisateurs actifs ----
    useEffect(() => {
        const refreshActivity = () => {
            const now = Date.now();
            const fifteenMin = 15 * 60 * 1000;
            const usersJSON = localStorage.getItem('pmm_active_users');
            const users: ActiveUser[] = usersJSON ? JSON.parse(usersJSON) : [];
            setActiveUsers(users.filter(u => now - u.loginTime < fifteenMin));
        };
        refreshActivity();
        const interval = setInterval(refreshActivity, 5000);
        return () => clearInterval(interval);
    }, []);

    // ---- Comptage notifications ----
    const newCastingApps = useMemo(() => data?.castingApplications?.filter(a => a.status === 'Nouveau').length || 0, [data]);
    const newFashionDayApps = useMemo(() => data?.fashionDayApplications?.filter(a => a.status === 'Nouveau').length || 0, [data]);
    const newRecoveryRequests = useMemo(() => data?.recoveryRequests?.filter(a => a.status === 'Nouveau').length || 0, [data]);
    const newBookingRequests = useMemo(() => data?.bookingRequests?.filter(a => a.status === 'Nouveau').length || 0, [data]);
    const newMessages = useMemo(() => data?.contactMessages?.filter(a => a.status === 'Nouveau').length || 0, [data]);

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: PresentationChartLineIcon },
        { id: 'talents', label: 'Talents', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: NewspaperIcon },
        { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
        { id: 'finance', label: 'Finance', icon: CurrencyDollarIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    ];

    // ---- Statistiques ----
    const totalModels = data?.models?.length || 0;
    const totalArticles = data?.articles?.length || 0;
    const totalCastingApps = data?.castingApplications?.length || 0;
    const totalRevenue = data?.monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

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
            <div>
                {activeTab === 'dashboard' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Vue d'ensemble</h2>
                        
                        {/* Statistiques principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <AdminStats
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
                            <AdminStats
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
                            <AdminStats
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
                            <AdminStats
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

                        {/* Notifications urgentes */}
                        {(newCastingApps > 0 || newFashionDayApps > 0 || newRecoveryRequests > 0 || newBookingRequests > 0 || newMessages > 0) && (
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
                                                    <p className="text-sm text-green-300">Nouveaux messages</p>
                                                </div>
                                            </div>
                                        </div>
                    )}
                </div>
            </div>
                        )}
                    </section>
                )}

                {activeTab === 'talents' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Gestion des Talents et Recrutement</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard 
                                title="Mannequins Pro" 
                                icon={UsersIcon} 
                                href="/admin/models" 
                                description="Ajouter, modifier ou rétrograder des profils de mannequins."
                                color="gold"
                            />
                            <AdminCard 
                                title="Débutants" 
                                icon={UserGroupIcon} 
                                href="/admin/beginner-students-access" 
                                description="Consulter les accès et promouvoir les mannequins en formation."
                                color="blue"
                            />
                            <AdminCard 
                                title="Direction Artistique" 
                                icon={PaintBrushIcon} 
                                href="/admin/artistic-direction" 
                                description="Créer et assigner des thèmes de séance photo aux mannequins."
                                color="purple"
                            />
                            <AdminCard 
                                title="Candidatures Casting" 
                                icon={ClipboardDocumentListIcon} 
                                href="/admin/casting-applications" 
                                description="Consulter et traiter les candidatures pour les castings."
                                notificationCount={newCastingApps}
                                color="green"
                            />
                            <AdminCard 
                                title="Résultats Casting" 
                                icon={ClipboardDocumentCheckIcon} 
                                href="/admin/casting-results" 
                                description="Valider les candidats et créer leurs profils."
                                color="teal"
                            />
                            <AdminCard 
                                title="Accès Mannequins Pro" 
                                icon={KeyIcon} 
                                href="/admin/model-access" 
                                description="Consulter les identifiants des mannequins confirmés."
                                color="orange"
                            />
                        </div>
                    </section>
                )}
                
                {activeTab === 'communication' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Communication & Messagerie</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard 
                                title="Messagerie Interne" 
                                icon={ChatBubbleLeftRightIcon} 
                                href="/admin/messaging" 
                                description="Communiquer avec les mannequins et étudiants."
                                color="blue"
                            />
                            <AdminCard 
                                title="Messages Contact" 
                                icon={ChatBubbleLeftRightIcon} 
                                href="/admin/messages" 
                                description="Gérer les messages reçus via le formulaire de contact."
                                notificationCount={newMessages}
                                color="green"
                            />
                            <AdminCard 
                                title="Gestion des Emails" 
                                icon={EnvelopeIcon} 
                                href="/admin/emails" 
                                description="Créer et gérer les campagnes email et templates."
                                color="purple"
                            />
                            <AdminCard 
                                title="Gestion du Contenu" 
                                icon={DocumentTextIcon} 
                                href="/admin/content" 
                                description="Modifier le contenu des pages du site."
                                color="indigo"
                            />
                            <AdminCard 
                                title="Demandes Récupération" 
                                icon={KeyIcon} 
                                href="/admin/recovery-requests" 
                                description="Traiter les demandes de coordonnées oubliées."
                                notificationCount={newRecoveryRequests}
                                color="yellow"
                            />
                            <AdminCard 
                                title="Commentaires" 
                                icon={ChatBubbleLeftRightIcon} 
                                href="/admin/comments" 
                                description="Modérer les commentaires sur les articles et profils."
                                color="blue"
                            />
                            <AdminCard 
                                title="Gestion des Médias" 
                                icon={PhotoIcon} 
                                href="/admin/media" 
                                description="Gérer vos images et fichiers multimédias."
                                color="teal"
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'content' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Gestion du Contenu et Formation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard 
                                title="Magazine" 
                                icon={NewspaperIcon} 
                                href="/admin/magazine" 
                                description="Créer et administrer les articles du magazine Focus Model 241."
                                color="blue"
                            />
                            <AdminCard 
                                title="Actualités" 
                                icon={PresentationChartLineIcon} 
                                href="/admin/news" 
                                description="Publier et gérer les actualités de la page d'accueil."
                                color="green"
                            />
                            <AdminCard 
                                title="Contenu Agence" 
                                icon={BuildingStorefrontIcon} 
                                href="/admin/agency" 
                                description="Mettre à jour services, chronologie et réalisations."
                                color="purple"
                            />
                            <AdminCard 
                                title="Événements PFD" 
                                icon={CalendarDaysIcon} 
                                href="/admin/fashion-day-events" 
                                description="Configurer les éditions du Perfect Fashion Day."
                                color="orange"
                            />
                            <AdminCard 
                                title="Gestion du Contenu" 
                                icon={DocumentTextIcon} 
                                href="/admin/content" 
                                description="Modifier le contenu des pages du site."
                                color="indigo"
                            />
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
                                color="gray"
                            />
                            <AdminCard 
                                title="Commentaires" 
                                icon={ChatBubbleLeftRightIcon} 
                                href="/admin/comments" 
                                description="Gérer les commentaires des articles du magazine."
                                color="teal"
                            />
                            <AdminCard 
                                title="Classroom Pro" 
                                icon={BookOpenIcon} 
                                href="/admin/classroom" 
                                description="Modifier modules et chapitres de la formation avancée."
                                color="pink"
                            />
                            <AdminCard 
                                title="Paramètres du Site" 
                                icon={Cog6ToothIcon} 
                                href="/admin/settings" 
                                description="Modifier infos de contact, images et clés API."
                                color="gold"
                            />
                            <AdminCard 
                                title="Progression Classroom" 
                                icon={AcademicCapIcon} 
                                href="/admin/classroom-progress" 
                                description="Suivre l'avancement des mannequins en formation."
                                color="teal"
                            />
        </div>
                    </section>
                )}
                
                {activeTab === 'finance' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Gestion Financière</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AdminCard 
                                title="Paiements" 
                                icon={CurrencyDollarIcon} 
                                href="/admin/payments" 
                                description="Suivre les paiements et facturations des mannequins."
                                color="green"
                            />
                            <AdminCard 
                                title="Réservations" 
                                icon={CalendarIcon} 
                                href="/admin/bookings" 
                                description="Gérer les réservations et créneaux de shooting."
                                notificationCount={newBookingRequests}
                                color="blue"
                            />
                            <AdminCard 
                                title="Absences" 
                                icon={ExclamationTriangleIcon} 
                                href="/admin/absences" 
                                description="Enregistrer et suivre les absences des mannequins."
                                color="red"
                            />
                            <AdminCard 
                                title="Candidatures Fashion Day" 
                                icon={SparklesIcon} 
                                href="/admin/fashion-day-applications" 
                                description="Traiter les candidatures pour les événements PFD."
                                notificationCount={newFashionDayApps}
                                color="purple"
                            />
        </div>
    </section>
                )}

                
                {activeTab === 'analytics' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-6">Analytics et Monitoring</h2>
                        <StatsigDebug />
                    </section>
                )}
            </div>
        </AdminLayout>
    );
};

export default Admin;
