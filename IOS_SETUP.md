# Configuration iOS - Perfect Models Management

⚠️ **IMPORTANT : iOS nécessite macOS et Xcode**

Ce guide est pour quand tu auras accès à un Mac.

## Prérequis

### 1. macOS
- macOS 13 Ventura ou plus récent
- Au moins 8 GB RAM
- 50 GB d'espace disque libre

### 2. Xcode
Télécharge depuis l'App Store (gratuit) :
- Ouvre l'App Store
- Cherche "Xcode"
- Clique sur "Obtenir" (7+ GB)
- Attends le téléchargement (30-60 min)

### 3. Command Line Tools
```bash
xcode-select --install
```

### 4. CocoaPods
```bash
sudo gem install cocoapods
```

## Installation iOS

### 1. Clone le projet (si pas déjà fait)
```bash
git clone [ton-repo]
cd perfect-models-management
npm install
```

### 2. Build l'app web
```bash
npm run build
```

### 3. Ajoute la plateforme iOS
```bash
npx cap add ios
```

Cela crée le dossier `ios/` avec le projet Xcode.

### 4. Installe les pods
```bash
cd ios/App
pod install
cd ../..
```

### 5. Ouvre Xcode
```bash
npm run mobile:ios
```

Ou manuellement :
```bash
open ios/App/App.xcworkspace
```

⚠️ Ouvre toujours le fichier `.xcworkspace`, PAS `.xcodeproj`

## Configuration Xcode

### 1. Sélectionne ton équipe
- Clique sur le projet "App" dans la sidebar
- Onglet "Signing & Capabilities"
- Team : Sélectionne ton Apple ID (ou crée un compte gratuit)

### 2. Bundle Identifier
Déjà configuré : `ga.perfectmodels.app`

Si besoin de changer :
- Signing & Capabilities → Bundle Identifier
- Change en `com.tonnom.perfectmodels`

### 3. Sélectionne un simulateur
En haut : iPhone 15 Pro (ou autre)

### 4. Lance l'app
Clique sur le bouton ▶️ Play

## Configuration Firebase iOS

### 1. Télécharge GoogleService-Info.plist
- Firebase Console : https://console.firebase.google.com/
- Sélectionne "perfect-156b5"
- Project Settings → Your apps
- Clique sur l'icône iOS (ou "Add app" si pas encore créé)
- Bundle ID : `ga.perfectmodels.app`
- Télécharge `GoogleService-Info.plist`

### 2. Ajoute le fichier dans Xcode
- Glisse `GoogleService-Info.plist` dans Xcode
- Destination : `App/App/` (à côté de `Info.plist`)
- Coche "Copy items if needed"
- Coche "App" dans Targets

### 3. Vérifie l'intégration
Le fichier doit apparaître dans :
```
ios/App/App/GoogleService-Info.plist
```

## Permissions iOS

Les permissions sont déjà configurées dans `Info.plist` :

```xml
<key>NSCameraUsageDescription</key>
<string>Perfect Models a besoin d'accéder à votre caméra pour prendre des photos.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Perfect Models a besoin d'accéder à vos photos.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Perfect Models a besoin de sauvegarder des photos dans votre galerie.</string>
```

Si besoin d'ajouter d'autres permissions, édite `ios/App/App/Info.plist`.

## Tester sur Simulateur

### 1. Sélectionne un simulateur
En haut de Xcode : iPhone 15 Pro, iPhone 14, iPad, etc.

### 2. Lance l'app
Clique sur ▶️ Play (ou Cmd+R)

### 3. Limitations du simulateur
- ❌ Pas de caméra réelle (image par défaut)
- ❌ Pas de notifications push (nécessite device réel)
- ✅ Navigation, UI, logique fonctionnent

## Tester sur Device Réel

### 1. Connecte ton iPhone/iPad
- Branche le câble Lightning/USB-C
- Déverrouille le device
- "Faire confiance à cet ordinateur" → Oui

### 2. Sélectionne le device
En haut de Xcode : Ton iPhone apparaît dans la liste

### 3. Première fois : Trust Developer
- Paramètres → Général → Gestion des appareils
- Fais confiance à ton Apple ID

### 4. Lance l'app
Clique sur ▶️ Play

## Live Reload (Développement Rapide)

### 1. Trouve ton IP Mac
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Exemple: 192.168.1.10
```

### 2. Édite capacitor.config.ts
```typescript
server: {
  url: 'http://192.168.1.10:5174',
  cleartext: true
}
```

### 3. Lance le dev server
```bash
npm run dev
```

### 4. Sync et lance
```bash
npm run mobile:sync
npm run mobile:ios
```

Maintenant chaque modification se reflète instantanément !

## Build Production

### 1. Archive l'app
- Product → Archive
- Attends la fin du build (5-10 min)

### 2. Distribute
- Window → Organizer → Archives
- Sélectionne ton archive
- Distribute App

### 3. Options de distribution

#### App Store (publication)
- Distribute App → App Store Connect
- Upload
- Attends la validation Apple (1-7 jours)

#### Ad Hoc (test interne)
- Distribute App → Ad Hoc
- Sélectionne les devices de test
- Export IPA
- Installe via Xcode ou TestFlight

#### Development (test local)
- Distribute App → Development
- Installe directement sur ton device

## Publier sur App Store

### 1. Compte Apple Developer
- https://developer.apple.com/
- 99$/an (obligatoire pour publier)

### 2. App Store Connect
- https://appstoreconnect.apple.com/
- Crée une nouvelle app
- Bundle ID : `ga.perfectmodels.app`
- Nom : "Perfect Models Management"

### 3. Remplis les infos
- Description
- Screenshots (iPhone 6.7", 6.5", 5.5")
- Icône 1024x1024
- Catégorie : Business ou Lifestyle
- Prix : Gratuit ou payant

### 4. Upload le build
- Xcode → Product → Archive
- Distribute → App Store Connect
- Upload

### 5. Soumets pour review
- App Store Connect → Ton app
- Ajoute le build uploadé
- Soumets pour review
- Attends 1-7 jours

## Screenshots pour App Store

Tailles requises :
- iPhone 6.7" (1290x2796) - iPhone 15 Pro Max
- iPhone 6.5" (1242x2688) - iPhone 11 Pro Max
- iPhone 5.5" (1242x2208) - iPhone 8 Plus

Prends des screenshots dans le simulateur :
- Cmd+S dans le simulateur
- Ou Device → Screenshot

## Troubleshooting

### "No signing certificate found"
- Xcode → Preferences → Accounts
- Ajoute ton Apple ID
- Download Manual Profiles

### "Command failed: pod install"
```bash
cd ios/App
pod repo update
pod deintegrate
pod install
cd ../..
```

### "Module not found"
```bash
npm run build
npx cap sync ios
```

### L'app ne se met pas à jour
```bash
# Clean build
# Xcode → Product → Clean Build Folder (Cmd+Shift+K)
npm run mobile:build
```

### Erreur de signature
- Vérifie que le Bundle ID est unique
- Vérifie que ton Apple ID est connecté
- Essaie "Automatically manage signing"

## Commandes Utiles

```bash
# Ouvrir Xcode
npm run mobile:ios
# ou
open ios/App/App.xcworkspace

# Sync après modifs
npm run mobile:sync

# Build et sync
npm run mobile:build

# Lister simulateurs
xcrun simctl list devices

# Boot simulateur
xcrun simctl boot "iPhone 15 Pro"

# Installer app
xcrun simctl install booted ios/App/build/App.app

# Logs
xcrun simctl spawn booted log stream --predicate 'process == "App"'
```

## Différences iOS vs Android

### Permissions
- iOS : demandées au moment de l'utilisation
- Android : demandées à l'installation

### Notifications
- iOS : nécessite certificat APNs
- Android : utilise FCM directement

### Back Button
- iOS : pas de back button système (navigation gestuelle)
- Android : back button géré dans le code

### Status Bar
- iOS : gérée par le système
- Android : personnalisable

## Ressources

- [Xcode](https://developer.apple.com/xcode/)
- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Apple Developer](https://developer.apple.com/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## Résumé : 3 Commandes pour iOS

```bash
# 1. Ajoute iOS
npx cap add ios

# 2. Ouvre Xcode
npm run mobile:ios

# 3. Lance l'app
# Clique sur ▶️ dans Xcode
```

C'est tout ! Le code est déjà compatible iOS grâce à Capacitor.

---

🍎 Bon développement iOS !
