import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    UsersIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, BriefcaseIcon, EnvelopeIcon,
    HomeIcon, CurrencyDollarIcon, PaintBrushIcon,
    SignalIcon, ArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

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
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord Administratif</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Nouvelles Candidatures" value={stats.newCastingApps} icon={ClipboardDocumentListIcon} link="/admin/casting-applications" />
                    <StatCard title="Nouveaux Bookings" value={stats.newBookingRequests} icon={BriefcaseIcon} link="/admin/bookings" />
                    <StatCard title="Nouveaux Messages" value={stats.newMessages} icon={EnvelopeIcon} link="/admin/messages" />
                    <StatCard title="Total Mannequins" value={stats.totalModels} icon={UsersIcon} link="/admin/models" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-10">
                        {/* Analytics Dashboard */}
                        <AnalyticsDashboard className="mb-10" />

                        <Section title="Accès Rapides" icon={HomeIcon}>
                            <DashboardCard title="Gérer les Mannequins" icon={UsersIcon} link="/admin/models" description="Ajouter, modifier ou archiver des profils de mannequins." />
                            <DashboardCard title="Gérer le Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Créer et administrer les articles du magazine." />
                            <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Créer et assigner des thèmes de séance photo." />
                            <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Enregistrer et suivre les paiements mensuels." />
                        </Section>
                        <Section title="Gestion du Site" icon={Cog6ToothIcon}>
                            <DashboardCard title="Contenu de l'Agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Mettre à jour les services et la chronologie." />
                            <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
                            <DashboardCard title="Gérer les Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Publier les actualités de la page d'accueil." />
                            <DashboardCard title="Paramètres Généraux" icon={Cog6ToothIcon} link="/admin/settings" description="Modifier les informations de contact, logos et clés API." />
                        </Section>
                    </main>

                    <aside className="lg:col-span-1 space-y-8">
                        <div className="admin-section-wrapper">
                            <h2 className="admin-section-title flex items-center gap-2"><SignalIcon className="w-6 h-6" />Activité en Direct</h2>
                            {activeUsers.length > 0 ? (
                                <ul className="space-y-3">
                                    {activeUsers.map(user => (
                                        <li key={user.name} className="flex items-center gap-3 bg-pm-dark/50 p-2 rounded-md border-l-4" style={{ borderColor: getRoleColor(user.role).match(/border-([a-z]+)-(\d+)/)?.[0].replace('border-', '') }}>
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
                        <div className="admin-section-wrapper">
                            <h2 className="admin-section-title flex items-center gap-2">Notifications Récentes</h2>
                            {stats.recentActivities.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.recentActivities.map((activity, index) => {
                                        const Icon = activityIconMap[activity.type as keyof typeof activityIconMap];
                                        return (
                                            <li key={index}>
                                                <Link to={activity.link} className="flex items-start gap-3 p-2 rounded-md hover:bg-pm-dark/50">
                                                    <Icon className="w-5 h-5 text-pm-gold/80 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm leading-tight">{activity.text}</p>
                                                        <p className="text-xs text-pm-off-white/60">{timeAgo(activity.date)}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <p className="text-sm text-center py-4 text-pm-off-white/60">Aucune nouvelle notification.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; }> = ({ title, icon: Icon, children }) => (
    <section>
        <h2 className="admin-section-title flex items-center gap-3"><Icon className="w-6 h-6" />{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {children}
        </div>
    </section>
);

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; link: string; }> = ({ title, value, icon: Icon, link }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to={link} className="block p-4 bg-black border border-pm-gold/20 rounded-lg hover:bg-pm-dark/50 transition-colors">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase text-pm-off-white/70 tracking-wider">{title}</p>
                <Icon className="w-6 h-6 text-pm-gold/50" />
            </div>
            <p className="text-4xl font-bold text-pm-gold mt-2">{value}</p>
        </Link>
    </motion.div>
);

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
