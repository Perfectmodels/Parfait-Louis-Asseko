import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🖼️  Correction des URLs d\'images...');

// URLs d'images de fallback
const fallbackImages = {
  model: 'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model',
  service: 'https://via.placeholder.com/300x200/1a1a1a/D4AF37?text=Service',
  article: 'https://via.placeholder.com/600x400/1a1a1a/D4AF37?text=Article',
  event: 'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Event'
};

// Lire le fichier de données
const dataPath = path.join(__dirname, '..', 'src', 'constants', 'data.ts');
if (fs.existsSync(dataPath)) {
  let dataContent = fs.readFileSync(dataPath, 'utf8');
  
  // Remplacer les URLs d'images cassées par des placeholders
  const imageReplacements = [
    // Modèles
    { from: /i\.ibb\.co\/[^"']+\.jpg/g, to: fallbackImages.model },
    { from: /i\.ibb\.co\/[^"']+\.png/g, to: fallbackImages.model },
    { from: /i\.ibb\.co\/[^"']+\.jpeg/g, to: fallbackImages.model },
    { from: /i\.ibb\.co\/[^"']+\.webp/g, to: fallbackImages.model },
    
    // Services
    { from: /https:\/\/i\.ibb\.co\/[^"']+\.jpg/g, to: fallbackImages.service },
    { from: /https:\/\/i\.ibb\.co\/[^"']+\.png/g, to: fallbackImages.service },
    
    // Articles
    { from: /imageUrl:\s*"[^"]*i\.ibb\.co[^"]*"/g, to: `imageUrl: "${fallbackImages.article}"` },
    
    // Événements
    { from: /fashionDayBg:\s*"[^"]*i\.ibb\.co[^"]*"/g, to: `fashionDayBg: "${fallbackImages.event}"` }
  ];
  
  let hasChanges = false;
  imageReplacements.forEach(({ from, to }) => {
    const newContent = dataContent.replace(from, to);
    if (newContent !== dataContent) {
      dataContent = newContent;
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(dataPath, dataContent);
    console.log('✅ URLs d\'images corrigées dans data.ts');
  } else {
    console.log('ℹ️  Aucune URL d\'image à corriger trouvée');
  }
} else {
  console.log('❌ Fichier data.ts non trouvé');
}

// Créer des images de fallback locales
const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

// Créer un SVG de fallback pour les modèles
const modelFallbackSvg = `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#1a1a1a"/>
  <circle cx="200" cy="200" r="80" fill="#D4AF37" opacity="0.3"/>
  <rect x="150" y="280" width="100" height="200" fill="#D4AF37" opacity="0.2"/>
  <text x="200" y="550" text-anchor="middle" fill="#D4AF37" font-family="Arial, sans-serif" font-size="24">Model</text>
</svg>`;

fs.writeFileSync(path.join(publicAssetsDir, 'model-fallback.svg'), modelFallbackSvg);
console.log('✅ Image de fallback créée: model-fallback.svg');

console.log('🎉 Correction des images terminée !');
