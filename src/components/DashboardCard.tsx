import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    link: string;
    description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description }) => {
    return (
        <Link 
            to={link}
            className="group bg-pm-dark/50 p-6 rounded-xl border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10"
        >
            <Icon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">
                {title}
            </h3>
            <p className="text-sm text-pm-off-white/70 leading-relaxed">
                {description}
            </p>
        </Link>
    );
};

export default DashboardCard;
