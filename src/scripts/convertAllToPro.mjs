import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/constants/modelsData.ts';
let content = readFileSync(filePath, 'utf-8');

// Compter les remplacements
let count = 0;

// Remplacer tous les "level": "Débutant" par "level": "Pro"
content = content.replace(/"level":\s*"Débutant"/g, (match) => {
    count++;
    return '"level": "Pro"';
});

// Sauvegarder le fichier
writeFileSync(filePath, content, 'utf-8');

console.log(`✅ Conversion terminée !`);
console.log(`${count} mannequins ont été changés de "Débutant" à "Pro"`);
console.log(`\nTous les mannequins sont maintenant de niveau "Pro" par défaut.`);
