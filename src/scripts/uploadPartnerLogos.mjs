import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clé API ImgBB (depuis .env)
const IMGBB_API_KEY = '59f0176178bae04b1f2cbd7f5bc03614';

// Dossier contenant les logos des partenaires
const PARTNERS_DIR = path.join(__dirname, '../../Partenaires');

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
        formData.append('name', `partner-${fileName.replace(/\.[^/.]+$/, '')}`);

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

async function uploadAllPartners() {
    console.log('🚀 Upload des logos partenaires vers ImgBB...\n');

    try {
        // Vérifier que le dossier existe
        if (!fs.existsSync(PARTNERS_DIR)) {
            console.error(`❌ Dossier introuvable: ${PARTNERS_DIR}`);
            return;
        }

        // Lire tous les fichiers
        const files = fs.readdirSync(PARTNERS_DIR)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                return numA - numB;
            })
            .map(file => path.join(PARTNERS_DIR, file));

        console.log(`📁 ${files.length} logos trouvés\n`);

        const results = [];

        // Upload chaque logo (avec délai pour éviter rate limiting)
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
        const outputFile = path.join(__dirname, 'partners-urls.json');
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');

        console.log(`\n✅ Upload terminé ! ${results.length}/${files.length} logos uploadés`);
        console.log(`📄 URLs sauvegardées dans: ${outputFile}`);

        // Générer un fichier TypeScript avec les URLs
        const tsContent = `// URLs des logos partenaires générées automatiquement depuis ImgBB
export const partnerLogos = [
${results.map(r => `  '${r.url}'`).join(',\n')}
];
`;
        const tsFile = path.join(__dirname, '../constants/partnerLogos.ts');
        fs.writeFileSync(tsFile, tsContent, 'utf8');
        console.log(`📄 Fichier TypeScript créé: ${tsFile}`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    }

    process.exit(0);
}

uploadAllPartners();
