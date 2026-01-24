// Script de comparaison Firebase Realtime Database vs Firestore
// Run this with: node src/scripts/compareFirebaseData.mjs

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

console.log("🔍 Comparaison Firebase Realtime Database vs Firestore\n");
console.log("=".repeat(70));

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const rtdb = getDatabase(app);
    const firestore = getFirestore(app);

    console.log("\n✅ Firebase initialisé avec succès\n");

    // ========== REALTIME DATABASE ==========
    console.log("📊 FIREBASE REALTIME DATABASE");
    console.log("-".repeat(70));

    const rtdbRef = ref(rtdb, '/');
    const rtdbSnapshot = await get(rtdbRef);

    let rtdbCollections = {};
    let rtdbTotalItems = 0;

    if (rtdbSnapshot.exists()) {
        const rtdbData = rtdbSnapshot.val();
        const collectionNames = Object.keys(rtdbData);

        console.log(`✅ Connecté à Realtime Database`);
        console.log(`📦 Nombre de collections: ${collectionNames.length}\n`);

        for (const collName of collectionNames) {
            const collData = rtdbData[collName];
            let itemCount = 0;
            let dataType = 'unknown';

            if (Array.isArray(collData)) {
                itemCount = collData.length;
                dataType = 'array';
            } else if (typeof collData === 'object' && collData !== null) {
                itemCount = Object.keys(collData).length;
                dataType = 'object';
            } else {
                dataType = 'primitive';
                itemCount = 1;
            }

            rtdbCollections[collName] = { count: itemCount, type: dataType };
            rtdbTotalItems += itemCount;

            console.log(`   ${collName.padEnd(30)} ${String(itemCount).padStart(5)} items (${dataType})`);
        }

        console.log("\n" + "-".repeat(70));
        console.log(`   TOTAL REALTIME DB:`.padEnd(30) + ` ${String(rtdbTotalItems).padStart(5)} items`);
    } else {
        console.log("⚠️  Realtime Database est vide");
    }

    // ========== FIRESTORE ==========
    console.log("\n\n📊 FIRESTORE");
    console.log("-".repeat(70));

    // Liste des collections potentielles à vérifier
    const potentialCollections = [
        'models', 'articles', 'courseData', 'fashionDayEvents', 'testimonials',
        'newsItems', 'agencyServices', 'castingApplications', 'fashionDayApplications',
        'forumThreads', 'forumReplies', 'articleComments', 'recoveryRequests',
        'bookingRequests', 'contactMessages', 'absences', 'monthlyPayments',
        'photoshootBriefs', 'juryMembers', 'registrationStaff', 'faqData',
        'modelDistinctions', 'agencyAchievements', 'agencyPartners', 'agencyTimeline',
        'navLinks', 'heroSlides', 'fashionDayReservations', 'gallery'
    ];

    let firestoreCollections = {};
    let firestoreTotalItems = 0;
    let firestoreFoundCollections = 0;

    for (const collName of potentialCollections) {
        try {
            const collRef = collection(firestore, collName);
            const snapshot = await getDocs(collRef);
            const itemCount = snapshot.size;

            if (itemCount > 0) {
                firestoreCollections[collName] = { count: itemCount, type: 'collection' };
                firestoreTotalItems += itemCount;
                firestoreFoundCollections++;
                console.log(`   ${collName.padEnd(30)} ${String(itemCount).padStart(5)} items (collection)`);
            }
        } catch (error) {
            // Collection n'existe pas ou erreur d'accès
        }
    }

    if (firestoreFoundCollections === 0) {
        console.log("⚠️  Aucune collection trouvée dans Firestore");
        console.log("ℹ️  Firestore semble vide ou non utilisé");
    } else {
        console.log("\n" + "-".repeat(70));
        console.log(`   TOTAL FIRESTORE:`.padEnd(30) + ` ${String(firestoreTotalItems).padStart(5)} items`);
    }

    // ========== COMPARAISON ==========
    console.log("\n\n📊 COMPARAISON");
    console.log("=".repeat(70));

    const allCollectionNames = new Set([
        ...Object.keys(rtdbCollections),
        ...Object.keys(firestoreCollections)
    ]);

    console.log("\n| Collection".padEnd(32) + "| Realtime DB | Firestore | Différence |");
    console.log("|" + "-".repeat(30) + "|" + "-".repeat(13) + "|" + "-".repeat(11) + "|" + "-".repeat(12) + "|");

    let collectionsInBoth = 0;
    let collectionsOnlyRTDB = 0;
    let collectionsOnlyFirestore = 0;

    for (const collName of Array.from(allCollectionNames).sort()) {
        const rtdbCount = rtdbCollections[collName]?.count || 0;
        const firestoreCount = firestoreCollections[collName]?.count || 0;
        const diff = rtdbCount - firestoreCount;

        let status = '';
        if (rtdbCount > 0 && firestoreCount > 0) {
            collectionsInBoth++;
            status = diff === 0 ? '✅ Identique' : `⚠️  ${diff > 0 ? '+' : ''}${diff}`;
        } else if (rtdbCount > 0) {
            collectionsOnlyRTDB++;
            status = '📍 RTDB seulement';
        } else {
            collectionsOnlyFirestore++;
            status = '📍 Firestore seulement';
        }

        console.log(
            `| ${collName.padEnd(29)}` +
            `| ${String(rtdbCount).padStart(11)} ` +
            `| ${String(firestoreCount).padStart(9)} ` +
            `| ${status.padEnd(10)} |`
        );
    }

    // ========== RÉSUMÉ ==========
    console.log("\n\n📈 RÉSUMÉ");
    console.log("=".repeat(70));
    console.log(`\n✅ Collections dans Realtime Database: ${Object.keys(rtdbCollections).length}`);
    console.log(`✅ Collections dans Firestore: ${Object.keys(firestoreCollections).length}`);
    console.log(`\n📊 Collections présentes dans les deux: ${collectionsInBoth}`);
    console.log(`📍 Collections uniquement dans Realtime DB: ${collectionsOnlyRTDB}`);
    console.log(`📍 Collections uniquement dans Firestore: ${collectionsOnlyFirestore}`);
    console.log(`\n📦 Total items Realtime DB: ${rtdbTotalItems}`);
    console.log(`📦 Total items Firestore: ${firestoreTotalItems}`);

    // ========== RECOMMANDATION ==========
    console.log("\n\n💡 RECOMMANDATION");
    console.log("=".repeat(70));

    if (firestoreTotalItems === 0) {
        console.log("\n✅ Le projet utilise UNIQUEMENT Firebase Realtime Database");
        console.log("✅ Firestore n'est PAS utilisé (c'est correct pour ce projet)");
        console.log("✅ Toutes les données sont dans Realtime Database");
        console.log("\n📝 Action: Aucune migration nécessaire");
    } else if (rtdbTotalItems > firestoreTotalItems) {
        console.log("\n⚠️  Realtime Database contient PLUS de données que Firestore");
        console.log("📝 Recommandation: Utiliser Realtime Database comme source principale");
    } else if (firestoreTotalItems > rtdbTotalItems) {
        console.log("\n⚠️  Firestore contient PLUS de données que Realtime Database");
        console.log("📝 Recommandation: Migrer les données vers Realtime Database");
    } else {
        console.log("\n✅ Les deux bases contiennent le même nombre d'items");
        console.log("📝 Recommandation: Vérifier la cohérence des données");
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ Comparaison terminée avec succès\n");

} catch (error) {
    console.error("\n❌ Erreur lors de la comparaison:");
    console.error("Message:", error.message);
    console.error("\nDétails:", error);
    process.exit(1);
}

process.exit(0);
