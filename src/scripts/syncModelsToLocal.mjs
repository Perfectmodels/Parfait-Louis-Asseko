// Script de synchronisation des modèles Firebase → Local
// Run this with: node src/scripts/syncModelsToLocal.mjs

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

console.log("🔄 Synchronisation des Modèles Firebase → Local\n");
console.log("=".repeat(70));

try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    console.log("\n✅ Firebase initialisé");

    // Lire les modèles depuis Firebase
    console.log("📖 Lecture des modèles depuis Firebase...");
    const modelsRef = ref(db, 'models');
    const snapshot = await get(modelsRef);

    if (!snapshot.exists()) {
        console.error("❌ Aucun modèle trouvé dans Firebase!");
        process.exit(1);
    }

    const modelsData = snapshot.val();
    const modelsArray = Object.keys(modelsData).map(key => ({
        id: key,
        ...modelsData[key]
    }));

    console.log(`✅ ${modelsArray.length} modèles chargés depuis Firebase`);

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
    const content = `import { Model } from '../types';

// Données des modèles synchronisées depuis Firebase
// Dernière synchronisation: ${new Date().toISOString()}
// Nombre de modèles: ${modelsArray.length}

export const models: Model[] = ${formatValue(modelsArray)};
`;

    // Sauvegarder
    const modelsFilePath = path.join(__dirname, '..', 'constants', 'modelsData.ts');

    // Backup de l'ancien fichier
    const backupDir = path.join(__dirname, '..', '..', 'firebase-backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (fs.existsSync(modelsFilePath)) {
        const oldContent = fs.readFileSync(modelsFilePath, 'utf-8');
        const backupPath = path.join(backupDir, `modelsData.ts.backup-${timestamp}`);
        fs.writeFileSync(backupPath, oldContent);
        console.log("✅ Backup de modelsData.ts sauvegardé");
    }

    // Écrire le nouveau fichier
    fs.writeFileSync(modelsFilePath, content);
    console.log("✅ modelsData.ts mis à jour avec", modelsArray.length, "modèles");

    // Statistiques
    const proModels = modelsArray.filter(m => m.level === 'Pro').length;
    const studentModels = modelsArray.filter(m => m.level === 'Student').length;
    const publicModels = modelsArray.filter(m => m.isPublic).length;

    console.log("\n📊 Statistiques des modèles:");
    console.log(`   - Total: ${modelsArray.length} modèles`);
    console.log(`   - Pro: ${proModels} modèles`);
    console.log(`   - Student: ${studentModels} modèles`);
    console.log(`   - Publics: ${publicModels} modèles`);

    console.log("\n" + "=".repeat(70));
    console.log("✅ Synchronisation des modèles terminée!");

} catch (error) {
    console.error("\n❌ Erreur:", error.message);
    console.error(error.stack);
    process.exit(1);
}

process.exit(0);
