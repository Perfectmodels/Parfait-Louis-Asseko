// Script de migration Realtime Database → Firestore
// Perfect Models Management

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

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
const realtimeDb = getDatabase(app);
const firestore = getFirestore(app);

console.log('🚀 Démarrage de la migration Realtime DB → Firestore...\n');

// Fonction pour migrer les données
async function migrateData() {
    try {
        // 1. Lire toutes les données de Realtime Database
        console.log('📖 Lecture des données depuis Realtime Database...');
        const dbRef = ref(realtimeDb, '/');
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            console.log('❌ Aucune donnée trouvée dans Realtime Database');
            return;
        }

        const data = snapshot.val();
        console.log('✅ Données récupérées avec succès\n');

        // 2. Préparer les collections Firestore
        const collections = {
            // Collections principales
            models: data.models || [],
            articles: data.articles || [],
            courseData: data.courseData || [],
            fashionDayEvents: data.fashionDayEvents || [],
            testimonials: data.testimonials || [],
            newsItems: data.newsItems || [],

            // Collections de configuration
            siteConfig: data.siteConfig || {},
            contactInfo: data.contactInfo || {},
            siteImages: data.siteImages || {},
            heroSlides: data.heroSlides || [],
            apiKeys: data.apiKeys || {},

            // Collections de navigation et agence
            navLinks: data.navLinks || [],
            socialLinks: data.socialLinks || {},
            agencyTimeline: data.agencyTimeline || [],
            agencyInfo: data.agencyInfo || {},
            modelDistinctions: data.modelDistinctions || [],
            agencyServices: data.agencyServices || [],
            agencyAchievements: data.agencyAchievements || [],
            agencyPartners: data.agencyPartners || [],

            // Collections utilisateurs et applications
            castingApplications: data.castingApplications || [],
            fashionDayApplications: data.fashionDayApplications || [],
            juryMembers: data.juryMembers || [],
            registrationStaff: data.registrationStaff || [],

            // Collections de contenu utilisateur
            forumThreads: data.forumThreads || [],
            forumReplies: data.forumReplies || [],
            articleComments: data.articleComments || [],
            recoveryRequests: data.recoveryRequests || [],
            bookingRequests: data.bookingRequests || [],
            contactMessages: data.contactMessages || [],

            // Collections de gestion
            absences: data.absences || [],
            monthlyPayments: data.monthlyPayments || [],
            photoshootBriefs: data.photoshootBriefs || [],
            faqData: data.faqData || []
        };

        // 3. Migrer chaque collection vers Firestore
        console.log('📦 Migration vers Firestore en cours...\n');

        let totalDocs = 0;

        for (const [collectionName, collectionData] of Object.entries(collections)) {
            if (!collectionData) continue;

            console.log(`   Migrating: ${collectionName}...`);

            // Si c'est un tableau
            if (Array.isArray(collectionData)) {
                if (collectionData.length === 0) {
                    console.log(`   ⚠️  ${collectionName}: vide, ignoré`);
                    continue;
                }

                const batch = writeBatch(firestore);
                let batchCount = 0;

                for (let i = 0; i < collectionData.length; i++) {
                    const item = collectionData[i];
                    if (!item || typeof item !== 'object') continue; // Skip invalid items

                    // Generate a unique ID
                    const docId = item.id || item.slug || item.name?.toLowerCase().replace(/\s+/g, '-') || `doc_${Date.now()}_${i}`;
                    const docRef = doc(firestore, collectionName, docId);
                    batch.set(docRef, item);
                    batchCount++;
                    totalDocs++;

                    // Firestore limite à 500 opérations par batch
                    if (batchCount === 500) {
                        await batch.commit();
                        batchCount = 0;
                    }
                }

                if (batchCount > 0) {
                    await batch.commit();
                }

                console.log(`   ✅ ${collectionName}: ${collectionData.length} documents migrés`);
            }
            // Si c'est un objet
            else if (typeof collectionData === 'object') {
                const docRef = doc(firestore, 'config', collectionName);
                await setDoc(docRef, collectionData);
                totalDocs++;
                console.log(`   ✅ ${collectionName}: configuration migrée`);
            }
        }

        console.log(`\n🎉 Migration terminée avec succès!`);
        console.log(`📊 Total: ${totalDocs} documents migrés`);
        console.log(`\n✨ Firestore est maintenant prêt à être utilisé!\n`);

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        throw error;
    }
}

// Exécuter la migration
migrateData()
    .then(() => {
        console.log('✅ Script de migration terminé');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Échec de la migration:', error);
        process.exit(1);
    });
