import React from 'react';

interface StatusCardProps {
  title: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  value: string | number;
  description?: string;
  icon?: React.ElementType;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  status, 
  value, 
  description, 
  icon: Icon 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'offline':
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      case 'warning':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'error':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-pm-gold border-pm-gold/30 bg-pm-gold/10';
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default StatusCard;
