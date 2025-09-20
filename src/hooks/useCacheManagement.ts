import { useEffect, useState, useCallback } from 'react';

interface CacheStatus {
  isOnline: boolean;
  lastUpdate: number;
  cacheVersion: string;
  needsRefresh: boolean;
}

export const useCacheManagement = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isOnline: navigator.onLine,
    lastUpdate: Date.now(),
    cacheVersion: '1.0.0',
    needsRefresh: false
  });

  // Vérifier la version du cache
  const checkCacheVersion = useCallback(() => {
    const storedVersion = localStorage.getItem('app-cache-version');
    const currentVersion = cacheStatus.cacheVersion;
    
    if (storedVersion !== currentVersion) {
      setCacheStatus(prev => ({ ...prev, needsRefresh: true }));
      return true;
    }
    return false;
  }, [cacheStatus.cacheVersion]);

  // Forcer la mise à jour du cache
  const forceCacheUpdate = useCallback(() => {
    // Vider le cache du navigateur
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Vider le localStorage
    localStorage.clear();
    sessionStorage.clear();

    // Mettre à jour la version du cache
    localStorage.setItem('app-cache-version', cacheStatus.cacheVersion);
    localStorage.setItem('app-last-update', Date.now().toString());

    setCacheStatus(prev => ({ 
      ...prev, 
      needsRefresh: false,
      lastUpdate: Date.now()
    }));

    // Recharger la page
    window.location.reload();
  }, [cacheStatus.cacheVersion]);

  // Vérifier si une mise à jour est nécessaire
  const checkForUpdates = useCallback(() => {
    const lastUpdate = localStorage.getItem('app-last-update');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!lastUpdate || (now - parseInt(lastUpdate)) > oneHour) {
      setCacheStatus(prev => ({ ...prev, needsRefresh: true }));
    }
  }, []);

  // Gérer les événements de connectivité
  useEffect(() => {
    const handleOnline = () => {
      setCacheStatus(prev => ({ ...prev, isOnline: true }));
      checkForUpdates();
    };

    const handleOffline = () => {
      setCacheStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkForUpdates]);

  // Vérifier le cache au chargement
  useEffect(() => {
    checkCacheVersion();
    checkForUpdates();
  }, [checkCacheVersion, checkForUpdates]);

  // Gérer les erreurs de chargement
  const handleLoadError = useCallback((error: Error) => {
    console.error('Load error detected:', error);
    
    // Si c'est une erreur de cache, proposer de vider le cache
    if (error.message.includes('cache') || error.message.includes('CORS')) {
      setCacheStatus(prev => ({ ...prev, needsRefresh: true }));
    }
  }, []);

  // Obtenir des informations sur le cache
  const getCacheInfo = useCallback(() => {
    return {
      ...cacheStatus,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      localStorage: {
        used: JSON.stringify(localStorage).length,
        available: 'unknown'
      },
      sessionStorage: {
        used: JSON.stringify(sessionStorage).length,
        available: 'unknown'
      }
    };
  }, [cacheStatus]);

  return {
    cacheStatus,
    forceCacheUpdate,
    checkForUpdates,
    handleLoadError,
    getCacheInfo,
    needsRefresh: cacheStatus.needsRefresh
  };
};
