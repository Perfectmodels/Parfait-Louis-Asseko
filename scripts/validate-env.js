#!/usr/bin/env node

/**
 * Script de validation des variables d'environnement
 * Vérifie que toutes les clés API nécessaires sont configurées
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Variables d'environnement requises
const REQUIRED_ENV_VARS = [
    'VITE_BREVO_API_KEY',
    'VITE_GOOGLE_AI_API_KEY'
];

// Variables optionnelles
const OPTIONAL_ENV_VARS = [
    'VITE_CLOUDINARY_CLOUD_NAME',
    'VITE_CLOUDINARY_API_KEY',
    'VITE_CLOUDINARY_API_SECRET',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_SMS_API_KEY',
    'VITE_ANALYTICS_API_KEY'
];

function loadEnvFile() {
    try {
        const envPath = join(projectRoot, '.env');
        const envContent = readFileSync(envPath, 'utf8');
        const envVars = {};
        
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return envVars;
    } catch (error) {
        console.error('❌ Impossible de charger le fichier .env');
        console.error('💡 Créez un fichier .env basé sur .env.example');
        return {};
    }
}

function validateEnvVars() {
    console.log('🔍 Validation des variables d\'environnement...\n');
    
    const envVars = loadEnvFile();
    let hasErrors = false;
    
    // Vérifier les variables requises
    console.log('📋 Variables requises:');
    REQUIRED_ENV_VARS.forEach(varName => {
        const value = envVars[varName];
        if (!value || value === 'your-' + varName.toLowerCase().replace('vite_', '').replace(/_/g, '-') + '-here') {
            console.log(`❌ ${varName}: Non configurée`);
            hasErrors = true;
        } else {
            console.log(`✅ ${varName}: Configurée`);
        }
    });
    
    console.log('\n📋 Variables optionnelles:');
    OPTIONAL_ENV_VARS.forEach(varName => {
        const value = envVars[varName];
        if (!value || value.includes('your-') || value.includes('here')) {
            console.log(`⚠️  ${varName}: Non configurée (optionnelle)`);
        } else {
            console.log(`✅ ${varName}: Configurée`);
        }
    });
    
    if (hasErrors) {
        console.log('\n❌ Certaines variables requises ne sont pas configurées');
        console.log('💡 Copiez .env.example vers .env et configurez vos clés API');
        process.exit(1);
    } else {
        console.log('\n✅ Toutes les variables requises sont configurées');
    }
}

// Exécuter la validation
validateEnvVars();
