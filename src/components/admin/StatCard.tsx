import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon?: React.ReactNode;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    icon,
    className = ""
}) => {
    return (
        <div className={`bg-black/50 border border-pm-gold/20 rounded-xl p-6 hover:shadow-lg hover:shadow-pm-gold/10 transition-all duration-300 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-pm-off-white">{title}</h3>
                {icon && (
                    <div className="p-2 rounded-full bg-pm-gold/20 text-pm-gold">
                        {icon}
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-pm-gold mb-1">{value}</p>
            <p className="text-sm text-pm-off-white/60">{subtitle}</p>
        </div>
    );
};

export default StatCard;
