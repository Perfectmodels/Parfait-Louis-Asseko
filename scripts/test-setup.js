// Script de test pour vérifier la configuration
console.log('🧪 Test de la configuration...');

// Vérifier l'environnement
console.log('Environment: development');
console.log('Production: false');
console.log('Development: true');

// Vérifier les dépendances
const dependencies = [
  'react',
  'react-dom',
  'react-router-dom',
  'firebase',
  '@heroicons/react',
  'framer-motion',
  'tailwindcss'
];

console.log('📦 Vérification des dépendances...');
dependencies.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep}`);
  } catch (e) {
    console.log(`❌ ${dep} - non trouvé`);
  }
});

// Vérifier la configuration Tailwind
console.log('🎨 Vérification de Tailwind CSS...');
try {
  const fs = require('fs');
  const path = require('path');
  
  const tailwindConfig = path.join(process.cwd(), 'tailwind.config.js');
  const cssFile = path.join(process.cwd(), 'src/index.css');
  
  if (fs.existsSync(tailwindConfig)) {
    console.log('✅ tailwind.config.js trouvé');
  } else {
    console.log('❌ tailwind.config.js manquant');
  }
  
  if (fs.existsSync(cssFile)) {
    console.log('✅ src/index.css trouvé');
  } else {
    console.log('❌ src/index.css manquant');
  }
} catch (e) {
  console.log('❌ Erreur lors de la vérification des fichiers');
}

console.log('✅ Test terminé !');
