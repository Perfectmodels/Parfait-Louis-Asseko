import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des icônes PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// SVG de base pour l'icône PMM
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B8941F;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#111111"/>
  
  <!-- Main circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.35}" fill="url(#goldGradient)" stroke="#D4AF37" stroke-width="${size * 0.02}"/>
  
  <!-- Letter P -->
  <text x="${size/2}" y="${size/2 + size * 0.1}" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" fill="#111111">P</text>
  
  <!-- Decorative elements -->
  <circle cx="${size * 0.25}" cy="${size * 0.25}" r="${size * 0.05}" fill="#D4AF37" opacity="0.6"/>
  <circle cx="${size * 0.75}" cy="${size * 0.25}" r="${size * 0.05}" fill="#D4AF37" opacity="0.6"/>
  <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.05}" fill="#D4AF37" opacity="0.6"/>
  <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.05}" fill="#D4AF37" opacity="0.6"/>
</svg>
`;

// Générer les icônes
iconSizes.forEach(size => {
    const svgContent = createIconSVG(size);
    const iconPath = path.join(iconDir, `icon-${size}x${size}.png`);
    
    // Pour l'instant, on crée des fichiers SVG
    // En production, vous devriez convertir ces SVG en PNG
    const svgPath = path.join(iconDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    
    console.log(`✅ Icône ${size}x${size} générée`);
});

// Créer des icônes spécialisées
const createMessageIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#111111"/>
  <rect x="${size * 0.2}" y="${size * 0.3}" width="${size * 0.6}" height="${size * 0.4}" rx="${size * 0.1}" fill="url(#goldGradient)"/>
  <text x="${size/2}" y="${size/2 + size * 0.05}" font-family="Arial, sans-serif" font-size="${size * 0.3}" text-anchor="middle" fill="#111111">💬</text>
</svg>
`;

const createProfileIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#111111"/>
  <circle cx="${size/2}" cy="${size * 0.4}" r="${size * 0.15}" fill="url(#goldGradient)"/>
  <path d="M${size * 0.3} ${size * 0.7} Q${size/2} ${size * 0.5} ${size * 0.7} ${size * 0.7}" stroke="url(#goldGradient)" stroke-width="${size * 0.05}" fill="none"/>
</svg>
`;

const createCastingIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#111111"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="none" stroke="url(#goldGradient)" stroke-width="${size * 0.05}"/>
  <text x="${size/2}" y="${size/2 + size * 0.05}" font-family="Arial, sans-serif" font-size="${size * 0.25}" text-anchor="middle" fill="#D4AF37">🎭</text>
</svg>
`;

// Générer les icônes spécialisées
const specialIcons = [
    { name: 'message-96x96', svg: createMessageIcon(96) },
    { name: 'profile-96x96', svg: createProfileIcon(96) },
    { name: 'casting-96x96', svg: createCastingIcon(96) }
];

specialIcons.forEach(icon => {
    const iconPath = path.join(iconDir, `${icon.name}.svg`);
    fs.writeFileSync(iconPath, icon.svg);
    console.log(`✅ Icône spécialisée ${icon.name} générée`);
});

console.log('\n🎉 Toutes les icônes PWA ont été générées !');
console.log('📝 Note: En production, convertissez les fichiers SVG en PNG pour de meilleures performances.');
