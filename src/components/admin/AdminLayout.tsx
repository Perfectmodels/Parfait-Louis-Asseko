import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
    HomeIcon, UsersIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    Bars3Icon, XMarkIcon,
    BookOpenIcon,
    PhotoIcon,
    MicrophoneIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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
            `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                    ? 'bg-pm-gold text-pm-dark shadow-xl shadow-pm-gold/10'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="truncate">{label}</span>
    </NavLink>
);

const navSections = [
    {
        title: 'Core',
        links: [
            { to: '/admin', icon: HomeIcon, label: 'Dashboard' },
            { to: '/admin/models', icon: UsersIcon, label: 'Models' },
            { to: '/admin/magazine', icon: NewspaperIcon, label: 'Magazine' },
            { to: '/admin/bookings', icon: BriefcaseIcon, label: 'Bookings' },
        ]
    },
    {
        title: 'Recruitment',
        links: [
            { to: '/admin/casting-applications', icon: ClipboardDocumentListIcon, label: 'Casting Apps' },
            { to: '/admin/casting-results', icon: ClipboardDocumentCheckIcon, label: 'Grading' },
            { to: '/admin/fashion-day-applications', icon: SparklesIcon, label: 'PFD Apps' },
        ]
    },
    {
        title: 'AI Lab',
        links: [
            { to: '/admin/generer-image', icon: SparklesIcon, label: 'Image Gen' },
            { to: '/admin/analyser-image', icon: PhotoIcon, label: 'Analysis' },
            { to: '/admin/live-chat', icon: MicrophoneIcon, label: 'Voice AI' },
        ]
    },
    {
        title: 'Operations',
        links: [
            { to: '/admin/classroom', icon: BookOpenIcon, label: 'Classroom' },
            { to: '/admin/absences', icon: CalendarIcon, label: 'Attendance'},
            { to: '/admin/payments', icon: CurrencyDollarIcon, label: 'Finance' },
            { to: '/admin/artistic-direction', icon: PaintBrushIcon, label: 'Creative' },
        ]
    },
    {
        title: 'System',
        links: [
            { to: '/admin/mailing', icon: PaperAirplaneIcon, label: 'Mailing' },
            { to: '/admin/settings', icon: Cog6ToothIcon, label: 'Site Config' },
        ]
    }
];

const Sidebar: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
    <nav className="flex flex-col gap-y-10">
        {navSections.map(section => (
            <div key={section.title}>
                <h3 className="px-4 text-[9px] font-black uppercase text-pm-gold/40 tracking-[0.4em] mb-4">{section.title}</h3>
                <div className="space-y-1">
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
        <div className="min-h-screen bg-[#050505] text-pm-off-white flex">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 fixed top-0 left-0 h-full bg-pm-dark border-r border-white/5 p-8 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-4 mb-16 px-4">
                    <img src="https://i.ibb.co/fVBxPNTP/T-shirt.png" alt="Logo" className="h-10 w-auto" />
                    <h1 className="font-playfair text-xl font-black text-white italic">Elite Panel</h1>
                </div>
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)} 
                            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-pm-dark border-r border-white/5 p-8 overflow-y-auto lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-16 px-4">
                                <h1 className="font-playfair text-xl font-black italic">Elite Panel</h1>
                                <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                            </div>
                            <Sidebar onLinkClick={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex flex-col flex-1 lg:pl-72">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-pm-dark/60 backdrop-blur-xl px-6 sm:px-10">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-pm-off-white/80">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold">
                            {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-pm-gold transition-colors">Public Site</Link>
                        <div className="w-8 h-8 rounded-full bg-pm-gold/20 border border-pm-gold/40 flex items-center justify-center text-pm-gold text-[10px] font-bold">AD</div>
                    </div>
                </header>
                <main className="p-6 sm:p-10 lg:p-16">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;