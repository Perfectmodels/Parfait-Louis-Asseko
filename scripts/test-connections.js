#!/usr/bin/env node

/**
 * Script de test des connexions
 * Teste les connexions Firebase et Neon Database
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

async function testFirebaseConnection() {
    console.log('🔍 Test de la connexion Firebase...');
    
    try {
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        
        // Tester la connexion en récupérant les données
        const testRef = ref(database, 'test');
        await get(testRef);
        
        console.log('✅ Connexion Firebase réussie');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur de connexion Firebase:', error.message);
        return false;
    }
}

async function testNeonConnection() {
    console.log('🔍 Test de la connexion Neon Database...');
    
    try {
        const sql = neon(neonConfig.connectionString);
        
        // Tester la connexion
        const result = await sql`SELECT 1 as test`;
        
        console.log('✅ Connexion Neon Database réussie');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur de connexion Neon Database:', error.message);
        return false;
    }
}

async function testDatabaseStructure() {
    console.log('🔍 Test de la structure de la base de données...');
    
    try {
        const sql = neon(neonConfig.connectionString);
        
        // Vérifier l'existence des tables
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        
        console.log('📋 Tables disponibles:');
        tables.forEach(table => {
            console.log(`  - ${table.table_name}`);
        });
        
        // Vérifier les données
        const userCount = await sql`SELECT COUNT(*) as count FROM users`;
        const postCount = await sql`SELECT COUNT(*) as count FROM posts`;
        
        console.log(`👥 Utilisateurs: ${userCount[0].count}`);
        console.log(`📝 Posts: ${postCount[0].count}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors du test de la structure:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Tests de connexion');
    console.log('====================');
    
    const firebaseOk = await testFirebaseConnection();
    const neonOk = await testNeonConnection();
    
    if (neonOk) {
        await testDatabaseStructure();
    }
    
    console.log('\n📊 Résumé des tests:');
    console.log(`Firebase: ${firebaseOk ? '✅ OK' : '❌ Échec'}`);
    console.log(`Neon Database: ${neonOk ? '✅ OK' : '❌ Échec'}`);
    
    if (firebaseOk && neonOk) {
        console.log('\n🎉 Tous les tests sont passés ! La migration peut commencer.');
    } else {
        console.log('\n⚠️ Certains tests ont échoué. Vérifiez la configuration.');
    }
}

// Exécuter les tests
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests };
