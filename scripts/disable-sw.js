import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚫 Désactivation temporaire du Service Worker...');

// Renommer le Service Worker pour le désactiver
const swPath = path.join(__dirname, '../public/sw.js');
const swDisabledPath = path.join(__dirname, '../public/sw.js.disabled');

if (fs.existsSync(swPath)) {
  if (fs.existsSync(swDisabledPath)) {
    fs.unlinkSync(swDisabledPath);
  }
  fs.renameSync(swPath, swDisabledPath);
  console.log('✅ Service Worker désactivé (renommé en sw.js.disabled)');
} else if (fs.existsSync(swDisabledPath)) {
  console.log('ℹ️  Service Worker déjà désactivé');
} else {
  console.log('❌ Fichier Service Worker non trouvé');
}

console.log('💡 Redémarrez le serveur de développement.');
console.log('🔄 Pour réactiver le Service Worker, utilisez: npm run enable-sw');
