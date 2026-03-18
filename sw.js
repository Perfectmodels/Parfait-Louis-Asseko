// sw.js

const STATIC_CACHE_NAME = 'pmm-static-v4';
const DYNAMIC_CACHE_NAME = 'pmm-dynamic-v4';

// Assets to pre-cache on install — uniquement les ressources locales fiables
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logopmm.jpg',
  '/logo.svg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Montserrat:wght@300;400;500;700&display=swap'
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
  // Navigation requests (HTML) → always network-first to get fresh index.html
  else if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then(r => r || new Response(null, { status: 503 })))
    );
  }
  else {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          if (networkResponse.type !== 'opaque' && networkResponse.ok) {
            // Clone BEFORE using the response
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
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
