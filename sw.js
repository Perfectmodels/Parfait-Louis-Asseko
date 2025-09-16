const CACHE_NAME = 'pmm-v2';
// Removed cross-origin assets that may cause CORS errors during installation.
// The service worker will attempt to cache other assets at runtime.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
  // Only process GET requests and web protocols. This will ignore chrome-extension:// requests.
  if (event.request.method !== 'GET' || (!event.request.url.startsWith('http:') && !event.request.url.startsWith('https:'))) {
    return;
  }

  // Network-first for navigations to always get the latest index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  
  // Network-first for APIs to ensure data freshness
  if (event.request.url.includes('firebaseio.com')) {
     event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
     );
     return;
  }

  // Cache-first for all other requests (static assets)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response and if the request is for an HTTP/HTTPS scheme
          if (networkResponse && networkResponse.ok && (event.request.url.startsWith('http:') || event.request.url.startsWith('https:'))) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        
        return response || fetchPromise;
      });
    })
  );
});
