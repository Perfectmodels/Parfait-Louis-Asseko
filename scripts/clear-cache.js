import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage du cache PWA...');

// Supprimer le dossier dist
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✅ Dossier dist supprimé');
}

// Supprimer le dossier .vite
const viteDir = path.join(__dirname, '../node_modules/.vite');
if (fs.existsSync(viteDir)) {
  fs.rmSync(viteDir, { recursive: true, force: true });
  console.log('✅ Cache Vite supprimé');
}

// Mettre à jour la version du Service Worker
const swPath = path.join(__dirname, '../public/sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Incrémenter la version
  const versionMatch = swContent.match(/pmm-v(\d+)\.(\d+)\.(\d+)/);
  if (versionMatch) {
    const major = parseInt(versionMatch[1]);
    const minor = parseInt(versionMatch[2]);
    const patch = parseInt(versionMatch[3]) + 1;
    const newVersion = `pmm-v${major}.${minor}.${patch}`;
    
    swContent = swContent.replace(/pmm-v\d+\.\d+\.\d+/g, newVersion);
    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Version Service Worker mise à jour: ${newVersion}`);
  }
}

console.log('🎉 Cache nettoyé avec succès !');
console.log('💡 Redémarrez le serveur de développement pour appliquer les changements.');
