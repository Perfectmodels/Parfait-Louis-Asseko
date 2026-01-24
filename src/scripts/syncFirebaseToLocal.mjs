// Script de synchronisation Firebase → Local
// Télécharge toutes les données de Firebase Realtime Database et les sauvegarde localement
// Run this with: node src/scripts/syncFirebaseToLocal.mjs

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log("🔄 Synchronisation Firebase → Local\n");
console.log("=".repeat(70));

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    console.log("\n✅ Firebase initialisé avec succès");
    console.log("📊 Database URL:", firebaseConfig.databaseURL);

    // Lire toutes les données de Firebase
    console.log("\n📖 Lecture des données Firebase...");
    const rootRef = ref(db, '/');
    const snapshot = await get(rootRef);

    if (!snapshot.exists()) {
        console.error("❌ Aucune donnée trouvée dans Firebase!");
        process.exit(1);
    }

    const firebaseData = snapshot.val();
    console.log("✅ Données Firebase chargées");

    // Créer le dossier de backup si nécessaire
    const backupDir = path.join(__dirname, '..', '..', 'firebase-backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log("📁 Dossier de backup créé:", backupDir);
    }

    // Sauvegarder toutes les données en JSON
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullBackupPath = path.join(backupDir, `firebase-full-backup-${timestamp}.json`);
    fs.writeFileSync(fullBackupPath, JSON.stringify(firebaseData, null, 2));
    console.log("✅ Backup complet sauvegardé:", fullBackupPath);

    // Préparer les données pour les fichiers TypeScript
    console.log("\n🔄 Conversion des données pour TypeScript...");

    // Helper function to convert object to array if needed
    const objectToArray = (obj) => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        return Object.keys(obj).map(key => ({
            id: key,
            ...obj[key]
        }));
    };

    // Helper function to format value for TypeScript
    const formatValue = (value, indent = 0) => {
        const spaces = '  '.repeat(indent);

        if (value === null || value === undefined) {
            return 'null';
        }

        if (typeof value === 'string') {
            // Escape special characters
            return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            const items = value.map(item => `${spaces}  ${formatValue(item, indent + 1)}`).join(',\n');
            return `[\n${items}\n${spaces}]`;
        }

        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) return '{}';
            const items = keys.map(key => {
                const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
                return `${spaces}  ${formattedKey}: ${formatValue(value[key], indent + 1)}`;
            }).join(',\n');
            return `{\n${items}\n${spaces}}`;
        }

        return 'null';
    };

    // Mettre à jour data.ts
    console.log("\n📝 Mise à jour de src/constants/data.ts...");

    const dataFilePath = path.join(__dirname, '..', 'constants', 'data.ts');

    // Lire le fichier actuel pour garder les imports et types
    let dataFileContent = fs.readFileSync(dataFilePath, 'utf-8');

    // Extraire la partie avant les exports
    const importsMatch = dataFileContent.match(/^[\s\S]*?(?=export const siteConfig)/m);
    const imports = importsMatch ? importsMatch[0] : `
// FIX: Removed BeginnerStudent from import as the type is deprecated.
import { Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, SocialLinks, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, HeroSlide, FashionDayReservation } from '../types';

`;

    // Construire le nouveau contenu
    let newContent = imports;

    // Ajouter siteConfig
    const siteConfig = firebaseData.siteConfig || { logo: '/logo.jpg' };
    newContent += `export const siteConfig = ${formatValue(siteConfig)};\n\n`;

    // Ajouter navLinks
    const navLinks = objectToArray(firebaseData.navLinks || []);
    newContent += `export const navLinks: NavLink[] = ${formatValue(navLinks)};\n\n`;

    // Ajouter socialLinks
    const socialLinks = firebaseData.socialLinks || {
        facebook: 'https://www.facebook.com/perfectmodels.ga/',
        instagram: 'https://www.instagram.com/perfectmodels.ga/',
        youtube: 'https://www.youtube.com/@PMM241'
    };
    newContent += `export const socialLinks: SocialLinks = ${formatValue(socialLinks)};\n\n`;

    // Ajouter contactInfo
    const contactInfo = firebaseData.contactInfo || {
        email: 'contact@perfectmodels.ga',
        phone: '+241 77 50 79 50',
        address: 'Libreville, Gabon',
        notificationEmail: 'contact@perfectmodels.ga'
    };
    newContent += `export const contactInfo: ContactInfo = ${formatValue(contactInfo)};\n\n`;

    // Ajouter siteImages
    const siteImages = firebaseData.siteImages || {};
    newContent += `export const siteImages: SiteImages = ${formatValue(siteImages)};\n\n`;

    // Ajouter apiKeys (Redacted for security)
    // We do NOT want to hardcode production keys in the source code.
    // Keys should be loaded from environment variables in the application.
    newContent += `export const apiKeys: ApiKeys = {
  // Configured via environment variables (VITE_RESEND_API_KEY, etc.)
  // See .env.example
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',
  firebaseDynamicLinks: {
    webApiKey: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_API_KEY || '',
    domainUriPrefix: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_DOMAIN || ''
  },
  imgbbApiKey: import.meta.env.VITE_IMGBB_API_KEY || '',
  brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || ''
};\n\n`;

    // Ajouter juryMembers
    const juryMembers = objectToArray(firebaseData.juryMembers || []);
    newContent += `export const juryMembers: JuryMember[] = ${formatValue(juryMembers)};\n\n`;

    // Ajouter registrationStaff
    const registrationStaff = objectToArray(firebaseData.registrationStaff || []);
    newContent += `export const registrationStaff: RegistrationStaff[] = ${formatValue(registrationStaff)};\n\n`;

    // Ajouter models (référence vers modelsData.ts)
    newContent += `export { models } from './modelsData';\n\n`;

    // Ajouter testimonials
    const testimonials = objectToArray(firebaseData.testimonials || []);
    newContent += `export const testimonials: Testimonial[] = ${formatValue(testimonials)};\n\n`;

    // Ajouter les arrays vides pour les données dynamiques
    newContent += `export const castingApplications: CastingApplication[] = [];\n`;
    newContent += `export const fashionDayApplications: FashionDayApplication[] = [];\n`;
    newContent += `export const forumThreads: ForumThread[] = [];\n`;
    newContent += `export const forumReplies: ForumReply[] = [];\n`;
    newContent += `export const articleComments: ArticleComment[] = [];\n`;
    newContent += `export const recoveryRequests: RecoveryRequest[] = [];\n`;
    newContent += `export const bookingRequests: BookingRequest[] = [];\n`;
    newContent += `export const contactMessages: ContactMessage[] = [];\n`;
    newContent += `export const absences: Absence[] = [];\n`;
    newContent += `export const monthlyPayments: MonthlyPayment[] = [];\n`;
    newContent += `export const photoshootBriefs: PhotoshootBrief[] = [];\n`;
    newContent += `// FIX: Removed beginnerStudents array as the feature is deprecated.\n\n\n`;

    // Ajouter newsItems
    const newsItems = objectToArray(firebaseData.newsItems || []);
    newContent += `export const newsItems: NewsItem[] = ${formatValue(newsItems)};\n\n`;

    // Ajouter fashionDayEvents
    const fashionDayEvents = objectToArray(firebaseData.fashionDayEvents || []);
    newContent += `export const fashionDayEvents: FashionDayEvent[] = ${formatValue(fashionDayEvents)};\n\n`;

    // Ajouter agencyTimeline
    const agencyTimeline = objectToArray(firebaseData.agencyTimeline || []);
    newContent += `export const agencyTimeline = ${formatValue(agencyTimeline)};\n\n`;

    // Ajouter agencyInfo
    const agencyInfo = firebaseData.agencyInfo || {};
    newContent += `export const agencyInfo = ${formatValue(agencyInfo)};\n\n`;

    // Ajouter modelDistinctions
    const modelDistinctions = objectToArray(firebaseData.modelDistinctions || []);
    newContent += `export const modelDistinctions: ModelDistinction[] = ${formatValue(modelDistinctions)};\n\n`;

    // Ajouter agencyServices
    const agencyServices = objectToArray(firebaseData.agencyServices || []);
    newContent += `export const agencyServices: Service[] = ${formatValue(agencyServices)};\n\n`;

    // Ajouter agencyAchievements
    const agencyAchievements = objectToArray(firebaseData.agencyAchievements || []);
    newContent += `export const agencyAchievements: AchievementCategory[] = ${formatValue(agencyAchievements)};\n\n`;

    // Ajouter agencyPartners
    const agencyPartners = objectToArray(firebaseData.agencyPartners || []);
    newContent += `export const agencyPartners: Partner[] = ${formatValue(agencyPartners)};\n\n`;

    // Ajouter faqData
    const faqData = objectToArray(firebaseData.faqData || []);
    newContent += `export const faqData: FAQCategory[] = ${formatValue(faqData)};\n\n`;

    // Ajouter heroSlides
    const heroSlides = objectToArray(firebaseData.heroSlides || []);
    newContent += `export const heroSlides: HeroSlide[] = ${formatValue(heroSlides)};\n\n\n`;

    // Ajouter fashionDayReservations
    newContent += `export const fashionDayReservations: FashionDayReservation[] = [];\n`;

    // Sauvegarder le backup de l'ancien fichier
    const dataBackupPath = path.join(backupDir, `data.ts.backup-${timestamp}`);
    fs.writeFileSync(dataBackupPath, dataFileContent);
    console.log("✅ Backup de data.ts sauvegardé:", dataBackupPath);

    // Écrire le nouveau fichier
    fs.writeFileSync(dataFilePath, newContent);
    console.log("✅ data.ts mis à jour avec les données Firebase");

    // Statistiques
    console.log("\n📊 Statistiques de synchronisation:");
    console.log(`   - siteConfig: ${Object.keys(siteConfig).length} propriétés`);
    console.log(`   - navLinks: ${navLinks.length} liens`);
    console.log(`   - testimonials: ${testimonials.length} témoignages`);
    console.log(`   - newsItems: ${newsItems.length} actualités`);
    console.log(`   - fashionDayEvents: ${fashionDayEvents.length} événements`);
    console.log(`   - agencyServices: ${agencyServices.length} services`);
    console.log(`   - agencyPartners: ${agencyPartners.length} partenaires`);
    console.log(`   - heroSlides: ${heroSlides.length} slides`);
    console.log(`   - faqData: ${faqData.length} catégories FAQ`);

    console.log("\n" + "=".repeat(70));
    console.log("✅ Synchronisation terminée avec succès!");
    console.log("\n💡 Le site peut maintenant fonctionner en mode offline avec les données locales");
    console.log("📁 Backups sauvegardés dans:", backupDir);

} catch (error) {
    console.error("\n❌ Erreur lors de la synchronisation:");
    console.error("Message:", error.message);
    console.error("\nStack:", error.stack);
    process.exit(1);
}

process.exit(0);
