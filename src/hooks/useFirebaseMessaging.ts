import { useState, useEffect } from 'react';
import { getFCMToken, onMessageListener, showNotification } from '../services/firebase';

interface UseFirebaseMessagingReturn {
  token: string | null;
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  subscribeToNotifications: () => Promise<string | null>;
  unsubscribe: () => void;
}

export const useFirebaseMessaging = (): UseFirebaseMessagingReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Vérifier le support du navigateur
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    // Obtenir le statut de permission actuel
    if (supported) {
      setPermissionStatus(Notification.permission);
    }

    // Écouter les messages en foreground
    if (supported) {
      const unsubscribe = onMessageListener().then((payload) => {
        if (payload) {
          const { notification, data } = payload;
          showNotification(
            notification?.title || 'Nouvelle notification',
            {
              body: notification?.body,
              icon: '/favicon.ico',
              data
            }
          );
        }
      });

      return () => {
        unsubscribe.then(unsub => unsub && unsub());
      };
    }
  }, []);

  // Demander la permission pour les notifications
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('Les notifications ne sont pas supportées par ce navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        console.log('Permission de notification accordée');
        return true;
      } else {
        console.log('Permission de notification refusée');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  };

  // S'abonner aux notifications
  const subscribeToNotifications = async (): Promise<string | null> => {
    if (!isSupported) {
      console.log('Les notifications ne sont pas supportées');
      return null;
    }

    if (permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        return null;
      }
    }

    try {
      const fcmToken = await getFCMToken();
      setToken(fcmToken);
      
      if (fcmToken) {
        // Sauvegarder le token dans localStorage pour l'utiliser plus tard
        localStorage.setItem('fcmToken', fcmToken);
        
        // Envoyer le token au backend pour l'enregistrement
        await sendTokenToBackend(fcmToken);
      }
      
      return fcmToken;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error);
      return null;
    }
  };

  // Envoyer le token au backend
  const sendTokenToBackend = async (token: string) => {
    try {
      // Remplacez avec votre endpoint API
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: 'web',
          userAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du token');
      }

      console.log('Token FCM enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du token au backend:', error);
    }
  };

  // Se désabonner
  const unsubscribe = () => {
    localStorage.removeItem('fcmToken');
    setToken(null);
    console.log('Désabonné des notifications');
  };

  return {
    token,
    isSupported,
    permissionStatus,
    requestPermission,
    subscribeToNotifications,
    unsubscribe
  };
};
