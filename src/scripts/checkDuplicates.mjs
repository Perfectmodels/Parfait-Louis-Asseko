import { readFileSync } from 'fs';

const content = readFileSync('./src/constants/modelsData.ts', 'utf-8');

// Extraire tous les IDs
const idMatches = content.matchAll(/"id":\s*"([^"]+)"/g);
const ids = Array.from(idMatches, m => m[1]);

// Trouver les doublons
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

console.log(`Total de mannequins: ${ids.length}`);
console.log(`IDs uniques: ${new Set(ids).size}`);
console.log(`Doublons trouvés: ${uniqueDuplicates.length}`);

if (uniqueDuplicates.length > 0) {
    console.log('\nListe des IDs en double:');
    uniqueDuplicates.forEach(id => {
        const count = ids.filter(i => i === id).length;
        console.log(`  - ${id} (${count} fois)`);
    });
}

// Extraire tous les noms
const nameMatches = content.matchAll(/"name":\s*"([^"]+)"/g);
const names = Array.from(nameMatches, m => m[1]);

const nameDuplicates = names.filter((name, index) => names.indexOf(name) !== index);
const uniqueNameDuplicates = [...new Set(nameDuplicates)];

if (uniqueNameDuplicates.length > 0) {
    console.log('\n\nNoms en double:');
    uniqueNameDuplicates.forEach(name => {
        const count = names.filter(n => n === name).length;
        console.log(`  - ${name} (${count} fois)`);
    });
}
