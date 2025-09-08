const CACHE_NAME = 'pmm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500&display=swap',
];

// External assets that might have CORS restrictions
const EXTERNAL_ASSETS = [
  'https://i.ibb.co/fVBxPNTP/T-shirt.png',
  'https://i.ibb.co/K2wS0Pz/hero-bg.jpg'
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching core assets');
      // Only cache local assets that we have control over
      return cache.addAll(ASSETS_TO_CACHE);
    })
    .then(() => {
      // Handle external assets with CORS
      return Promise.all(
        EXTERNAL_ASSETS.map(url => {
          return fetch(url, { mode: 'no-cors' })
            .then(response => {
              if (!response.ok) {
                console.warn(`Failed to cache ${url}:`, response.statusText);
                return Promise.reject('Failed to cache external asset');
              }
              return caches.open(CACHE_NAME).then(cache => cache.put(url, response));
            })
            .catch(err => {
              console.warn(`Error caching ${url}:`, err);
              // Continue even if some external assets fail to cache
              return Promise.resolve();
            });
        })
      );
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
  if (event.request.method !== 'GET') {
    return;
  }
  
  const requestUrl = new URL(event.request.url);
  const isExternalAsset = EXTERNAL_ASSETS.some(url => event.request.url.includes(new URL(url).hostname));
  
  // Network-first for APIs to ensure data freshness
  if (requestUrl.hostname.includes('firebaseio.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // For external assets, try cache first, then network with no-cors
  if (isExternalAsset) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, try to fetch with no-cors
        return fetch(event.request, { mode: 'no-cors' })
          .then(response => {
            // Even if the response is opaque, we can still cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(error => {
            console.warn('Error fetching external asset:', error);
            // Return a fallback response if available
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
      })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        // Don't cache responses with error status codes
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response before putting it in the cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
