import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon, MagnifyingGlassIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

// Types
import type { BookingRequest, ContactMessage, RecoveryRequest, CastingApplication, FashionDayApplication } from '../../types';

type AdminTab = 'talents' | 'content' | 'accounting';

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

    // Persist selected tab across sessions
    const [activeTab, setActiveTab] = useState<AdminTab>(() => (sessionStorage.getItem('admin_active_tab') as AdminTab) || 'talents');
    useEffect(() => {
        sessionStorage.setItem('admin_active_tab', activeTab);
    }, [activeTab]);

    // Live active users (local only)
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
        const interval = setInterval(checkActivity, 5000);
        return () => clearInterval(interval);
    }, []);

    // Logout
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Metrics
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    // Tab badges
    const tabBadges: Record<AdminTab, number> = useMemo(() => ({
        talents: newCastingApps,
        content: 0,
        accounting: newBookingRequests + newFashionDayApps + newMessages + newRecoveryRequests,
    }), [newCastingApps, newBookingRequests, newFashionDayApps, newMessages, newRecoveryRequests]);

    // Admin quick search
    const [query, setQuery] = useState('');
    const adminLinks = useMemo(() => ([
        { label: 'Candidatures Casting', path: '/admin/casting-applications' },
        { label: 'Résultats Casting', path: '/admin/casting-results' },
        { label: 'Direction Artistique', path: '/admin/artistic-direction' },
        { label: 'Mannequins Pro', path: '/admin/models' },
        { label: 'Débutants', path: '/admin/beginner-students-access' },
        { label: 'Accès Mannequins Pro', path: '/admin/model-access' },
        { label: 'Magazine', path: '/admin/magazine' },
        { label: 'Commentaires', path: '/admin/comments' },
        { label: 'Actualités', path: '/admin/news' },
        { label: 'Agence', path: '/admin/agency' },
        { label: 'Paramètres du site', path: '/admin/settings' },
        { label: 'Classroom Pro', path: '/admin/classroom' },
        { label: 'Événements PFD', path: '/admin/fashion-day-events' },
        { label: 'Demandes de Booking', path: '/admin/bookings' },
        { label: 'Inscriptions PFD', path: '/admin/fashion-day-applications' },
        { label: 'Comptabilité', path: '/admin/payments' },
        { label: 'Absences', path: '/admin/absences' },
        { label: 'Messages', path: '/admin/messages' },
        { label: 'Récupérations', path: '/admin/recovery-requests' },
    ]), []);

    const filteredLinks = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [] as { label: string; path: string }[];
        return adminLinks.filter(l => l.label.toLowerCase().includes(q));
    }, [query, adminLinks]);

    // Recent activity feed
    type FeedItem = {
        id: string;
        date: string; // ISO
        title: string;
        status?: string;
        link: string;
        type: 'Casting' | 'Booking' | 'Message' | 'Récupération' | 'PFD';
    };

    const recentFeed: FeedItem[] = useMemo(() => {
        const feed: FeedItem[] = [];

        (data?.castingApplications || []).forEach((c: CastingApplication) => {
            feed.push({
                id: c.id,
                date: c.submissionDate,
                title: `${c.firstName} ${c.lastName}`.trim(),
                status: c.status,
                link: '/admin/casting-applications',
                type: 'Casting',
            });
        });
        (data?.fashionDayApplications || []).forEach((f: FashionDayApplication) => {
            feed.push({
                id: f.id,
                date: f.submissionDate,
                title: `${f.name} (${f.role})`,
                status: f.status,
                link: '/admin/fashion-day-applications',
                type: 'PFD',
            });
        });
        (data?.bookingRequests || []).forEach((b: BookingRequest) => {
            feed.push({
                id: b.id,
                date: b.submissionDate,
                title: `${b.clientName} — ${b.requestedModels}`,
                status: b.status,
                link: '/admin/bookings',
                type: 'Booking',
            });
        });
        (data?.contactMessages || []).forEach((m: ContactMessage) => {
            feed.push({
                id: m.id,
                date: m.submissionDate,
                title: `${m.name}: ${m.subject}`,
                status: m.status,
                link: '/admin/messages',
                type: 'Message',
            });
        });
        (data?.recoveryRequests || []).forEach((r: RecoveryRequest) => {
            feed.push({
                id: r.id,
                date: r.timestamp,
                title: `${r.modelName} (${r.phone})`,
                status: r.status,
                link: '/admin/recovery-requests',
                type: 'Récupération',
            });
        });

        return feed
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 8);
    }, [data]);

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
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

                {/* KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <KPI label="Candidatures Casting" value={newCastingApps} link="/admin/casting-applications" />
                    <KPI label="Inscriptions PFD" value={newFashionDayApps} link="/admin/fashion-day-applications" />
                    <KPI label="Bookings" value={newBookingRequests} link="/admin/bookings" />
                    <KPI label="Messages" value={newMessages} link="/admin/messages" />
                    <KPI label="Récupérations" value={newRecoveryRequests} link="/admin/recovery-requests" />
                </div>

                {/* Global quick search */}
                <div className="relative mb-8">
                    <div className="flex items-center gap-3 bg-black border border-pm-gold/20 rounded-full px-4 py-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-pm-gold/80" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher une page (min. 2 lettres): ex. casting, payments, messages..."
                            className="flex-1 bg-transparent outline-none placeholder:text-pm-off-white/40 text-sm"
                            aria-label="Rechercher une page admin"
                        />
                    </div>
                    {filteredLinks.length > 0 && (
                        <div className="absolute z-10 mt-2 w-full bg-black border border-pm-gold/20 rounded-lg shadow-lg max-h-72 overflow-auto">
                            <ul>
                                {filteredLinks.map((l) => (
                                    <li key={l.path}>
                                        <Link onClick={() => setQuery('')} to={l.path} className="block px-4 py-2 hover:bg-pm-gold/10">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Live Activity */}
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

                {/* Recent Activity Feed */}
                <div className="admin-section-wrapper mb-8">
                    <h2 className="admin-section-title flex items-center gap-2"><ClockIcon className="w-6 h-6"/>Dernières entrées</h2>
                    {recentFeed.length > 0 ? (
                        <ul className="divide-y divide-pm-gold/10 bg-black/40 border border-pm-gold/20 rounded-lg">
                            {recentFeed.map((item) => (
                                <li key={`${item.type}-${item.id}`} className="p-4 flex items-start justify-between gap-4 hover:bg-pm-gold/5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-pm-off-white truncate">
                                            <span className="text-pm-gold">[{item.type}]</span> {item.title}
                                        </p>
                                        <p className="text-xs text-pm-off-white/70 mt-1">
                                            {new Date(item.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                                            {item.status ? ` • Statut: ${item.status}` : ''}
                                        </p>
                                    </div>
                                    <Link to={item.link} className="text-xs text-pm-gold hover:underline flex-shrink-0">Voir</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-pm-off-white/60">Aucune activité récente disponible.</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <QuickAction to="/admin/models" label="Nouveau mannequin" />
                    <QuickAction to="/admin/magazine" label="Nouvel article" />
                    <QuickAction to="/admin/news" label="Ajouter actualité" />
                    <QuickAction to="/admin/fashion-day-events" label="Configurer PFD" />
                    <QuickAction to="/admin/settings" label="Paramètres" />
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
                                {tabBadges[tab.id] > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center min-w-[1.2rem] h-5 px-1 text-xs rounded-full bg-red-600 text-white">
                                        {tabBadges[tab.id]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="animate-fade-in">
                    {activeTab === 'talents' && (
                        <>
                          <TabContent title="Recrutement">
                            <DashboardCard title="Candidatures Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Consulter et traiter les candidatures pour les castings." notificationCount={newCastingApps} />
                            <DashboardCard title="Résultats & Validation Casting" icon={ClipboardDocumentCheckIcon} link="/admin/casting-results" description="Valider les candidats et créer leurs profils de débutant." />
                          </TabContent>
                          <TabContent title="Profils & Accès">
                            <DashboardCard title="Gérer les Mannequins Pro" icon={UsersIcon} link="/admin/models" description="Ajouter, modifier ou rétrograder des profils de mannequins."/>
                            <DashboardCard title="Gérer les Débutants" icon={UserGroupIcon} link="/admin/beginner-students-access" description="Consulter les accès et promouvoir les mannequins en formation."/>
                            <DashboardCard title="Accès Mannequins Pro" icon={KeyIcon} link="/admin/model-access" description="Consulter les identifiants des mannequins confirmés." />
                          </TabContent>
                          <TabContent title="Direction & Séances">
                            <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Créer et assigner des thèmes de séance photo aux mannequins."/>
                          </TabContent>
                        </>
                    )}
                    {activeTab === 'content' && (
                        <>
                          <TabContent title="Editorial & Magazine">
                            <DashboardCard title="Gérer le Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Créer et administrer les articles du magazine Focus Model 241." />
                            <DashboardCard title="Modérer les Commentaires" icon={ChatBubbleLeftRightIcon} link="/admin/comments" description="Gérer les commentaires laissés sur les articles du magazine." />
                            <DashboardCard title="Gérer les Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Publier et gérer les actualités de la page d'accueil." />
                          </TabContent>
                          <TabContent title="Pages & Agence">
                            <DashboardCard title="Contenu de l'Agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Mettre à jour les services, la chronologie et les réalisations." />
                            <DashboardCard title="Paramètres du Site" icon={Cog6ToothIcon} link="/admin/settings" description="Modifier les informations de contact, les images et les clés API." />
                          </TabContent>
                          <TabContent title="Formation & Événements">
                            <DashboardCard title="Gérer le Classroom Pro" icon={BookOpenIcon} link="/admin/classroom" description="Modifier les modules et chapitres de la formation avancée." />
                            <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
                          </TabContent>
                        </>
                    )}
                     {activeTab === 'accounting' && (
                        <>
                          <TabContent title="Opérations">
                            <DashboardCard title="Demandes de Booking" icon={BriefcaseIcon} link="/admin/bookings" description="Consulter et gérer les demandes de booking des clients." notificationCount={newBookingRequests} />
                            <DashboardCard title="Candidatures PFD" icon={SparklesIcon} link="/admin/fashion-day-applications" description="Gérer les inscriptions pour l'événement Perfect Fashion Day." notificationCount={newFashionDayApps} />
                          </TabContent>
                          <TabContent title="Suivi & Comptabilité">
                            <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Enregistrer et suivre les paiements mensuels des mannequins." />
                            <DashboardCard title="Suivi des Absences" icon={CalendarIcon} link="/admin/absences" description="Enregistrer et consulter les absences des mannequins." />
                            <DashboardCard title="Suivi Classroom Pro" icon={AcademicCapIcon} link="/admin/classroom-progress" description="Voir la progression des mannequins confirmés aux quiz." />
                          </TabContent>
                          <TabContent title="Messages & Récupérations">
                            <DashboardCard title="Messages de Contact" icon={EnvelopeIcon} link="/admin/messages" description="Lire et gérer les messages reçus via le formulaire de contact." notificationCount={newMessages} />
                            <DashboardCard title="Demandes de Récupération" icon={ExclamationTriangleIcon} link="/admin/recovery-requests" description="Traiter les demandes de coordonnées oubliées." notificationCount={newRecoveryRequests} />
                          </TabContent>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabContent: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h2 className="text-xl font-bold text-pm-off-white/80 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {children}
        </div>
    </section>
);

const KPI: React.FC<{ label: string; value: number; link: string; }> = ({ label, value, link }) => (
    <Link to={link} className="block bg-black border border-pm-gold/20 rounded-lg p-4 hover:border-pm-gold transition-colors">
        <p className="text-sm text-pm-off-white/70">{label}</p>
        <p className="text-3xl font-playfair text-pm-gold">{value}</p>
    </Link>
);

const QuickAction: React.FC<{ to: string; label: string; }> = ({ to, label }) => (
    <Link to={to} className="px-4 py-2 bg-black border border-pm-gold/30 rounded-full text-sm text-pm-gold hover:bg-pm-gold hover:text-pm-dark transition-colors">
        {label}
    </Link>
);

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <Link to={link} className="relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
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

export default Admin;