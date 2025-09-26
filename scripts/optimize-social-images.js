import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script pour optimiser les images pour les réseaux sociaux
 * Génère des aperçus optimisés pour Facebook, Twitter, LinkedIn, etc.
 */

const socialImageConfig = {
  // Dimensions recommandées pour les réseaux sociaux
  dimensions: {
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 630 },
    linkedin: { width: 1200, height: 627 },
    instagram: { width: 1080, height: 1080 },
    youtube: { width: 1280, height: 720 }
  },
  
  // Couleurs de la marque
  colors: {
    primary: '#D4AF37', // pm-gold
    dark: '#1a1a1a',    // pm-dark
    light: '#f5f5f5'    // pm-off-white
  }
};

/**
 * Génère une image sociale optimisée
 */
function generateSocialImage(title, subtitle, backgroundImage, dimensions) {
  const { width, height } = dimensions;
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Perfect Models Management</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Playfair Display', 'Times New Roman', serif;
            width: ${width}px;
            height: ${height}px;
            background: ${backgroundImage ? `url('${backgroundImage}')` : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'};
            background-size: cover;
            background-position: center;
            color: white;
            overflow: hidden;
            position: relative;
        }
        
        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
        }
        
        .container {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px;
        }
        
        .logo {
            height: 80px;
            width: auto;
            margin-bottom: 40px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
        
        .title {
            font-size: ${width > 1000 ? '4rem' : '2.5rem'};
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 20px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
        
        .subtitle {
            font-size: ${width > 1000 ? '1.8rem' : '1.2rem'};
            color: #D4AF37;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .decoration-1 {
            position: absolute;
            top: 40px;
            right: 40px;
            width: 120px;
            height: 120px;
            border: 2px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
        }
        
        .decoration-2 {
            position: absolute;
            bottom: 40px;
            left: 40px;
            width: 80px;
            height: 80px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 50%;
        }
        
        .pattern {
            position: absolute;
            inset: 0;
            opacity: 0.1;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 0L35 20L55 25L35 30L30 50L25 30L5 25L25 20Z'/%3E%3C/g%3E%3C/svg%3E");
            background-repeat: repeat;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="overlay"></div>
    <div class="pattern"></div>
    
    <div class="container">
        <img src="/assets/logo.png" alt="Perfect Models Management" class="logo">
        <h1 class="title">${title}</h1>
        <p class="subtitle">${subtitle}</p>
    </div>
    
    <div class="decoration-1"></div>
    <div class="decoration-2"></div>
</body>
</html>`;
}

/**
 * Génère les images sociales pour toutes les pages
 */
function generateAllSocialImages() {
  const pages = [
    {
      name: 'home',
      title: "L'Élégance Redéfinie",
      subtitle: 'Perfect Models Management',
      backgroundImage: '/assets/hero-bg.jpg'
    },
    {
      name: 'models',
      title: 'Nos Mannequins',
      subtitle: 'Le Visage de la Mode Gabonaise',
      backgroundImage: '/assets/models-bg.jpg'
    },
    {
      name: 'magazine',
      title: 'Magazine Mode',
      subtitle: 'Tendances & Actualités',
      backgroundImage: '/assets/magazine-bg.jpg'
    },
    {
      name: 'agency',
      title: 'Notre Agence',
      subtitle: 'Excellence & Professionnalisme',
      backgroundImage: '/assets/agency-bg.jpg'
    },
    {
      name: 'fashion-day',
      title: 'Perfect Fashion Day',
      subtitle: 'L\'Événement Mode de l\'Année',
      backgroundImage: '/assets/fashion-day-bg.jpg'
    }
  ];

  const outputDir = path.join(__dirname, '..', 'public', 'social-images');
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  pages.forEach(page => {
    Object.entries(socialImageConfig.dimensions).forEach(([platform, dimensions]) => {
      const html = generateSocialImage(
        page.title,
        page.subtitle,
        page.backgroundImage,
        dimensions
      );
      
      const filename = `${page.name}-${platform}.html`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, html);
      console.log(`✅ Généré: ${filename}`);
    });
  });

  console.log('\n🎉 Toutes les images sociales ont été générées !');
  console.log(`📁 Dossier: ${outputDir}`);
}

/**
 * Génère un aperçu de test
 */
function generateTestPreview() {
  const testHtml = generateSocialImage(
    "L'Élégance Redéfinie",
    'Perfect Models Management',
    '/assets/hero-bg.jpg',
    socialImageConfig.dimensions.facebook
  );
  
  const testPath = path.join(__dirname, '..', 'public', 'social-preview.html');
  fs.writeFileSync(testPath, testHtml);
  console.log(`🧪 Aperçu de test généré: ${testPath}`);
}

// Exécution du script
console.log('🚀 Génération des images sociales optimisées...\n');

generateAllSocialImages();
generateTestPreview();

console.log('\n📋 Instructions:');
console.log('1. Ouvrez public/social-preview.html dans votre navigateur pour voir l\'aperçu');
console.log('2. Les images sont optimisées pour tous les réseaux sociaux');
console.log('3. Utilisez ces images dans vos meta tags Open Graph et Twitter Cards');

export {
  generateSocialImage,
  generateAllSocialImages,
  socialImageConfig
};
