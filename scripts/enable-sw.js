import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('✅ Réactivation du Service Worker...');

// Renommer le Service Worker pour le réactiver
const swPath = path.join(__dirname, '../public/sw.js');
const swDisabledPath = path.join(__dirname, '../public/sw.js.disabled');

if (fs.existsSync(swDisabledPath)) {
  if (fs.existsSync(swPath)) {
    fs.unlinkSync(swPath);
  }
  fs.renameSync(swDisabledPath, swPath);
  console.log('✅ Service Worker réactivé');
} else if (fs.existsSync(swPath)) {
  console.log('ℹ️  Service Worker déjà activé');
} else {
  console.log('❌ Fichier Service Worker désactivé non trouvé');
}

console.log('💡 Redémarrez le serveur de développement.');
