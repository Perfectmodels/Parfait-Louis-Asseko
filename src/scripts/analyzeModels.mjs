import { readFileSync } from 'fs';

const content = readFileSync('./src/constants/modelsData.ts', 'utf-8');

// Parse le fichier pour extraire les objets mannequins
const modelObjects = [];
let currentModel = null;
let braceCount = 0;
let inModelsArray = false;

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('export const models: Model[] = [')) {
        inModelsArray = true;
        continue;
    }

    if (!inModelsArray) continue;

    // Compter les accolades
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (openBraces > 0 && braceCount === 0) {
        currentModel = { lines: [], startLine: i + 1 };
    }

    if (currentModel) {
        currentModel.lines.push(line);
    }

    braceCount += openBraces - closeBraces;

    if (braceCount === 0 && currentModel && currentModel.lines.length > 0) {
        // Extraire les propriétés importantes
        const modelText = currentModel.lines.join(' ');
        const idMatch = modelText.match(/"id":\s*"([^"]+)"/);
        const nameMatch = modelText.match(/"name":\s*"([^"]+)"/);
        const isPublicMatch = modelText.match(/"isPublic":\s*(true|false)/);
        const levelMatch = modelText.match(/"level":\s*"([^"]+)"/);
        const usernameMatch = modelText.match(/"username":\s*"([^"]+)"/);

        if (idMatch) {
            modelObjects.push({
                id: idMatch[1],
                name: nameMatch ? nameMatch[1] : 'NO_NAME',
                isPublic: isPublicMatch ? isPublicMatch[1] === 'true' : false,
                level: levelMatch ? levelMatch[1] : 'NO_LEVEL',
                username: usernameMatch ? usernameMatch[1] : 'NO_USERNAME',
                lineNumber: currentModel.startLine
            });
        }
        currentModel = null;
    }
}

console.log(`Total mannequins trouvés: ${modelObjects.length}\n`);

// Mannequins publics
const publicModels = modelObjects.filter(m => m.isPublic);
console.log(`Mannequins publics: ${publicModels.length}`);

// Vérifier les doublons d'IDs dans les mannequins publics
const publicIds = publicModels.map(m => m.id);
const duplicatePublicIds = publicIds.filter((id, index) => publicIds.indexOf(id) !== index);
if (duplicatePublicIds.length > 0) {
    console.log('\n⚠️  DOUBLONS D\'IDS dans les mannequins publics:');
    [...new Set(duplicatePublicIds)].forEach(id => {
        const models = publicModels.filter(m => m.id === id);
        console.log(`  ID: ${id}`);
        models.forEach(m => console.log(`    - ${m.name} (ligne ${m.lineNumber})`));
    });
}

// Vérifier les doublons de noms dans les mannequins publics
const publicNames = publicModels.map(m => m.name);
const duplicatePublicNames = publicNames.filter((name, index) => publicNames.indexOf(name) !== index);
if (duplicatePublicNames.length > 0) {
    console.log('\n⚠️  DOUBLONS DE NOMS dans les mannequins publics:');
    [...new Set(duplicatePublicNames)].forEach(name => {
        const models = publicModels.filter(m => m.name === name);
        console.log(`  Nom: ${name} (${models.length} fois)`);
        models.forEach(m => console.log(`    - ID: ${m.id} (ligne ${m.lineNumber})`));
    });
}

// Mannequins sans niveau
const noLevel = modelObjects.filter(m => m.level === 'NO_LEVEL');
if (noLevel.length > 0) {
    console.log('\n⚠️  Mannequins SANS NIVEAU:');
    noLevel.forEach(m => console.log(`  - ${m.name} (ID: ${m.id}, ligne ${m.lineNumber})`));
}

// Mannequins Pro
const proModels = modelObjects.filter(m => m.level !== 'Débutant' && m.level !== 'NO_LEVEL');
console.log(`\n✅ Mannequins Pro (non-débutants): ${proModels.length}`);
proModels.forEach(m => console.log(`  - ${m.name} (${m.level}) - ${m.username}`));
