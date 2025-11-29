// utils/pwa.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          // Optional: Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // Check every hour
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });

    let refreshing: boolean;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}
