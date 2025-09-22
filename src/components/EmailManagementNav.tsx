import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    EnvelopeIcon,
    ChartBarIcon,
    DocumentTextIcon,
    WrenchScrewdriverIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface EmailManagementNavProps {
    className?: string;
}

const EmailManagementNav: React.FC<EmailManagementNavProps> = ({ className = '' }) => {
    const location = useLocation();

    const emailNavItems = [
        {
            name: "Messages de Contact",
            path: "/admin/messages",
            icon: EnvelopeIcon,
            description: "Gérer les messages reçus"
        },
        {
            name: "Gestion des Emails",
            path: "/admin/email-management",
            icon: ChartBarIcon,
            description: "Logs et statistiques d'emails"
        },
        {
            name: "Modèles d'Emails",
            path: "/admin/email-templates",
            icon: DocumentTextIcon,
            description: "Templates personnalisés"
        },
        {
            name: "Diagnostic Email",
            path: "/admin/email-diagnostic",
            icon: WrenchScrewdriverIcon,
            description: "Test et configuration"
        }
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className={`bg-black/50 border border-pm-gold/10 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-bold text-pm-gold mb-4 flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                Communication & Emails
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {emailNavItems.map((item) => (
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

export default EmailManagementNav;
