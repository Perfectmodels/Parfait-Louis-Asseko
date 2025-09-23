import React from 'react';

interface ChangeData {
    value: number;
    type: 'increase' | 'decrease';
    label: string;
}

interface AdminStatsProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow';
    change?: ChangeData;
    loading?: boolean;
    className?: string;
}

const AdminStats: React.FC<AdminStatsProps> = ({
    title,
    value,
    icon: Icon,
    color = 'gold',
    change,
    loading = false,
    className = ""
}) => {
    const colorClasses = {
        gold: {
            bg: 'from-pm-gold/20 to-pm-gold/5',
            icon: 'text-pm-gold',
            border: 'border-pm-gold/30'
        },
        blue: {
            bg: 'from-blue-500/20 to-blue-500/5',
            icon: 'text-blue-400',
            border: 'border-blue-500/30'
        },
        green: {
            bg: 'from-green-500/20 to-green-500/5',
            icon: 'text-green-400',
            border: 'border-green-500/30'
        },
        purple: {
            bg: 'from-purple-500/20 to-purple-500/5',
            icon: 'text-purple-400',
            border: 'border-purple-500/30'
        },
        red: {
            bg: 'from-red-500/20 to-red-500/5',
            icon: 'text-red-400',
            border: 'border-red-500/30'
        },
        orange: {
            bg: 'from-orange-500/20 to-orange-500/5',
            icon: 'text-orange-400',
            border: 'border-orange-500/30'
        },
        yellow: {
            bg: 'from-yellow-500/20 to-yellow-500/5',
            icon: 'text-yellow-400',
            border: 'border-yellow-500/30'
        }
    };

    const currentColor = colorClasses[color];

    if (loading) {
        return (
            <div className={`bg-gradient-to-br ${currentColor.bg} border ${currentColor.border} rounded-xl p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-pm-gold/20 rounded-lg"></div>
                        <div className="w-16 h-4 bg-pm-gold/20 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-24 h-6 bg-pm-gold/20 rounded"></div>
                        <div className="w-32 h-4 bg-pm-gold/20 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-br ${currentColor.bg} border ${currentColor.border} rounded-xl p-6 hover:shadow-lg hover:shadow-pm-gold/10 transition-all duration-300 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${currentColor.bg} border ${currentColor.border}`}>
                    <Icon className={`w-6 h-6 ${currentColor.icon}`} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        change.type === 'increase' ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {change.type === 'increase' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                            </svg>
                        )}
                        <span>{change.value}%</span>
                    </div>
                )}
            </div>

            <div>
                <div className="text-3xl font-bold text-pm-off-white mb-1">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <div className="text-pm-off-white/70 text-sm font-medium">
                    {title}
                </div>
                {change && (
                    <div className="text-xs text-pm-off-white/60 mt-1">
                        {change.label}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStats;
