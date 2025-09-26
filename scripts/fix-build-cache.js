#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🧹 Nettoyage du cache et reconstruction...\n');

// Supprimer les dossiers de cache
const cacheDirs = [
  'dist',
  'node_modules/.vite',
  'node_modules/.cache'
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`🗑️  Suppression de ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Nettoyer le cache npm
console.log('🧹 Nettoyage du cache npm...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Erreur lors du nettoyage du cache npm:', error.message);
}

// Réinstaller les dépendances
console.log('📦 Réinstallation des dépendances...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Erreur lors de l\'installation:', error.message);
}

// Reconstruire le projet
console.log('🔨 Reconstruction du projet...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Reconstruction terminée avec succès!');
} catch (error) {
  console.log('❌ Erreur lors de la reconstruction:', error.message);
  process.exit(1);
}

console.log('\n🎉 Nettoyage et reconstruction terminés!');
console.log('💡 Redémarrez votre serveur de développement si nécessaire.');
