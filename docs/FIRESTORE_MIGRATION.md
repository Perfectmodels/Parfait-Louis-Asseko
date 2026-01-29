# Migration vers Firestore - Documentation

## 📋 Vue d'ensemble

Ce projet a été migré de **Firebase Realtime Database** vers **Firestore** pour bénéficier de meilleures performances, de requêtes plus puissantes et d'une structure de données plus flexible.

## 🔄 Changements effectués

### 1. Configuration Firebase

**Avant (firebaseConfig.ts):**

```typescript
import { getDatabase } from "firebase/database";
export const db = getDatabase(app);
```

**Après (firestoreConfig.ts):**

```typescript
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
```

### 2. Hook useFirestore.tsx

Toutes les fonctions ont été migrées pour utiliser les API Firestore :

| Fonction | Avant (RTDB) | Après (Firestore) |
|----------|--------------|-------------------|
| **Lecture** | `ref()`, `get()` | `collection()`, `getDocs()`, `doc()`, `getDoc()` |
| **Écriture** | `set()` | `setDoc()` |
| **Mise à jour** | `update()` | `updateDoc()` |
| **Suppression** | `remove()` | `deleteDoc()` |

### 3. Structure des données

#### Collections (Arrays)

- `models`, `articles`, `courseData`, `fashionDayEvents`, etc.
- Stockées comme collections Firestore avec des documents individuels

#### Configurations (Objects)

- `siteConfig`, `contactInfo`, `apiKeys`, etc.
- Stockées dans une collection `config` avec des documents nommés

## 🚀 Migration des données existantes

Si vous avez des données dans Realtime Database, utilisez le script de migration :

```bash
node migrate_to_firestore.js
```

Ce script va :

1. ✅ Lire toutes les données de Realtime Database
2. ✅ Les transférer vers Firestore
3. ✅ Conserver la même structure
4. ✅ Afficher un rapport de migration

## 📊 Structure Firestore

### Collections

```
/models/{modelId}
/articles/{articleId}
/fashionDayEvents/{eventId}
/newsItems/{newsId}
/castingApplications/{applicationId}
...
```

### Configurations

```
/config/siteConfig
/config/contactInfo
/config/apiKeys
/config/adminProfile
...
```

## ✅ Avantages de Firestore

1. **Requêtes complexes** : Filtrage, tri et pagination avancés
2. **Indexation automatique** : Meilleures performances
3. **Transactions** : Opérations atomiques garanties
4. **Offline support** : Meilleure gestion hors ligne
5. **Scalabilité** : Conçu pour les grandes applications

## 🔧 Règles de sécurité Firestore

Assurez-vous de configurer les règles de sécurité dans `firestore.rules` :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collections publiques en lecture
    match /models/{modelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Configuration en lecture seule pour le public
    match /config/{configId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Collections privées (admin seulement)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 Tests

Après la migration, testez les fonctionnalités suivantes :

- [ ] Lecture des modèles dans la page d'accueil
- [ ] Ajout d'un nouveau mannequin via l'admin
- [ ] Modification d'un mannequin existant
- [ ] Suppression d'un mannequin
- [ ] Lecture des articles du magazine
- [ ] Gestion des événements Fashion Day
- [ ] Formulaires de contact et candidatures

## 📝 Notes importantes

1. **Backward Compatibility** : Le fichier `firebase.ts` exporte maintenant depuis `firestoreConfig.ts` pour maintenir la compatibilité
2. **Optimistic Updates** : Les fonctions CRUD mettent à jour l'état local immédiatement pour une meilleure UX
3. **Error Handling** : Tous les appels Firestore sont wrappés dans des try/catch avec logging

## 🆘 Dépannage

### Problème : Les données ne s'affichent pas

**Solution** : Vérifiez que les règles Firestore autorisent la lecture

### Problème : Erreur "Permission denied"

**Solution** : Vérifiez l'authentification et les règles de sécurité

### Problème : Les modifications ne sont pas sauvegardées

**Solution** :

1. Vérifiez la console pour les erreurs
2. Assurez-vous que l'ID du document est correct
3. Vérifiez les règles d'écriture Firestore

## 📚 Ressources

- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Migration Guide officiel](https://firebase.google.com/docs/firestore/rtdb-vs-firestore)
- [Best Practices Firestore](https://firebase.google.com/docs/firestore/best-practices)

---

**Date de migration** : 29 janvier 2026  
**Version** : 2.0.0  
**Status** : ✅ Complété
