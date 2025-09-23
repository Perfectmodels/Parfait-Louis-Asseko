// Script de nettoyage complet pour le développement
const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage complet du projet...');

// Fonction pour supprimer un dossier récursivement
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Dossier supprimé: ${dirPath}`);
  }
}

// Fonction pour supprimer un fichier
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Fichier supprimé: ${filePath}`);
  }
}

try {
  // Supprimer les dossiers de build
  removeDir('dist');
  removeDir('node_modules/.vite');
  removeDir('.vite');
  
  // Supprimer les fichiers de cache
  removeFile('package-lock.json');
  removeFile('yarn.lock');
  removeFile('pnpm-lock.yaml');
  
  // Supprimer les logs
  removeFile('npm-debug.log');
  removeFile('yarn-debug.log');
  removeFile('yarn-error.log');
  
  console.log('✅ Nettoyage terminé !');
  console.log('💡 Vous pouvez maintenant relancer: npm install && npm run dev');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
  process.exit(1);
}
