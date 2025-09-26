import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Réparation du cache Vite...');

// Dossiers et fichiers à supprimer
const itemsToDelete = [
  'dist',
  'node_modules/.vite',
  'node_modules/.cache',
  '.vite',
  'coverage',
  '.nyc_output'
];

// Supprimer les dossiers de cache
itemsToDelete.forEach(item => {
  const fullPath = path.join(__dirname, '..', item);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Supprimé: ${item}`);
    } catch (error) {
      console.log(`⚠️  Impossible de supprimer ${item}:`, error.message);
    }
  }
});

// Nettoyer le package-lock.json pour forcer une réinstallation propre
const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  try {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json supprimé');
  } catch (error) {
    console.log('⚠️  Impossible de supprimer package-lock.json:', error.message);
  }
}

// Mettre à jour la configuration Vite pour éviter les problèmes de WebSocket
const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Vérifier si la configuration HMR est présente
  if (!viteConfig.includes('hmr:')) {
    const hmrConfig = `
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      host: 'localhost'
    }
  },`;
    
    // Ajouter la configuration HMR
    viteConfig = viteConfig.replace(
      /server:\s*{[\s\S]*?}/,
      hmrConfig
    );
    
    fs.writeFileSync(viteConfigPath, viteConfig);
    console.log('✅ Configuration Vite mise à jour');
  }
}

console.log('🎉 Cache Vite nettoyé et réparé !');
console.log('💡 Exécutez "npm install" puis "npm run dev" pour redémarrer proprement.');
