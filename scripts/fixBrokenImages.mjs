import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDlE_x6E8y3SHNbe95gFB0WjXH3i1XS45I",
  authDomain: "pmmdb-89a3f.firebaseapp.com",
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com",
  projectId: "pmmdb-89a3f",
  storageBucket: "pmmdb-89a3f.firebasestorage.app",
  messagingSenderId: "1062005773098",
  appId: "1:1062005773098:web:7e3c3a5b8e4a2e7c5b3e8f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Image par défaut
const DEFAULT_IMAGE = '/placeholder-model.jpg';

async function fixBrokenImages() {
  console.log('🔧 Correction des images cassées...\n');

  try {
    const modelsRef = ref(db, 'models');
    const snapshot = await get(modelsRef);
    const models = snapshot.val() || [];

    console.log(`📊 ${models.length} mannequins trouvés\n`);

    let fixedCount = 0;
    let alreadyOkCount = 0;

    const updatedModels = models.map(model => {
      let updated = { ...model };
      let wasFixed = false;

      // Vérifier l'image principale
      if (!model.imageUrl || model.imageUrl.includes('i.ibb.co')) {
        updated.imageUrl = DEFAULT_IMAGE;
        wasFixed = true;
      }

      // Vérifier le portfolio
      if (model.portfolio && Array.isArray(model.portfolio)) {
        const fixedPortfolio = model.portfolio.map(img => 
          (!img || img.includes('i.ibb.co')) ? DEFAULT_IMAGE : img
        );
        if (JSON.stringify(fixedPortfolio) !== JSON.stringify(model.portfolio)) {
          updated.portfolio = fixedPortfolio;
          wasFixed = true;
        }
      }

      if (wasFixed) {
        fixedCount++;
        console.log(`✅ Corrigé: ${model.name}`);
      } else {
        alreadyOkCount++;
      }

      return updated;
    });

    // Sauvegarder les modifications
    await set(modelsRef, updatedModels);

    console.log(`\n📈 RÉSUMÉ:`);
    console.log(`   - Mannequins corrigés: ${fixedCount}`);
    console.log(`   - Déjà OK: ${alreadyOkCount}`);
    console.log(`   - Total: ${models.length}`);
    console.log(`\n✅ Correction terminée !`);
    console.log(`\n💡 IMPORTANT:`);
    console.log(`   Les images pointent maintenant vers /placeholder-model.jpg`);
    console.log(`   Vous devrez uploader les vraies photos des mannequins via le panel admin.`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixBrokenImages();

