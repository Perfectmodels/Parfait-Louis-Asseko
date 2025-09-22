import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BookOpenIcon,
    PhotoIcon,
    AcademicCapIcon,
    SignalIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface ContentManagementNavProps {
    className?: string;
}

const ContentManagementNav: React.FC<ContentManagementNavProps> = ({ className = '' }) => {
    const location = useLocation();

    const contentNavItems = [
        {
            name: "Magazine",
            path: "/admin/magazine",
            icon: BookOpenIcon,
            description: "Gestion du magazine"
        },
        {
            name: "Galerie",
            path: "/admin/gallery",
            icon: PhotoIcon,
            description: "Gestion de la galerie"
        },
        {
            name: "Classroom",
            path: "/admin/classroom",
            icon: AcademicCapIcon,
            description: "Gestion des cours"
        },
        {
            name: "Progrès Classroom",
            path: "/admin/classroom-progress",
            icon: SignalIcon,
            description: "Suivi des progrès"
        },
        {
            name: "Direction Artistique",
            path: "/admin/artistic-direction",
            icon: SparklesIcon,
            description: "Direction artistique"
        }
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className={`bg-black/50 border border-pm-gold/10 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-bold text-pm-gold mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                Contenu & Formation
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {contentNavItems.map((item) => (
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

export default ContentManagementNav;
