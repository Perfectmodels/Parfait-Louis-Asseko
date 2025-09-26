import React, { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface CacheManagerProps {
  onCacheCleared?: () => void;
}

const CacheManager: React.FC<CacheManagerProps> = ({ onCacheCleared }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleared, setLastCleared] = useState<Date | null>(null);

  useEffect(() => {
    // Vérifier si le Service Worker est disponible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker prêt:', registration);
      });
    }
  }, []);

  const clearCache = async () => {
    setIsClearing(true);
    try {
      // Vider le cache du Service Worker
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Cache du Service Worker vidé');
      }

      // Forcer la mise à jour du Service Worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('✅ Service Worker désenregistré');
      }

      // Vider le localStorage (optionnel)
      // localStorage.clear();

      setLastCleared(new Date());
      onCacheCleared?.();

      // Recharger la page après un délai
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const forceRefresh = () => {
    // Forcer le rechargement sans cache
    window.location.reload(true);
  };

  return (
    <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6">
      <h3 className="text-lg font-playfair text-red-400 mb-4 flex items-center gap-2">
        <TrashIcon className="w-5 h-5" />
        Gestion du Cache
      </h3>
      
      <div className="space-y-4">
        <div className="text-sm text-red-400/80">
          <p>Si les pages ne s'affichent pas correctement, nettoyez le cache :</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCache}
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isClearing ? 'animate-spin' : ''}`} />
            {isClearing ? 'Nettoyage...' : 'Vider le Cache'}
          </button>

          <button
            onClick={forceRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Recharger la Page
          </button>
        </div>

        {lastCleared && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircleIcon className="w-4 h-4" />
            Cache vidé le {lastCleared.toLocaleString('fr-FR')}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• <strong>Vider le Cache</strong> : Supprime tous les fichiers mis en cache</p>
          <p>• <strong>Recharger la Page</strong> : Force le rechargement sans utiliser le cache</p>
        </div>
      </div>
    </div>
  );
};

export default CacheManager;
