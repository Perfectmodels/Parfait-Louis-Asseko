# 📱 Perfect Models Management - Version Mobile

Bienvenue dans la version mobile de Perfect Models Management ! Cette app utilise **Capacitor** pour transformer ton app React en applications natives iOS et Android.

## 🚀 Démarrage Rapide

### 1. Tester sur Android (maintenant !)

```bash
npm run mobile:android
```

Cela va :
1. Ouvrir Android Studio
2. Attendre que Gradle sync (première fois : 5-10 min)
3. Cliquer sur le bouton ▶️ Run

### 2. Tester sur iOS (macOS uniquement)

⚠️ **iOS nécessite macOS et Xcode**

Si tu es sur Windows, consulte **IOS_ON_WINDOWS.md** pour les alternatives.

Si tu as un Mac :

```bash
npx cap add ios
npm run mobile:ios
```

Cela va :
1. Créer le projet iOS
2. Ouvrir Xcode
3. Cliquer sur le bouton ▶️ Play

Voir **IOS_SETUP.md** pour le guide complet.

## 📚 Documentation

- **[QUICKSTART_MOBILE.md](QUICKSTART_MOBILE.md)** - Démarrage rapide (5 min)
- **[MOBILE.md](MOBILE.md)** - Guide complet (tout ce qu'il faut savoir)
- **[ANDROID_SETUP.md](ANDROID_SETUP.md)** - Configuration Android détaillée
- **[MOBILE_COMMANDS.md](MOBILE_COMMANDS.md)** - Aide-mémoire des commandes
- **[MOBILE_SUMMARY.md](MOBILE_SUMMARY.md)** - Résumé de ce qui a été fait

## ✨ Fonctionnalités Mobiles

### Déjà Implémentées
- ✅ Détection automatique de plateforme (iOS/Android/Web)
- ✅ Caméra native (prendre photo + galerie)
- ✅ Notifications push natives
- ✅ Status bar personnalisée (noir #080808)
- ✅ Splash screen (2s)
- ✅ Back button Android géré
- ✅ Vibrations tactiles (haptics)
- ✅ Partage natif

### À Venir
- 🔄 Géolocalisation
- 🔄 Contacts natifs
- 🔄 Calendrier
- 🔄 Biométrie (Face ID / Touch ID)

## 🛠️ Commandes Essentielles

```bash
# Build et sync
npm run mobile:build

# Ouvrir Android Studio
npm run mobile:android

# Ouvrir Xcode (macOS)
npm run mobile:ios

# Sync après modifs
npm run mobile:sync

# Dev avec live reload
npm run dev
# Puis édite capacitor.config.ts avec ton IP
npm run mobile:sync
```

## 📱 Structure

```
perfect-models-management/
├── android/              # Projet Android natif
├── ios/                  # Projet iOS natif (après npx cap add ios)
├── src/
│   ├── hooks/
│   │   └── useCapacitor.ts      # Détection plateforme
│   ├── utils/
│   │   ├── nativeCamera.ts      # Caméra native
│   │   └── nativePush.ts        # Push natif
│   └── components/
│       └── MobileImagePicker.tsx # Picker caméra/galerie
└── capacitor.config.ts   # Config Capacitor
```

## 🎯 Prochaines Étapes

### 1. Tester l'App
```bash
npm run mobile:android
```

### 2. Générer les Icônes
```bash
# Place ton logo 1024x1024 dans resources/icon.png
npx @capacitor/assets generate --iconBackgroundColor '#080808'
```

### 3. Configurer Firebase
- Télécharge `google-services.json` depuis Firebase Console
- Place dans `android/app/google-services.json`
- Pour iOS : `GoogleService-Info.plist` dans `ios/App/App/`

### 4. Tester les Fonctionnalités Natives
- Va sur une page avec upload d'image
- Sur mobile, tu verras les boutons "Prendre une photo" et "Galerie"
- Teste les notifications push

### 5. Build Production
```bash
# Android APK
cd android
./gradlew assembleRelease

# Android AAB (Play Store)
./gradlew bundleRelease

# iOS (Xcode)
npm run mobile:ios
# Product → Archive → Distribute
```

## 🐛 Problèmes Courants

### Android : "SDK location not found"
Crée `android/local.properties` :
```
sdk.dir=C:\\Users\\TON_USER\\AppData\\Local\\Android\\Sdk
```

### iOS : "Command failed: pod install"
```bash
cd ios/App
pod repo update
pod install
```

### L'app ne se met pas à jour
```bash
npm run build
npm run mobile:sync
```

## 📖 Ressources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Firebase Console](https://console.firebase.google.com/)

## 💡 Astuces

### Live Reload (dev rapide)
1. Trouve ton IP : `ipconfig`
2. Édite `capacitor.config.ts` :
   ```typescript
   server: { url: 'http://TON_IP:5174', cleartext: true }
   ```
3. Lance : `npm run dev`
4. Sync : `npm run mobile:sync`
5. Ouvre l'app : `npm run mobile:android`

Maintenant chaque modification se reflète instantanément !

### Détecter la Plateforme
```typescript
import { useCapacitor } from './hooks/useCapacitor';
const { isNative, platform } = useCapacitor();
// isNative: true sur mobile, false sur web
// platform: 'ios' | 'android' | 'web'
```

### Utiliser la Caméra
```typescript
import { takePhoto, pickFromGallery } from './utils/nativeCamera';
const photo = await takePhoto();
const image = await pickFromGallery();
```

## 🎉 C'est Parti !

Ton app est maintenant prête pour iOS et Android. Lance :

```bash
npm run mobile:android
```

Et commence à tester ! 🚀

---

**Questions ?** Consulte les fichiers de documentation dans le dossier racine.

**Besoin d'aide ?** Ouvre une issue sur GitHub ou contacte l'équipe.

**Bon développement !** 💪
