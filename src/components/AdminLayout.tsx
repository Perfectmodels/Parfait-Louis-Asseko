import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import { 
    HomeIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    showSearch?: boolean;
    onSearch?: (query: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
    children, 
    title, 
    description, 
    breadcrumbs = [], 
    showSearch = false,
    onSearch 
}) => {
    const { data } = useData();
    const { logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    // Notifications count
    const newCastingApps = (data as any)?.castingApplications?.filter((app: any) => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = (data as any)?.fashionDayApplications?.filter((app: any) => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = (data as any)?.recoveryRequests?.filter((req: any) => req.status === 'Nouveau').length || 0;
    const newBookingRequests = (data as any)?.bookingRequests?.filter((req: any) => req.status === 'Nouveau').length || 0;
    const newMessages = (data as any)?.contactMessages?.filter((msg: any) => msg.status === 'Nouveau').length || 0;
    const totalNotifications = newCastingApps + newFashionDayApps + newRecoveryRequests + newBookingRequests + newMessages;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
            <SEO title={`${title} - Administration`} noIndex />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-pm-gold/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-60 right-20 w-40 h-40 bg-pm-gold/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pm-gold/4 rounded-full blur-2xl animate-pulse delay-2000"></div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-gradient-to-r from-black/95 via-pm-dark/98 to-black/95 backdrop-blur-sm border-b border-pm-gold/20 sticky top-0 z-40">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo et navigation */}
                            <div className="flex items-center gap-6">
                                <Link 
                                    to="/admin" 
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 rounded-xl flex items-center justify-center border border-pm-gold/30 group-hover:scale-105 transition-transform">
                                        <HomeIcon className="w-6 h-6 text-pm-gold" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-playfair text-pm-gold">Admin Panel</h1>
                                        <p className="text-xs text-pm-off-white/60">Perfect Models Management</p>
                                    </div>
                                </Link>

                                {/* Breadcrumbs */}
                                {breadcrumbs.length > 0 && (
                                    <nav className="hidden md:flex items-center space-x-2 text-sm">
                                        <Link to="/admin" className="text-pm-gold hover:text-yellow-300 transition-colors">
                                            Dashboard
                                        </Link>
                                        {breadcrumbs.map((crumb, index) => (
                                            <React.Fragment key={index}>
                                                <span className="text-pm-gold/50">/</span>
                                                {crumb.href ? (
                                                    <Link 
                                                        to={crumb.href} 
                                                        className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
                                                    >
                                                        {crumb.label}
                                                    </Link>
                                                ) : (
                                                    <span className="text-pm-gold">{crumb.label}</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </nav>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                {/* Search */}
                                {showSearch && (
                                    <form onSubmit={handleSearch} className="hidden md:block">
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pm-off-white/50" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Rechercher..."
                                                className="w-64 pl-10 pr-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                                            />
                                        </div>
                                    </form>
                                )}

                                {/* Notifications */}
                                {totalNotifications > 0 && (
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                                            <span className="text-red-400 text-sm font-bold">{totalNotifications}</span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                )}

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-6 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-playfair text-pm-gold mb-2">{title}</h1>
                        {description && (
                            <p className="text-pm-off-white/70 text-lg">{description}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;