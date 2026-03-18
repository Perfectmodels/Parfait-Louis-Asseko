import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';
import { saveAdminFcmToken } from './adminNotify';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
const FCM_TOKEN_KEY = 'pmm_fcm_token';

/** Retourne le token FCM mis en cache dans localStorage */
export function getCachedFcmToken(): string | null {
  return localStorage.getItem(FCM_TOKEN_KEY);
}

/**
 * Demande la permission, obtient le token FCM, le persiste en localStorage
 * et le sauvegarde dans Firebase pour que l'admin reçoive les notifs.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.warn('[FCM] Notifications non supportées.');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('[FCM] Permission refusée.');
    return null;
  }

  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging as Messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
      // Sauvegarde dans Firebase pour les notifications admin
      await saveAdminFcmToken(token);
      console.log('[FCM] Token obtenu et sauvegardé:', token);
    }

    return token;
  } catch (err) {
    console.error('[FCM] Erreur token:', err);
    return null;
  }
}

/**
 * Restaure la session FCM depuis localStorage sans redemander la permission.
 * À appeler au démarrage de l'app si la permission est déjà accordée.
 */
export async function restoreFcmSession(): Promise<string | null> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;

  const cached = getCachedFcmToken();
  if (cached) {
    // Resync le token dans Firebase (au cas où il aurait été effacé)
    await saveAdminFcmToken(cached).catch(() => {});
    return cached;
  }

  // Pas de cache → tenter de récupérer silencieusement
  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging as Messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
      await saveAdminFcmToken(token).catch(() => {});
    }
    return token;
  } catch {
    return null;
  }
}

/** Écoute les messages FCM au premier plan. Retourne une fonction de nettoyage. */
export function onForegroundMessage(
  callback: (payload: { title: string; body: string; icon?: string }) => void
): () => void {
  return onMessage(messaging as Messaging, (payload) => {
    callback({
      title: payload.notification?.title ?? 'PMM',
      body: payload.notification?.body ?? '',
      icon: payload.notification?.icon,
    });
  });
}
