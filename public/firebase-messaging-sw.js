// firebase-messaging-sw.js
// Ce fichier DOIT être à la racine du domaine (servi depuis /firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
    authDomain: "perfectmodels-4e5fa.firebaseapp.com",
    databaseURL: "https://perfectmodels-4e5fa-default-rtdb.firebaseio.com",
    projectId: "perfectmodels-4e5fa",
    storageBucket: "perfectmodels-4e5fa.firebasestorage.app",
    messagingSenderId: "1072431985374",
    appId: "1:1072431985374:web:55f7a7899d05e68fe5484f",
});

const messaging = firebase.messaging();

// Compteur de badge persisté dans IndexedDB via Cache API (simple)
const BADGE_STORE = 'pmm-badge-store';
const BADGE_KEY = 'badge-count';

async function getBadgeCount() {
    try {
        const cache = await caches.open(BADGE_STORE);
        const res = await cache.match(BADGE_KEY);
        if (!res) return 0;
        return parseInt(await res.text(), 10) || 0;
    } catch { return 0; }
}

async function setBadgeCount(count) {
    try {
        const cache = await caches.open(BADGE_STORE);
        await cache.put(BADGE_KEY, new Response(String(count)));
    } catch {}
}

async function incrementBadge() {
    const count = (await getBadgeCount()) + 1;
    await setBadgeCount(count);
    if ('setAppBadge' in self.navigator) {
        await self.navigator.setAppBadge(count).catch(() => {});
    }
    return count;
}

async function clearBadge() {
    await setBadgeCount(0);
    if ('clearAppBadge' in self.navigator) {
        await self.navigator.clearAppBadge().catch(() => {});
    }
}

// Gestion des notifications en arrière-plan (app fermée / onglet inactif)
messaging.onBackgroundMessage(async (payload) => {
    console.log('[FCM SW] Message reçu en arrière-plan:', payload);

    const { title = 'PMM', body = '', icon = '/logopmm.jpg' } = payload.notification ?? {};
    const badgeCount = await incrementBadge();

    await self.registration.showNotification(title, {
        body,
        icon,
        badge: '/icons/icon-72.webp',
        data: { ...payload.data, badgeCount },
        tag: payload.data?.type || 'pmm-notif', // regroupe les notifs du même type
        renotify: true,
    });
});

// Clic sur la notification → ouvre/focus l'app et efface le badge
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/admin';

    event.waitUntil(
        clearBadge().then(() =>
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                return clients.openWindow(url);
            })
        )
    );
});

// Message depuis l'app principale pour effacer le badge (ex: admin ouvre le panel)
self.addEventListener('message', (event) => {
    if (event.data?.type === 'CLEAR_BADGE') {
        clearBadge();
    }
});
