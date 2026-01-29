/**
 * Script de migration des données de Firebase Realtime Database vers Firestore
 * 
 * Ce script permet de transférer toutes les données existantes de Realtime Database
 * vers Firestore en conservant la même structure.
 * 
 * Usage:
 * 1. Assurez-vous que les deux bases de données sont configurées
 * 2. Exécutez: node migrate_to_firestore.js
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const firestore = getFirestore(app);

// Collections à migrer
const collections = [
    'models', 'articles', 'courseData', 'fashionDayEvents', 'testimonials',
    'newsItems', 'agencyServices', 'castingApplications', 'fashionDayApplications',
    'forumThreads', 'forumReplies', 'articleComments', 'recoveryRequests',
    'bookingRequests', 'contactMessages', 'absences', 'monthlyPayments',
    'photoshootBriefs', 'juryMembers', 'registrationStaff', 'faqData',
    'modelDistinctions', 'agencyAchievements', 'agencyPartners', 'agencyTimeline',
    'navLinks', 'heroSlides', 'fashionDayReservations', 'gallery'
];

// Configurations à migrer
const configs = [
    'siteConfig', 'contactInfo', 'siteImages', 'socialLinks',
    'agencyInfo', 'apiKeys', 'adminProfile'
];

async function migrateCollection(collectionName) {
    console.log(`📦 Migration de la collection: ${collectionName}...`);

    try {
        const rtdbRef = ref(rtdb, collectionName);
        const snapshot = await get(rtdbRef);

        if (!snapshot.exists()) {
            console.log(`⚠️  Collection ${collectionName} vide ou inexistante dans RTDB`);
            return;
        }

        const data = snapshot.val();
        let count = 0;

        // Migrer chaque document
        for (const [key, value] of Object.entries(data)) {
            const docRef = doc(firestore, collectionName, key);
            await setDoc(docRef, value);
            count++;
        }

        console.log(`✅ ${count} documents migrés pour ${collectionName}`);
    } catch (error) {
        console.error(`❌ Erreur lors de la migration de ${collectionName}:`, error);
    }
}

async function migrateConfig(configName) {
    console.log(`⚙️  Migration de la configuration: ${configName}...`);

    try {
        const rtdbRef = ref(rtdb, `config/${configName}`);
        const snapshot = await get(rtdbRef);

        if (!snapshot.exists()) {
            console.log(`⚠️  Configuration ${configName} inexistante dans RTDB`);
            return;
        }

        const data = snapshot.val();
        const docRef = doc(firestore, 'config', configName);
        await setDoc(docRef, data);

        console.log(`✅ Configuration ${configName} migrée`);
    } catch (error) {
        console.error(`❌ Erreur lors de la migration de ${configName}:`, error);
    }
}

async function migrate() {
    console.log('🚀 Début de la migration RTDB → Firestore\n');

    // Migrer les collections
    console.log('📚 Migration des collections...\n');
    for (const collectionName of collections) {
        await migrateCollection(collectionName);
    }

    console.log('\n⚙️  Migration des configurations...\n');
    // Migrer les configurations
    for (const configName of configs) {
        await migrateConfig(configName);
    }

    console.log('\n✨ Migration terminée avec succès !');
    console.log('🔍 Vérifiez vos données dans la console Firebase Firestore');
}

// Exécuter la migration
migrate().catch(console.error);
