import React, { useState, useEffect } from 'react';
import { 
    Bars3Icon, 
    BellIcon, 
    ArrowRightOnRectangleIcon,
    SignalIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

interface AdminHeaderProps {
    onMenuClick: () => void;
    onLogout: () => void;
    totalNotifications: number;
}

interface ActiveUser {
    name: string;
    role: string;
    loginTime: number;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Administrateur';
        case 'student': return 'Mannequin Pro';
        case 'beginner': return 'Débutant';
        case 'jury': return 'Jury';
        case 'registration': return 'Enregistrement';
        default: return role;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-500/20 text-red-300';
        case 'student': return 'bg-pm-gold/20 text-pm-gold';
        case 'beginner': return 'bg-blue-500/20 text-blue-300';
        case 'jury': return 'bg-purple-500/20 text-purple-300';
        case 'registration': return 'bg-teal-500/20 text-teal-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, onLogout, totalNotifications }) => {
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [showActiveUsers, setShowActiveUsers] = useState(false);

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

    return (
        <header className="bg-black border-b border-pm-gold/20 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-pm-off-white/70 hover:text-pm-gold"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    
                    <div>
                        <h1 className="text-xl font-semibold text-pm-off-white">
                            Tableau de Bord Administratif
                        </h1>
                        <p className="text-sm text-pm-off-white/60">
                            Gestion complète de Perfect Models Management
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Active users indicator */}
                    <div className="relative">
                        <button
                            onClick={() => setShowActiveUsers(!showActiveUsers)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-pm-dark border border-pm-gold/20 hover:border-pm-gold/40 transition-colors"
                        >
                            <SignalIcon className="h-5 w-5 text-pm-gold" />
                            <span className="text-sm text-pm-off-white">
                                {activeUsers.length} actif{activeUsers.length !== 1 ? 's' : ''}
                            </span>
                            {activeUsers.length > 0 && (
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {/* Active users dropdown */}
                        {showActiveUsers && (
                            <div className="absolute right-0 mt-2 w-80 bg-black border border-pm-gold/20 rounded-lg shadow-xl z-50">
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-pm-gold mb-3">
                                        Utilisateurs actifs (15 dernières minutes)
                                    </h3>
                                    {activeUsers.length > 0 ? (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {activeUsers.map((user, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-2 rounded bg-pm-dark/50">
                                                    <UserIcon className="h-4 w-4 text-pm-gold" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-pm-off-white truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(user.role)}`}>
                                                            {getRoleDisplayName(user.role)}
                                                        </p>
                                                    </div>
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-pm-off-white/60">
                                            Aucun utilisateur actif
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 rounded-lg bg-pm-dark border border-pm-gold/20 hover:border-pm-gold/40 transition-colors">
                            <BellIcon className="h-5 w-5 text-pm-off-white" />
                            {totalNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalNotifications > 99 ? '99+' : totalNotifications}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span className="text-sm">Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Click outside to close active users dropdown */}
            {showActiveUsers && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActiveUsers(false)}
                />
            )}
        </header>
    );
};

export default AdminHeader;