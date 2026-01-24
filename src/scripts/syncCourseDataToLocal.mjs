// Script de synchronisation des cours Firebase → Local
// Run this with: node src/scripts/syncCourseDataToLocal.mjs

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

console.log("🔄 Synchronisation des Cours PMM Classroom Firebase → Local\n");
console.log("=".repeat(70));

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    console.log("\n✅ Firebase initialisé");

    // Lire les données de cours depuis Firebase
    console.log("📖 Lecture des données de cours depuis Firebase...");
    const courseRef = ref(db, 'courseData');
    const snapshot = await get(courseRef);

    if (!snapshot.exists()) {
        console.error("❌ Aucune donnée de cours trouvée dans Firebase!");
        process.exit(1);
    }

    const courseData = snapshot.val();
    const courseArray = Array.isArray(courseData)
        ? courseData
        : Object.keys(courseData).map(key => ({
            id: key,
            ...courseData[key]
        }));

    console.log(`✅ ${courseArray.length} modules de cours chargés depuis Firebase`);

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
    const content = `import { Module } from '../types';

// Données des cours PMM Classroom synchronisées depuis Firebase
// Dernière synchronisation: ${new Date().toISOString()}
// Nombre de modules: ${courseArray.length}

export const courseData: Module[] = ${formatValue(courseArray)};
`;

    // Sauvegarder
    const courseFilePath = path.join(__dirname, '..', 'constants', 'courseData.ts');

    // Backup de l'ancien fichier
    const backupDir = path.join(__dirname, '..', '..', 'firebase-backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (fs.existsSync(courseFilePath)) {
        const oldContent = fs.readFileSync(courseFilePath, 'utf-8');
        const backupPath = path.join(backupDir, `courseData.ts.backup-${timestamp}`);
        fs.writeFileSync(backupPath, oldContent);
        console.log("✅ Backup de courseData.ts sauvegardé");
    }

    // Écrire le nouveau fichier
    fs.writeFileSync(courseFilePath, content);
    console.log("✅ courseData.ts mis à jour avec", courseArray.length, "modules");

    // Statistiques
    let totalChapters = 0;
    courseArray.forEach(module => {
        if (module.chapters) {
            totalChapters += module.chapters.length;
        }
    });

    console.log("\n📊 Statistiques des cours:");
    console.log(`   - Modules: ${courseArray.length}`);
    console.log(`   - Chapitres totaux: ${totalChapters}`);

    console.log("\n" + "=".repeat(70));
    console.log("✅ Synchronisation des cours terminée!");

} catch (error) {
    console.error("\n❌ Erreur:", error.message);
    console.error(error.stack);
    process.exit(1);
}

process.exit(0);
