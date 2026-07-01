import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';
import { saveAdminFcmToken, removeAdminFcmToken } from './adminNotify';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
const FCM_TOKEN_KEY = 'pmm_fcm_token';

/**
 * Identifiant unique et stable pour cet appareil/navigateur.
 * Stocké dans localStorage pour persister entre les sessions.
 */
export function getDeviceId(): string {
  let id = localStorage.getItem('pmm_device_id');
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('pmm_device_id', id);
  }
  return id;
}

/** Retourne le token FCM mis en cache dans localStorage */
export function getCachedFcmToken(): string | null {
  return localStorage.getItem(FCM_TOKEN_KEY);
}

/**
 * Demande la permission, obtient le token FCM, le persiste en localStorage
 * et le sauvegarde dans Firebase pour que l'admin reçoive les notifs.
 * Uniquement appelé quand l'utilisateur est admin.
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
      await saveAdminFcmToken(token, getDeviceId());
      console.log('[FCM] Token obtenu et sauvegardé:', token);
    }

    return token;
  } catch (err) {
    console.error('[FCM] Erreur token:', err);
    return null;
  }
}

/**
 * Restaure la session FCM admin depuis localStorage sans redemander la permission.
 * À appeler au démarrage de l'app si l'admin est connecté et la permission déjà accordée.
 */
export async function restoreFcmSession(): Promise<string | null> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;

  const deviceId = getDeviceId();

  const cached = getCachedFcmToken();
  if (cached) {
    // Resync le token dans Firebase (au cas où il aurait été effacé)
    await saveAdminFcmToken(cached, deviceId).catch(() => {});
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
      await saveAdminFcmToken(token, deviceId).catch(() => {});
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
