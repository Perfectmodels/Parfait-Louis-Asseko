import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier JSON Firebase
const firebaseDataPath = path.join(__dirname, '../../perfect-156b5-default-rtdb-export.json');
const firebaseData = JSON.parse(fs.readFileSync(firebaseDataPath, 'utf-8'));

console.log('🔄 Mise à jour des données depuis Firebase...\n');

// 1. Mettre à jour les articles
if (firebaseData.articles) {
    const articlesArray = Object.values(firebaseData.articles);
    console.log(`📰 ${articlesArray.length} articles trouvés`);

    const articlesContent = `// Articles synchronisés depuis Firebase
// Dernière mise à jour: ${new Date().toISOString()}

export const articles = ${JSON.stringify(articlesArray, null, 2)};
`;

    fs.writeFileSync(
        path.join(__dirname, '../constants/articlesData.ts'),
        articlesContent,
        'utf-8'
    );
    console.log('✅ Articles mis à jour\n');
}

// 2. Mettre à jour les informations de l'agence
if (firebaseData.agencyInfo) {
    const agencyContent = `// Informations de l'agence synchronisées depuis Firebase
// Dernière mise à jour: ${new Date().toISOString()}

export const agencyInfo = ${JSON.stringify(firebaseData.agencyInfo, null, 2)};

export const agencyAchievements = ${JSON.stringify(firebaseData.agencyAchievements || [], null, 2)};

export const agencyTimeline = ${JSON.stringify(firebaseData.agencyTimeline || [], null, 2)};

export const agencyPartners = ${JSON.stringify(firebaseData.agencyPartners || [], null, 2)};

export const agencyServices = ${JSON.stringify(firebaseData.agencyServices || [], null, 2)};
`;

    fs.writeFileSync(
        path.join(__dirname, '../constants/agencyData.ts'),
        agencyContent,
        'utf-8'
    );
    console.log('✅ Informations de l\'agence mises à jour\n');
}

// 3. Mettre à jour les informations de contact
if (firebaseData.contactInfo) {
    const contactContent = `// Informations de contact synchronisées depuis Firebase
// Dernière mise à jour: ${new Date().toISOString()}

export const contactInfo = ${JSON.stringify(firebaseData.contactInfo, null, 2)};
`;

    fs.writeFileSync(
        path.join(__dirname, '../constants/contactData.ts'),
        contactContent,
        'utf-8'
    );
    console.log('✅ Informations de contact mises à jour\n');
}

// 4. Mettre à jour les données de cours
if (firebaseData.courseData) {
    const courseDataArray = Object.values(firebaseData.courseData);
    const courseContent = `// Données de cours synchronisées depuis Firebase
// Dernière mise à jour: ${new Date().toISOString()}

export const courseData = ${JSON.stringify(courseDataArray, null, 2)};
`;

    fs.writeFileSync(
        path.join(__dirname, '../constants/courseData.ts'),
        courseContent,
        'utf-8'
    );
    console.log(`✅ ${courseDataArray.length} modules de cours mis à jour\n`);
}

console.log('🎉 Mise à jour terminée avec succès !');
console.log('\n📋 Résumé:');
console.log(`   - Articles: ${firebaseData.articles ? Object.keys(firebaseData.articles).length : 0}`);
console.log(`   - Partenaires: ${firebaseData.agencyPartners ? firebaseData.agencyPartners.length : 0}`);
console.log(`   - Services: ${firebaseData.agencyServices ? firebaseData.agencyServices.length : 0}`);
console.log(`   - Modules de cours: ${firebaseData.courseData ? Object.keys(firebaseData.courseData).length : 0}`);
