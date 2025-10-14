import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

type AdminTab = 'overview' | 'talents' | 'content' | 'accounting';

interface ActiveUser {
    name: string;
    role: string;
    loginTime: number;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Administrateur';
        case 'student': return 'Mannequin Pro';
        case 'beginner': return 'Débutant';
        case 'jury': return 'Jury';
        case 'registration': return 'Enregistrement';
        default: return role;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-500/20 text-red-300';
        case 'student': return 'bg-pm-gold/20 text-pm-gold';
        case 'beginner': return 'bg-blue-500/20 text-blue-300';
        case 'jury': return 'bg-purple-500/20 text-purple-300';
        case 'registration': return 'bg-teal-500/20 text-teal-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    useEffect(() => {
        const checkActivity = () => {
            const now = Date.now();
            const fifteenMinutes = 15 * 60 * 1000;
            const currentActivityJSON = localStorage.getItem('pmm_active_users');
            const allUsers: ActiveUser[] = currentActivityJSON ? JSON.parse(currentActivityJSON) : [];
            const recentUsers = allUsers.filter(user => (now - user.loginTime) < fifteenMinutes);
            setActiveUsers(recentUsers);
        };

        checkActivity();
        const interval = setInterval(checkActivity, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;
    const totalModels = data?.models?.length || 0;
    const totalBeginnerStudents = data?.beginnerStudents?.length || 0;

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Aperçu', icon: HomeIcon },
        { id: 'talents', label: 'Talents', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: NewspaperIcon },
        { id: 'accounting', label: 'Comptabilité & Suivi', icon: BriefcaseIcon },
    ];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord Administratif</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="admin-section-wrapper mb-8">
                    <h2 className="admin-section-title flex items-center gap-2"><SignalIcon className="w-6 h-6"/>Activité en Direct</h2>
                    {activeUsers.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {activeUsers.map(user => (
                                <li key={user.name} className="bg-pm-dark/50 p-3 rounded-md flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                    <div>
                                        <p className="font-semibold text-sm truncate">{user.name}</p>
                                        <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${getRoleColor(user.role)}`}>{getRoleDisplayName(user.role)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-pm-off-white/60">Aucun utilisateur actif dans les 15 dernières minutes.</p>
                    )}
                </div>

                <div className="border-b border-pm-gold/20 mb-8">
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
                
                <div className="animate-fade-in">
                    {activeTab === 'overview' && (
                        <section className="space-y-8">
                            {/* KPIs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                <KpiCard icon={ClipboardDocumentListIcon} label="Casting (Nouveaux)" value={newCastingApps} accent="text-pm-gold" />
                                <KpiCard icon={SparklesIcon} label="PFD (Nouveaux)" value={newFashionDayApps} accent="text-pm-gold" />
                                <KpiCard icon={EnvelopeIcon} label="Messages (Nouveaux)" value={newMessages} />
                                <KpiCard icon={BriefcaseIcon} label="Bookings (Nouveaux)" value={newBookingRequests} />
                                <KpiCard icon={UsersIcon} label="Mannequins Pro" value={totalModels} />
                                <KpiCard icon={AcademicCapIcon} label="Débutants" value={totalBeginnerStudents} />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Quick actions */}
                                <div className="xl:col-span-2">
                                    <h3 className="text-lg font-bold text-pm-off-white/80 mb-4">Raccourcis</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <Stagger>
                                            <DashboardCard title="Candidatures Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Traiter les nouvelles candidatures." notificationCount={newCastingApps} />
                                            <DashboardCard title="Candidatures PFD" icon={SparklesIcon} link="/admin/fashion-day-applications" description="Gérer les inscriptions au PFD." notificationCount={newFashionDayApps} />
                                            <DashboardCard title="Demandes de Booking" icon={BriefcaseIcon} link="/admin/bookings" description="Gérer les demandes clients." notificationCount={newBookingRequests} />
                                            <DashboardCard title="Messages" icon={EnvelopeIcon} link="/admin/messages" description="Lire les nouveaux messages." notificationCount={newMessages} />
                                            <DashboardCard title="Mannequins Pro" icon={UsersIcon} link="/admin/models" description="Gérer les profils confirmés." />
                                            <DashboardCard title="Débutants" icon={UserGroupIcon} link="/admin/beginner-students-access" description="Promouvoir les étudiants." />
                                        </Stagger>
                                    </div>
                                </div>

                                {/* Recents */}
                                <div className="xl:col-span-1">
                                    <h3 className="text-lg font-bold text-pm-off-white/80 mb-4">Dernières activités</h3>
                                    <div className="space-y-4">
                                        <RecentList
                                            title="Casting"
                                            items={(data?.castingApplications || []).slice().sort((a,b)=> new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).slice(0,5).map(a=>({
                                                id: a.id,
                                                primary: `${a.firstName} ${a.lastName}`,
                                                secondary: a.city,
                                                date: a.submissionDate,
                                                status: a.status
                                            }))}
                                            icon={ClipboardDocumentListIcon}
                                            linkBase="/admin/casting-applications"
                                        />
                                        <RecentList
                                            title="Messages"
                                            items={(data?.contactMessages || []).slice().sort((a,b)=> new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).slice(0,5).map(m=>({
                                                id: m.id,
                                                primary: m.name,
                                                secondary: m.subject,
                                                date: m.submissionDate,
                                                status: m.status
                                            }))}
                                            icon={EnvelopeIcon}
                                            linkBase="/admin/messages"
                                        />
                                        <RecentList
                                            title="Bookings"
                                            items={(data?.bookingRequests || []).slice().sort((a,b)=> new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).slice(0,5).map(b=>({
                                                id: b.id,
                                                primary: b.clientName,
                                                secondary: b.requestedModels,
                                                date: b.submissionDate,
                                                status: b.status
                                            }))}
                                            icon={BriefcaseIcon}
                                            linkBase="/admin/bookings"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    {activeTab === 'talents' && (
                        <TabContent title="Gestion des Talents et du Recrutement">
                            <Stagger>
                              <DashboardCard title="Gérer les Mannequins Pro" icon={UsersIcon} link="/admin/models" description="Ajouter, modifier ou rétrograder des profils de mannequins."/>
                              <DashboardCard title="Gérer les Débutants" icon={UserGroupIcon} link="/admin/beginner-students-access" description="Consulter les accès et promouvoir les mannequins en formation."/>
                              <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Créer et assigner des thèmes de séance photo aux mannequins."/>
                              <DashboardCard title="Candidatures Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Consulter et traiter les candidatures pour les castings." notificationCount={newCastingApps} />
                              <DashboardCard title="Résultats & Validation Casting" icon={ClipboardDocumentCheckIcon} link="/admin/casting-results" description="Valider les candidats et créer leurs profils de débutant." />
                              <DashboardCard title="Accès Mannequins Pro" icon={KeyIcon} link="/admin/model-access" description="Consulter les identifiants des mannequins confirmés." />
                            </Stagger>
                        </TabContent>
                    )}
                    {activeTab === 'content' && (
                         <TabContent title="Gestion du Contenu et de la Formation">
                            <Stagger>
                              <DashboardCard title="Gérer le Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Créer et administrer les articles du magazine Focus Model 241." />
                              <DashboardCard title="Gérer les Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Publier et gérer les actualités de la page d'accueil." />
                              <DashboardCard title="Contenu de l'Agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Mettre à jour les services, la chronologie et les réalisations." />
                              <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
                              <DashboardCard title="Modérer les Commentaires" icon={ChatBubbleLeftRightIcon} link="/admin/comments" description="Gérer les commentaires laissés sur les articles du magazine." />
                              <DashboardCard title="Gérer le Classroom Pro" icon={BookOpenIcon} link="/admin/classroom" description="Modifier les modules et chapitres de la formation avancée." />
                              <DashboardCard title="Paramètres du Site" icon={Cog6ToothIcon} link="/admin/settings" description="Modifier les informations de contact, les images et les clés API." />
                            </Stagger>
                         </TabContent>
                    )}
                     {activeTab === 'accounting' && (
                         <TabContent title="Comptabilité, Opérations et Suivi">
                           <Stagger>
                             <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Enregistrer et suivre les paiements mensuels des mannequins." />
                             <DashboardCard title="Suivi des Absences" icon={CalendarIcon} link="/admin/absences" description="Enregistrer et consulter les absences des mannequins." />
                             <DashboardCard title="Demandes de Booking" icon={BriefcaseIcon} link="/admin/bookings" description="Consulter et gérer les demandes de booking des clients." notificationCount={newBookingRequests} />
                             <DashboardCard title="Candidatures PFD" icon={SparklesIcon} link="/admin/fashion-day-applications" description="Gérer les inscriptions pour l'événement Perfect Fashion Day." notificationCount={newFashionDayApps} />
                             <DashboardCard title="Suivi Classroom Pro" icon={AcademicCapIcon} link="/admin/classroom-progress" description="Voir la progression des mannequins confirmés aux quiz." />
                             <DashboardCard title="Messages de Contact" icon={EnvelopeIcon} link="/admin/messages" description="Lire et gérer les messages reçus via le formulaire de contact." notificationCount={newMessages} />
                             <DashboardCard title="Demandes de Récupération" icon={ExclamationTriangleIcon} link="/admin/recovery-requests" description="Traiter les demandes de coordonnées oubliées." notificationCount={newRecoveryRequests} />
                           </Stagger>
                         </TabContent>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabContent: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h2 className="text-xl font-bold text-pm-off-white/80 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <Link to={link} className="relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10 reveal reveal-up">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-slow">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h2>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

const Stagger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div className="reveal reveal-up" style={{ animationDelay: `${100 + index * 80}ms` }}>
          {child}
        </div>
      ))}
    </>
  );
};

export default Admin;

// ===== Local Components

const KpiCard: React.FC<{ icon: React.ElementType; label: string; value: number | string; accent?: string; }> = ({ icon: Icon, label, value, accent }) => {
    return (
        <div className="reveal reveal-up bg-black/60 border border-pm-gold/20 rounded-lg p-4 flex items-center gap-4 hover-lift">
            <div className={`w-10 h-10 rounded-md bg-pm-gold/10 flex items-center justify-center ${accent ? accent : 'text-pm-gold'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-sm text-pm-off-white/70">{label}</div>
                <div className="text-2xl font-bold text-pm-off-white">{value}</div>
            </div>
        </div>
    );
};

type RecentItem = { id: string; primary: string; secondary?: string; date: string; status?: string };

const RecentList: React.FC<{ title: string; items: RecentItem[]; icon: React.ElementType; linkBase: string; }> = ({ title, items, icon: Icon, linkBase }) => {
    const formatDate = (value: string): string => {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    const getStatusClasses = (status?: string): string => {
        if (!status) return 'bg-pm-off-white/10 text-pm-off-white/70';
        const map: Record<string, string> = {
            'Nouveau': 'bg-green-500/20 text-green-300',
            'Présélectionné': 'bg-blue-500/20 text-blue-300',
            'Accepté': 'bg-pm-gold/20 text-pm-gold',
            'Refusé': 'bg-red-500/20 text-red-300',
            'Confirmé': 'bg-pm-gold/20 text-pm-gold',
            'Annulé': 'bg-red-500/20 text-red-300',
            'Lu': 'bg-blue-500/20 text-blue-300',
            'Archivé': 'bg-gray-500/20 text-gray-300',
            'En attente': 'bg-yellow-500/20 text-yellow-300',
        };
        return map[status] || 'bg-pm-off-white/10 text-pm-off-white/70';
    };

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg p-4 reveal reveal-up">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-pm-gold" />
                <h4 className="font-semibold text-pm-off-white/80">{title}</h4>
            </div>
            {items.length === 0 ? (
                <p className="text-sm text-pm-off-white/60">Aucun élément récent.</p>
            ) : (
                <ul className="divide-y divide-pm-gold/10">
                    {items.map(item => (
                        <li key={item.id} className="py-2 flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-pm-off-white truncate">{item.primary}</div>
                                {item.secondary && <div className="text-xs text-pm-off-white/60 truncate">{item.secondary}</div>}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {item.status && <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClasses(item.status)}`}>{item.status}</span>}
                                <span className="text-xs text-pm-off-white/50 w-14 text-right">{formatDate(item.date)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-3 text-right">
                <Link to={linkBase} className="text-xs text-pm-gold hover:underline">Tout voir</Link>
            </div>
        </div>
    );
};