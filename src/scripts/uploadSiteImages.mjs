import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
    authDomain: "perfectmodels-4e5fa.firebaseapp.com",
    databaseURL: "https://perfectmodels-4e5fa-default-rtdb.firebaseio.com",
    projectId: "perfectmodels-4e5fa",
    storageBucket: "perfectmodels-4e5fa.firebasestorage.app",
    messagingSenderId: "1072431985374",
    appId: "1:1072431985374:web:55f7a7899d05e68fe5484f",
    measurementId: "G-CSP65WPY89"
};

// Données corrigées
const siteImages = {
    hero: 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
    about: 'https://i.ibb.co/3WfK9Xg/about-img.jpg',
    fashionDayBg: 'https://i.ibb.co/C5rcPJH/titostyle-53.jpg',
    agencyHistory: 'https://i.ibb.co/jH0YvJg/agency-history.jpg',
    classroomBg: 'https://i.ibb.co/TBt9FBS/AJC-4630.jpg',
    castingBg: 'https://i.ibb.co/z5TzL2M/casting-bg.jpg',
};

const siteConfig = {
    logo: 'https://i.ibb.co/fVBxPNT/T-shirt.png'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function uploadSiteImages() {
    console.log('📤 Upload des images du site vers Firebase...\n');

    try {
        // Upload site images
        console.log('Uploading siteImages...');
        await set(ref(db, 'config/siteImages'), siteImages);
        console.log('✅ siteImages uploaded');

        // Upload site config
        console.log('Uploading siteConfig...');
        await set(ref(db, 'config/siteConfig'), siteConfig);
        console.log('✅ siteConfig uploaded');

        console.log('\n✅ Toutes les images ont été uploadées avec succès !');
        console.log('\nImages uploadées:');
        console.log('- Logo:', siteConfig.logo);
        console.log('- Hero:', siteImages.hero);
        console.log('- About:', siteImages.about);
        console.log('- Fashion Day:', siteImages.fashionDayBg);
        console.log('- Agency History:', siteImages.agencyHistory);
        console.log('- Classroom:', siteImages.classroomBg);
        console.log('- Casting:', siteImages.castingBg);

    } catch (error) {
        console.error('❌ Erreur lors de l\'upload:', error);
    }

    process.exit(0);
}

uploadSiteImages();
