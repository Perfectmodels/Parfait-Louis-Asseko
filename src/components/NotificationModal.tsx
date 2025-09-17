import React from 'react';
import { XMarkIcon, BellIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  link?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  notifications,
  onNotificationClick
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
      case 'success':
        return <BellIcon className="w-5 h-5 text-green-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      default:
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-pm-dark border border-pm-gold/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-pm-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pm-gold/20 rounded-full flex items-center justify-center">
                  <BellIcon className="w-6 h-6 text-pm-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pm-gold">{title}</h3>
                  <p className="text-sm text-pm-off-white/60">{notifications.length} notification{notifications.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-pm-gold/10 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-pm-off-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <BellIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-pm-off-white mb-2">Aucune notification</h4>
                  <p className="text-pm-off-white/60">Tout est à jour !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${getNotificationColor(notification.type)} hover:bg-pm-gold/5 transition-all duration-200 cursor-pointer group`}
                      onClick={() => onNotificationClick?.(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-pm-off-white group-hover:text-pm-gold transition-colors">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-pm-off-white/50">
                              {notification.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-pm-off-white/70 leading-relaxed">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <div className="mt-2">
                              <span className="text-xs text-pm-gold font-medium">
                                Cliquez pour voir les détails →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-pm-gold/20 bg-black/20">
              <div className="flex justify-between items-center">
                <p className="text-sm text-pm-off-white/60">
                  Cliquez sur une notification pour plus de détails
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
