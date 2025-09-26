// Configuration du Service Worker
export const disableServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Worker désactivé');
    } catch (error) {
      console.error('Erreur lors de la désactivation du Service Worker:', error);
    }
  }
};

export const enableServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker activé');
    } catch (error) {
      console.error('Erreur lors de l\'activation du Service Worker:', error);
    }
  }
};