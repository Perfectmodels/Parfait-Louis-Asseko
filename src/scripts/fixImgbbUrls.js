// Script pour corriger les URLs ImgBB cassées
// Les URLs ImgBB correctes ont le format: https://i.ibb.co/XXXXXXX/nom.jpg
// où XXXXXXX est un code de 7-8 caractères

const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../constants/data.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// Regex pour trouver les URLs ImgBB avec des codes trop longs
const imgbbRegex = /https:\/\/i\.ibb\.co\/([A-Za-z0-9]{9,})\/([^'"]+)/g;

let matches = [];
let match;
while ((match = imgbbRegex.exec(content)) !== null) {
    matches.push({
        full: match[0],
        code: match[1],
        filename: match[2]
    });
}

console.log(`Found ${matches.length} potentially broken ImgBB URLs`);

// Corriger les URLs en gardant seulement les 7-8 premiers caractères du code
matches.forEach(m => {
    const correctedCode = m.code.substring(0, 7);
    const correctedUrl = `https://i.ibb.co/${correctedCode}/${m.filename}`;
    console.log(`${m.full} -> ${correctedUrl}`);
    content = content.replace(m.full, correctedUrl);
});

// Sauvegarder le fichier corrigé
fs.writeFileSync(dataFilePath, content, 'utf8');
console.log(`\n✅ Fixed ${matches.length} URLs in data.ts`);
