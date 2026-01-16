import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
    authDomain: "perfectmodels-4e5fa.firebaseapp.com",
    databaseURL: "https://perfectmodels-4e5fa-default-rtdb.firebaseio.com",
    projectId: "perfectmodels-4e5fa",
    storageBucket: "perfectmodels-4e5fa.firebasestorage.app",
    messagingSenderId: "1072431985374",
    appId: "1:1072431985374:web:55f7a7899d05e68fe5484f",
    measurementId: "G-CSP65WPY89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function checkFirebaseImages() {
    console.log('🔍 Vérification des images dans Firebase Realtime Database...\n');

    try {
        // Vérifier les images du site
        console.log('📸 SITE IMAGES:');
        console.log('='.repeat(60));
        const siteImagesRef = ref(db, 'config/siteImages');
        const siteImagesSnapshot = await get(siteImagesRef);

        if (siteImagesSnapshot.exists()) {
            const siteImages = siteImagesSnapshot.val();
            console.log(JSON.stringify(siteImages, null, 2));
        } else {
            console.log('❌ Aucune image de site trouvée dans Firebase');
        }

        // Vérifier les mannequins
        console.log('\n\n👤 MODELS:');
        console.log('='.repeat(60));
        const modelsRef = ref(db, 'models');
        const modelsSnapshot = await get(modelsRef);

        if (modelsSnapshot.exists()) {
            const models = modelsSnapshot.val();
            const modelCount = Object.keys(models).length;
            console.log(`✅ ${modelCount} mannequins trouvés\n`);

            Object.entries(models).forEach(([id, model]) => {
                console.log(`Model: ${model.name}`);
                console.log(`  - Image: ${model.imageUrl || 'N/A'}`);
                if (model.portfolio && model.portfolio.length > 0) {
                    console.log(`  - Portfolio: ${model.portfolio.length} images`);
                    console.log(`    Premier: ${model.portfolio[0]}`);
                }
                console.log('');
            });
        } else {
            console.log('❌ Aucun mannequin trouvé dans Firebase');
        }

        // Vérifier les articles
        console.log('\n\n📰 ARTICLES:');
        console.log('='.repeat(60));
        const articlesRef = ref(db, 'articles');
        const articlesSnapshot = await get(articlesRef);

        if (articlesSnapshot.exists()) {
            const articles = articlesSnapshot.val();
            const articleCount = Object.keys(articles).length;
            console.log(`✅ ${articleCount} articles trouvés\n`);

            Object.entries(articles).slice(0, 3).forEach(([id, article]) => {
                console.log(`Article: ${article.title}`);
                console.log(`  - Image: ${article.imageUrl || 'N/A'}`);
                console.log('');
            });
        } else {
            console.log('❌ Aucun article trouvé dans Firebase');
        }

        // Vérifier le logo
        console.log('\n\n🎨 SITE CONFIG:');
        console.log('='.repeat(60));
        const siteConfigRef = ref(db, 'config/siteConfig');
        const siteConfigSnapshot = await get(siteConfigRef);

        if (siteConfigSnapshot.exists()) {
            const siteConfig = siteConfigSnapshot.val();
            console.log(`Logo: ${siteConfig.logo || 'N/A'}`);
        } else {
            console.log('❌ Aucune configuration de site trouvée');
        }

        console.log('\n\n✅ Vérification terminée !');

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
    }

    process.exit(0);
}

checkFirebaseImages();
