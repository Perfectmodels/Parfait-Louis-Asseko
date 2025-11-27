import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInfo {
  isStandalone: boolean;
  isInstallable: boolean;
  supportsInstall: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  isOffline: boolean;
  updateAvailable: boolean;
}

export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isStandalone: false,
    isInstallable: false,
    supportsInstall: false,
    platform: 'unknown',
    isOffline: !navigator.onLine,
    updateAvailable: false
  });

  // Détecter la plateforme
  const detectPlatform = useCallback((): 'ios' | 'android' | 'desktop' | 'unknown' => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/win|mac|linux/.test(userAgent)) {
      return 'desktop';
    }
    
    return 'unknown';
  }, []);

  // Vérifier si l'application est en mode standalone
  const checkStandaloneMode = useCallback(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    
    return isStandalone;
  }, []);

  // Mettre à jour les informations PWA
  const updatePWAInfo = useCallback(() => {
    setPwaInfo(prev => ({
      ...prev,
      isStandalone: checkStandaloneMode(),
      platform: detectPlatform(),
      isOffline: !navigator.onLine,
      isInstallable: !!installPrompt
    }));
  }, [checkStandaloneMode, detectPlatform, installPrompt]);

  // Installer la PWA
  const installPWA = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'installation:', error);
      return false;
    }
  }, [installPrompt]);

  // Afficher les instructions d'installation iOS
  const showIOSInstallInstructions = useCallback((): boolean => {
    const isIOS = detectPlatform() === 'ios';
    const isStandalone = checkStandaloneMode();
    
    if (isIOS && !isStandalone) {
      // Afficher les instructions pour iOS
      const message = `Pour installer Perfect Models sur votre iPhone/iPad:
1. Appuyez sur l'icône "Partager" 
2. Faites défiler vers le bas et appuyez sur "Sur l'écran d'accueil"
3. Appuyez sur "Ajouter" pour installer l'application`;
      
      alert(message);
      return true;
    }
    
    return false;
  }, [detectPlatform, checkStandaloneMode]);

  // Gérer les notifications push
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: 'https://i.ibb.co/NdrpzGpm/blob.jpg',
        badge: 'https://i.ibb.co/NdrpzGpm/blob.jpg',
        ...options
      });
    }
  }, []);

  // Gérer la synchronisation en arrière-plan
  const syncData = useCallback(async () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      return registration.sync.register('background-sync');
    }
    return false;
  }, []);

  // Effacer le cache
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      return true;
    }
    return false;
  }, []);

  // Vérifier les mises à jour
  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      // Envoyer un message au service worker pour vérifier les mises à jour
      registration.active?.postMessage({ type: 'CHECK_UPDATES' });
      
      return true;
    }
    return false;
  }, []);

  // Effet pour l'initialisation
  useEffect(() => {
    // Détecter l'événement d'installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setPwaInfo(prev => ({
        ...prev,
        isInstallable: true,
        supportsInstall: true
      }));
    };

    // Écouter les changements de connexion
    const handleOnline = () => {
      setPwaInfo(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setPwaInfo(prev => ({ ...prev, isOffline: true }));
    };

    // Écouter les changements de mode d'affichage
    const handleDisplayModeChange = () => {
      updatePWAInfo();
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    // Initialiser les informations PWA
    updatePWAInfo();

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, [updatePWAInfo]);

  return {
    pwaInfo,
    installPWA,
    showIOSInstallInstructions,
    requestNotificationPermission,
    showNotification,
    syncData,
    clearCache,
    checkForUpdates,
    updatePWAInfo
  };
};
