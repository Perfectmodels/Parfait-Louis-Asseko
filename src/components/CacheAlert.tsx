import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const CacheAlert: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a des problèmes de cache
    const checkCacheIssues = () => {
      // Détecter si la page ne se charge pas correctement
      const hasCacheIssues = localStorage.getItem('pmm_cache_issues') === 'true';
      if (hasCacheIssues) {
        setShowAlert(true);
      }
    };

    checkCacheIssues();

    // Écouter les erreurs de chargement
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Failed to fetch') || 
          event.message.includes('NetworkError') ||
          event.message.includes('ChunkLoadError')) {
        localStorage.setItem('pmm_cache_issues', 'true');
        setShowAlert(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Vider le cache du navigateur
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        // Recharger la page
        window.location.reload();
      });
    } else {
      // Fallback : rechargement simple
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowAlert(false);
    localStorage.removeItem('pmm_cache_issues');
  };

  if (!showAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-500/90 backdrop-blur-sm border border-red-400/30 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-100">
              Problème de chargement détecté
            </h3>
            <p className="text-xs text-red-200 mt-1">
              Les pages ne se chargent pas correctement. Cela peut être dû au cache.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-400/20 text-red-100 text-xs font-semibold rounded-md hover:bg-red-400/30 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Rechargement...' : 'Recharger'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-red-200 text-xs hover:text-red-100"
              >
                Ignorer
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-red-200 hover:text-red-100 flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheAlert;
