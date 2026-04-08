# 🔔 Guide Rapide - Notifications Push

## Configuration en 3 étapes

### Étape 1: Obtenir la clé serveur FCM

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet **Perfect Models**
3. Cliquez sur ⚙️ → **Paramètres du projet**
4. Onglet **Cloud Messaging**
5. Copiez la **Clé du serveur** (sous "API Cloud Messaging (héritée)")

### Étape 2: Configurer la variable d'environnement

Ajoutez dans `.env.local`:

```env
VITE_FCM_SERVER_KEY=AAAA...votre_cle_serveur_ici
```

### Étape 3: Activer dans l'admin

1. Connectez-vous au tableau de bord admin
2. Cliquez sur l'icône 🔔 dans le header
3. Autorisez les notifications dans votre navigateur

✅ **C'est tout!** Vous recevrez maintenant des notifications pour:
- Nouvelles candidatures casting
- Messages de contact
- Demandes de booking
- Candidatures Perfect Fashion Day
- Connexions utilisateurs
- Demandes de récupération d'accès

## Test rapide

Ouvrez la console du navigateur dans l'admin et tapez:

```javascript
// Vérifier la configuration
window.testNotifications.check()

// Tester une notification
window.testNotifications.test('casting')

// Tester toutes les notifications
window.testNotifications.testAll()
```

## Déploiement mobile

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

## Besoin d'aide?

Consultez `NOTIFICATIONS_SETUP.md` pour la documentation complète.
