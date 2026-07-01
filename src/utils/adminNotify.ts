/**
 * adminNotify.ts
 * Envoie des notifications push à l'admin via FCM Legacy HTTP API.
 * Les tokens FCM admin sont stockés dans Firebase Realtime DB sous /adminFcmTokens/{deviceId}.
 * Plusieurs appareils/onglets peuvent être enregistrés simultanément.
 */
import { ref, get, set, remove } from 'firebase/database';
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

/** Récupère tous les tokens FCM admin depuis Firebase (multi-appareils) */
async function getAdminTokens(): Promise<string[]> {
  try {
    // Support ancien format (clé unique) + nouveau format (map par deviceId)
    const [mapSnap, legacySnap] = await Promise.all([
      get(ref(db, 'adminFcmTokens')),
      get(ref(db, 'adminFcmToken')),
    ]);

    const tokens: string[] = [];

    if (mapSnap.exists()) {
      const map = mapSnap.val() as Record<string, string>;
      tokens.push(...Object.values(map).filter(Boolean));
    }

    // Inclure l'ancien token unique s'il existe et n'est pas déjà dans la map
    const legacy = legacySnap.val() as string | null;
    if (legacy && !tokens.includes(legacy)) {
      tokens.push(legacy);
    }

    return [...new Set(tokens)]; // dédoublonner
  } catch {
    return [];
  }
}

/** Sauvegarde le token FCM admin dans Firebase sous un deviceId unique */
export async function saveAdminFcmToken(token: string, deviceId: string): Promise<void> {
  await set(ref(db, `adminFcmTokens/${deviceId}`), token);
}

/** Supprime un token FCM invalide/expiré */
export async function removeAdminFcmToken(deviceId: string): Promise<void> {
  await remove(ref(db, `adminFcmTokens/${deviceId}`)).catch(() => {});
}

/** Envoie une notification push à tous les appareils admin enregistrés */
export async function notifyAdmin(
  type: NotifType,
  body: string,
  url = '/admin'
): Promise<void> {
  if (!SERVER_KEY) return;

  const tokens = await getAdminTokens();
  if (!tokens.length) return;

  const payload = {
    notification: {
      title: NOTIF_CONFIG[type].title,
      body,
      icon: NOTIF_CONFIG[type].icon,
      click_action: url,
      badge: '/icons/icon-72.webp',
    },
    data: { url, type },
  };

  await Promise.allSettled(
    tokens.map(token =>
      fetch(FCM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${SERVER_KEY}`,
        },
        body: JSON.stringify({ to: token, ...payload }),
      }).catch(() => {})
    )
  );
}
