# Guide de Migration vers Variables d'Environnement

## ✅ Fichier .env créé

Le fichier `.env` a été créé avec toutes vos clés API actuelles.

## 🔄 Étapes de Migration

### 1. Mettre à jour `firebaseConfig.ts`

**Avant :**

```typescript
const firebaseConfig = {
    apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
    authDomain: "perfectmodels-4e5fa.firebaseapp.com",
    // ...
};
```

**Après :**

```typescript
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

### 2. Mettre à jour `src/constants/data.ts`

**Avant :**

```typescript
export const apiKeys: ApiKeys = {
  resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
  formspreeEndpoint: 'https://formspree.io/f/xovnyqnz',
  firebaseDynamicLinks: {
    webApiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
    domainUriPrefix: 'https://perfectmodels.page.link'
  },
  imgbbApiKey: '59f0176178bae04b1f2cbd7f5bc03614',
  brevoApiKey: 'VOTRE_CLÉ_API_BREVO_ICI',
};
```

**Après :**

```typescript
export const apiKeys: ApiKeys = {
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || 're_12345678_abcdefghijklmnopqrstuvwxyz',
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xovnyqnz',
  firebaseDynamicLinks: {
    webApiKey: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_API_KEY || "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
    domainUriPrefix: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_DOMAIN || 'https://perfectmodels.page.link'
  },
  imgbbApiKey: import.meta.env.VITE_IMGBB_API_KEY || '59f0176178bae04b1f2cbd7f5bc03614',
  brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || 'VOTRE_CLÉ_API_BREVO_ICI',
};
```

### 3. Redémarrer le serveur de développement

Après avoir modifié les fichiers, redémarrez le serveur :

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis relancer
npm run dev
```

## 🔒 Sécurité

### ⚠️ IMPORTANT : Mots de passe du Jury

Les mots de passe du jury sont actuellement en dur dans le code :

```typescript
export const juryMembers: JuryMember[] = [
  { id: 'jury1', name: 'Martelly', username: 'jury1', password: 'password2025' },
  // ...
];
```

**Recommandations :**

1. **NE JAMAIS** stocker de mots de passe en clair dans le code
2. Utiliser Firebase Authentication pour gérer les utilisateurs
3. Ou au minimum, hasher les mots de passe avec bcrypt

### 📋 Checklist de Sécurité

- [x] Fichier `.env` créé
- [x] `.env` ajouté au `.gitignore`
- [ ] Migrer `firebaseConfig.ts` vers variables d'environnement
- [ ] Migrer `data.ts` vers variables d'environnement
- [ ] Redémarrer le serveur de développement
- [ ] Tester que tout fonctionne
- [ ] Supprimer les clés en dur du code
- [ ] Implémenter un système d'authentification sécurisé pour le jury

## 🚀 Déploiement

### Pour Vercel

1. Aller dans les paramètres du projet Vercel
2. Ajouter toutes les variables d'environnement :
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

### Pour Netlify

1. Aller dans Site settings > Build & deploy > Environment
2. Ajouter toutes les variables

## 📝 Notes

- Les variables d'environnement Vite doivent commencer par `VITE_` pour être accessibles côté client
- Utilisez `import.meta.env.VITE_NOM_VARIABLE` pour y accéder
- Ne commitez JAMAIS le fichier `.env` dans Git
- Utilisez `.env.example` comme template pour les autres développeurs

## 🔑 Clés API Actuelles

### Firebase

- ✅ Configuration complète extraite
- ✅ Database URL configurée

### Services Tiers

- ✅ ImgBB API Key
- ✅ Formspree Endpoint
- ✅ Firebase Dynamic Links
- ⚠️ Resend API Key (placeholder)
- ⚠️ Brevo API Key (à configurer)
- ⚠️ Gemini API Key (manquante)

## 🎯 Prochaines Étapes

1. Obtenir une vraie clé API Gemini si nécessaire
2. Configurer Brevo avec une vraie clé
3. Migrer le code pour utiliser les variables d'environnement
4. Tester en local
5. Configurer les variables sur Vercel/Netlify
6. Déployer
