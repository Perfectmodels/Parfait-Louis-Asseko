import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon,
    UsersIcon,
    BookOpenIcon,
    NewspaperIcon,
    CalendarDaysIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    BriefcaseIcon,
    EnvelopeIcon,
    ChartBarIcon,
    XMarkIcon,
    PaintBrushIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftRightIcon,
    KeyIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    PresentationChartLineIcon,
    BuildingStorefrontIcon,
    SparklesIcon,
    AcademicCapIcon,
    SignalIcon,
    DocumentTextIcon,
    PhotoIcon,
    GlobeAltIcon,
    CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: {
        casting: number;
        fashionDay: number;
        recovery: number;
        bookings: number;
        messages: number;
    };
}

interface MenuItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    children?: MenuItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, notifications }) => {
    const location = useLocation();

    const menuItems: MenuItem[] = [
        {
            name: 'Tableau de bord',
            href: '/admin',
            icon: HomeIcon,
        },
        {
            name: 'Gestion des Talents',
            href: '#',
            icon: UsersIcon,
            children: [
                { name: 'Mannequins Pro', href: '/admin/models', icon: UsersIcon },
                { name: 'Direction Artistique', href: '/admin/artistic-direction', icon: PaintBrushIcon },
                { name: 'Candidatures Casting', href: '/admin/casting-applications', icon: ClipboardDocumentListIcon, badge: notifications.casting },
                { name: 'Résultats Casting', href: '/admin/casting-results', icon: ClipboardDocumentCheckIcon },
                { name: 'Accès Mannequins', href: '/admin/model-access', icon: KeyIcon },
            ]
        },
        {
            name: 'Gestion du Contenu',
            href: '#',
            icon: NewspaperIcon,
            children: [
                { name: 'Magazine', href: '/admin/magazine', icon: NewspaperIcon },
                { name: 'Actualités', href: '/admin/news', icon: PresentationChartLineIcon },
                { name: 'Contenu Agence', href: '/admin/agency', icon: BuildingStorefrontIcon },
                { name: 'Événements PFD', href: '/admin/fashion-day-events', icon: CalendarDaysIcon },
                { name: 'Commentaires', href: '/admin/comments', icon: ChatBubbleLeftRightIcon },
                { name: 'Classroom Pro', href: '/admin/classroom', icon: BookOpenIcon },
            ]
        },
        {
            name: 'Opérations & Suivi',
            href: '#',
            icon: ChartBarIcon,
            children: [
                { name: 'Comptabilité', href: '/admin/payments', icon: CurrencyDollarIcon },
                { name: 'Absences', href: '/admin/absences', icon: CalendarDaysIcon },
                { name: 'Demandes Booking', href: '/admin/bookings', icon: BriefcaseIcon, badge: notifications.bookings },
                { name: 'Candidatures PFD', href: '/admin/fashion-day-applications', icon: SparklesIcon, badge: notifications.fashionDay },
                { name: 'Suivi Classroom', href: '/admin/classroom-progress', icon: AcademicCapIcon },
                { name: 'Messages Contact', href: '/admin/messages', icon: EnvelopeIcon, badge: notifications.messages },
                { name: 'Récupération', href: '/admin/recovery-requests', icon: ExclamationTriangleIcon, badge: notifications.recovery },
            ]
        },
        {
            name: 'Paramètres',
            href: '/admin/settings',
            icon: Cog6ToothIcon,
        },
    ];

    const isActiveRoute = (href: string) => {
        if (href === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(href);
    };

    const renderMenuItem = (item: MenuItem, level = 0) => {
        const isActive = isActiveRoute(item.href);
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.name} className="space-y-1">
                    <div className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                        level === 0 ? 'text-pm-gold' : 'text-pm-off-white/70'
                    }`}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </div>
                    <div className="ml-6 space-y-1">
                        {item.children.map(child => renderMenuItem(child, level + 1))}
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                        ? 'bg-pm-gold/20 text-pm-gold border-r-2 border-pm-gold'
                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                } ${level > 0 ? 'ml-2' : ''}`}
            >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-pm-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-pm-gold/20">
                    <div className="flex items-center">
                        <h1 className="text-xl font-playfair text-pm-gold font-bold">PMM Admin</h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md text-pm-off-white/70 hover:text-pm-gold"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {menuItems.map(item => renderMenuItem(item))}
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;