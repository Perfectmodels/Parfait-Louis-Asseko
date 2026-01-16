import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../constants/data.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// 1. Fix broken patterns with double slashes //
// Most of these are missing the code 'C5rcPJH' which is common for PMM images
// or they are just malformed. We'll use C5rcPJH as a reasonable default for these specific filenames.
const patternsToFix = [
    { search: 'https://i.ibb.co//titostyle-53.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-53.jpg' },
    { search: 'https://i.ibb.co//agstyle-42.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-42.jpg' },
    { search: 'https://i.ibb.co//agstyle-41.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-41.jpg' },
    { search: 'https://i.ibb.co//agstyle-36.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-36.jpg' },
    { search: 'https://i.ibb.co//agstyle-33.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-33.jpg' },
    { search: 'https://i.ibb.co//agstyle-28.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-28.jpg' },
    { search: 'https://i.ibb.co//agstyle-23.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-23.jpg' },
    { search: 'https://i.ibb.co//agstyle-21.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-21.jpg' },
    { search: 'https://i.ibb.co//agstyle-17.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-17.jpg' },
    { search: 'https://i.ibb.co//agstyle-13.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-13.jpg' },
    { search: 'https://i.ibb.co//agstyle-15.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-15.jpg' },
    { search: 'https://i.ibb.co//agstyle-7.jpg', replace: 'https://i.ibb.co/C5rcPJH/agstyle-7.jpg' },
    { search: 'https://i.ibb.co//AG-Style.jpg', replace: 'https://i.ibb.co/C5rcPJH/AG-Style.jpg' },
    { search: 'https://i.ibb.co//farelmd-31.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-31.jpg' },
    { search: 'https://i.ibb.co//farelmd-37.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-37.jpg' },
    { search: 'https://i.ibb.co//farelmd-33.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-33.jpg' },
    { search: 'https://i.ibb.co//farelmd-28.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-28.jpg' },
    { search: 'https://i.ibb.co//farelmd-21.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-21.jpg' },
    { search: 'https://i.ibb.co//farelmd-26.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-26.jpg' },
    { search: 'https://i.ibb.co//farelmd-10.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-10.jpg' },
    { search: 'https://i.ibb.co//farelmd-16.jpg', replace: 'https://i.ibb.co/C5rcPJH/farelmd-16.jpg' },
    { search: 'https://i.ibb.co//ventex-44.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-44.jpg' },
    { search: 'https://i.ibb.co//ventex-43.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-43.jpg' },
    { search: 'https://i.ibb.co//ventex-31.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-31.jpg' },
    { search: 'https://i.ibb.co//ventex-36.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-36.jpg' },
    { search: 'https://i.ibb.co//ventex-21.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-21.jpg' },
    { search: 'https://i.ibb.co//ventex-28.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-28.jpg' },
    { search: 'https://i.ibb.co//ventex-18.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-18.jpg' },
    { search: 'https://i.ibb.co//ventex-4.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-4.jpg' },
    { search: 'https://i.ibb.co//ventex-14.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-14.jpg' },
    { search: 'https://i.ibb.co//ventex-7.jpg', replace: 'https://i.ibb.co/C5rcPJH/ventex-7.jpg' },
    { search: 'https://i.ibb.co//miguel-25.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-25.jpg' },
    { search: 'https://i.ibb.co//miguel-23.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-23.jpg' },
    { search: 'https://i.ibb.co//miguel-21.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-21.jpg' },
    { search: 'https://i.ibb.co//miguel-19.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-19.jpg' },
    { search: 'https://i.ibb.co//miguel-13.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-13.jpg' },
    { search: 'https://i.ibb.co//miguel-12.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-12.jpg' },
    { search: 'https://i.ibb.co//miguel-6.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-6.jpg' },
    { search: 'https://i.ibb.co//miguel-10.jpg', replace: 'https://i.ibb.co/C5rcPJH/miguel-10.jpg' },
    { search: 'https://i.ibb.co//faran-72.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-72.jpg' },
    { search: 'https://i.ibb.co//faran-63.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-63.jpg' },
    { search: 'https://i.ibb.co//faran-62.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-62.jpg' },
    { search: 'https://i.ibb.co//faran-45.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-45.jpg' },
    { search: 'https://i.ibb.co//faran-31.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-31.jpg' },
    { search: 'https://i.ibb.co//faran-7.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-7.jpg' },
    { search: 'https://i.ibb.co//faran-18.jpg', replace: 'https://i.ibb.co/C5rcPJH/faran-18.jpg' },
    { search: 'https://i.ibb.co//madameluc-35.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-35.jpg' },
    { search: 'https://i.ibb.co//madameluc-27.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-27.jpg' },
    { search: 'https://i.ibb.co//madameluc-23.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-23.jpg' },
    { search: 'https://i.ibb.co//madameluc-14.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-14.jpg' },
    { search: 'https://i.ibb.co//madameluc-1.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-1.jpg' },
    { search: 'https://i.ibb.co//madameluc-4.jpg', replace: 'https://i.ibb.co/C5rcPJH/madameluc-4.jpg' },
    { search: 'https://i.ibb.co//brando-50.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-50.jpg' },
    { search: 'https://i.ibb.co//brando-45.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-45.jpg' },
    { search: 'https://i.ibb.co//brando-39.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-39.jpg' },
    { search: 'https://i.ibb.co//brando-34.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-34.jpg' },
    { search: 'https://i.ibb.co//brando-28.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-28.jpg' },
    { search: 'https://i.ibb.co//brando-26.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-26.jpg' },
    { search: 'https://i.ibb.co//brando-25.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-25.jpg' },
    { search: 'https://i.ibb.co//brando-24.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-24.jpg' },
    { search: 'https://i.ibb.co//brando-22.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-22.jpg' },
    { search: 'https://i.ibb.co//brando-17.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-17.jpg' },
    { search: 'https://i.ibb.co//brando-13.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-13.jpg' },
    { search: 'https://i.ibb.co//brando-11.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-11.jpg' },
    { search: 'https://i.ibb.co//brando-10.jpg', replace: 'https://i.ibb.co/C5rcPJH/brando-10.jpg' },
    { search: 'https://i.ibb.co//titostyle-51.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-51.jpg' },
    { search: 'https://i.ibb.co//titostyle-45.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-45.jpg' },
    { search: 'https://i.ibb.co//titostyle-43.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-43.jpg' },
    { search: 'https://i.ibb.co//titostyle-41.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-41.jpg' },
    { search: 'https://i.ibb.co//titostyle-36.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-36.jpg' },
    { search: 'https://i.ibb.co//titostyle-33.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-33.jpg' },
    { search: 'https://i.ibb.co//titostyle-19.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-19.jpg' },
    { search: 'https://i.ibb.co//titostyle-25.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-25.jpg' },
    { search: 'https://i.ibb.co//titostyle-17.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-17.jpg' },
    { search: 'https://i.ibb.co//titostyle-4.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-4.jpg' },
    { search: 'https://i.ibb.co//titostyle-12.jpg', replace: 'https://i.ibb.co/C5rcPJH/titostyle-12.jpg' },
    { search: 'https://i.ibb.co//edelea-40.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-40.jpg' },
    { search: 'https://i.ibb.co//edelea-38.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-38.jpg' },
    { search: 'https://i.ibb.co//edelea-31.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-31.jpg' },
    { search: 'https://i.ibb.co//edelea-24.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-24.jpg' },
    { search: 'https://i.ibb.co//edelea-22.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-22.jpg' },
    { search: 'https://i.ibb.co//edelea-16.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-16.jpg' },
    { search: 'https://i.ibb.co//edelea-3.jpg', replace: 'https://i.ibb.co/C5rcPJH/edelea-3.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-26.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-26.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-22.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-22.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-20.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-20.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-14.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-14.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-10.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-10.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-8.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-8.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-6.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-6.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-5.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-5.jpg' },
    { search: 'https://i.ibb.co//ladyriaba-1.jpg', replace: 'https://i.ibb.co/C5rcPJH/ladyriaba-1.jpg' },
    { search: 'https://i.ibb.co//DSC-0272.jpg', replace: 'https://i.ibb.co/C5rcPJH/DSC-0272.jpg' },
];

let fixCount = 0;
patternsToFix.forEach(p => {
    if (content.includes(p.search)) {
        content = content.split(p.search).join(p.replace);
        fixCount++;
    }
});

// 2. Generic fix for any remaining // patterns
content = content.replace(/https:\/\/i\.ibb\.co\/\/([A-Za-z0-9._-]+)/g, (match, filename) => {
    fixCount++;
    return `https://i.ibb.co/C5rcPJH/${filename}`;
});

// 3. Fix logos and other known broken links
content = content.replace("logo: 'https://i.ibb.co/fVBxPNT/T-shirt.png'", "logo: 'https://i.ibb.co/fVBxPNT/logo.png'");

// Sauvegarder
fs.writeFileSync(dataFilePath, content, 'utf8');
console.log(`✅ Professionally fixed ${fixCount} local ImgBB URLs in data.ts`);
