# Perfect Models Management - Version Mobile

Cette app utilise **Capacitor** pour créer des versions natives iOS et Android à partir du code React existant.

## Prérequis

### Pour iOS
- macOS avec Xcode 14+ installé
- CocoaPods : `sudo gem install cocoapods`
- Compte Apple Developer (pour déployer sur l'App Store)

### Pour Android
- Android Studio installé
- Java JDK 17+
- Android SDK 33+

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Build l'app web :
```bash
npm run build
```

3. Initialiser les plateformes :
```bash
# iOS (macOS uniquement)
npx cap add ios

# Android
npx cap add android
```

4. Synchroniser le code :
```bash
npm run mobile:sync
```

## Développement

### Tester sur iOS
```bash
npm run mobile:ios
```
Cela ouvre Xcode. Cliquez sur le bouton Play pour lancer sur simulateur ou device.

### Tester sur Android
```bash
npm run mobile:android
```
Cela ouvre Android Studio. Cliquez sur Run pour lancer sur émulateur ou device.

### Live Reload (développement rapide)

1. Trouve ton IP locale :
```bash
ipconfig  # Windows
ifconfig  # macOS/Linux
```

2. Modifie `capacitor.config.ts` :
```typescript
server: {
  url: 'http://192.168.1.X:5174',  // Ton IP locale
  cleartext: true
}
```

3. Lance le dev server :
```bash
npm run dev
```

4. Sync et ouvre l'app :
```bash
npm run mobile:sync
npm run mobile:ios  # ou mobile:android
```

L'app chargera depuis ton serveur local avec hot reload.

## Build Production

### iOS

1. Ouvre Xcode :
```bash
npm run mobile:ios
```

2. Dans Xcode :
   - Sélectionne ton équipe de développement
   - Configure le Bundle ID : `ga.perfectmodels.app`
   - Product → Archive
   - Distribute App → App Store Connect

### Android

1. Génère une clé de signature :
```bash
keytool -genkey -v -keystore perfect-models.keystore -alias perfect-models -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure `android/app/build.gradle` :
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../perfect-models.keystore')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'perfect-models'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. Build l'APK/AAB :
```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB pour Play Store
```

## Plugins Natifs Utilisés

- **Camera** : Prendre des photos ou choisir depuis la galerie
- **Push Notifications** : Notifications natives iOS/Android
- **Status Bar** : Personnaliser la barre de statut
- **Splash Screen** : Écran de démarrage
- **App** : Gestion du cycle de vie (back button, etc.)
- **Haptics** : Vibrations tactiles
- **Share** : Partager du contenu

## Fonctionnalités Mobiles

### Caméra Native
```typescript
import { takePhoto, pickFromGallery } from './utils/nativeCamera';

const photo = await takePhoto();  // Prendre une photo
const image = await pickFromGallery();  // Choisir depuis galerie
```

### Détection de Plateforme
```typescript
import { useCapacitor } from './hooks/useCapacitor';

const { isNative, platform } = useCapacitor();
// isNative: true sur iOS/Android, false sur web
// platform: 'ios' | 'android' | 'web'
```

## Permissions

### iOS (`ios/App/App/Info.plist`)
```xml
<key>NSCameraUsageDescription</key>
<string>Perfect Models a besoin d'accéder à votre caméra pour prendre des photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Perfect Models a besoin d'accéder à vos photos.</string>
```

### Android (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Troubleshooting

### Erreur "Command failed: pod install"
```bash
cd ios/App
pod repo update
pod install
```

### Erreur Gradle sur Android
```bash
cd android
./gradlew clean
./gradlew build
```

### L'app ne se met pas à jour
```bash
npm run build
npm run mobile:sync
```

## Ressources

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Plugins Capacitor](https://capacitorjs.com/docs/plugins)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console](https://play.google.com/console)
