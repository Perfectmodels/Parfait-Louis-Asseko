import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon, ArrowUpRightIcon, StarIcon, PlusIcon, PaperAirplaneIcon, MagnifyingGlassIcon, MicrophoneIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const stats = useMemo(() => {
        if (!data) return { newCastingApps: 0, newBookingRequests: 0, newMessages: 0, totalModels: 0, recentActivities: [] };

        const newCastingApps = data.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
        const newBookingRequests = data.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
        const newMessages = data.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;
        const newReservations = data.fashionDayReservations?.filter(res => res.status === 'Nouveau').length || 0;
        const totalModels = data.models?.length || 0;

        const recentCasting = (data.castingApplications || [])
            .filter(app => app.status === 'Nouveau')
            .map(app => ({ type: 'casting', text: `Nouvelle candidature de ${app.firstName} ${app.lastName}`, link: '/admin/casting-applications', date: new Date(app.submissionDate) }));

        const recentBookings = (data.bookingRequests || [])
            .filter(req => req.status === 'Nouveau')
            .map(req => ({ type: 'booking', text: `Demande de booking de ${req.clientName}`, link: '/admin/bookings', date: new Date(req.submissionDate) }));

        const recentMessages = (data.contactMessages || [])
            .filter(msg => msg.status === 'Nouveau')
            .map(msg => ({ type: 'message', text: `Nouveau message de ${msg.name}`, link: '/admin/messages', date: new Date(msg.submissionDate) }));

        const recentReservations = (data.fashionDayReservations || [])
            .filter(res => res.status === 'Nouveau')
            .map(res => ({ type: 'reservation', text: `Réservation PFD (${res.guestCount}p) de ${res.name}`, link: '/admin/fashion-day-reservations', date: new Date(res.submissionDate) }));

        const allRecent = [...recentCasting, ...recentBookings, ...recentMessages, ...recentReservations]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10);

        return { newCastingApps, newBookingRequests, newMessages, newReservations, totalModels, recentActivities: allRecent };
    }, [data]);

    const activityIconMap = {
        casting: ClipboardDocumentListIcon,
        booking: BriefcaseIcon,
        message: EnvelopeIcon,
        reservation: StarIcon,
    };

    const quickActions = [
        { label: 'Ajouter Mannequin', icon: PlusIcon, link: '/admin/models', color: 'bg-pm-gold' },
        { label: 'Publier Article', icon: NewspaperIcon, link: '/admin/magazine', color: 'bg-blue-600' },
        { label: 'Mailing List', icon: PaperAirplaneIcon, link: '/admin/mailing', color: 'bg-purple-600' },
        { label: 'Nouvelle Édition PFD', icon: SparklesIcon, link: '/admin/fashion-day-events', color: 'bg-pm-gold' },
    ];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="mb-8">
                    <NotificationTester />
                </div>

                {/* --- Quick Actions Bar --- */}
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} to={action.link} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group">
                                <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-pm-gold transition-colors">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- Stats Grid --- */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Candidatures Casting" value={stats.newCastingApps} icon={ClipboardDocumentListIcon} link="/admin/casting-applications" isNew={stats.newCastingApps > 0} color="gold" />
                        <StatCard title="Demandes Booking" value={stats.newBookingRequests} icon={BriefcaseIcon} link="/admin/bookings" isNew={stats.newBookingRequests > 0} color="blue" />
                        <StatCard title="Réservations PFD" value={stats.newReservations} icon={StarIcon} link="/admin/fashion-day-reservations" isNew={stats.newReservations > 0} color="purple" />
                        <StatCard title="Board Mannequins" value={stats.totalModels} icon={UsersIcon} link="/admin/models" color="gray" />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Recent Activity Feed --- */}
                    <main className="lg:col-span-2">
                        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-3">
                                    <SignalIcon className="w-5 h-5 text-pm-gold" />
                                    Activités Récentes
                                </h2>
                                <span className="text-[10px] font-black uppercase tracking-widest text-pm-off-white/40">Dernières 24h</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {stats.recentActivities.length > 0 ? (
                                    stats.recentActivities.map((activity, index) => {
                                        const Icon = activityIconMap[activity.type as keyof typeof activityIconMap];
                                        return (
                                            <Link key={index} to={activity.link} className="flex items-center gap-6 p-6 hover:bg-white/5 transition-colors group">
                                                <div className="w-12 h-12 rounded-2xl bg-pm-dark/80 border border-white/10 flex items-center justify-center group-hover:border-pm-gold/50 transition-colors">
                                                    <Icon className="w-6 h-6 text-pm-gold" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium group-hover:text-pm-gold transition-colors">{activity.text}</p>
                                                    <p className="text-xs text-pm-off-white/40 mt-1 uppercase tracking-widest font-black">{timeAgo(activity.date)}</p>
                                                </div>
                                                <ArrowUpRightIcon className="w-5 h-5 text-pm-off-white/20 group-hover:text-pm-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-pm-off-white/40 italic">Aucune activité récente à signaler.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-pm-gold/5 text-center">
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-pm-gold hover:text-white transition-colors">
                                    Voir tout l'historique d'activité
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* --- Live Users & System Status --- */}
                    <aside className="space-y-8">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                            <h2 className="text-lg font-bold font-playfair text-white flex items-center gap-3 mb-6">
                                <UserGroupIcon className="w-5 h-5 text-pm-gold" />
                                Utilisateurs Actifs
                            </h2>
                            {activeUsers.length > 0 ? (
                                <ul className="space-y-4">
                                    {activeUsers.map(user => (
                                        <li key={user.name} className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center text-pm-gold border border-pm-gold/20 font-black text-xs uppercase">
                                                    {user.name.substring(0, 2)}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-pm-dark rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${getRoleColor(user.role).split(' ')[1]}`}>
                                                    {getRoleDisplayName(user.role)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 text-pm-off-white/30 text-xs italic">
                                    Aucun autre utilisateur en ligne.
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-pm-gold/20 to-transparent border border-pm-gold/20 rounded-3xl p-8 relative overflow-hidden group">
                            <SparklesIcon className="absolute -right-4 -bottom-4 w-24 h-24 text-pm-gold/5 group-hover:scale-110 transition-transform duration-1000" />
                            <h3 className="text-xl font-playfair font-black text-pm-gold mb-2 uppercase tracking-tighter">Élite Agency</h3>
                            <p className="text-xs text-pm-off-white/60 leading-relaxed font-light">
                                Votre plateforme est à jour et fonctionne sur les serveurs de production.
                                <span className="block mt-2 font-bold text-pm-gold">Version: 2.5.0-gold</span>
                            </p>
                            <div className="mt-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Tous les systèmes sont en ligne</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <Link to={link} className="relative group block bg-black p-8 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-2 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse-slow">
                {notificationCount}
            </span>
        )}
        <Icon className="w-12 h-12 text-pm-gold mb-5" />
        <h2 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">{title}</h2>
        <p className="text-sm text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;

