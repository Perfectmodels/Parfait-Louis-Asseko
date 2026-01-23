import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon, UsersIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    Bars3Icon, XMarkIcon,
    BookOpenIcon,
    PhotoIcon,
    MicrophoneIcon,
    PaperAirplaneIcon, // FIX: Added import for PaperAirplaneIcon
    UserIcon,
    SignalIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

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
        icon: HomeIcon,
        links: [
            { to: '/admin', icon: HomeIcon, label: 'Tableau de Bord' },
            { to: '/admin/settings', icon: Cog6ToothIcon, label: 'Paramètres Généraux' },
        ]
    },
    {
        title: 'Gestion Board',
        icon: UserGroupIcon,
        links: [
            { to: '/admin/models', icon: UsersIcon, label: 'Mannequins' },
            { to: '/admin/magazine', icon: NewspaperIcon, label: 'Magazine' },
            { to: '/admin/gallery', icon: PhotoIcon, label: 'Galerie Photos' },
            { to: '/admin/news', icon: PresentationChartLineIcon, label: 'Actualités Site' },
        ]
    },
    {
        title: 'Candidatures & Booking',
        icon: ClipboardDocumentListIcon,
        links: [
            { to: '/admin/casting-applications', icon: ClipboardDocumentListIcon, label: 'Casting (Brut)' },
            { to: '/admin/casting-results', icon: ClipboardDocumentCheckIcon, label: 'Sélections Casting' },
            { to: '/admin/bookings', icon: BriefcaseIcon, label: 'Demandes Booking' },
        ]
    },
    {
        title: 'Perfect Fashion Day',
        icon: SparklesIcon,
        links: [
            { to: '/admin/fashion-day-events', icon: CalendarDaysIcon, label: 'Éditions PFD' },
            { to: '/admin/fashion-day-applications', icon: SparklesIcon, label: 'Candidatures PFD' },
            { to: '/admin/fashion-day-reservations', icon: UserGroupIcon, label: 'Liste des Réservations' },
        ]
    },
    {
        title: 'PMM Classroom',
        icon: AcademicCapIcon,
        links: [
            { to: '/admin/classroom', icon: BookOpenIcon, label: 'Gestion Cours' },
            { to: '/admin/classroom-progress', icon: AcademicCapIcon, label: 'Suivi Étudiants' },
            { to: '/admin/model-access', icon: KeyIcon, label: 'Comptes & Accès' },
            { to: '/admin/absences', icon: CalendarIcon, label: 'Registre Présence' },
            { to: '/admin/payments', icon: CurrencyDollarIcon, label: 'Comptabilité' },
            { to: '/admin/artistic-direction', icon: PaintBrushIcon, label: 'Direction Artistique' },
        ]
    },
    {
        title: 'Communication',
        icon: EnvelopeIcon,
        links: [
            { to: '/admin/messages', icon: EnvelopeIcon, label: 'Messages Contact' },
            { to: '/admin/comments', icon: ChatBubbleLeftRightIcon, label: 'Modération Blog' },
            { to: '/admin/mailing', icon: PaperAirplaneIcon, label: 'Mailing List' },
            { to: '/admin/recovery-requests', icon: ExclamationTriangleIcon, label: 'Récupération' },
        ]
    },
    {
        title: 'Outils Smart AI',
        icon: SignalIcon,
        links: [
            { to: '/admin/generer-image', icon: PaintBrushIcon, label: 'Générateur Image' },
            { to: '/admin/analyser-image', icon: MagnifyingGlassIcon, label: 'Vision IA' },
            { to: '/admin/live-chat', icon: MicrophoneIcon, label: 'Support Vocal IA' },
        ]
    }
];

const Sidebar: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
    <nav className="flex flex-col gap-y-8">
        {navSections.map(section => (
            <div key={section.title} className="group/section">
                <div className="flex items-center gap-2 px-3 mb-3 opacity-40 group-hover/section:opacity-100 transition-opacity">
                    <section.icon className="w-3 h-3 text-pm-gold" />
                    <h3 className="text-[10px] font-black uppercase text-pm-off-white tracking-[0.2em]">{section.title}</h3>
                </div>
                <div className="space-y-0.5 ml-1 border-l border-white/5 pl-2">
                    {section.links.map(link => <NavItem key={link.to} {...link} onClick={onLinkClick} />)}
                </div>
            </div>
        ))}
    </nav>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white flex">
            {/* --- Sidebar for Desktop --- */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 fixed top-0 left-0 h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 p-6 z-50">
                <div className="flex items-center gap-4 mb-10 px-2">
                    <div className="w-10 h-10 bg-pm-gold rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <img src="https://i.ibb.co/fVBxPNT/logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0" />
                    </div>
                    <div>
                        <h1 className="font-playfair text-lg text-white font-bold leading-none">Perfect Models</h1>
                        <p className="text-[10px] text-pm-gold uppercase tracking-[0.2em] font-black mt-1">Plateforme Admin</p>
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow pr-2 -mr-2 scrollbar-hide">
                    <Sidebar />
                </div>

                {/* Sidebar Footer - User Profile */}
                <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center text-pm-gold border border-pm-gold/20">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Administrateur</p>
                            <p className="text-[10px] text-pm-off-white/40 uppercase tracking-widest font-black">Accès Total</p>
                        </div>
                        <Link to="/admin" className="p-2 hover:bg-white/10 rounded-lg text-pm-off-white/40 hover:text-pm-gold transition-all">
                            <Cog6ToothIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* --- Mobile Sidebar --- */}
            <div className={`fixed inset-0 z-[100] flex lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-pm-dark border-r border-pm-gold/10 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 flex-grow overflow-y-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-pm-gold rounded-lg flex items-center justify-center">
                                    <img src="https://i.ibb.co/fVBxPNT/logo.png" alt="Logo" className="w-5 h-5 object-contain brightness-0" />
                                </div>
                                <h1 className="font-playfair text-lg text-pm-gold">Admin Panel</h1>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" className="text-pm-off-white/70 p-1"><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <Sidebar onLinkClick={() => setSidebarOpen(false)} />
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex flex-col flex-1 lg:pl-72">
                <header className="sticky top-0 z-40 lg:hidden flex h-16 items-center gap-x-6 border-b border-white/5 bg-pm-dark/80 backdrop-blur-md px-4">
                    <button onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu" className="p-2 text-pm-off-white/80">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 text-sm font-bold uppercase tracking-widest text-pm-gold">{location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Tableau de bord'}</div>
                </header>
                <main className="flex-1 p-4 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;