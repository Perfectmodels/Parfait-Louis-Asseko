/**
 * adminNotify.ts
 * Envoie des notifications push à l'admin via FCM Legacy HTTP API.
 * Le token FCM admin est stocké dans Firebase Realtime DB sous /adminFcmToken.
 */
import { ref, get, set } from 'firebase/database';
import { db } from '../realtimedbConfig';

const FCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';

// Clé serveur FCM — à mettre dans .env (VITE_FCM_SERVER_KEY)
const SERVER_KEY = import.meta.env.VITE_FCM_SERVER_KEY as string;

export type NotifType =
  | 'visit'
  | 'casting'
  | 'contact'
  | 'booking'
  | 'fashionday';

const NOTIF_CONFIG: Record<NotifType, { title: string; icon: string }> = {
  visit:      { title: '👁️ Nouvelle visite', icon: '/logopmm.jpg' },
  casting:    { title: '🎬 Nouvelle candidature casting', icon: '/logopmm.jpg' },
  contact:    { title: '✉️ Nouveau message de contact', icon: '/logopmm.jpg' },
  booking:    { title: '📅 Nouvelle demande de booking', icon: '/logopmm.jpg' },
  fashionday: { title: '✨ Candidature Perfect Fashion Day', icon: '/logopmm.jpg' },
};

/** Récupère le token FCM admin depuis Firebase */
async function getAdminToken(): Promise<string | null> {
  try {
    const snap = await get(ref(db, 'adminFcmToken'));
    return snap.val() as string | null;
  } catch {
    return null;
  }
}

/** Sauvegarde le token FCM admin dans Firebase */
export async function saveAdminFcmToken(token: string): Promise<void> {
  await set(ref(db, 'adminFcmToken'), token);
}

/** Envoie une notification push à l'admin */
export async function notifyAdmin(
  type: NotifType,
  body: string,
  url = '/admin'
): Promise<void> {
  if (!SERVER_KEY) return; // Pas de clé serveur configurée

  const token = await getAdminToken();
  if (!token) return; // Admin pas encore abonné

  try {
    await fetch(FCM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: NOTIF_CONFIG[type].title,
          body,
          icon: NOTIF_CONFIG[type].icon,
          click_action: url,
        },
        data: { url },
      }),
    });
  } catch (err) {
    console.warn('[adminNotify] Erreur envoi notif:', err);
  }
}
