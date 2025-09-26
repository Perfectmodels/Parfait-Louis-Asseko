import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚨 Réparation d\'urgence du projet...');

// 1. Arrêter tous les processus Node.js
console.log('🛑 Arrêt des processus Node.js...');
try {
  const { exec } = await import('child_process');
  exec('taskkill /f /im node.exe', (error) => {
    if (error && !error.message.includes('not found')) {
      console.log('⚠️  Impossible d\'arrêter les processus Node.js:', error.message);
    } else {
      console.log('✅ Processus Node.js arrêtés');
    }
  });
} catch (error) {
  console.log('⚠️  Erreur lors de l\'arrêt des processus:', error.message);
}

// 2. Supprimer tous les caches
const cacheItems = [
  'dist',
  'node_modules/.vite',
  'node_modules/.cache',
  '.vite',
  'coverage',
  '.nyc_output',
  'package-lock.json'
];

console.log('🧹 Suppression des caches...');
cacheItems.forEach(item => {
  const fullPath = path.join(__dirname, '..', item);
  if (fs.existsSync(fullPath)) {
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Dossier supprimé: ${item}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Fichier supprimé: ${item}`);
      }
    } catch (error) {
      console.log(`⚠️  Impossible de supprimer ${item}:`, error.message);
    }
  }
});

// 3. Corriger la configuration Vite
console.log('🔧 Correction de la configuration Vite...');
const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Configuration optimisée pour éviter les problèmes de WebSocket
  const optimizedConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      clientPort: 5173
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'react-router-dom']
  }
});`;

  fs.writeFileSync(viteConfigPath, optimizedConfig);
  console.log('✅ Configuration Vite optimisée');
}

// 4. Créer un fichier .env.local pour forcer le port
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = `VITE_PORT=5173
VITE_HOST=localhost
VITE_HMR_PORT=5173`;

fs.writeFileSync(envPath, envContent);
console.log('✅ Fichier .env.local créé');

// 5. Nettoyer le cache du navigateur
console.log('🌐 Instructions pour nettoyer le cache du navigateur:');
console.log('1. Ouvrez les outils de développement (F12)');
console.log('2. Clic droit sur le bouton de rechargement');
console.log('3. Sélectionnez "Vider le cache et recharger de force"');

console.log('🎉 Réparation d\'urgence terminée !');
console.log('💡 Exécutez maintenant: npm install && npm run dev');
