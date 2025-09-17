import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon, EyeIcon } from '@heroicons/react/24/outline';
import NotificationModal from './NotificationModal';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  link?: string;
}

interface InteractiveDashboardCardProps {
  title: string;
  icon: React.ElementType;
  link: string;
  description: string;
  notificationCount?: number;
  notifications?: NotificationItem[];
  stats?: {
    total: number;
    new: number;
    pending: number;
  };
}

const InteractiveDashboardCard: React.FC<InteractiveDashboardCardProps> = ({
  title,
  icon: Icon,
  link,
  description,
  notificationCount = 0,
  notifications = [],
  stats
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const handleCardClick = () => {
    navigate(link);
  };

  const handleNotificationBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notifications.length > 0) {
      setShowNotifications(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative group block bg-black/50 p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-xl shadow-lg hover:shadow-pm-gold/20 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Notification Badge */}
        {notificationCount > 0 && (
          <motion.button
            onClick={handleNotificationBadgeClick}
            className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`${notificationCount} notification${notificationCount > 1 ? 's' : ''} - Cliquez pour voir`}
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </motion.button>
        )}

        {/* Stats Badge */}
        {stats && (
          <div className="absolute top-3 left-3 bg-pm-gold/20 text-pm-gold text-xs font-medium px-2 py-1 rounded-full border border-pm-gold/30">
            {stats.total} total
          </div>
        )}

        {/* Icon */}
        <div className="mb-4">
          <Icon className="w-12 h-12 text-pm-gold group-hover:text-yellow-400 transition-colors" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-pm-off-white/70 leading-relaxed mb-4">
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="font-semibold text-green-400">{stats.new}</div>
              <div className="text-green-300/70">Nouveaux</div>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="font-semibold text-yellow-400">{stats.pending}</div>
              <div className="text-yellow-300/70">En attente</div>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="font-semibold text-blue-400">{stats.total}</div>
              <div className="text-blue-300/70">Total</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-pm-gold font-medium group-hover:text-yellow-400 transition-colors">
            Cliquez pour accéder
          </span>
          {notificationCount > 0 && notifications.length > 0 && (
            <motion.button
              onClick={handleNotificationBadgeClick}
              className="flex items-center gap-1 text-xs text-pm-off-white/60 hover:text-pm-gold transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <EyeIcon className="w-4 h-4" />
              Voir détails
            </motion.button>
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      </motion.div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title={`Notifications - ${title}`}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default InteractiveDashboardCard;
