# Commandes Mobile - Aide-Mémoire

## Commandes Essentielles

### Build et Sync
```bash
# Build web + sync vers mobile
npm run mobile:build

# Sync uniquement (après modifs config)
npm run mobile:sync
```

### Ouvrir les IDEs
```bash
# Android Studio
npm run mobile:android

# Xcode (macOS)
npm run mobile:ios
```

### Développement avec Live Reload
```bash
# 1. Trouve ton IP
ipconfig  # Windows
ifconfig  # macOS/Linux

# 2. Édite capacitor.config.ts
server: {
  url: 'http://TON_IP:5174',
  cleartext: true
}

# 3. Lance dev server
npm run dev

# 4. Sync et ouvre
npm run mobile:sync
npm run mobile:android  # ou mobile:ios
```

### Retour en mode production
```bash
# Supprime la section server de capacitor.config.ts
npm run mobile:build
```

## Commandes Capacitor

### Ajouter une plateforme
```bash
npx cap add android
npx cap add ios
```

### Sync (copie dist/ vers mobile)
```bash
npx cap sync
npx cap sync android
npx cap sync ios
```

### Ouvrir les IDEs
```bash
npx cap open android
npx cap open ios
```

### Run avec logs
```bash
npx cap run android
npx cap run ios
npx cap run android --livereload
npx cap run ios --livereload
```

### Update plugins
```bash
npm install @capacitor/camera@latest
npx cap sync
```

### Liste des plugins installés
```bash
npx cap ls
```

## Commandes Android

### ADB (Android Debug Bridge)
```bash
# Liste devices connectés
adb devices

# Installer APK
adb install app-release.apk

# Désinstaller app
adb uninstall ga.perfectmodels.app

# Voir logs
adb logcat

# Voir logs de l'app uniquement
adb logcat | grep "Capacitor"

# Screenshot
adb shell screencap -p /sdcard/screen.png
adb pull /sdcard/screen.png

# Redémarrer ADB
adb kill-server
adb start-server
```

### Gradle
```bash
cd android

# Clean
./gradlew clean

# Build debug
./gradlew assembleDebug

# Build release (APK)
./gradlew assembleRelease

# Build release (AAB pour Play Store)
./gradlew bundleRelease

# Liste tasks
./gradlew tasks
```

### Générer clé de signature
```bash
keytool -genkey -v -keystore perfect-models.keystore -alias perfect-models -keyalg RSA -keysize 2048 -validity 10000
```

## Commandes iOS (macOS uniquement)

### CocoaPods
```bash
cd ios/App

# Installer pods
pod install

# Update pods
pod update

# Repo update
pod repo update
```

### Xcodebuild
```bash
cd ios/App

# Build
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug

# Clean
xcodebuild clean -workspace App.xcworkspace -scheme App

# Archive (pour App Store)
xcodebuild archive -workspace App.xcworkspace -scheme App -archivePath build/App.xcarchive
```

### Simulateur
```bash
# Liste simulateurs
xcrun simctl list devices

# Boot simulateur
xcrun simctl boot "iPhone 15 Pro"

# Installer app
xcrun simctl install booted path/to/App.app

# Lancer app
xcrun simctl launch booted ga.perfectmodels.app
```

## Commandes Firebase

### Télécharger configs
```bash
# Android
# Firebase Console → Project Settings → Your apps → Android
# Télécharge google-services.json
# Place dans: android/app/google-services.json

# iOS
# Firebase Console → Project Settings → Your apps → iOS
# Télécharge GoogleService-Info.plist
# Place dans: ios/App/App/GoogleService-Info.plist
```

### Deploy rules
```bash
firebase deploy --only database
firebase deploy --only firestore
firebase deploy --only storage
```

## Commandes Icônes

### Générer toutes les tailles
```bash
# Installe le générateur
npm install -g @capacitor/assets

# Place icon.png (1024x1024) dans resources/
# Place splash.png (2732x2732) dans resources/

# Génère
npx @capacitor/assets generate --iconBackgroundColor '#080808' --splashBackgroundColor '#080808'
```

## Commandes Git

### Commit mobile
```bash
# Ajoute les fichiers mobile
git add android/ ios/ capacitor.config.ts

# Commit
git commit -m "feat: add mobile support with Capacitor"

# Push
git push
```

### Ignorer builds
Les builds sont déjà dans `.gitignore` :
- `android/app/build/`
- `ios/App/build/`
- `*.keystore`

## Commandes NPM

### Installer dépendances
```bash
npm install
```

### Update Capacitor
```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/android@latest @capacitor/ios@latest
npm install @capacitor/camera@latest @capacitor/push-notifications@latest
npx cap sync
```

### Audit sécurité
```bash
npm audit
npm audit fix
```

## Troubleshooting

### Android : Gradle sync failed
```bash
cd android
./gradlew clean
./gradlew build
```

### iOS : Pod install failed
```bash
cd ios/App
pod repo update
pod install
```

### App ne se met pas à jour
```bash
npm run build
npx cap sync
# Puis relance l'app depuis l'IDE
```

### Effacer cache
```bash
# Node
rm -rf node_modules package-lock.json
npm install

# Android
cd android
./gradlew clean

# iOS
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

## Raccourcis IDE

### Android Studio
- `Shift + F10` : Run
- `Ctrl + F9` : Build
- `Shift + F9` : Debug
- `Alt + 1` : Project view
- `Alt + 6` : Logcat

### Xcode
- `Cmd + R` : Run
- `Cmd + B` : Build
- `Cmd + .` : Stop
- `Cmd + Shift + K` : Clean
- `Cmd + 0` : Navigator

## Liens Utiles

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)

---

💡 Astuce : Ajoute ces commandes à ton terminal en tant qu'alias pour aller plus vite !
