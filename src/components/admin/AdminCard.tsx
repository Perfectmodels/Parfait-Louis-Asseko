import React from 'react';
import { Link } from 'react-router-dom';

interface AdminCardProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
  href?: string;
  description?: string;
  color?: 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'indigo';
  notificationCount?: number;
  onClick?: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  children, 
  className = '', 
  icon: Icon,
  href,
  description,
  color = 'gold',
  notificationCount,
  onClick
}) => {
  const colorClasses = {
    gold: 'border-pm-gold/20 hover:border-pm-gold/40 hover:bg-pm-gold/5',
    blue: 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5',
    green: 'border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5',
    purple: 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5',
    red: 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5',
    orange: 'border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5',
    teal: 'border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/5',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5'
  };

  const iconColorClasses = {
    gold: 'text-pm-gold',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    teal: 'text-teal-400',
    indigo: 'text-indigo-400'
  };

  const cardContent = (
    <div 
      className={`bg-black/50 border rounded-xl p-6 transition-all duration-300 group cursor-pointer ${colorClasses[color]} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />}
          <h3 className="text-xl font-playfair text-pm-gold group-hover:text-white transition-colors">{title}</h3>
        </div>
        {notificationCount && notificationCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {notificationCount}
          </span>
        )}
      </div>
      {description && (
        <p className="text-pm-off-white/70 text-sm leading-relaxed group-hover:text-pm-off-white transition-colors">
          {description}
        </p>
      )}
      {children}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default AdminCard;
