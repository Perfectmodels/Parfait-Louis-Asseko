import { readFileSync } from 'fs';

const content = readFileSync('./src/constants/modelsData.ts', 'utf-8');

// Extraire tous les levels
const levelMatches = content.matchAll(/"level":\s*"([^"]+)"/g);
const levels = Array.from(levelMatches, m => m[1]);

console.log(`Total de mannequins: ${levels.length}\n`);

// Compter par niveau
const levelCounts = {};
levels.forEach(level => {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
});

console.log('Répartition par niveau:');
Object.entries(levelCounts).sort((a, b) => b[1] - a[1]).forEach(([level, count]) => {
    console.log(`  ${level}: ${count} mannequins`);
});

// Extraire les mannequins avec username et password
const usernameMatches = content.matchAll(/"username":\s*"([^"]+)"/g);
const usernames = Array.from(usernameMatches, m => m[1]);

const passwordMatches = content.matchAll(/"password":\s*"([^"]+)"/g);
const passwords = Array.from(passwordMatches, m => m[1]);

console.log(`\nMannequins avec username: ${usernames.length}`);
console.log(`Mannequins avec password: ${passwords.length}`);

// Compter les mannequins Pro (non-débutants)
const proCount = levels.filter(l => l !== 'Débutant').length;
console.log(`\nMannequins Pro (non-débutants): ${proCount}`);
