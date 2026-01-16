import fetch from 'node-fetch';

// Clé API ImgBB (à remplacer par la vraie clé)
const IMGBB_API_KEY = '46c5d36c2e6a7d44b13fb18ecc2c35f7';

async function listImgBBImages() {
    console.log('📸 Récupération des images depuis ImgBB...\n');

    try {
        // ImgBB n'a pas d'endpoint pour lister toutes les images
        // Mais on peut récupérer les images récentes via l'endpoint user
        const response = await fetch(`https://api.imgbb.com/1/user?key=${IMGBB_API_KEY}`);

        if (!response.ok) {
            console.error('❌ Erreur API ImgBB:', response.status, response.statusText);
            const errorData = await response.json();
            console.error('Détails:', errorData);
            return;
        }

        const data = await response.json();
        console.log('✅ Réponse API:', JSON.stringify(data, null, 2));

        // Alternative: Essayer l'endpoint albums
        console.log('\n📁 Tentative de récupération des albums...');
        const albumsResponse = await fetch(`https://api.imgbb.com/1/albums?key=${IMGBB_API_KEY}`);

        if (albumsResponse.ok) {
            const albumsData = await albumsResponse.json();
            console.log('Albums:', JSON.stringify(albumsData, null, 2));
        } else {
            console.log('❌ Pas d\'accès aux albums');
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.log('\n💡 Note: ImgBB API ne permet pas de lister toutes les images.');
        console.log('Les images doivent être uploadées via l\'API et les URLs stockées.');
        console.log('\nSolution recommandée:');
        console.log('1. Uploader les images via l\'interface admin du site');
        console.log('2. Les URLs seront automatiquement sauvegardées dans Firebase');
        console.log('3. Ou utiliser l\'API ImgBB pour uploader et récupérer les URLs');
    }

    process.exit(0);
}

listImgBBImages();
