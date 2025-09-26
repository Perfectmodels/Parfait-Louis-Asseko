import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ElementType;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  description 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-pm-gold';
    }
  };

  return (
    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-pm-gold">{title}</h3>
        {Icon && <Icon className="w-6 h-6 text-pm-gold" />}
      </div>
      <div className="text-3xl font-bold text-pm-off-white mb-2">{value}</div>
      {change && (
        <div className={`text-sm font-medium ${getChangeColor()}`}>
          {change}
        </div>
      )}
      {description && (
        <p className="text-sm text-pm-off-white/70 mt-2">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
