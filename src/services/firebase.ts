import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useState, useEffect } from 'react';

// Configuration Firebase pour Perfect Models Management
const firebaseConfig = {
  apiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
  authDomain: "perfect-models-management.firebaseapp.com",
  projectId: "perfect-models-management",
  storageBucket: "perfect-models-management.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Service Worker Registration pour FCM
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker Firebase enregistré avec succès:', registration);
      return registration;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker Firebase:', error);
      return null;
    }
  }
  return null;
};

// Obtenir le token FCM pour les notifications push
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // S'assurer que le service worker est enregistré
    await registerServiceWorker();
    
    // Demander la permission pour les notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission de notification refusée');
      return null;
    }

    // Obtenir le token FCM avec la clé VAPID
    const token = await getToken(messaging, {
      vapidKey: 'BEa5rqQ9sPIu6KZ2Pv5nUcv61D8yTI2m8ea_amYTdE2NMPs6kx2cEqkbR5FOgwwae_m6aoCfBm5GcsoeXgolcpk'
    });

    if (token) {
      console.log('Token FCM obtenu:', token);
      return token;
    } else {
      console.log('Aucun token FCM disponible');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token FCM:', error);
    return null;
  }
};

// Écouter les messages entrants
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message reçu en foreground:', payload);
      resolve(payload);
    });
  });
};

// Afficher une notification locale
export const showNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};

// Hook React pour les notifications Firebase
export const useFirebaseMessaging = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier si le navigateur supporte les notifications
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      getFCMToken().then(setToken);
    }
  }, []);

  return { token, isSupported, getFCMToken };
};

export { app, messaging };
