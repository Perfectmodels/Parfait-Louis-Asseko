import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';

// Récupère depuis Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

/**
 * Demande la permission et retourne le FCM token.
 * Retourne null si refusé ou non supporté.
 */
export async function requestNotificationPermission(): Promise<string | null> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('[FCM] Notifications non supportées sur ce navigateur.');
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
        console.log('[FCM] Token obtenu:', token);
        return token;
    } catch (err) {
        console.error('[FCM] Erreur lors de la récupération du token:', err);
        return null;
    }
}

/**
 * Écoute les messages FCM quand l'app est au premier plan.
 * Retourne une fonction de nettoyage (unsubscribe).
 */
export function onForegroundMessage(
    callback: (payload: { title: string; body: string; icon?: string }) => void
): () => void {
    const unsubscribe = onMessage(messaging as Messaging, (payload) => {
        const title = payload.notification?.title ?? 'PMM';
        const body  = payload.notification?.body  ?? '';
        const icon  = payload.notification?.icon;
        callback({ title, body, icon });
    });
    return unsubscribe;
}
