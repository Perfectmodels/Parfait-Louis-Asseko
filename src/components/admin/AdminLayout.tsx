import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
    HomeIcon, UsersIcon, CalendarIcon, NewspaperIcon,
    AcademicCapIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
    Bars3Icon, XMarkIcon, CameraIcon, BriefcaseIcon, CurrencyEuroIcon
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = useData();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { icon: HomeIcon, label: "Tableau de bord", path: "/admin" },
        { icon: UsersIcon, label: "Mannequins", path: "/admin/models" },
        { icon: CameraIcon, label: "Casting", path: "/admin/casting-applications" },
        { icon: CalendarIcon, label: "Fashion Day", path: "/admin/fashion-day-applications" },
        { icon: NewspaperIcon, label: "Magazine", path: "/admin/magazine" },
        { icon: AcademicCapIcon, label: "Classroom", path: "/admin/classroom" },
        { icon: BriefcaseIcon, label: "Agence", path: "/admin/agency" },
        { icon: CurrencyEuroIcon, label: "Paiements", path: "/admin/payments" },
        { icon: Cog6ToothIcon, label: "Paramètres", path: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-pm-dark flex font-montserrat text-pm-off-white">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-black border-r border-pm-gold/20 z-50 transition-transform duration-300 transform lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="h-20 flex items-center justify-center border-b border-pm-gold/20">
                    <h1 className="text-2xl font-playfair text-pm-gold font-bold">Admin Panel</h1>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)] scrollbar-hide">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                    isActive
                                    ? 'bg-pm-gold text-pm-dark font-bold'
                                    : 'text-pm-off-white/70 hover:bg-pm-dark hover:text-pm-gold'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors mt-8"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden bg-black border-b border-pm-gold/20 flex items-center justify-between px-6 sticky top-0 z-30">
                    <span className="font-playfair text-pm-gold text-lg">Admin Panel</span>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-pm-gold p-2"
                    >
                        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </header>

                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
