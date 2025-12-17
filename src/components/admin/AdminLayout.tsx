import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon, UsersIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    Bars3Icon, XMarkIcon,
    BookOpenIcon,
    PhotoIcon,
    MicrophoneIcon,
    PaperAirplaneIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    BellIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';
import QuickActionsMenu from './QuickActionsMenu';
import { useData } from '../../contexts/DataContext';

interface NavItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        end={to === '/admin'}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                ? 'bg-pm-gold text-pm-dark'
                : 'text-pm-off-white/70 hover:bg-pm-gold/10 hover:text-pm-off-white'
            }`
        }
    >
        <Icon className="w-5 h-5" />
        <span className="truncate">{label}</span>
    </NavLink>
);

const navSections = [
    {
        title: 'Principal',
        links: [
            { to: '/admin', icon: HomeIcon, label: 'Dashboard' },
            { to: '/admin/models', icon: UsersIcon, label: 'Mannequins' },
            { to: '/admin/magazine', icon: NewspaperIcon, label: 'Magazine' },
            { to: '/admin/bookings', icon: BriefcaseIcon, label: 'Bookings' },
        ]
    },
    {
        title: 'Recrutement',
        links: [
            { to: '/admin/casting-applications', icon: ClipboardDocumentListIcon, label: 'Candidatures Casting' },
            { to: '/admin/casting-results', icon: ClipboardDocumentCheckIcon, label: 'Résultats Casting' },
            { to: '/admin/fashion-day-applications', icon: SparklesIcon, label: 'Candidatures PFD' },
        ]
    },
    {
        title: 'Contenu & Site',
        links: [
            { to: '/admin/news', icon: PresentationChartLineIcon, label: 'Actualités' },
            { to: '/admin/agency', icon: BuildingStorefrontIcon, label: 'Page Agence' },
            { to: '/admin/fashion-day-events', icon: CalendarDaysIcon, label: 'Événements PFD' },
            { to: '/admin/fashion-day-reservations', icon: ClipboardDocumentCheckIcon, label: 'Réservations PFD' },
            { to: '/admin/settings', icon: Cog6ToothIcon, label: 'Paramètres du Site' },
        ]
    },
    {
        title: 'Outils IA',
        links: [
            { to: '/admin/generer-image', icon: SparklesIcon, label: 'Générateur d\'Image' },
            { to: '/admin/analyser-image', icon: PhotoIcon, label: 'Analyse d\'Image' },
            { to: '/admin/live-chat', icon: MicrophoneIcon, label: 'Live Chat IA' },
        ]
    },
    {
        title: 'Classroom & Suivi',
        links: [
            { to: '/admin/classroom', icon: BookOpenIcon, label: 'Classroom Pro' },
            { to: '/admin/classroom-progress', icon: AcademicCapIcon, label: 'Suivi Pro' },
            { to: '/admin/model-access', icon: KeyIcon, label: 'Accès Pro' },
            { to: '/admin/absences', icon: CalendarIcon, label: 'Suivi Absences' },
            { to: '/admin/payments', icon: CurrencyDollarIcon, label: 'Comptabilité' },
            { to: '/admin/artistic-direction', icon: PaintBrushIcon, label: 'Direction Artistique' },
        ]
    },
    {
        title: 'Communication',
        links: [
            { to: '/admin/mailing', icon: PaperAirplaneIcon, label: 'Mailing' },
            { to: '/admin/messages', icon: EnvelopeIcon, label: 'Messages de Contact' },
            { to: '/admin/comments', icon: ChatBubbleLeftRightIcon, label: 'Commentaires' },
            { to: '/admin/recovery-requests', icon: ExclamationTriangleIcon, label: 'Demandes de Récupération' },
        ]
    }
];

const Sidebar: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
    <nav className="flex flex-col gap-y-6 pb-10">
        <div className="px-1">
            <NavLink
                to="/"
                onClick={onLinkClick}
                className="flex items-center justify-center gap-2 w-full bg-pm-gold/10 text-pm-gold hover:bg-pm-gold hover:text-black border border-pm-gold/20 hover:border-pm-gold py-3 rounded-md transition-all duration-300 group font-medium text-sm uppercase tracking-wide"
            >
                <GlobeAltIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Voir le Site</span>
            </NavLink>
        </div>

        {navSections.map(section => (
            <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold uppercase text-pm-off-white/50 tracking-wider mb-2">{section.title}</h3>
                <div className="space-y-1">
                    {section.links.map(link => <NavItem key={link.to} {...link} onClick={onLinkClick} />)}
                </div>
            </div>
        ))}
    </nav>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const location = useLocation();
    const { data } = useData();

    // Calculate unread notifications count
    const unreadCount =
        (data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0) +
        (data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0) +
        (data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            // Cmd/Ctrl + N for notifications
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                setNotificationsOpen(true);
            }
            // Cmd/Ctrl + P for quick actions
            if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                e.preventDefault();
                setQuickActionsOpen(true);
            }
            // Escape to close all
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotificationsOpen(false);
                setQuickActionsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white flex">
            {/* Global Search */}
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Notification Center */}
            <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

            {/* Quick Actions Menu */}
            <QuickActionsMenu isOpen={quickActionsOpen} onClose={() => setQuickActionsOpen(false)} />

            {/* --- Sidebar for Desktop --- */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 fixed top-0 left-0 h-full bg-black border-r border-pm-gold/10 p-5">
                <div className="flex items-center gap-3 mb-8">
                    <img src="https://i.ibb.co/fVBxPNTP/T-shirt.png" alt="Logo" className="h-10 w-auto" />
                    <h1 className="font-playfair text-xl text-pm-gold">Admin Panel</h1>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <Sidebar />
                </div>
            </aside>

            {/* --- Mobile Sidebar --- */}
            <div className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/60 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-black border-r border-pm-gold/10 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-5 flex-grow overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-playfair text-xl text-pm-gold">Admin Panel</h1>
                            <button onClick={() => setSidebarOpen(false)} className="text-pm-off-white/70 p-1"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <Sidebar onLinkClick={() => setSidebarOpen(false)} />
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex flex-col flex-1 lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-pm-gold/10 bg-black/80 backdrop-blur-sm px-4">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-pm-off-white/80 lg:hidden">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-pm-gold lg:hidden">
                        {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                    </div>

                    {/* Desktop Header Actions */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
                        <div className="flex-1 max-w-md">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-full flex items-center gap-3 px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg hover:border-pm-gold/40 transition-colors text-pm-off-white/60 hover:text-pm-off-white"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                <span className="flex-1 text-left text-sm">Rechercher...</span>
                                <kbd className="px-2 py-1 bg-black border border-pm-gold/20 rounded text-xs text-pm-gold">⌘K</kbd>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setQuickActionsOpen(true)}
                                className="p-2 hover:bg-pm-gold/10 rounded-lg transition-colors relative group"
                                title="Actions rapides (⌘P)"
                            >
                                <PlusCircleIcon className="w-6 h-6 text-pm-off-white/70 group-hover:text-pm-gold" />
                            </button>

                            <button
                                onClick={() => setNotificationsOpen(true)}
                                className="p-2 hover:bg-pm-gold/10 rounded-lg transition-colors relative group"
                                title="Notifications (⌘N)"
                            >
                                <BellIcon className="w-6 h-6 text-pm-off-white/70 group-hover:text-pm-gold" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Header Actions */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 hover:bg-pm-gold/10 rounded-lg transition-colors"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5 text-pm-off-white/70" />
                        </button>
                        <button
                            onClick={() => setNotificationsOpen(true)}
                            className="p-2 hover:bg-pm-gold/10 rounded-lg transition-colors relative"
                        >
                            <BellIcon className="w-5 h-5 text-pm-off-white/70" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;