import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon, ArrowUpRightIcon
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

        const allRecent = [...recentCasting, ...recentBookings, ...recentMessages]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5);
            
        return { newCastingApps, newBookingRequests, newMessages, totalModels, recentActivities: allRecent };
    }, [data]);
    
    const activityIconMap = {
        casting: ClipboardDocumentListIcon,
        booking: BriefcaseIcon,
        message: EnvelopeIcon,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-pm-gold mb-2">Tableau de Bord Administratif</h1>
                <p className="text-pm-off-white/70">Gestion complète de la plateforme Perfect Models Management.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Nouvelles Candidatures" value={stats.newCastingApps} icon={ClipboardDocumentListIcon} />
                <StatCard title="Nouveaux Bookings" value={stats.newBookingRequests} icon={BriefcaseIcon} />
                <StatCard title="Nouveaux Messages" value={stats.newMessages} icon={EnvelopeIcon} />
                <StatCard title="Total Mannequins" value={stats.totalModels} icon={UsersIcon} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="lg:col-span-2">
                    {/* Contenu principal sans navigation supplémentaire */}
                </main>

                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-pm-gold flex items-center gap-2 mb-4">
                            <SignalIcon className="w-5 h-5"/>Activité en Direct
                        </h2>
                        {activeUsers.length > 0 ? (
                            <ul className="space-y-3">
                                {activeUsers.map(user => (
                                    <li key={user.name} className="flex items-center gap-3 bg-pm-dark/50 p-3 rounded-md border-l-2" style={{borderColor: getRoleColor(user.role).match(/border-([a-z]+)-(\d+)/)?.[0].replace('border-','')}}>
                                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                        <div>
                                            <p className="font-semibold text-sm truncate">{user.name}</p>
                                            <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${getRoleColor(user.role)}`}>{getRoleDisplayName(user.role)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-center py-4 text-pm-off-white/60">Aucun utilisateur actif.</p>
                        )}
                    </div>
                    <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-pm-gold flex items-center gap-2 mb-4">Notifications Récentes</h2>
                        {stats.recentActivities.length > 0 ? (
                            <ul className="space-y-3">
                                {stats.recentActivities.map((activity, index) => {
                                    const Icon = activityIconMap[activity.type as keyof typeof activityIconMap];
                                    return (
                                    <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-pm-dark/50">
                                        <Icon className="w-5 h-5 text-pm-gold/80 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm leading-tight">{activity.text}</p>
                                            <p className="text-xs text-pm-off-white/60">{timeAgo(activity.date)}</p>
                                        </div>
                                    </li>
                                )})}
                            </ul>
                        ) : (
                            <p className="text-sm text-center py-4 text-pm-off-white/60">Aucune nouvelle notification.</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; }> = ({ title, value, icon: Icon }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="p-4 bg-black border border-pm-gold/20 rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase text-pm-off-white/70 tracking-wider">{title}</p>
                <Icon className="w-6 h-6 text-pm-gold/50" />
            </div>
            <p className="text-4xl font-bold text-pm-gold mt-2">{value}</p>
        </div>
    </motion.div>
);

export default Admin;
