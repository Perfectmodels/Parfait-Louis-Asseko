# 🚀 Déploiement Firestore - Guide Rapide

## 📋 Prérequis

1. ✅ Migration vers Firestore complétée
2. ✅ Tests effectués avec succès
3. ✅ Firebase CLI installé (`npm install -g firebase-tools`)
4. ✅ Authentification Firebase (`firebase login`)

## 🔧 Étapes de Déploiement

### 1. Déployer les Règles Firestore

```bash
# Déployer uniquement les règles Firestore
firebase deploy --only firestore:rules

# Ou déployer tout Firebase
firebase deploy
```

### 2. Vérifier les Règles dans la Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `perfectmodels-4e5fa`
3. Cliquez sur **Firestore Database**
4. Allez dans l'onglet **Règles**
5. ✅ Vérifiez que les règles sont déployées

### 3. Tester les Règles

```bash
# Tester les règles localement (optionnel)
firebase emulators:start --only firestore
```

## 🔒 Passer en Mode Production

### Étape 1 : Modifier `firestore.rules`

1. Ouvrez `firestore.rules`
2. **Commentez** les règles de développement (section "RÈGLES DE DÉVELOPPEMENT")
3. **Décommentez** les règles de production (section "RÈGLES DE PRODUCTION")

### Étape 2 : Configurer Firebase Auth

Les règles de production utilisent `request.auth.token.admin`. Vous devez :

1. Activer Firebase Authentication
2. Créer des utilisateurs admin
3. Ajouter un custom claim `admin: true`

```javascript
// Dans Firebase Functions ou Admin SDK
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### Étape 3 : Déployer

```bash
firebase deploy --only firestore:rules
```

## 🧪 Tester Après Déploiement

### Test 1 : Lecture Publique

- ✅ Ouvrez votre site en navigation privée
- ✅ Vérifiez que les mannequins publics s'affichent
- ✅ Vérifiez que les articles s'affichent

### Test 2 : Écriture Admin

- ✅ Connectez-vous en tant qu'admin
- ✅ Essayez d'ajouter un mannequin
- ✅ Essayez de modifier un article

### Test 3 : Écriture Publique (Candidatures)

- ✅ Déconnectez-vous
- ✅ Remplissez le formulaire de candidature
- ✅ Vérifiez que la candidature est créée

## 📊 Monitorer les Règles

### Console Firebase

1. Allez dans **Firestore Database** > **Règles**
2. Cliquez sur **Simulateur de règles**
3. Testez différentes opérations

### Logs

```bash
# Voir les logs Firebase
firebase functions:log
```

## 🔄 Rollback (En cas de problème)

### Option 1 : Revenir aux Règles de Développement

```bash
# Réactiver les règles permissives
firebase deploy --only firestore:rules
```

### Option 2 : Restaurer une Version Précédente

1. Allez dans Firebase Console > Firestore > Règles
2. Cliquez sur **Historique des règles**
3. Sélectionnez une version précédente
4. Cliquez sur **Publier**

## ⚠️ Avertissements

### Mode Développement (Actuel)

```javascript
match /{document=**} {
  allow read, write: if true; // ⚠️ DANGEREUX EN PRODUCTION
}
```

**Risques** :

- ❌ N'importe qui peut lire toutes les données
- ❌ N'importe qui peut modifier/supprimer des données
- ❌ Pas de protection contre les abus

### Mode Production (Recommandé)

```javascript
match /models/{modelId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}
```

**Avantages** :

- ✅ Lecture publique contrôlée
- ✅ Écriture réservée aux admins
- ✅ Protection contre les abus

## 📝 Checklist de Déploiement

- [ ] Tests locaux réussis
- [ ] Règles Firestore configurées
- [ ] Firebase Auth configuré (si mode production)
- [ ] Custom claims admin configurés (si mode production)
- [ ] Règles déployées : `firebase deploy --only firestore:rules`
- [ ] Tests post-déploiement effectués
- [ ] Monitoring activé
- [ ] Documentation mise à jour

## 🆘 Dépannage

### Problème : "Permission denied"

**Solution** :

1. Vérifiez les règles dans Firebase Console
2. Vérifiez l'authentification de l'utilisateur
3. Vérifiez les custom claims

### Problème : "Missing or insufficient permissions"

**Solution** :

1. Vérifiez que les règles sont déployées
2. Vérifiez la structure des documents
3. Testez avec le simulateur de règles

### Problème : Les règles ne se mettent pas à jour

**Solution** :

```bash
# Forcer le déploiement
firebase deploy --only firestore:rules --force
```

## 📚 Ressources

- [Documentation Règles Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Simulateur de Règles](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)

---

**Date** : 29 janvier 2026  
**Version** : 2.0.0  
**Status** : Mode Développement Actif
