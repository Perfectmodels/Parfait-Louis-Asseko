/**
 * Admin Dashboard Page
 * 
 * Page principale du panel administratif de Perfect Models Management.
 * Affiche une vue d'ensemble complète de l'activité de l'agence.
 * 
 * Sections principales:
 * 1. Header avec titre et bouton de déconnexion
 * 2. Cartes de statistiques rapides (4 métriques clés)
 * 3. Dashboard Analytics avec graphiques et tendances
 * 4. Accès rapides aux fonctionnalités principales
 * 5. Gestion du site (contenu, événements, paramètres)
 * 6. Activité en direct (utilisateurs connectés)
 * 7. Notifications récentes (dernières activités)
 * 
 * Fonctionnalités:
 * - Statistiques en temps réel depuis Firebase
 * - Suivi des utilisateurs actifs (15 dernières minutes)
 * - Notifications des nouvelles activités
 * - Navigation rapide vers toutes les sections
 * - Design responsive et moderne
 * 
 * @author Perfect Models Management
 * @version 2.0
 */

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
import { DashboardCalendar } from '../components/admin/DashboardCalendar';

/**
 * Interface pour un utilisateur actif
 */
interface ActiveUser {
    name: string;      // Nom de l'utilisateur
    role: string;      // Rôle (admin, student, jury, registration)
    loginTime: number; // Timestamp de connexion
}

/**
 * Convertit un rôle technique en nom d'affichage français
 * @param role - Rôle technique (admin, student, jury, registration)
 * @returns Nom d'affichage en français
 */
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

/**
 * Retourne les classes Tailwind CSS pour la couleur d'un rôle
 * @param role - Rôle technique
 * @returns Classes CSS pour background, text et border
 */
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

/**
 * Convertit une date en format relatif ("il y a X minutes")
 * @param date - Date à convertir
 * @returns Chaîne de caractères au format relatif
 */
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
            .map(msg => ({ type: 'message', text: `Nouveau message de ${msg.name}`, link: '/admin/messages', date: new Date(msg.timestamp) }));

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
        <div className="bg-pm-dark text-pm-off-white py-12 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-pm-gold/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold mb-2">Espace Administration</h1>
                        <p className="text-pm-off-white/60">Bienvenue sur le panneau de contrôle de Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </header>

                {/* Main Analytics Dashboard Component - Takes center stage */}
                <AnalyticsDashboard className="mb-12" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <main className="lg:col-span-2 space-y-12">
                        {/* New Calendar Widget */}
                        <DashboardCalendar />

                        <Section title="Gestion Principale" icon={HomeIcon}>
                            <DashboardCard title="Mannequins" icon={UsersIcon} link="/admin/models" description="Gérer les profils et castings." highlight />
                            <DashboardCard title="Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Articles et publications." />
                            <DashboardCard title="Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Nouvelles candidatures." notificationCount={stats.newCastingApps} />
                            <DashboardCard title="Bookings" icon={BriefcaseIcon} link="/admin/bookings" description="Demandes de clients." notificationCount={stats.newBookingRequests} />
                        </Section>

                        <Section title="Administration du Site" icon={Cog6ToothIcon}>
                            <DashboardCard title="Agence & Services" icon={BuildingStorefrontIcon} link="/admin/agency" description="Contenu institutionnel." />
                            <DashboardCard title="Perfect Fashion Day" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Événements et billetterie." />
                            <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Briefs créatifs." />
                            <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Suivi financier." />
                            <DashboardCard title="Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="News feed accueil." />
                            <DashboardCard title="Paramètres" icon={Cog6ToothIcon} link="/admin/settings" description="Configuration globale." />
                        </Section>
                    </main>

                    <aside className="lg:col-span-1 space-y-8">
                        {/* Live Activity Feed */}
                        <div className="bg-black/40 border border-pm-gold/20 rounded-xl p-6 shadow-lg backdrop-blur-sm sticky top-8">
                            <h2 className="text-xl font-bold text-pm-gold mb-6 flex items-center gap-3 border-b border-pm-gold/10 pb-4">
                                <SignalIcon className="w-6 h-6 animate-pulse" />
                                En Direct
                            </h2>
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

                        {/* Recent Notifications */}
                        <div className="bg-black/40 border border-pm-gold/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-pm-gold mb-6 flex items-center gap-3 border-b border-pm-gold/10 pb-4">
                                <EnvelopeIcon className="w-6 h-6" />
                                Notifications
                            </h2>
                            {stats.recentActivities.length > 0 ? (
                                <ul className="space-y-4">
                                    {stats.recentActivities.map((activity, index) => {
                                        const Icon = activityIconMap[activity.type as keyof typeof activityIconMap];
                                        return (
                                            <li key={index} className="group">
                                                <Link to={activity.link} className="flex items-start gap-4 p-3 rounded-lg hover:bg-pm-gold/5 transition-colors border border-transparent hover:border-pm-gold/10">
                                                    <div className={`p-2 rounded-full bg-pm-dark border border-pm-gold/20 group-hover:border-pm-gold/50 transition-colors`}>
                                                        <Icon className="w-4 h-4 text-pm-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-pm-off-white leading-snug group-hover:text-pm-gold transition-colors">{activity.text}</p>
                                                        <p className="text-xs text-pm-off-white/50 mt-1">{timeAgo(activity.date)}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <EnvelopeIcon className="w-12 h-12 text-pm-gold/20 mx-auto mb-3" />
                                    <p className="text-sm text-pm-off-white/60">Aucune nouvelle notification.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; }> = ({ title, icon: Icon, children }) => (
    <section className="bg-black/20 rounded-2xl p-8 border border-pm-gold/5">
        <h2 className="text-2xl font-playfair text-pm-gold mb-8 flex items-center gap-3">
            <Icon className="w-7 h-7 text-pm-gold/70" />
            {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {children}
        </div>
    </section>
);

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    highlight?: boolean;
    notificationCount?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, highlight = false, notificationCount = 0 }) => (
    <Link to={link} className={`group relative block bg-black p-6 border transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 ${highlight ? 'border-pm-gold/40 bg-gradient-to-br from-pm-gold/5 to-transparent' : 'border-pm-gold/10 hover:border-pm-gold/30'}`}>
        {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md animate-bounce">
                {notificationCount}
            </span>
        )}
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg transition-colors ${highlight ? 'bg-pm-gold text-black' : 'bg-pm-dark text-pm-gold group-hover:bg-pm-gold group-hover:text-black'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <ArrowUpRightIcon className="w-5 h-5 text-pm-gold/30 group-hover:text-pm-gold transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">{title}</h3>
        <p className="text-sm text-pm-off-white/60 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;
