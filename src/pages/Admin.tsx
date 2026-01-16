import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon, ArrowUpRightIcon, StarIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';

interface ActiveUser {
    name: string;
    role: string;
    loginTime: number;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Administrateur';
        case 'student': return 'Mannequin Pro';
        // FIX: Removed 'beginner' role as feature is deprecated.
        case 'jury': return 'Jury';
        case 'registration': return 'Enregistrement';
        default: return role;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'student': return 'bg-pm-gold/20 text-pm-gold border-pm-gold/30';
        // FIX: Removed 'beginner' role color as feature is deprecated.
        case 'jury': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'registration': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
}

const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
    interval = seconds / 2592000;
    if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
    interval = seconds / 86400;
    if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
    interval = seconds / 3600;
    if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
    interval = seconds / 60;
    if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
    return "à l'instant";
};


const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
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
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Admin Dashboard" noIndex />

            <div className="space-y-10">
                {/* --- Welcome Header --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-pm-gold/5 blur-3xl rounded-full -z-10"></div>
                    <div>
                        <p className="text-pm-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2">Centre de Contrôle</p>
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">
                            Bonjour, <span className="text-pm-gold">Parfait Asseko</span>
                        </h1>
                        <p className="text-pm-off-white/50 text-sm mt-2 flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4" />
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                            Voir le Site
                        </Link>
                        <button onClick={handleLogout} className="px-6 py-3 bg-red-600/20 hover:bg-red-600 text-red-100 border border-red-600/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                            <ArrowRightOnRectangleIcon className="w-4 h-4" /> Déconnexion
                        </button>
                    </div>
                </header>

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

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; link: string; isNew?: boolean; color: string; }> = ({ title, value, icon: Icon, link, isNew, color }) => {
    const colorSchemes: Record<string, string> = {
        gold: 'from-pm-gold/10 hover:from-pm-gold/20 border-pm-gold/20 text-pm-gold',
        blue: 'from-blue-600/10 hover:from-blue-600/20 border-blue-600/20 text-blue-400',
        purple: 'from-purple-600/10 hover:from-purple-600/20 border-purple-600/20 text-purple-400',
        gray: 'from-white/5 hover:from-white/10 border-white/10 text-pm-off-white/60',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to={link} className={`block p-6 bg-gradient-to-br ${colorSchemes[color]} border rounded-3xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-black/40 rounded-2xl group-hover:bg-pm-dark transition-colors border border-white/5">
                        <Icon className="w-6 h-6" />
                    </div>
                    {isNew && (
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full animate-bounce shadow-xl">
                            Nouveau
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-pm-off-white/40">{title}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 transform rotate-12 transition-transform group-hover:scale-110 duration-700">
                    <Icon className="w-20 h-20" />
                </div>
            </Link>
        </motion.div>
    );
};

const DashboardCard: React.FC<{ title: string; icon: React.ElementType; link: string; description: string; }> = ({ title, icon: Icon, link, description }) => (
    <Link to={link} className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        <div className="flex justify-between items-start">
            <Icon className="w-8 h-8 text-pm-gold mb-4 transition-transform group-hover:scale-110" />
            <ArrowUpRightIcon className="w-5 h-5 text-pm-off-white/40 transition-all duration-300 group-hover:text-pm-gold group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <h3 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h3>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;
