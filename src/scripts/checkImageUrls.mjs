import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier JSON Firebase
const firebaseDataPath = path.join(__dirname, '../../perfect-156b5-default-rtdb-export.json');
const firebaseData = JSON.parse(fs.readFileSync(firebaseDataPath, 'utf-8'));

console.log('🔍 Vérification des URLs d\'images...\n');

const imageUrls = new Set();

// Extraire les URLs des articles
if (firebaseData.articles) {
    Object.values(firebaseData.articles).forEach(article => {
        if (article.imageUrl) imageUrls.add(article.imageUrl);
        if (article.featuredImage) imageUrls.add(article.featuredImage);

        if (article.content && Array.isArray(article.content)) {
            article.content.forEach(block => {
                if (block.type === 'image' && block.src) {
                    imageUrls.add(block.src);
                }
            });
        }
    });
}

// Extraire les URLs des services
if (firebaseData.agencyServices) {
    firebaseData.agencyServices.forEach(service => {
        if (service.imageUrl) imageUrls.add(service.imageUrl);
    });
}

console.log(`📊 Total d'URLs d'images uniques trouvées: ${imageUrls.size}\n`);

// Grouper par domaine
const urlsByDomain = {};
imageUrls.forEach(url => {
    try {
        const domain = new URL(url).hostname;
        if (!urlsByDomain[domain]) {
            urlsByDomain[domain] = [];
        }
        urlsByDomain[domain].push(url);
    } catch (e) {
        console.log(`⚠️  URL invalide: ${url}`);
    }
});

console.log('📍 Images par domaine:\n');
Object.entries(urlsByDomain).forEach(([domain, urls]) => {
    console.log(`   ${domain}: ${urls.length} images`);
});

console.log('\n✅ Vérification terminée !');
