const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const TINYPNG_API_KEY = 'nXDD3JJvTGLDL7xwrR0T7lhDQB6pj8kN';

// Liste toutes tes URLs d’images ici
const imageUrls = [
  'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
  'https://i.ibb.co/3WfK9Xg/about-img.jpg',
  'https://i.ibb.co/C5rcPJHz/titostyle-53.jpg',
  // ... ajoute toutes tes URLs ici
];

const outputDir = path.join(__dirname, 'compressed_images');
fs.ensureDirSync(outputDir);

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur téléchargement: ${url}`);
  const buffer = await res.buffer();
  await fs.writeFile(dest, buffer);
}

async function compressWithTinyPng(inputPath, outputPath) {
  const image = await fs.readFile(inputPath);
  const response = await fetch('https://api.tinify.com/shrink', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from('api:' + TINYPNG_API_KEY).toString('base64'),
      'Content-Type': 'application/octet-stream'
    },
    body: image
  });
  const result = await response.json();
  if (result.error) throw new Error(result.message);

  // Télécharge l'image compressée
  const compressedImage = await fetch(result.output.url);
  const buffer = await compressedImage.buffer();
  await fs.writeFile(outputPath, buffer);
}

(async () => {
  for (const url of imageUrls) {
    try {
      const fileName = path.basename(url);
      const originalPath = path.join(outputDir, 'original_' + fileName);
      const compressedPath = path.join(outputDir, 'compressed_' + fileName);

      console.log(`Téléchargement de ${url}...`);
      await downloadImage(url, originalPath);

      console.log(`Compression de ${fileName} via TinyPNG...`);
      await compressWithTinyPng(originalPath, compressedPath);

      console.log(`✅ ${fileName} compressée et sauvegardée dans ${compressedPath}`);
    } catch (err) {
      console.error(`❌ Erreur pour ${url}:`, err.message);
    }
  }
  console.log('--- Terminé ---');
})();