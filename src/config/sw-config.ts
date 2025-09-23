// Configuration du Service Worker
export const SW_CONFIG = {
  // Désactiver le SW en développement
  enabled: import.meta.env.PROD,
  
  // Nom du fichier SW
  filename: '/sw.js',
  
  // Options de registration
  registrationOptions: {
    scope: '/',
    updateViaCache: 'none'
  }
};

// Fonction pour désactiver le SW
export const disableServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✅ Service Worker désactivé:', registration.scope);
      }
      
      // Nettoyer les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
        console.log('✅ Caches nettoyés');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la désactivation du SW:', error);
    }
  }
};

// Fonction pour activer le SW
export const enableServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && SW_CONFIG.enabled) {
    try {
      const registration = await navigator.serviceWorker.register(
        SW_CONFIG.filename,
        SW_CONFIG.registrationOptions
      );
      console.log('✅ Service Worker activé:', registration);
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation du SW:', error);
    }
  }
};
