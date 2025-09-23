const CACHE_NAME = 'pmm-v1';
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
  if (event.request.method !== 'GET' || (!event.request.url.startsWith('http:') && !event.request.url.startsWith('https:'))) {
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
        if (response) {
          return response;
        }
        
        // Only fetch if it's a safe request and not a development server request
        if ((event.request.url.startsWith('http:') || event.request.url.startsWith('https:')) && 
            !event.request.url.includes('localhost') && 
            !event.request.url.includes('127.0.0.1')) {
          return fetch(event.request).then((networkResponse) => {
            // Check if we received a valid response
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((error) => {
            console.log('SW fetch failed:', error);
            // Return a fallback response if fetch fails
            return new Response('Network error', { status: 408, statusText: 'Request Timeout' });
          });
        }
        
        // Return a fallback for non-HTTP requests
        return new Response('Invalid request', { status: 400, statusText: 'Bad Request' });
      });
    })
  );
});
