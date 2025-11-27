// Service Worker pour Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuration Firebase (doit correspondre à celle dans firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
  authDomain: "perfect-models-management.firebaseapp.com",
  projectId: "perfect-models-management",
  storageBucket: "perfect-models-management.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678",
  measurementId: "G-XXXXXXXXXX"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Cloud Messaging
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan:', payload);

  // Personnaliser la notification
  const notificationTitle = payload.notification?.title || 'Nouvelle notification';
  const notificationOptions = {
    body: payload.notification?.body || 'Vous avez reçu une nouvelle notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'perfect-models-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Voir'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ],
    data: payload.data || {}
  };

  // Afficher la notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer le clic sur les notifications
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification cliquée:', event);

  event.notification.close();

  // Gérer les actions
  if (event.action === 'open') {
    // Ouvrir l'application vers une page spécifique
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        // Si une fenêtre est déjà ouverte, la mettre au premier plan
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Gérer l'installation du service worker
self.addEventListener('install', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker installé');
  event.waitUntil(self.skipWaiting());
});

// Gérer l'activation du service worker
self.addEventListener('activate', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker activé');
  event.waitUntil(self.clients.claim());
});
