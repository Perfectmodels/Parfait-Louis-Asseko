import { readFileSync } from 'fs';

const content = readFileSync('./src/constants/modelsData.ts', 'utf-8');

// Parse pour extraire tous les mannequins publics
const modelObjects = [];
let currentModel = {};
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

    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (openBraces > 0 && braceCount === 0) {
        currentModel = { lineNumber: i + 1 };
    }

    if (braceCount > 0) {
        const nameMatch = line.match(/"name":\s*"([^"]+)"/);
        const idMatch = line.match(/"id":\s*"([^"]+)"/);
        const isPublicMatch = line.match(/"isPublic":\s*(true|false)/);
        const imageMatch = line.match(/"imageUrl":\s*"([^"]+)"/);

        if (nameMatch) currentModel.name = nameMatch[1];
        if (idMatch) currentModel.id = idMatch[1];
        if (isPublicMatch) currentModel.isPublic = isPublicMatch[1] === 'true';
        if (imageMatch) currentModel.imageUrl = imageMatch[1];
    }

    braceCount += openBraces - closeBraces;

    if (braceCount === 0 && currentModel.name) {
        modelObjects.push({ ...currentModel });
        currentModel = {};
    }
}

console.log(`Total mannequins: ${modelObjects.length}\n`);

// Mannequins publics
const publicModels = modelObjects.filter(m => m.isPublic);
console.log(`=== MANNEQUINS PUBLICS (${publicModels.length}) ===`);
publicModels.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name} (ID: ${m.id})`);
});

// Vérifier les doublons d'IDs
const publicIds = publicModels.map(m => m.id);
const duplicateIds = publicIds.filter((id, index) => publicIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
    console.log('\n⚠️  DOUBLONS D\'IDS:');
    [...new Set(duplicateIds)].forEach(id => {
        const models = publicModels.filter(m => m.id === id);
        console.log(`  ID: ${id}`);
        models.forEach(m => console.log(`    - ${m.name} (ligne ${m.lineNumber})`));
    });
} else {
    console.log('\n✅ Aucun doublon d\'ID trouvé');
}

// Vérifier les doublons de noms
const publicNames = publicModels.map(m => m.name);
const duplicateNames = publicNames.filter((name, index) => publicNames.indexOf(name) !== index);
if (duplicateNames.length > 0) {
    console.log('\n⚠️  DOUBLONS DE NOMS:');
    [...new Set(duplicateNames)].forEach(name => {
        const models = publicModels.filter(m => m.name === name);
        console.log(`  Nom: "${name}" (${models.length} fois)`);
        models.forEach(m => console.log(`    - ID: ${m.id} (ligne ${m.lineNumber})`));
    });
} else {
    console.log('✅ Aucun doublon de nom trouvé');
}

// Vérifier les images placeholder
const placeholderImage = 'https://i.ibb.co/fVBxPNTP/T-shirt.png';
const withPlaceholder = publicModels.filter(m => m.imageUrl === placeholderImage);
if (withPlaceholder.length > 0) {
    console.log(`\n⚠️  ${withPlaceholder.length} mannequin(s) public(s) avec image placeholder:`);
    withPlaceholder.forEach(m => console.log(`  - ${m.name}`));
}
