import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  BellSlashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { notificationService } from '../services/notificationService';

interface NotificationManagerProps {
  onNotificationChange?: (isEnabled: boolean) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ onNotificationChange }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    checkPermissionStatus();
  }, []);

  const checkNotificationSupport = () => {
    const supported = notificationService.isSupported();
    setIsSupported(supported);
    
    if (!supported) {
      setShowBanner(true);
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const status = await notificationService.getSubscriptionStatus();
      setPermission(status.permission);
      setIsEnabled(status.isSubscribed);
      onNotificationChange?.(status.isSubscribed);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await notificationService.initialize();
      if (success) {
        setIsEnabled(true);
        setPermission('granted');
        onNotificationChange?.(true);
        setShowBanner(false);
        
        // Envoyer une notification de test
        await notificationService.sendLocalNotification(
          'Notifications activées !',
          {
            body: 'Vous recevrez maintenant les notifications de Perfect Models Management.',
            icon: '/icons/icon-192x192.png'
          }
        );
      } else {
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation des notifications:', error);
      setShowBanner(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await notificationService.unsubscribeFromPush();
      setIsEnabled(false);
      onNotificationChange?.(false);
    } catch (error) {
      console.error('Erreur lors de la désactivation des notifications:', error);
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendLocalNotification(
        'Test de notification',
        {
          body: 'Ceci est une notification de test de Perfect Models Management.',
          icon: '/icons/icon-192x192.png',
          tag: 'test-notification'
        }
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-500">Notifications non supportées</h3>
            <p className="text-xs text-yellow-400">Votre navigateur ne supporte pas les notifications push.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner de demande d'activation */}
      {showBanner && permission !== 'granted' && (
        <div className="bg-pm-gold/10 border border-pm-gold/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <BellIcon className="w-5 h-5 text-pm-gold mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-pm-gold">Activez les notifications</h3>
                <p className="text-xs text-pm-gold/80 mt-1">
                  Recevez des notifications pour les nouveaux messages, castings et événements.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-pm-gold/60 hover:text-pm-gold"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="px-3 py-1.5 bg-pm-gold text-pm-dark text-xs font-semibold rounded-md hover:bg-pm-gold/90 disabled:opacity-50"
            >
              {isLoading ? 'Activation...' : 'Activer'}
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-3 py-1.5 text-pm-gold/80 text-xs hover:text-pm-gold"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* Statut des notifications */}
      <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <BellSlashIcon className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <h3 className="text-sm font-semibold text-pm-off-white">
                Notifications {isEnabled ? 'activées' : 'désactivées'}
              </h3>
              <p className="text-xs text-pm-off-white/70">
                {isEnabled 
                  ? 'Vous recevez les notifications push' 
                  : 'Activez les notifications pour rester informé'
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEnabled ? (
              <>
                <button
                  onClick={handleTestNotification}
                  className="px-3 py-1.5 bg-pm-gold/20 text-pm-gold text-xs font-semibold rounded-md hover:bg-pm-gold/30"
                >
                  Test
                </button>
                <button
                  onClick={handleDisableNotifications}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-md hover:bg-red-500/30"
                >
                  Désactiver
                </button>
              </>
            ) : (
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="px-3 py-1.5 bg-pm-gold text-pm-dark text-xs font-semibold rounded-md hover:bg-pm-gold/90 disabled:opacity-50"
              >
                {isLoading ? 'Activation...' : 'Activer'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Informations sur les permissions */}
      {permission === 'denied' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-sm font-semibold text-red-500">Notifications bloquées</h3>
              <p className="text-xs text-red-400">
                Les notifications sont bloquées dans les paramètres de votre navigateur. 
                Activez-les pour recevoir les mises à jour.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
