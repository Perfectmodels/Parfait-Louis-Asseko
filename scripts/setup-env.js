#!/usr/bin/env node

/**
 * Script de configuration des variables d'environnement
 * Configure les variables nécessaires pour la migration
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
    console.log('🔧 Configuration des variables d\'environnement');
    console.log('===============================================');
    
    const envVars = {};
    
    // Configuration Firebase
    console.log('\n📱 Configuration Firebase:');
    envVars.VITE_FIREBASE_API_KEY = await question('Clé API Firebase: ');
    envVars.VITE_FIREBASE_AUTH_DOMAIN = await question('Domaine d\'authentification Firebase: ');
    envVars.VITE_FIREBASE_DATABASE_URL = await question('URL de la base de données Firebase: ');
    envVars.VITE_FIREBASE_PROJECT_ID = await question('ID du projet Firebase: ');
    envVars.VITE_FIREBASE_STORAGE_BUCKET = await question('Bucket de stockage Firebase: ');
    envVars.VITE_FIREBASE_MESSAGING_SENDER_ID = await question('ID de l\'expéditeur de messages: ');
    envVars.VITE_FIREBASE_APP_ID = await question('ID de l\'application Firebase: ');
    
    // Configuration Neon
    console.log('\n🐘 Configuration Neon Database:');
    envVars.DATABASE_URL = await question('URL de connexion Neon Database: ');
    envVars.VITE_DATABASE_URL = envVars.DATABASE_URL;
    
    // Configuration ImgBB
    console.log('\n🖼️ Configuration ImgBB:');
    envVars.VITE_IMGBB_API_KEY = await question('Clé API ImgBB: ');
    
    // Configuration Google Analytics
    console.log('\n📊 Configuration Google Analytics:');
    envVars.VITE_GA_TRACKING_ID = await question('ID de suivi Google Analytics: ');
    
    // Créer le fichier .env
    const envContent = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Fichier .env créé avec succès !');
    
    // Créer le fichier .env.example
    const exampleContent = Object.entries(envVars)
        .map(([key, value]) => `${key}=your_${key.toLowerCase().replace('vite_', '').replace('_', '_')}`)
        .join('\n');
    
    fs.writeFileSync('.env.example', exampleContent);
    console.log('✅ Fichier .env.example créé avec succès !');
    
    rl.close();
}

// Exécuter la configuration
if (import.meta.url === `file://${process.argv[1]}`) {
    setupEnvironment();
}

export { setupEnvironment };
