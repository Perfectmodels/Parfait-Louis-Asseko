import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMGBB_API_KEY = "59f0176178bae04b1f2cbd7f5bc03614";
const MODELS_DIR = path.join(__dirname, 'src', 'public');
const OUTPUT_FILE = path.join(__dirname, 'src', 'constants', 'modelImages.ts');

async function uploadImage(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const base64Image = fileContent.toString('base64');
        const formData = new FormData();
        formData.append('image', base64Image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            console.log(`Uploaded: ${path.basename(filePath)} -> ${data.data.url}`);
            return data.data.url;
        } else {
            console.error(`Error uploading ${filePath}:`, data);
            return null;
        }
    } catch (error) {
        console.error(`Exception uploading ${filePath}:`, error);
        return null;
    }
}

async function main() {
    const imageUrls = {};

    // Ensure directory exists
    if (!fs.existsSync(MODELS_DIR)) {
        console.error(`Directory not found: ${MODELS_DIR}`);
        return;
    }

    // sort files numerically if possible or just loop 1 to 30 as per previous logic
    for (let i = 1; i <= 30; i++) {
        const fileName = `${i}.png`;
        const filePath = path.join(MODELS_DIR, fileName);

        if (fs.existsSync(filePath)) {
            console.log(`Processing ${fileName}...`);
            const url = await uploadImage(filePath);
            if (url) {
                imageUrls[i] = url;
            }
        } else {
            console.warn(`File not found: ${fileName}`);
        }
    }

    const tsContent = `export const MODEL_IMAGES: Record<number, string> = ${JSON.stringify(imageUrls, null, 2)};`;

    fs.writeFileSync(OUTPUT_FILE, tsContent);
    console.log(`Successfully saved image URLs to ${OUTPUT_FILE}`);
}

main();
