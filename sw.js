const CACHE_NAME = 'pmm-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/public/offline.html',
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache, fall back to network, and cache new requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || (!request.url.startsWith('http:') && !request.url.startsWith('https:'))) {
    return;
  }

  const url = new URL(request.url);

  // Network-first for API/data requests
  if (/firebaseio\.com|firestore\.googleapis\.com/.test(url.hostname)) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // App shell routing for SPA: serve index.html for navigation requests within our origin
  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        return (
          cached || fetch('/index.html').then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
            return resp;
          }).catch(() => caches.match('/public/offline.html'))
        );
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok && url.origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => cached || caches.match('/public/offline.html'));
      return cached || fetchPromise;
    })
  );
});
