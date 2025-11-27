import React, { useState, useEffect } from 'react';
import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';

interface NotificationSettings {
  bookingAlerts: boolean;
  newsUpdates: boolean;
  eventReminders: boolean;
  modelUpdates: boolean;
}

const NotificationsManager: React.FC = () => {
  const { 
    token, 
    isSupported, 
    permissionStatus, 
    requestPermission, 
    subscribeToNotifications, 
    unsubscribe 
  } = useFirebaseMessaging();

  const [settings, setSettings] = useState<NotificationSettings>({
    bookingAlerts: true,
    newsUpdates: true,
    eventReminders: true,
    modelUpdates: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    
    try {
      if (token) {
        unsubscribe();
      } else {
        await subscribeToNotifications();
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    
    // Envoyer les préférences au backend
    if (token) {
      updateNotificationPreferences(newSettings);
    }
  };

  const updateNotificationPreferences = async (preferences: NotificationSettings) => {
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          token,
          preferences
        })
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Les notifications push ne sont pas supportées par ce navigateur. 
          Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Gestion des Notifications
      </h3>
      
      {/* Statut des notifications */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Notifications Push
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            permissionStatus === 'granted' 
              ? 'bg-green-100 text-green-800' 
              : permissionStatus === 'denied'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {permissionStatus === 'granted' && 'Activées'}
            {permissionStatus === 'denied' && 'Bloquées'}
            {permissionStatus === 'default' && 'Non configurées'}
          </span>
        </div>
        
        {token && (
          <p className="text-xs text-gray-500 mb-2">
            Token FCM: {token.substring(0, 20)}...
          </p>
        )}
        
        <button
          onClick={handleToggleNotifications}
          disabled={isLoading || permissionStatus === 'denied'}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            token
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'
          }`}
        >
          {isLoading ? 'Chargement...' : token ? 'Désactiver' : 'Activer'} les notifications
        </button>
      </div>

      {/* Préférences de notification */}
      {token && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Types de notifications
          </h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.bookingAlerts}
                onChange={() => handleSettingChange('bookingAlerts')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Alertes de booking</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.newsUpdates}
                onChange={() => handleSettingChange('newsUpdates')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Mises à jour des actualités</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.eventReminders}
                onChange={() => handleSettingChange('eventReminders')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Rappels d'événements</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.modelUpdates}
                onChange={() => handleSettingChange('modelUpdates')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Mises à jour de profil</span>
            </label>
          </div>
        </div>
      )}

      {permissionStatus === 'denied' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            Les notifications sont bloquées. Pour les activer, allez dans les paramètres 
            de votre navigateur et autorisez les notifications pour ce site.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
