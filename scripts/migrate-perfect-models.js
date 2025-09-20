#!/usr/bin/env node

/**
 * Script de migration spécifique pour Perfect Models
 * Migre les données Firebase vers Neon Database
 */

import { neon } from '@neondatabase/serverless';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration Firebase
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

// Configuration Neon
const neonConfig = {
    connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialiser Neon
const sql = neon(neonConfig.connectionString);

// Fonction pour migrer les mannequins
async function migrateModels() {
    console.log('🔄 Migration des mannequins...');
    
    try {
        const modelsRef = ref(database, 'models');
        const modelsSnapshot = await get(modelsRef);
        const firebaseModels = modelsSnapshot.val() || {};
        
        let migratedCount = 0;
        
        for (const [modelId, modelData] of Object.entries(firebaseModels)) {
            try {
                // Vérifier si le mannequin existe déjà
                const existingModel = await sql`
                    SELECT id FROM users WHERE username = ${modelData.username || modelId}
                `;
                
                if (existingModel.length > 0) {
                    console.log(`⚠️  Mannequin ${modelData.username || modelId} existe déjà`);
                    continue;
                }
                
                // Insérer le mannequin
                await sql`
                    INSERT INTO users (username, email, name, role, is_active, created_at)
                    VALUES (
                        ${modelData.username || modelId},
                        ${modelData.email || ''},
                        ${modelData.name || modelData.username || modelId},
                        'user',
                        ${modelData.isActive !== false},
                        ${modelData.createdAt || new Date().toISOString()}
                    )
                `;
                
                migratedCount++;
                console.log(`✅ Mannequin migré: ${modelData.name || modelData.username || modelId}`);
                
            } catch (error) {
                console.error(`❌ Erreur lors de la migration du mannequin ${modelId}:`, error.message);
            }
        }
        
        console.log(`🎉 ${migratedCount} mannequins migrés avec succès`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration des mannequins:', error);
    }
}

// Fonction pour migrer les étudiants débutants
async function migrateBeginnerStudents() {
    console.log('🔄 Migration des étudiants débutants...');
    
    try {
        const studentsRef = ref(database, 'beginnerStudents');
        const studentsSnapshot = await get(studentsRef);
        const firebaseStudents = studentsSnapshot.val() || {};
        
        let migratedCount = 0;
        
        for (const [studentId, studentData] of Object.entries(firebaseStudents)) {
            try {
                // Vérifier si l'étudiant existe déjà
                const existingStudent = await sql`
                    SELECT id FROM users WHERE username = ${studentData.matricule || studentId}
                `;
                
                if (existingStudent.length > 0) {
                    console.log(`⚠️  Étudiant ${studentData.matricule || studentId} existe déjà`);
                    continue;
                }
                
                // Insérer l'étudiant
                await sql`
                    INSERT INTO users (username, email, name, role, is_active, created_at)
                    VALUES (
                        ${studentData.matricule || studentId},
                        ${studentData.email || ''},
                        ${studentData.name || studentData.matricule || studentId},
                        'user',
                        ${studentData.isActive !== false},
                        ${studentData.createdAt || new Date().toISOString()}
                    )
                `;
                
                migratedCount++;
                console.log(`✅ Étudiant migré: ${studentData.name || studentData.matricule || studentId}`);
                
            } catch (error) {
                console.error(`❌ Erreur lors de la migration de l'étudiant ${studentId}:`, error.message);
            }
        }
        
        console.log(`🎉 ${migratedCount} étudiants migrés avec succès`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration des étudiants:', error);
    }
}

// Fonction pour migrer les posts/articles
async function migratePosts() {
    console.log('🔄 Migration des posts...');
    
    try {
        const postsRef = ref(database, 'posts');
        const postsSnapshot = await get(postsRef);
        const firebasePosts = postsSnapshot.val() || {};
        
        let migratedCount = 0;
        
        for (const [postId, postData] of Object.entries(firebasePosts)) {
            try {
                // Vérifier si le post existe déjà
                const existingPost = await sql`
                    SELECT id FROM posts WHERE title = ${postData.title}
                `;
                
                if (existingPost.length > 0) {
                    console.log(`⚠️  Post "${postData.title}" existe déjà`);
                    continue;
                }
                
                // Trouver l'ID de l'auteur
                let authorId = null;
                if (postData.author) {
                    const author = await sql`
                        SELECT id FROM users WHERE username = ${postData.author}
                    `;
                    authorId = author[0]?.id || null;
                }
                
                // Insérer le post
                await sql`
                    INSERT INTO posts (title, content, author_id, status, created_at, updated_at)
                    VALUES (
                        ${postData.title || 'Sans titre'},
                        ${postData.content || ''},
                        ${authorId},
                        ${postData.status || 'draft'},
                        ${postData.createdAt || new Date().toISOString()},
                        ${postData.updatedAt || new Date().toISOString()}
                    )
                `;
                
                migratedCount++;
                console.log(`✅ Post migré: ${postData.title}`);
                
            } catch (error) {
                console.error(`❌ Erreur lors de la migration du post ${postId}:`, error.message);
            }
        }
        
        console.log(`🎉 ${migratedCount} posts migrés avec succès`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration des posts:', error);
    }
}

// Fonction pour migrer les analytics
async function migrateAnalytics() {
    console.log('🔄 Migration des analytics...');
    
    try {
        // Créer des métriques basées sur les données Firebase
        const modelsRef = ref(database, 'models');
        const modelsSnapshot = await get(modelsRef);
        const models = modelsSnapshot.val() || {};
        
        const studentsRef = ref(database, 'beginnerStudents');
        const studentsSnapshot = await get(studentsRef);
        const students = studentsSnapshot.val() || {};
        
        const postsRef = ref(database, 'posts');
        const postsSnapshot = await get(postsRef);
        const posts = postsSnapshot.val() || {};
        
        // Calculer les métriques
        const totalModels = Object.keys(models).length;
        const totalStudents = Object.keys(students).length;
        const totalPosts = Object.keys(posts).length;
        const activeUsers = Object.values(models).filter((model: any) => model.isActive).length +
                           Object.values(students).filter((student: any) => student.isActive).length;
        
        // Insérer les métriques
        await sql`
            INSERT INTO analytics (metric_name, metric_value, recorded_at)
            VALUES 
                ('total_models', ${totalModels}, NOW()),
                ('total_students', ${totalStudents}, NOW()),
                ('total_posts', ${totalPosts}, NOW()),
                ('active_users', ${activeUsers}, NOW())
        `;
        
        console.log(`✅ Analytics migrées: ${totalModels} modèles, ${totalStudents} étudiants, ${totalPosts} posts, ${activeUsers} utilisateurs actifs`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration des analytics:', error);
    }
}

// Fonction principale de migration
async function runMigration() {
    console.log('🚀 Migration Perfect Models: Firebase vers Neon Database');
    console.log('=======================================================');
    
    try {
        // Tester la connexion Neon
        console.log('🔍 Test de la connexion Neon...');
        await sql`SELECT 1 as test`;
        console.log('✅ Connexion Neon réussie');
        
        // Tester la connexion Firebase
        console.log('🔍 Test de la connexion Firebase...');
        const testRef = ref(database, 'test');
        await get(testRef);
        console.log('✅ Connexion Firebase réussie');
        
        // Exécuter les migrations
        await migrateModels();
        await migrateBeginnerStudents();
        await migratePosts();
        await migrateAnalytics();
        
        console.log('=======================================================');
        console.log('🎉 Migration Perfect Models terminée avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

// Exécuter la migration
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigration();
}

export { runMigration };
