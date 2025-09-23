// Script pour supprimer complètement le Service Worker
console.log('🧹 Suppression du Service Worker...');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length === 0) {
      console.log('✅ Aucun Service Worker trouvé');
      return;
    }
    
    registrations.forEach(registration => {
      registration.unregister().then(success => {
        if (success) {
          console.log('✅ Service Worker supprimé avec succès');
        } else {
          console.log('❌ Échec de la suppression du Service Worker');
        }
      });
    });
  });
} else {
  console.log('ℹ️ Service Worker non supporté par ce navigateur');
}

// Nettoyer le cache
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
      console.log(`✅ Cache ${name} supprimé`);
    });
  });
}

console.log('✅ Nettoyage terminé !');
