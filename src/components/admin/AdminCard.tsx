import React from 'react';
import { Link } from 'react-router-dom';

interface AdminCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    href?: string;
    onClick?: () => void;
    color?: 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'indigo' | 'teal' | 'gray' | 'pink';
    notificationCount?: number;
    disabled?: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({
    title,
    description,
    icon: Icon,
    href,
    onClick,
    color = 'gold',
    notificationCount = 0,
    disabled = false
}) => {
    const colorClasses = {
        gold: 'from-pm-gold to-yellow-400 hover:from-yellow-400 hover:to-pm-gold',
        blue: 'from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500',
        green: 'from-green-500 to-green-400 hover:from-green-400 hover:to-green-500',
        purple: 'from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500',
        red: 'from-red-500 to-red-400 hover:from-red-400 hover:to-red-500',
        orange: 'from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500',
        yellow: 'from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500',
        indigo: 'from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500',
        teal: 'from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500',
        gray: 'from-gray-500 to-gray-400 hover:from-gray-400 hover:to-gray-500',
        pink: 'from-pink-500 to-pink-400 hover:from-pink-400 hover:to-pink-500'
    };


    const cardContent = (
        <div className={`group relative bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-6 transition-all duration-300 hover:border-pm-gold/40 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/25 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {/* Notification Badge */}
            {notificationCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {notificationCount > 99 ? '99+' : notificationCount}
                </div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${color === 'gold' ? 'text-pm-dark' : 'text-white'}`} />
            </div>

            {/* Content */}
            <div>
                <h3 className="text-xl font-playfair text-pm-gold mb-2 group-hover:text-white transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-pm-off-white/70 text-sm leading-relaxed group-hover:text-pm-off-white/90 transition-colors duration-300">
                    {description}
                </p>
            </div>

            {/* Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );

    if (disabled) {
        return cardContent;
    }

    if (href) {
        return (
            <Link to={href} className="block">
                {cardContent}
            </Link>
        );
    }

    if (onClick) {
        return (
            <div onClick={onClick}>
                {cardContent}
            </div>
        );
    }

    return cardContent;
};

export default AdminCard;
