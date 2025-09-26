import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage complet du projet...');

// Fichiers et dossiers à supprimer
const filesToDelete = [
  'dist',
  'node_modules/.vite',
  'node_modules/.cache',
  '.vite',
  'coverage',
  '.nyc_output',
  '*.log',
  '*.tmp',
  '*.temp'
];

// Dossiers à nettoyer
const dirsToClean = [
  'public/icons',
  'src/components/admin'
];

// Supprimer les fichiers et dossiers
filesToDelete.forEach(item => {
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

// Nettoyer les dossiers spécifiques
dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
      const filePath = path.join(fullPath, file);
      try {
        if (fs.statSync(filePath).isFile()) {
          // Garder seulement les fichiers essentiels
          if (!file.includes('icon-') && !file.includes('message-') && !file.includes('profile-') && !file.includes('casting-')) {
            fs.unlinkSync(filePath);
            console.log(`✅ Fichier supprimé: ${dir}/${file}`);
          }
        }
      } catch (error) {
        console.log(`⚠️  Impossible de supprimer ${dir}/${file}:`, error.message);
      }
    });
  }
});

// Mettre à jour le package.json pour supprimer les scripts inutiles
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Scripts à supprimer
  const scriptsToRemove = ['clear-sw'];
  
  scriptsToRemove.forEach(script => {
    if (packageJson.scripts[script]) {
      delete packageJson.scripts[script];
      console.log(`✅ Script supprimé: ${script}`);
    }
  });
  
  // Sauvegarder le package.json nettoyé
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

console.log('🎉 Nettoyage du projet terminé !');
console.log('💡 Redémarrez le serveur de développement pour appliquer les changements.');
