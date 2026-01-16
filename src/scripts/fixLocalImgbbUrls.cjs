const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../constants/data.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// Regex pour trouver les URLs ImgBB avec des codes trop longs (8+ caractères)
const imgbbRegex = /https:\/\/i\.ibb\.co\/([A-Za-z0-9]{8,})\//g;

let fixCount = 0;
content = content.replace(imgbbRegex, (match, code) => {
    fixCount++;
    const fixedCode = code.substring(0, 7);
    return `https://i.ibb.co/${fixedCode}/`;
});

// Sauvegarder le fichier corrigé
fs.writeFileSync(dataFilePath, content, 'utf8');
console.log(`✅ Fixed ${fixCount} ImgBB URLs in data.ts`);
