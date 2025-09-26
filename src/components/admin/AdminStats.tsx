import React from 'react';

interface AdminStatsProps {
  children: React.ReactNode;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'indigo';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    label: string;
  };
  className?: string;
}

const AdminStats: React.FC<AdminStatsProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  className = '' 
}) => {
  const colorClasses = {
    gold: 'bg-pm-gold/10 border-pm-gold/30 text-pm-gold',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
  };

  return (
    <div className={`bg-black/50 border rounded-xl p-6 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" />
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm flex items-center gap-1 ${
          change.type === 'increase' ? 'text-green-400' : 'text-red-400'
        }`}>
          <span>{change.type === 'increase' ? '↗' : '↘'}</span>
          <span>{change.value}%</span>
          <span className="opacity-70">{change.label}</span>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
