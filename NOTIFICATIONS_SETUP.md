# Configuration des Notifications Push

Ce document explique comment configurer les notifications push pour l'application Perfect Models Management.

## Vue d'ensemble

Les notifications push sont envoyées automatiquement à l'administrateur pour les événements suivants:

- ✅ **Nouvelles candidatures casting** - Quand un candidat soumet son dossier
- ✅ **Nouveaux messages de contact** - Via le formulaire de contact
- ✅ **Nouvelles demandes de booking** - Demandes de réservation de mannequins
- ✅ **Candidatures Perfect Fashion Day** - Inscriptions pour l'événement
- ✅ **Connexions utilisateurs** - Quand un utilisateur se connecte (Admin, Mannequin, Jury, Staff)
- ✅ **Demandes de récupération d'accès** - Quand un utilisateur a oublié ses identifiants

## Configuration requise

### 1. Obtenir la clé serveur FCM (Server Key)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Cliquez sur l'icône ⚙️ (Paramètres) → **Paramètres du projet**
4. Allez dans l'onglet **Cloud Messaging**
5. Sous **API Cloud Messaging (héritée)**, copiez la **Clé du serveur**

⚠️ **Important**: Si l'API Cloud Messaging (héritée) n'est pas activée, cliquez sur les trois points ⋮ et activez-la.

### 2. Configurer les variables d'environnement

Ajoutez la clé serveur dans vos fichiers `.env`:

```env
# Clé serveur FCM pour envoyer les notifications
VITE_FCM_SERVER_KEY=AAAA...votre_cle_serveur_ici

# Clé VAPID pour recevoir les notifications (déjà configurée)
VITE_FIREBASE_VAPID_KEY=votre_cle_vapid
```

### 3. Fichiers concernés

Les notifications sont gérées par:

- `src/utils/adminNotify.ts` - Service d'envoi des notifications
- `src/utils/fcmService.ts` - Gestion des tokens et permissions
- `src/hooks/usePushNotifications.ts` - Hook React pour les notifications

### 4. Activer les notifications côté admin

1. Connectez-vous au tableau de bord admin
2. Cliquez sur l'icône 🔔 dans le header
3. Autorisez les notifications dans votre navigateur
4. Le token FCM sera automatiquement sauvegardé dans Firebase

## Architecture

```
┌─────────────────┐
│  Événement      │ (Soumission formulaire, connexion, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  notifyAdmin()  │ Fonction appelée avec type et message
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Firebase DB    │ Récupère le token FCM admin
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FCM API        │ Envoie la notification push
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin Device   │ Reçoit la notification
└─────────────────┘
```

## Types de notifications

| Type | Titre | Événement déclencheur |
|------|-------|----------------------|
| `visit` | 👁️ Nouvelle visite | Connexion d'un utilisateur |
| `casting` | 🎬 Nouvelle candidature casting | Soumission formulaire casting |
| `contact` | ✉️ Nouveau message de contact | Message via formulaire contact |
| `booking` | 📅 Nouvelle demande de booking | Demande de réservation |
| `fashionday` | ✨ Candidature Perfect Fashion Day | Inscription PFD |

## Test des notifications

### Test manuel

1. Ouvrez le tableau de bord admin
2. Activez les notifications (icône 🔔)
3. Dans un autre onglet/navigateur, soumettez un formulaire
4. Vous devriez recevoir une notification

### Test avec curl

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Content-Type: application/json" \
  -H "Authorization: key=VOTRE_CLE_SERVEUR" \
  -d '{
    "to": "TOKEN_FCM_ADMIN",
    "notification": {
      "title": "Test Notification",
      "body": "Ceci est un test",
      "icon": "/logopmm.jpg"
    }
  }'
```

## Déploiement mobile (Android)

Les notifications fonctionnent automatiquement dans l'app Android via Capacitor:

1. Assurez-vous que `google-services.json` est configuré
2. Les permissions sont déjà définies dans `AndroidManifest.xml`
3. Le service `MyFirebaseMessagingService.java` gère les notifications en arrière-plan

### Build et sync

```bash
# 1. Build web
npm run build

# 2. Sync avec Capacitor
npx cap sync android

# 3. Build APK
cd android
./gradlew assembleDebug
```

## Dépannage

### Les notifications ne s'affichent pas

1. ✅ Vérifiez que `VITE_FCM_SERVER_KEY` est définie
2. ✅ Vérifiez que l'admin a activé les notifications
3. ✅ Vérifiez que le token est sauvegardé dans Firebase DB (`/adminFcmToken`)
4. ✅ Vérifiez la console du navigateur pour les erreurs
5. ✅ Testez avec curl pour isoler le problème

### Erreur "Unauthorized"

- La clé serveur FCM est incorrecte ou expirée
- Vérifiez que vous utilisez la bonne clé du bon projet Firebase

### Token non sauvegardé

- Vérifiez les permissions du navigateur
- Vérifiez que le service worker est enregistré (`/firebase-messaging-sw.js`)
- Vérifiez les règles Firebase Realtime Database

## Sécurité

⚠️ **Important**: 

- Ne commitez JAMAIS la clé serveur FCM dans Git
- Ajoutez `.env` et `.env.local` dans `.gitignore`
- Utilisez des variables d'environnement pour le déploiement
- La clé serveur doit rester côté serveur en production

## Support

Pour plus d'informations:
- [Documentation Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
