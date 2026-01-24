// sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
  authDomain: "perfectmodels-4e5fa.firebaseapp.com",
  databaseURL: "https://perfectmodels-4e5fa-default-rtdb.firebaseio.com",
  projectId: "perfectmodels-4e5fa",
  storageBucket: "perfectmodels-4e5fa.firebasestorage.app",
  messagingSenderId: "1072431985374",
  appId: "1:1072431985374:web:55f7a7899d05e68fe5484f",
  measurementId: "G-CSP65WPY89"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const STATIC_CACHE_NAME = 'pmm-static-v3';
const DYNAMIC_CACHE_NAME = 'pmm-dynamic-v3';

// Assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  // Key JS modules from importmap
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react-router-dom@^6.23.1',
  'https://aistudiocdn.com/framer-motion@^12.23.12',
  'https://aistudiocdn.com/firebase@^12.2.1/app',
  'https://aistudiocdn.com/firebase@^12.2.1/database',
  // Core app image
  '/logo.jpg', // Logo
  // Google Fonts CSS
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Strategy 1: Network-first for API calls (Firebase)
  if (url.hostname.includes('firebaseio.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request).then(res => res || new Response(null, { status: 503, statusText: "Service Unavailable" })))
    );
  }
  // Strategy 2: Stale-while-revalidate for images
  else if (/\.(?:png|jpg|jpeg|svg|gif)$/.test(url.pathname) || url.hostname.includes('i.ibb.co') || url.hostname.includes('i.postimg.cc')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request).then(networkResponse => {
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
  // Strategy 3: Cache-first for everything else (App Shell & static assets)
  else {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          if (networkResponse.type !== 'opaque') {
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
