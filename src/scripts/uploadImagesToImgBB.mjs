import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clé API ImgBB (depuis .env)
const IMGBB_API_KEY = '59f0176178bae04b1f2cbd7f5bc03614';

// Dossier contenant les images
const IMAGES_DIR = path.join(__dirname, '../../mannequins fashion day');

async function uploadImage(filePath) {
    try {
        const fileName = path.basename(filePath);
        console.log(`📤 Upload de ${fileName}...`);

        // Lire le fichier et le convertir en base64
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');

        // Créer le FormData
        const formData = new URLSearchParams();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', base64Image);
        formData.append('name', fileName.replace(/\.[^/.]+$/, '')); // Nom sans extension

        // Upload vers ImgBB
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Upload failed');
        }

        const result = await response.json();

        if (result.data && result.data.url) {
            console.log(`✅ ${fileName} → ${result.data.url}`);
            return {
                fileName,
                url: result.data.url,
                displayUrl: result.data.display_url,
                deleteUrl: result.data.delete_url,
                id: result.data.id
            };
        } else {
            throw new Error('No URL in response');
        }

    } catch (error) {
        console.error(`❌ Erreur pour ${path.basename(filePath)}:`, error.message);
        return null;
    }
}

async function uploadAllImages() {
    console.log('🚀 Upload de toutes les images vers ImgBB...\n');

    try {
        // Vérifier que le dossier existe
        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`❌ Dossier introuvable: ${IMAGES_DIR}`);
            return;
        }

        // Lire tous les fichiers
        const files = fs.readdirSync(IMAGES_DIR)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => path.join(IMAGES_DIR, file));

        console.log(`📁 ${files.length} images trouvées\n`);

        const results = [];

        // Upload chaque image (avec délai pour éviter rate limiting)
        for (let i = 0; i < files.length; i++) {
            const result = await uploadImage(files[i]);
            if (result) {
                results.push(result);
            }

            // Attendre 1 seconde entre chaque upload
            if (i < files.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Sauvegarder les résultats
        const outputFile = path.join(__dirname, 'imgbb-urls.json');
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');

        console.log(`\n✅ Upload terminé ! ${results.length}/${files.length} images uploadées`);
        console.log(`📄 URLs sauvegardées dans: ${outputFile}`);

        // Générer un fichier TypeScript avec les URLs
        const tsContent = `// URLs générées automatiquement depuis ImgBB
export const fashionDayImages = {
${results.map(r => `  '${r.fileName}': '${r.url}'`).join(',\n')}
};
`;
        const tsFile = path.join(__dirname, '../constants/fashionDayImages.ts');
        fs.writeFileSync(tsFile, tsContent, 'utf8');
        console.log(`📄 Fichier TypeScript créé: ${tsFile}`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    }

    process.exit(0);
}

uploadAllImages();
