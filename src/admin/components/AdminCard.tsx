import React from 'react';
import { Link } from 'react-router-dom';

interface AdminCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    notificationCount?: number;
    onClick?: () => void;
    className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
    title, 
    description, 
    icon: Icon, 
    link, 
    notificationCount,
    onClick,
    className = ""
}) => {
    const cardContent = (
        <div className={`relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10 ${className}`}>
            {notificationCount && notificationCount > 0 && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse-slow">
                    {notificationCount > 99 ? '99+' : notificationCount}
                </span>
            )}
            <Icon className="w-10 h-10 text-pm-gold mb-4" />
            <h3 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">
                {title}
            </h3>
            <p className="text-sm text-pm-off-white/70 leading-relaxed">
                {description}
            </p>
        </div>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="w-full text-left">
                {cardContent}
            </button>
        );
    }

    return (
        <Link to={link}>
            {cardContent}
        </Link>
    );
};

export default AdminCard;