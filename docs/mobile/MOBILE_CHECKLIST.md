# ✅ Checklist Mobile - Perfect Models Management

## Installation et Configuration

### Capacitor
- [x] Capacitor Core installé
- [x] Capacitor CLI installé
- [x] Capacitor Android installé
- [x] Capacitor iOS installé (à faire sur macOS)
- [x] Configuration `capacitor.config.ts` créée
- [x] Plugins installés (Camera, Push, Status Bar, etc.)

### Projet Android
- [x] Dossier `android/` créé
- [x] Gradle configuré
- [x] Permissions ajoutées dans `AndroidManifest.xml`
- [x] 7 plugins Capacitor configurés
- [ ] Android Studio installé (à faire par l'utilisateur)
- [ ] Émulateur créé (à faire par l'utilisateur)

### Projet iOS (macOS uniquement)
- [ ] Dossier `ios/` créé (commande : `npx cap add ios`)
- [ ] CocoaPods installé
- [ ] Xcode installé
- [ ] Simulateur configuré

## Code et Intégration

### Hooks
- [x] `useCapacitor.ts` - Détection plateforme
- [x] Intégré dans `App.tsx`
- [x] Status bar configurée
- [x] Splash screen configurée
- [x] Back button Android géré

### Services
- [x] `nativeCamera.ts` - Caméra et galerie
- [x] `nativePush.ts` - Notifications push natives
- [x] Intégration conditionnelle (web vs mobile)

### Composants
- [x] `MobileImagePicker.tsx` - Boutons caméra/galerie
- [x] Détection automatique plateforme
- [x] Fallback sur web (input file)

### Build
- [x] `npm run build` fonctionne
- [x] `npx cap sync` fonctionne
- [x] Assets copiés dans `android/app/src/main/assets/public`

## Documentation

### Guides Créés
- [x] `README_MOBILE.md` - Vue d'ensemble
- [x] `QUICKSTART_MOBILE.md` - Démarrage rapide
- [x] `MOBILE.md` - Guide complet
- [x] `ANDROID_SETUP.md` - Configuration Android
- [x] `MOBILE_COMMANDS.md` - Aide-mémoire
- [x] `MOBILE_SUMMARY.md` - Résumé
- [x] `MOBILE_CHECKLIST.md` - Cette checklist
- [x] `resources/README.md` - Génération icônes

### Scripts NPM
- [x] `mobile:build` - Build + sync
- [x] `mobile:android` - Ouvrir Android Studio
- [x] `mobile:ios` - Ouvrir Xcode
- [x] `mobile:sync` - Sync uniquement

## Configuration

### Fichiers de Config
- [x] `capacitor.config.ts` configuré
- [x] `.gitignore` mis à jour (builds mobiles)
- [x] `package.json` mis à jour (scripts)
- [x] `AndroidManifest.xml` mis à jour (permissions)

### Variables d'Environnement
- [x] `VITE_BREVO_API_KEY` ajoutée
- [x] Firebase config déjà présente
- [x] `google-services.json` téléchargé et copié ✅
- [ ] `GoogleService-Info.plist` à télécharger (iOS)

## Tests à Faire

### Android
- [ ] Ouvrir Android Studio : `npm run mobile:android`
- [ ] Attendre Gradle sync
- [ ] Créer un émulateur
- [ ] Lancer l'app (bouton Run ▶️)
- [ ] Tester la navigation
- [ ] Tester la caméra (page upload)
- [ ] Tester les notifications push
- [ ] Vérifier la status bar (noir)
- [ ] Tester le back button

### iOS (macOS)
- [ ] Ajouter iOS : `npx cap add ios`
- [ ] Ouvrir Xcode : `npm run mobile:ios`
- [ ] Installer CocoaPods
- [ ] Créer un simulateur
- [ ] Lancer l'app (bouton Play ▶️)
- [ ] Tester la navigation
- [ ] Tester la caméra
- [ ] Tester les notifications push
- [ ] Vérifier la status bar

### Live Reload
- [ ] Trouver IP locale : `ipconfig`
- [ ] Éditer `capacitor.config.ts` avec IP
- [ ] Lancer dev server : `npm run dev`
- [ ] Sync : `npm run mobile:sync`
- [ ] Ouvrir app : `npm run mobile:android`
- [ ] Modifier un fichier
- [ ] Vérifier hot reload

## Ressources et Assets

### Icônes
- [ ] Créer `resources/icon.png` (1024x1024)
- [ ] Créer `resources/splash.png` (2732x2732)
- [ ] Générer : `npx @capacitor/assets generate`
- [ ] Vérifier dans `android/app/src/main/res/mipmap-*/`
- [ ] Vérifier dans `ios/App/App/Assets.xcassets/` (iOS)

### Firebase
- [x] Télécharger `google-services.json` ✅
- [x] Placer dans `android/app/google-services.json` ✅
- [x] Configurer Firebase Messaging ✅
- [x] Service MyFirebaseMessagingService créé ✅
- [ ] Télécharger `GoogleService-Info.plist` (iOS)
- [ ] Placer dans `ios/App/App/GoogleService-Info.plist`
- [ ] Vérifier les règles Firebase déployées

## Production

### Android
- [ ] Générer clé de signature : `keytool -genkey`
- [ ] Créer `android/keystore.properties`
- [ ] Configurer `android/app/build.gradle`
- [ ] Build APK : `./gradlew assembleRelease`
- [ ] Tester APK sur device
- [ ] Build AAB : `./gradlew bundleRelease`
- [ ] Créer compte Google Play Console
- [ ] Upload AAB
- [ ] Remplir store listing
- [ ] Soumettre pour review

### iOS (macOS)
- [ ] Configurer Bundle ID dans Xcode
- [ ] Sélectionner équipe de développement
- [ ] Configurer signing & capabilities
- [ ] Archive : Product → Archive
- [ ] Distribute App → App Store Connect
- [ ] Créer compte Apple Developer
- [ ] Remplir App Store listing
- [ ] Soumettre pour review

## Optimisations

### Performance
- [ ] Activer minification (production)
- [ ] Optimiser images
- [ ] Lazy loading des routes
- [ ] Code splitting

### UX Mobile
- [ ] Tester sur différentes tailles d'écran
- [ ] Vérifier les touch targets (min 44x44)
- [ ] Tester en mode portrait/paysage
- [ ] Vérifier les animations
- [ ] Tester la navigation gestuelle

### Sécurité
- [ ] Ne pas exposer les clés sensibles
- [ ] Utiliser HTTPS uniquement
- [ ] Valider les inputs
- [ ] Sécuriser les API calls
- [ ] Configurer Content Security Policy

## Maintenance

### Updates
- [ ] Mettre à jour Capacitor : `npm install @capacitor/core@latest`
- [ ] Mettre à jour plugins : `npm install @capacitor/camera@latest`
- [ ] Sync après updates : `npx cap sync`
- [ ] Tester après chaque update

### Monitoring
- [ ] Configurer Firebase Analytics
- [ ] Configurer Crashlytics
- [ ] Monitorer les performances
- [ ] Suivre les reviews utilisateurs

## Notes

### Commandes Rapides
```bash
# Test Android
npm run mobile:android

# Test iOS
npm run mobile:ios

# Build + Sync
npm run mobile:build

# Live Reload
npm run dev
npm run mobile:sync
```

### Liens Utiles
- Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode/
- Firebase: https://console.firebase.google.com/

---

## Statut Actuel

✅ **Prêt pour Android** - Lance `npm run mobile:android` pour tester !

⏳ **iOS à configurer** - Nécessite macOS + Xcode

📱 **Fonctionnalités natives** - Caméra, Push, Status Bar implémentées

📚 **Documentation complète** - 8 fichiers de docs créés

🚀 **Prêt à déployer** - Suis les étapes Production ci-dessus

---

**Prochaine étape recommandée :** Ouvre Android Studio et teste l'app !

```bash
npm run mobile:android
```
