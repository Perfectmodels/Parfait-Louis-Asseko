// Script de synchronisation des articles Firebase → Local
// Run this with: node src/scripts/syncArticlesToLocal.mjs

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log("🔄 Synchronisation des Articles Firebase → Local\n");
console.log("=".repeat(70));

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    console.log("\n✅ Firebase initialisé");

    // Lire les articles depuis Firebase
    console.log("📖 Lecture des articles depuis Firebase...");
    const articlesRef = ref(db, 'articles');
    const snapshot = await get(articlesRef);

    if (!snapshot.exists()) {
        console.error("❌ Aucun article trouvé dans Firebase!");
        process.exit(1);
    }

    const articlesData = snapshot.val();
    const articlesArray = Array.isArray(articlesData)
        ? articlesData
        : Object.keys(articlesData).map(key => ({
            id: key,
            ...articlesData[key]
        }));

    console.log(`✅ ${articlesArray.length} articles chargés depuis Firebase`);

    // Formater pour TypeScript
    const formatValue = (value, indent = 0) => {
        const spaces = '  '.repeat(indent);

        if (value === null || value === undefined) return 'null';
        if (typeof value === 'string') {
            return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
        }
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);

        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            const items = value.map(item => `${spaces}  ${formatValue(item, indent + 1)}`).join(',\n');
            return `[\n${items}\n${spaces}]`;
        }

        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) return '{}';
            const items = keys.map(key => {
                const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
                return `${spaces}  ${formattedKey}: ${formatValue(value[key], indent + 1)}`;
            }).join(',\n');
            return `{\n${items}\n${spaces}}`;
        }

        return 'null';
    };

    // Créer le contenu du fichier
    const content = `import { Article } from '../types';

// Données des articles du magazine synchronisées depuis Firebase
// Dernière synchronisation: ${new Date().toISOString()}
// Nombre d'articles: ${articlesArray.length}

export const articles: Article[] = ${formatValue(articlesArray)};
`;

    // Sauvegarder
    const articlesFilePath = path.join(__dirname, '..', 'constants', 'magazineData.ts');

    // Backup de l'ancien fichier
    const backupDir = path.join(__dirname, '..', '..', 'firebase-backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (fs.existsSync(articlesFilePath)) {
        const oldContent = fs.readFileSync(articlesFilePath, 'utf-8');
        const backupPath = path.join(backupDir, `magazineData.ts.backup-${timestamp}`);
        fs.writeFileSync(backupPath, oldContent);
        console.log("✅ Backup de magazineData.ts sauvegardé");
    }

    // Écrire le nouveau fichier
    fs.writeFileSync(articlesFilePath, content);
    console.log("✅ magazineData.ts mis à jour avec", articlesArray.length, "articles");

    // Statistiques
    const categories = [...new Set(articlesArray.map(a => a.category))];
    const authors = [...new Set(articlesArray.map(a => a.author))];

    console.log("\n📊 Statistiques des articles:");
    console.log(`   - Total: ${articlesArray.length} articles`);
    console.log(`   - Catégories: ${categories.length} (${categories.join(', ')})`);
    console.log(`   - Auteurs: ${authors.length}`);

    console.log("\n" + "=".repeat(70));
    console.log("✅ Synchronisation des articles terminée!");

} catch (error) {
    console.error("\n❌ Erreur:", error.message);
    console.error(error.stack);
    process.exit(1);
}

process.exit(0);
