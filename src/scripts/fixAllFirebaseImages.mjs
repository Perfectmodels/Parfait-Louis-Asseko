import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

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

// Fonction pour corriger les URLs ImgBB
function fixImgbbUrl(url) {
    if (!url || typeof url !== 'string') return url;

    // Pattern pour les URLs ImgBB avec codes trop longs
    const imgbbPattern = /https:\/\/i\.ibb\.co\/([A-Za-z0-9]{8,})\/([^'"]+)/;
    const match = url.match(imgbbPattern);

    if (match) {
        const code = match[1];
        const filename = match[2];
        // Garder seulement les 7 premiers caractères du code
        const fixedCode = code.substring(0, 7);
        return `https://i.ibb.co/${fixedCode}/${filename}`;
    }

    return url;
}

// Fonction pour corriger un objet récursivement
function fixObject(obj) {
    if (!obj) return obj;

    if (typeof obj === 'string') {
        return fixImgbbUrl(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => fixObject(item));
    }

    if (typeof obj === 'object') {
        const fixed = {};
        for (const key in obj) {
            fixed[key] = fixObject(obj[key]);
        }
        return fixed;
    }

    return obj;
}

async function fixAllImages() {
    console.log('🔧 Correction de toutes les URLs d\'images dans Firebase...\n');

    try {
        let totalFixed = 0;

        // 1. Corriger les mannequins
        console.log('👤 Correction des images des mannequins...');
        const modelsRef = ref(db, 'models');
        const modelsSnapshot = await get(modelsRef);

        if (modelsSnapshot.exists()) {
            const models = modelsSnapshot.val();
            const fixedModels = fixObject(models);
            await set(modelsRef, fixedModels);
            console.log(`✅ ${Object.keys(models).length} mannequins corrigés`);
            totalFixed++;
        }

        // 2. Corriger les articles
        console.log('\n📰 Correction des images des articles...');
        const articlesRef = ref(db, 'articles');
        const articlesSnapshot = await get(articlesRef);

        if (articlesSnapshot.exists()) {
            const articles = articlesSnapshot.val();
            const fixedArticles = fixObject(articles);
            await set(articlesRef, fixedArticles);
            console.log(`✅ ${Object.keys(articles).length} articles corrigés`);
            totalFixed++;
        }

        // 3. Corriger les événements Fashion Day
        console.log('\n🎭 Correction des images Fashion Day...');
        const fashionDayRef = ref(db, 'fashionDayEvents');
        const fashionDaySnapshot = await get(fashionDayRef);

        if (fashionDaySnapshot.exists()) {
            const events = fashionDaySnapshot.val();
            const fixedEvents = fixObject(events);
            await set(fashionDayRef, fixedEvents);
            console.log(`✅ ${Object.keys(events).length} événements corrigés`);
            totalFixed++;
        }

        // 4. Corriger les news items
        console.log('\n📢 Correction des images des actualités...');
        const newsRef = ref(db, 'newsItems');
        const newsSnapshot = await get(newsRef);

        if (newsSnapshot.exists()) {
            const news = newsSnapshot.val();
            const fixedNews = fixObject(news);
            await set(newsRef, fixedNews);
            console.log(`✅ ${Object.keys(news).length} actualités corrigées`);
            totalFixed++;
        }

        console.log(`\n\n✅ Correction terminée ! ${totalFixed} collections mises à jour.`);
        console.log('\n💡 Les images devraient maintenant s\'afficher correctement sur le site.');

    } catch (error) {
        console.error('❌ Erreur lors de la correction:', error);
    }

    process.exit(0);
}

fixAllImages();
