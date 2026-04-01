# 🔑 Comment obtenir la clé serveur FCM

## Étapes détaillées avec captures

### 1. Accéder à Firebase Console

Allez sur: https://console.firebase.google.com/

### 2. Sélectionner votre projet

Cliquez sur le projet **Perfect Models Management**

### 3. Accéder aux paramètres

1. Cliquez sur l'icône ⚙️ (roue dentée) en haut à gauche
2. Sélectionnez **Paramètres du projet**

### 4. Onglet Cloud Messaging

1. Cliquez sur l'onglet **Cloud Messaging**
2. Faites défiler jusqu'à la section **API Cloud Messaging (héritée)**

### 5. Activer l'API (si nécessaire)

Si vous voyez "API Cloud Messaging (héritée) désactivée":
1. Cliquez sur les trois points verticaux ⋮
2. Sélectionnez **Activer l'API Cloud Messaging (héritée)**

### 6. Copier la clé

Copiez la valeur du champ **Clé du serveur**

Format: `AAAA...` (commence généralement par AAAA)

### 7. Ajouter dans .env.local

```env
VITE_FCM_SERVER_KEY=AAAA...votre_cle_copiee
```

### 8. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

## ✅ Vérification

Dans la console du navigateur (tableau de bord admin):

```javascript
window.testNotifications.check()
```

Vous devriez voir:
```
✅ Clé serveur FCM
```

## ⚠️ Important

- Ne commitez JAMAIS cette clé dans Git
- Gardez-la confidentielle
- Utilisez `.env.local` (déjà dans .gitignore)
