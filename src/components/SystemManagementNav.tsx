import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Cog6ToothIcon,
    UsersIcon,
    ShieldCheckIcon,
    ServerIcon
} from '@heroicons/react/24/outline';

interface SystemManagementNavProps {
    className?: string;
}

const SystemManagementNav: React.FC<SystemManagementNavProps> = ({ className = '' }) => {
    const location = useLocation();

    const systemNavItems = [
        {
            name: "Paramètres",
            path: "/admin/settings",
            icon: Cog6ToothIcon,
            description: "Paramètres généraux"
        },
        {
            name: "Utilisateurs",
            path: "/admin/user-management",
            icon: UsersIcon,
            description: "Gestion des utilisateurs"
        },
        {
            name: "Sécurité",
            path: "/admin/security",
            icon: ShieldCheckIcon,
            description: "Paramètres de sécurité"
        },
        {
            name: "Clés API",
            path: "/admin/api-keys",
            icon: Cog6ToothIcon,
            description: "Configuration API"
        },
        {
            name: "Serveur",
            path: "/admin/server",
            icon: ServerIcon,
            description: "État du serveur"
        },
        {
            name: "Base de Données",
            path: "/admin/database",
            icon: ServerIcon,
            description: "Gestion BDD"
        },
        {
            name: "Test Liens",
            path: "/admin/link-test",
            icon: ShieldCheckIcon,
            description: "Test des liens"
        }
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className={`bg-black/50 border border-pm-gold/10 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-bold text-pm-gold mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                Configuration & Système
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {systemNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                            isActive(item.path)
                                ? 'bg-pm-gold/20 border-pm-gold text-pm-gold'
                                : 'bg-pm-dark border-pm-gold/20 text-pm-off-white hover:bg-pm-gold/10 hover:border-pm-gold/40'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-semibold">{item.name}</span>
                        </div>
                        <p className="text-xs text-pm-off-white/70">{item.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SystemManagementNav;
