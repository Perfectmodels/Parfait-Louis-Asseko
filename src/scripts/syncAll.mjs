// Script de synchronisation global (Lance tous les scripts de synchro)
// Run this with: node src/scripts/syncAll.mjs

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Lancement de la synchronisation globale Firebase → Local\n");

const scripts = [
    'syncFirebaseToLocal.mjs',
    'syncModelsToLocal.mjs',
    'syncArticlesToLocal.mjs',
    'syncCourseDataToLocal.mjs'
];

const runScript = (scriptName) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, scriptName);
        console.log(`▶️  Exécution de ${scriptName}...`);

        const child = spawn('node', [scriptPath], { stdio: 'inherit' });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${scriptName} terminé avec succès\n`);
                resolve();
            } else {
                console.error(`❌ ${scriptName} a échoué avec le code ${code}\n`);
                reject(new Error(`Script ${scriptName} failed`));
            }
        });

        child.on('error', (err) => {
            console.error(`❌ Erreur lors du lancement de ${scriptName}:`, err);
            reject(err);
        });
    });
};

const runAll = async () => {
    try {
        for (const script of scripts) {
            await runScript(script);
        }

        console.log("🎉 Synchronisation globale terminée avec succès !");
        console.log("💡 Toutes les données locales sont maintenant à jour avec Firebase.");

    } catch (error) {
        console.error("💥 La synchronisation globale a échoué.");
        process.exit(1);
    }
};

runAll();
