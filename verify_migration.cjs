#!/usr/bin/env node

/**
 * Script de vérification rapide de la migration Firestore
 * 
 * Ce script vérifie que tous les fichiers ont été correctement migrés
 * et que la configuration Firestore est correcte.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la migration Firestore...\n');

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function check(name, condition, errorMessage = '') {
    if (condition) {
        console.log(`✅ ${name}`);
        checks.passed++;
        return true;
    } else {
        console.log(`❌ ${name}`);
        if (errorMessage) console.log(`   → ${errorMessage}`);
        checks.failed++;
        return false;
    }
}

function warn(name, message) {
    console.log(`⚠️  ${name}`);
    console.log(`   → ${message}`);
    checks.warnings++;
}

// Vérifier les fichiers modifiés
console.log('📁 Vérification des fichiers...\n');

const useFirestorePath = path.join(__dirname, 'src', 'hooks', 'useFirestore.tsx');
const firestoreConfigPath = path.join(__dirname, 'src', 'firestoreConfig.ts');
const firebasePath = path.join(__dirname, 'src', 'firebase.ts');
const rulesPath = path.join(__dirname, 'firestore.rules');

check(
    'useFirestore.tsx existe',
    fs.existsSync(useFirestorePath),
    'Le fichier useFirestore.tsx est introuvable'
);

check(
    'firestoreConfig.ts existe',
    fs.existsSync(firestoreConfigPath),
    'Le fichier firestoreConfig.ts est introuvable'
);

check(
    'firebase.ts existe',
    fs.existsSync(firebasePath),
    'Le fichier firebase.ts est introuvable'
);

check(
    'firestore.rules existe',
    fs.existsSync(rulesPath),
    'Le fichier firestore.rules est introuvable'
);

// Vérifier le contenu des fichiers
console.log('\n📝 Vérification du contenu...\n');

if (fs.existsSync(useFirestorePath)) {
    const useFirestoreContent = fs.readFileSync(useFirestorePath, 'utf8');

    check(
        'useFirestore utilise Firestore',
        useFirestoreContent.includes('firebase/firestore'),
        'useFirestore n\'importe pas firebase/firestore'
    );

    check(
        'useFirestore n\'utilise plus Realtime Database',
        !useFirestoreContent.includes('firebase/database'),
        'useFirestore utilise encore firebase/database'
    );

    check(
        'Fonction loadCollection mise à jour',
        useFirestoreContent.includes('getDocs') && useFirestoreContent.includes('collection'),
        'loadCollection n\'utilise pas les API Firestore'
    );

    check(
        'Fonction addDocument mise à jour',
        useFirestoreContent.includes('setDoc') && useFirestoreContent.includes('doc'),
        'addDocument n\'utilise pas les API Firestore'
    );

    check(
        'Fonction updateDocument mise à jour',
        useFirestoreContent.includes('updateDoc'),
        'updateDocument n\'utilise pas updateDoc'
    );

    check(
        'Fonction deleteDocument mise à jour',
        useFirestoreContent.includes('deleteDoc'),
        'deleteDocument n\'utilise pas deleteDoc'
    );
}

if (fs.existsSync(firestoreConfigPath)) {
    const firestoreConfigContent = fs.readFileSync(firestoreConfigPath, 'utf8');

    check(
        'firestoreConfig exporte db',
        firestoreConfigContent.includes('export const db'),
        'firestoreConfig n\'exporte pas db'
    );

    check(
        'firestoreConfig utilise getFirestore',
        firestoreConfigContent.includes('getFirestore'),
        'firestoreConfig n\'utilise pas getFirestore'
    );
}

if (fs.existsSync(firebasePath)) {
    const firebaseContent = fs.readFileSync(firebasePath, 'utf8');

    check(
        'firebase.ts exporte depuis firestoreConfig',
        firebaseContent.includes('firestoreConfig'),
        'firebase.ts n\'exporte pas depuis firestoreConfig'
    );
}

// Vérifier les fichiers de documentation
console.log('\n📚 Vérification de la documentation...\n');

const docs = [
    'MIGRATION_SUMMARY.md',
    'FIRESTORE_TEST_GUIDE.md',
    'FIRESTORE_DEPLOYMENT.md',
    'README_FIRESTORE.md',
    'docs/FIRESTORE_MIGRATION.md',
    'migrate_to_firestore.js'
];

docs.forEach(doc => {
    const docPath = path.join(__dirname, doc);
    check(
        `${doc} existe`,
        fs.existsSync(docPath),
        `Le fichier ${doc} est introuvable`
    );
});

// Vérifier les règles Firestore
console.log('\n🔒 Vérification des règles Firestore...\n');

if (fs.existsSync(rulesPath)) {
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    if (rulesContent.includes('allow read, write: if true') &&
        !rulesContent.includes('MODE DÉVELOPPEMENT')) {
        warn(
            'Règles Firestore en mode permissif',
            'Les règles sont permissives sans commentaire de développement. Assurez-vous que c\'est intentionnel.'
        );
    } else if (rulesContent.includes('MODE DÉVELOPPEMENT')) {
        warn(
            'Mode développement actif',
            'Les règles Firestore sont en mode développement. Pensez à activer les règles de production avant le déploiement.'
        );
    }
}

// Résumé
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ DE LA VÉRIFICATION\n');
console.log(`✅ Tests réussis    : ${checks.passed}`);
console.log(`❌ Tests échoués    : ${checks.failed}`);
console.log(`⚠️  Avertissements  : ${checks.warnings}`);
console.log('='.repeat(50) + '\n');

if (checks.failed === 0) {
    console.log('🎉 Migration Firestore vérifiée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Lancez l\'application : npm run dev');
    console.log('2. Testez les fonctionnalités admin');
    console.log('3. Vérifiez Firebase Console');
    console.log('4. Consultez FIRESTORE_TEST_GUIDE.md pour plus de détails\n');
    process.exit(0);
} else {
    console.log('❌ Certaines vérifications ont échoué.');
    console.log('Veuillez corriger les erreurs avant de continuer.\n');
    process.exit(1);
}
