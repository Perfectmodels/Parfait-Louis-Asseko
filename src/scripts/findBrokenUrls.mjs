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

async function checkAllImages() {
    console.log('🔍 Recherche de toutes les URLs cassées dans Firebase...\n');

    try {
        const rootRef = ref(db);
        const snapshot = await get(rootRef);

        if (!snapshot.exists()) {
            console.log('❌ Aucune donnée dans Firebase');
            return;
        }

        const data = snapshot.val();
        const brokenUrls = [];

        // Fonction récursive pour chercher les URLs
        function findBrokenUrls(obj, path = '') {
            if (!obj) return;

            if (typeof obj === 'string') {
                // Chercher les URLs ImgBB avec codes trop longs
                const match = obj.match(/https:\/\/i\.ibb\.co\/([A-Za-z0-9]{8,})\//);
                if (match) {
                    brokenUrls.push({ path, url: obj, code: match[1] });
                }
            } else if (Array.isArray(obj)) {
                obj.forEach((item, index) => findBrokenUrls(item, `${path}[${index}]`));
            } else if (typeof obj === 'object') {
                Object.keys(obj).forEach(key => findBrokenUrls(obj[key], path ? `${path}.${key}` : key));
            }
        }

        findBrokenUrls(data);

        if (brokenUrls.length === 0) {
            console.log('✅ Aucune URL cassée trouvée !');
        } else {
            console.log(`❌ ${brokenUrls.length} URLs cassées trouvées:\n`);
            brokenUrls.forEach(({ path, url, code }) => {
                const fixedCode = code.substring(0, 7);
                console.log(`Path: ${path}`);
                console.log(`  Cassée: ${url}`);
                console.log(`  Correcte: ${url.replace(code, fixedCode)}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    }

    process.exit(0);
}

checkAllImages();
