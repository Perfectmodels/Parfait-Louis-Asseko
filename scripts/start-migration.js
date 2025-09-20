#!/usr/bin/env node

/**
 * Script de démarrage rapide pour la migration
 * Guide l'utilisateur à travers le processus de migration
 */

import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function startMigration() {
    console.log('🚀 Migration Perfect Models: Firebase vers Neon Database');
    console.log('=======================================================');
    console.log('');
    
    console.log('📋 Étapes de la migration:');
    console.log('1. Configuration des variables d\'environnement');
    console.log('2. Test des connexions');
    console.log('3. Migration des données');
    console.log('4. Vérification des résultats');
    console.log('');
    
    const proceed = await question('Voulez-vous commencer la migration ? (y/N): ');
    
    if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('❌ Migration annulée');
        rl.close();
        return;
    }
    
    try {
        // Étape 1: Configuration
        console.log('\n🔧 Étape 1: Configuration des variables d\'environnement');
        console.log('=======================================================');
        
        const configExists = await question('Avez-vous déjà configuré les variables d\'environnement ? (y/N): ');
        
        if (configExists.toLowerCase() !== 'y' && configExists.toLowerCase() !== 'yes') {
            console.log('📝 Lancement de la configuration...');
            execSync('npm run setup', { stdio: 'inherit' });
        }
        
        // Étape 2: Test des connexions
        console.log('\n🔍 Étape 2: Test des connexions');
        console.log('===============================');
        
        const testConnections = await question('Voulez-vous tester les connexions ? (Y/n): ');
        
        if (testConnections.toLowerCase() !== 'n' && testConnections.toLowerCase() !== 'no') {
            console.log('🧪 Test des connexions en cours...');
            execSync('npm run test', { stdio: 'inherit' });
        }
        
        // Étape 3: Migration
        console.log('\n🚀 Étape 3: Migration des données');
        console.log('=================================');
        
        const migrateData = await question('Voulez-vous lancer la migration ? (Y/n): ');
        
        if (migrateData.toLowerCase() !== 'n' && migrateData.toLowerCase() !== 'no') {
            console.log('📦 Migration en cours...');
            execSync('npm run migrate', { stdio: 'inherit' });
        }
        
        // Étape 4: Vérification
        console.log('\n✅ Étape 4: Vérification des résultats');
        console.log('=====================================');
        
        const verifyResults = await question('Voulez-vous vérifier les résultats ? (Y/n): ');
        
        if (verifyResults.toLowerCase() !== 'n' && verifyResults.toLowerCase() !== 'no') {
            console.log('🔍 Vérification en cours...');
            execSync('npm run test', { stdio: 'inherit' });
        }
        
        console.log('\n🎉 Migration terminée avec succès !');
        console.log('===================================');
        console.log('');
        console.log('📊 Prochaines étapes:');
        console.log('1. Tester votre application avec Neon Database');
        console.log('2. Configurer les backups automatiques');
        console.log('3. Optimiser les requêtes si nécessaire');
        console.log('4. Surveiller les performances');
        console.log('');
        console.log('📚 Documentation: docs/MIGRATION_GUIDE.md');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        console.log('');
        console.log('🛠️ Dépannage:');
        console.log('1. Vérifiez les variables d\'environnement');
        console.log('2. Vérifiez les connexions Firebase et Neon');
        console.log('3. Consultez les logs détaillés');
        console.log('4. Consultez la documentation: docs/MIGRATION_GUIDE.md');
    }
    
    rl.close();
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
    startMigration();
}

export { startMigration };
