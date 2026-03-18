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

// Gestion des notifications en arrière-plan (app fermée / onglet inactif)
messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] Message reçu en arrière-plan:', payload);

    const { title = 'PMM', body = '', icon = '/logo.svg' } = payload.notification ?? {};

    self.registration.showNotification(title, {
        body,
        icon,
        badge: '/logo.svg',
        data: payload.data,
    });
});

// Clic sur la notification → ouvre/focus l'app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/admin';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
