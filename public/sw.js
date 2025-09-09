const CACHE_NAME = 'pmm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://i.ibb.co/fVBxPNTP/T-shirt.png',
  'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500&display=swap',
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
  // Only process GET requests and web protocols. This will ignore chrome-extension:// requests.
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
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

  // Cache-first for all other requests
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        
        return response || fetchPromise;
      });
    })
  );
});
