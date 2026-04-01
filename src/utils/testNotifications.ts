/**
 * testNotifications.ts
 * Utilitaire pour tester les notifications push en développement
 * 
 * Usage dans la console du navigateur:
 * import { testAllNotifications } from './utils/testNotifications';
 * testAllNotifications();
 */

import { notifyAdmin, NotifType } from './adminNotify';

/**
 * Teste un type de notification spécifique
 */
export async function testNotification(type: NotifType, customMessage?: string): Promise<void> {
  const messages: Record<NotifType, string> = {
    visit: 'Test User (Mannequin) vient de se connecter',
    casting: 'Marie Dupont — Libreville',
    contact: 'Jean Martin — Demande d\'information',
    booking: 'Société ABC — Marie Dupont',
    fashionday: 'Sophie Laurent — Styliste',
  };

  const message = customMessage || messages[type];
  
  console.log(`🔔 Test notification [${type}]: ${message}`);
  
  try {
    await notifyAdmin(type, message);
    console.log('✅ Notification envoyée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error);
  }
}

/**
 * Teste tous les types de notifications
 */
export async function testAllNotifications(): Promise<void> {
  console.log('🧪 Test de toutes les notifications...\n');
  
  const types: NotifType[] = ['visit', 'casting', 'contact', 'booking', 'fashionday'];
  
  for (const type of types) {
    await testNotification(type);
    // Délai de 2 secondes entre chaque notification
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ Tous les tests terminés');
}

/**
 * Vérifie la configuration des notifications
 */
export function checkNotificationConfig(): void {
  console.log('🔍 Vérification de la configuration...\n');
  
  const checks = [
    {
      name: 'Support navigateur',
      test: () => 'Notification' in window && 'serviceWorker' in navigator,
      fix: 'Utilisez un navigateur moderne (Chrome, Firefox, Edge)',
    },
    {
      name: 'Permission notifications',
      test: () => Notification.permission === 'granted',
      fix: 'Cliquez sur l\'icône 🔔 dans le header admin pour activer',
    },
    {
      name: 'Clé serveur FCM',
      test: () => !!import.meta.env.VITE_FCM_SERVER_KEY,
      fix: 'Ajoutez VITE_FCM_SERVER_KEY dans votre fichier .env',
    },
    {
      name: 'Clé VAPID',
      test: () => !!import.meta.env.VITE_FIREBASE_VAPID_KEY,
      fix: 'Ajoutez VITE_FIREBASE_VAPID_KEY dans votre fichier .env',
    },
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.test();
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
    if (!passed) {
      console.log(`   → ${check.fix}`);
      allPassed = false;
    }
  });
  
  console.log('\n' + (allPassed 
    ? '✅ Configuration complète' 
    : '⚠️ Configuration incomplète - voir les corrections ci-dessus'
  ));
}

/**
 * Affiche les informations de debug
 */
export function debugNotifications(): void {
  console.log('🐛 Informations de debug\n');
  
  console.log('Environment:');
  console.log('  - FCM Server Key:', import.meta.env.VITE_FCM_SERVER_KEY ? '✅ Configurée' : '❌ Manquante');
  console.log('  - VAPID Key:', import.meta.env.VITE_FIREBASE_VAPID_KEY ? '✅ Configurée' : '❌ Manquante');
  
  console.log('\nNavigateur:');
  console.log('  - Support Notification:', 'Notification' in window ? '✅' : '❌');
  console.log('  - Support Service Worker:', 'serviceWorker' in navigator ? '✅' : '❌');
  console.log('  - Permission:', Notification.permission);
  
  console.log('\nToken FCM:');
  const token = localStorage.getItem('pmm_fcm_token');
  console.log('  - Token local:', token ? `✅ ${token.substring(0, 20)}...` : '❌ Aucun');
  
  console.log('\nService Worker:');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`  - Registrations actives: ${registrations.length}`);
      registrations.forEach((reg, i) => {
        console.log(`    ${i + 1}. ${reg.active?.scriptURL || 'N/A'}`);
      });
    });
  }
}

// Expose les fonctions dans window pour un accès facile depuis la console
if (typeof window !== 'undefined') {
  (window as any).testNotifications = {
    test: testNotification,
    testAll: testAllNotifications,
    check: checkNotificationConfig,
    debug: debugNotifications,
  };
  
  console.log('💡 Utilitaires de test disponibles:');
  console.log('  - window.testNotifications.check()    → Vérifier la config');
  console.log('  - window.testNotifications.debug()    → Infos de debug');
  console.log('  - window.testNotifications.test(type) → Tester un type');
  console.log('  - window.testNotifications.testAll()  → Tester tous les types');
}
