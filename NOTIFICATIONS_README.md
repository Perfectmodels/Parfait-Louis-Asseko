# 📱 Système de Notifications Push - Perfect Models Management

## 🎯 Objectif

Système complet de notifications push pour informer l'administrateur en temps réel de toutes les activités importantes sur la plateforme.

## ✨ Fonctionnalités

### Notifications automatiques pour:

| Événement | Déclencheur | Format | Lien |
|-----------|-------------|--------|------|
| 🎬 **Candidature Casting** | Soumission formulaire | "Prénom Nom — Ville" | `/admin/casting-applications` |
| ✉️ **Message Contact** | Formulaire contact | "Nom — Sujet" | `/admin/messages` |
| 📅 **Demande Booking** | Réservation mannequin | "Client — Mannequin" | `/admin/bookings` |
| ✨ **Candidature PFD** | Inscription événement | "Nom — Rôle" | `/admin/fashion-day-applications` |
| 👁️ **Connexion** | Login utilisateur | "Nom (Rôle)" | Page utilisateur |
| 🔑 **Récupération** | Mot de passe oublié | "Récupération: Nom" | `/admin/recovery-requests` |

## 📂 Structure du projet

```
src/
├── utils/
│   ├── adminNotify.ts          # Service d'envoi des notifications
│   ├── fcmService.ts            # Gestion FCM et tokens
│   └── testNotifications.ts     # Utilitaires de test (nouveau)
├── hooks/
│   └── usePushNotifications.ts  # Hook React pour notifications
├── pages/
│   ├── Admin.tsx                # Dashboard admin (modifié)
│   ├── Login.tsx                # Notifications connexion (modifié)
│   ├── CastingForm.tsx          # Notifications casting (modifié)
│   ├── Contact.tsx              # Notifications contact (existant)
│   └── FashionDayApplicationForm.tsx  # Notifications PFD (existant)
└── components/
    └── BookingForm.tsx          # Notifications booking (existant)

Documentation/
├── QUICK_START_NOTIFICATIONS.md    # Guide rapide (nouveau)
├── NOTIFICATIONS_SETUP.md          # Documentation complète (nouveau)
├── NOTIFICATIONS_CHANGELOG.md      # Historique des modifications (nouveau)
└── NOTIFICATIONS_README.md         # Ce fichier (nouveau)
```

## 🚀 Démarrage rapide

### 1. Configuration (5 minutes)

```bash
# 1. Obtenir la clé serveur FCM
# Firebase Console → Paramètres → Cloud Messaging → Clé du serveur

# 2. Ajouter dans .env.local
echo "VITE_FCM_SERVER_KEY=AAAA...votre_cle" >> .env.local

# 3. Redémarrer le serveur de dev
npm run dev
```

### 2. Activation admin

1. Connectez-vous au tableau de bord admin
2. Cliquez sur l'icône 🔔 dans le header
3. Autorisez les notifications

### 3. Test

```javascript
// Dans la console du navigateur (admin)
window.testNotifications.check()    // Vérifier config
window.testNotifications.testAll()  // Tester toutes les notifications
```

## 📱 Support mobile (Android)

Les notifications fonctionnent automatiquement dans l'app Android:

```bash
# Build et déploiement
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

Configuration déjà en place:
- ✅ `google-services.json` configuré
- ✅ `AndroidManifest.xml` avec permissions
- ✅ `MyFirebaseMessagingService.java` pour notifications background
- ✅ `capacitor.config.ts` avec options de présentation

## 🔧 Architecture technique

### Flow de notification

```
┌──────────────────┐
│  Événement       │  (Formulaire, connexion, etc.)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  notifyAdmin()   │  Fonction centralisée
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Firebase DB     │  Récupère token admin (/adminFcmToken)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  FCM Legacy API  │  POST https://fcm.googleapis.com/fcm/send
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Admin Device    │  Notification browser/mobile
└──────────────────┘
```

### Service centralisé

Toutes les notifications passent par `adminNotify.ts`:

```typescript
import { notifyAdmin } from './utils/adminNotify';

// Envoyer une notification
await notifyAdmin(
  'casting',                           // Type
  'Marie Dupont — Libreville',         // Message
  '/admin/casting-applications'        // Lien (optionnel)
);
```

## 🧪 Tests et validation

### Tests manuels

1. **Test formulaire casting**
   - Remplir et soumettre le formulaire
   - Vérifier la notification reçue

2. **Test connexion**
   - Se connecter avec un compte mannequin
   - Vérifier la notification "Connexion: Nom (Mannequin)"

3. **Test récupération**
   - Cliquer sur "Coordonnées oubliées?"
   - Soumettre une demande
   - Vérifier la notification

### Tests automatisés

```javascript
// Console navigateur (admin)
window.testNotifications.testAll()
```

### Vérification configuration

```javascript
window.testNotifications.check()
// ✅ Support navigateur
// ✅ Permission notifications
// ✅ Clé serveur FCM
// ✅ Clé VAPID
```

### Debug

```javascript
window.testNotifications.debug()
// Affiche toutes les infos de configuration
```

## 🔐 Sécurité

### Variables sensibles

```env
# ⚠️ NE JAMAIS COMMITTER
VITE_FCM_SERVER_KEY=...    # Clé serveur FCM
```

### Bonnes pratiques

- ✅ Clés dans `.env` et `.env.local`
- ✅ `.env` dans `.gitignore`
- ✅ Token admin stocké dans Firebase DB (sécurisé)
- ✅ Notifications envoyées uniquement à l'admin
- ✅ Pas de données sensibles dans les notifications

## 📊 Monitoring

### Vérifier les notifications envoyées

```javascript
// Console Firebase
// Realtime Database → adminFcmToken
// Vérifier que le token est présent
```

### Logs

```javascript
// Console navigateur
// Rechercher: [FCM] ou [adminNotify]
```

## 🐛 Dépannage

### Problème: Notifications non reçues

**Solutions:**
1. Vérifier `VITE_FCM_SERVER_KEY` dans `.env.local`
2. Vérifier permission navigateur (Paramètres → Notifications)
3. Vérifier token dans Firebase DB (`/adminFcmToken`)
4. Tester avec `window.testNotifications.test('casting')`

### Problème: Erreur "Unauthorized"

**Solution:** Clé serveur FCM incorrecte
- Vérifier dans Firebase Console
- Activer l'API Cloud Messaging (héritée) si nécessaire

### Problème: Token non sauvegardé

**Solutions:**
1. Vérifier que le service worker est enregistré
2. Vérifier les règles Firebase Realtime Database
3. Vérifier la console pour les erreurs

## 📚 Documentation

- **Guide rapide**: `QUICK_START_NOTIFICATIONS.md`
- **Configuration complète**: `NOTIFICATIONS_SETUP.md`
- **Historique**: `NOTIFICATIONS_CHANGELOG.md`
- **Ce fichier**: `NOTIFICATIONS_README.md`

## 🎓 Ressources externes

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## 📞 Support

Pour toute question ou problème:
1. Consulter la documentation ci-dessus
2. Vérifier les logs dans la console
3. Utiliser les utilitaires de test
4. Vérifier la configuration Firebase

---

**Version**: 2.5.0  
**Date**: 2026-04-01  
**Statut**: ✅ Production Ready
