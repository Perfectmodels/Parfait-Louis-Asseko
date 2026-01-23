import { readFileSync } from 'fs';

const content = readFileSync('./src/constants/modelsData.ts', 'utf-8');

// Parse pour extraire tous les mannequins avec username et password
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

    // Compter les accolades
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (openBraces > 0 && braceCount === 0) {
        currentModel = { lineNumber: i + 1 };
    }

    // Extraire les propriétés
    if (braceCount > 0) {
        const nameMatch = line.match(/"name":\s*"([^"]+)"/);
        const usernameMatch = line.match(/"username":\s*"([^"]+)"/);
        const passwordMatch = line.match(/"password":\s*"([^"]+)"/);
        const levelMatch = line.match(/"level":\s*"([^"]+)"/);
        const idMatch = line.match(/"id":\s*"([^"]+)"/);

        if (nameMatch) currentModel.name = nameMatch[1];
        if (usernameMatch) currentModel.username = usernameMatch[1];
        if (passwordMatch) currentModel.password = passwordMatch[1];
        if (levelMatch) currentModel.level = levelMatch[1];
        if (idMatch) currentModel.id = idMatch[1];
    }

    braceCount += openBraces - closeBraces;

    if (braceCount === 0 && currentModel.name) {
        modelObjects.push({ ...currentModel });
        currentModel = {};
    }
}

console.log(`Total mannequins: ${modelObjects.length}\n`);

// Mannequins avec credentials
const withCredentials = modelObjects.filter(m => m.username && m.password);
console.log(`Mannequins avec username ET password: ${withCredentials.length}\n`);

// Mannequins Pro (non-débutants)
const proModels = withCredentials.filter(m => m.level && m.level !== 'Débutant');
console.log(`=== MANNEQUINS PRO (${proModels.length}) ===`);
proModels.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name}`);
    console.log(`   Username: ${m.username}`);
    console.log(`   Password: ${m.password}`);
    console.log(`   Level: ${m.level}`);
    console.log(`   ID: ${m.id}`);
    console.log('');
});

// Mannequins sans niveau mais avec credentials
const noLevel = withCredentials.filter(m => !m.level);
if (noLevel.length > 0) {
    console.log(`\n⚠️  MANNEQUINS AVEC CREDENTIALS MAIS SANS NIVEAU (${noLevel.length}):`);
    noLevel.forEach(m => {
        console.log(`  - ${m.name} (${m.username})`);
    });
}

// Statistiques par niveau
console.log('\n=== STATISTIQUES PAR NIVEAU ===');
const levelCounts = {};
withCredentials.forEach(m => {
    const level = m.level || 'SANS_NIVEAU';
    levelCounts[level] = (levelCounts[level] || 0) + 1;
});
Object.entries(levelCounts).sort((a, b) => b[1] - a[1]).forEach(([level, count]) => {
    console.log(`${level}: ${count} mannequins`);
});
