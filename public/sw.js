// Service Worker avancé pour Perfect Models Management - PWA Android & iOS
const CACHE_NAME = 'perfect-models-v2';
const STATIC_CACHE = 'perfect-models-static-v2';
const DYNAMIC_CACHE = 'perfect-models-dynamic-v2';
const API_CACHE = 'perfect-models-api-v2';

// Fichiers statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  'https://i.ibb.co/NdrpzGpm/blob.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500;700&display=swap'
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First pour les assets statiques
  static: (request) => {
    return caches.match(request).then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE).then(cache => {
          cache.put(request, responseToCache);
        });
        return response;
      });
    });
  },

  // Network First pour les API
  networkFirst: (request) => {
    return fetch(request).then(response => {
      if (!response || response.status !== 200) {
        return caches.match(request);
      }
      const responseToCache = response.clone();
      caches.open(API_CACHE).then(cache => {
        cache.put(request, responseToCache);
      });
      return response;
    }).catch(() => {
      return caches.match(request);
    });
  },

  // Stale While Revalidate pour le contenu dynamique
  staleWhileRevalidate: (request) => {
    return caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
      return cachedResponse || fetchPromise;
    });
  }
};

// Installation du service worker
self.addEventListener('install', event => {
  console.log('[SW] Installation du service worker v2');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('[SW] Activation du service worker v2');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Gestion des requêtes fetch
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP(S)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie basée sur le type de requête
  let strategy;
  
  if (STATIC_ASSETS.some(asset => request.url.includes(asset)) || 
      url.pathname.includes('/static/') || 
      url.pathname.includes('/assets/')) {
    strategy = CACHE_STRATEGIES.static;
  } else if (url.pathname.includes('/api/') || url.pathname.includes('/firebase/')) {
    strategy = CACHE_STRATEGIES.networkFirst;
  } else {
    strategy = CACHE_STRATEGIES.staleWhileRevalidate;
  }

  event.respondWith(strategy(request));
});

// Gestion des notifications push
self.addEventListener('push', event => {
  console.log('[SW] Notification push reçue:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification de Perfect Models',
    icon: 'https://i.ibb.co/NdrpzGpm/blob.jpg',
    badge: 'https://i.ibb.co/NdrpzGpm/blob.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: 'https://i.ibb.co/NdrpzGpm/blob.jpg'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: 'https://i.ibb.co/NdrpzGpm/blob.jpg'
      }
    ],
    silent: false,
    requireInteraction: true,
    tag: 'perfect-models-notification'
  };

  event.waitUntil(
    self.registration.showNotification('Perfect Models', options)
  );
});

// Gestion du clic sur notification
self.addEventListener('notificationclick', event => {
  console.log('[SW] Clic sur notification:', event);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Fermer la notification
  } else {
    // Action par défaut: ouvrir l'application
    event.waitUntil(
      clients.matchAll().then(clientList => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Gestion de la synchronisation en arrière-plan (pour iOS)
self.addEventListener('sync', event => {
  console.log('[SW] Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Logique de synchronisation des données
      caches.keys().then(cacheNames => {
        console.log('[SW] Nettoyage des caches lors de la synchronisation');
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('perfect-models-')) {
              return caches.open(cacheName).then(cache => {
                return cache.keys().then(requests => {
                  requests.forEach(request => {
                    // Vérifier si les ressources sont toujours valides
                    cache.delete(request);
                  });
                });
              });
            }
          })
        );
      })
    );
  }
});

// Gestion du cycle de vie pour iOS
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Nettoyage périodique du cache (toutes les 24h)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    cleanupCache();
  }
});

function cleanupCache() {
  const MAX_AGE = 24 * 60 * 60 * 1000; // 24 heures
  const now = Date.now();

  caches.keys().then(cacheNames => {
    Promise.all(
      cacheNames.map(cacheName => {
        return caches.open(cacheName).then(cache => {
          return cache.keys().then(requests => {
            return Promise.all(
              requests.map(request => {
                return cache.match(request).then(response => {
                  if (response && response.headers.has('date')) {
                    const responseDate = new Date(response.headers.get('date')).getTime();
                    if (now - responseDate > MAX_AGE) {
                      return cache.delete(request);
                    }
                  }
                });
              })
            );
          });
        });
      })
    );
  });
}

console.log('[SW] Service Worker Perfect Models v2 chargé');
