// Script pour nettoyer l'environnement de développement
// Supprime les caches et désactive le service worker

console.log('🧹 Nettoyage de l\'environnement de développement...');

// Désactiver le service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for(let reg of registrations) {
      reg.unregister();
      console.log('✅ Service Worker désactivé');
    }
  });
}

// Nettoyer le localStorage des données de développement
const keysToRemove = ['vite', 'dev', 'debug'];
keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Cache ${key} supprimé`);
  }
});

// Supprimer les caches du navigateur
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
      console.log(`✅ Cache ${name} supprimé`);
    });
  });
}

console.log('✅ Nettoyage terminé !');
