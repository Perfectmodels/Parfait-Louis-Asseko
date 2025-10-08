# Guide de Migration des Images

## Problème
Les images hébergées sur ImgBB (i.ibb.co) retournent des erreurs 404 car elles ont été supprimées ou les liens ont expiré.

## Solution Recommandée : Images Locales

### Étape 1 : Créer la structure de dossiers
```
public/
  images/
    models/          # Photos des mannequins
    events/          # Photos d'événements
    gallery/         # Photos de galerie
    placeholder/     # Images par défaut
```

### Étape 2 : Télécharger et organiser vos images
1. Récupérez toutes vos photos originales
2. Placez-les dans les dossiers appropriés
3. Utilisez des noms de fichiers clairs (ex: `samantha-abongobiang.jpg`)

### Étape 3 : Mettre à jour les URLs dans Firebase

#### Pour les mannequins (via Admin Panel) :
1. Allez sur `/admin/models`
2. Pour chaque mannequin, cliquez sur "Modifier"
3. Changez l'URL de l'image de :
   - `https://i.ibb.co/xxxxx/image.jpg`
   - vers : `/images/models/nom-du-mannequin.jpg`

#### Ou via script automatique :

```javascript
// scripts/updateImageUrls.mjs
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com",
  // ... autres configs
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function updateImageUrls() {
  const modelsRef = ref(db, 'models');
  const snapshot = await get(modelsRef);
  const models = snapshot.val() || [];

  const updatedModels = models.map(model => ({
    ...model,
    imageUrl: model.imageUrl?.includes('i.ibb.co') 
      ? `/images/models/${model.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
      : model.imageUrl,
    portfolio: model.portfolio?.map((img: string) => 
      img.includes('i.ibb.co')
        ? `/images/gallery/${model.id}-${Date.now()}.jpg`
        : img
    ) || []
  }));

  await set(modelsRef, updatedModels);
  console.log('✅ Images mises à jour !');
}

updateImageUrls();
```

### Étape 4 : Image par défaut

Créez une image placeholder et placez-la dans `public/images/placeholder/model-default.jpg`

Puis mettez à jour `src/constants/data.ts` :

```typescript
export const DEFAULT_MODEL_IMAGE = '/images/placeholder/model-default.jpg';
```

### Étape 5 : Mise à jour des composants

Dans vos composants React, ajoutez une gestion d'erreur :

```tsx
<img 
  src={model.imageUrl} 
  alt={model.name}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder/model-default.jpg';
  }}
/>
```

## Alternative : Hébergement Cloud

Si vous préférez un hébergement externe :

### Option A : Firebase Storage (Recommandé)
1. Activez Firebase Storage
2. Uploadez vos images
3. Récupérez les URLs permanentes
4. Mettez à jour Firebase Database

### Option B : Cloudinary (Gratuit jusqu'à 25 GB)
1. Créez un compte sur cloudinary.com
2. Uploadez vos images
3. Utilisez leurs URLs optimisées

### Option C : AWS S3 / Google Cloud Storage
Pour des besoins professionnels avec CDN

## Avantages des Images Locales

✅ Aucune dépendance externe
✅ Chargement plus rapide (même domaine)
✅ Contrôle total sur les images
✅ Pas de limite de bande passante
✅ Pas de risque de suppression

## Script pour télécharger les images fonctionnelles

Si certaines images sur i.ibb.co fonctionnent encore :

```bash
# Installez wget (Windows: via scoop ou chocolatey)
# Puis créez un script pour télécharger les images restantes
```

## Prochaines étapes

1. Décidez quelle solution utiliser (local recommandé)
2. Organisez vos photos
3. Créez les dossiers nécessaires
4. Mettez à jour les URLs dans Firebase
5. Testez avec quelques mannequins d'abord
6. Déployez la mise à jour complète

