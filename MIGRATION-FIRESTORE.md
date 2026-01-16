# 🔄 Migration Realtime Database → Firestore

## Perfect Models Management - Guide de Migration

### 📋 Étapes de migration

#### 1. Exécuter le script de migration

```bash
node migrate-to-firestore.js
```

Ce script va :

- ✅ Lire toutes les données de Realtime Database
- ✅ Les migrer vers Firestore avec la bonne structure
- ✅ Créer les collections et documents appropriés
- ✅ Afficher un rapport détaillé de la migration

#### 2. Activer Firestore dans le code

Une fois la migration terminée, mettez à jour `src/contexts/DataContext.tsx` :

**Avant (Realtime Database) :**

```typescript
import { useDataStore, AppData } from '../hooks/useDataStore';
```

**Après (Firestore) :**

```typescript
import { useFirestore as useDataStore, AppData } from '../hooks/useFirestore';
```

#### 3. Vérifier que tout fonctionne

```bash
npm run dev
```

Ouvrez `http://localhost:5173` et vérifiez que :

- ✅ Les données s'affichent correctement
- ✅ Pas d'erreurs dans la console
- ✅ Les fonctionnalités CRUD fonctionnent

### 📊 Structure Firestore

```
perfectmodels-4e5fa (Firestore)
├── config/
│   ├── siteConfig
│   ├── contactInfo
│   ├── siteImages
│   ├── socialLinks
│   ├── agencyInfo
│   └── apiKeys
│
├── models/
│   ├── {modelId}
│   └── ...
│
├── articles/
│   ├── {articleSlug}
│   └── ...
│
├── fashionDayEvents/
│   ├── {eventId}
│   └── ...
│
├── testimonials/
│   ├── {testimonialId}
│   └── ...
│
├── castingApplications/
│   ├── {applicationId}
│   └── ...
│
└── ... (autres collections)
```

### 🔧 Avantages de Firestore

✅ **Requêtes plus puissantes** - Filtres, tri, pagination
✅ **Meilleure scalabilité** - Gère des millions de documents
✅ **Offline support** - Synchronisation automatique
✅ **Indexation automatique** - Requêtes plus rapides
✅ **Structure plus flexible** - Collections et sous-collections
✅ **Sécurité renforcée** - Rules plus granulaires

### ⚠️ Points d'attention

1. **Coûts** : Firestore facture par lecture/écriture (mais gratuit jusqu'à 50K lectures/jour)
2. **Rules** : Pensez à configurer les règles de sécurité Firestore
3. **Indexes** : Certaines requêtes complexes nécessitent des index

### 🔐 Règles de sécurité Firestore recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Config publique en lecture seule
    match /config/{document=**} {
      allow read: true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Collections publiques en lecture
    match /{collection}/{document=**} {
      allow read: true;
      allow write: if request.auth != null;
    }
  }
}
```

### 🚀 Rollback (si nécessaire)

Si vous voulez revenir à Realtime Database :

1. Dans `src/contexts/DataContext.tsx`, remettez :

```typescript
import { useDataStore, AppData } from '../hooks/useDataStore';
```

1. Vos données Realtime Database sont toujours intactes !

### 📞 Support

En cas de problème, vérifiez :

1. Console Firebase → Firestore Database
2. Console navigateur (F12) → Erreurs
3. Logs du script de migration

---

**Créé pour Perfect Models Management** 👑
