# Configuration Android - Perfect Models Management

## Prérequis

### 1. Installer Android Studio
Télécharge depuis : https://developer.android.com/studio

### 2. Installer Java JDK 17
```bash
# Vérifie si déjà installé
java -version

# Si pas installé, télécharge depuis :
# https://www.oracle.com/java/technologies/downloads/#java17
```

### 3. Configurer les variables d'environnement

#### Windows
```powershell
# JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17"

# ANDROID_HOME
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"

# PATH
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

#### macOS/Linux
Ajoute dans `~/.bashrc` ou `~/.zshrc` :
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

## Première Ouverture

### 1. Ouvre Android Studio
```bash
npm run mobile:android
```

Ou manuellement :
- Ouvre Android Studio
- File → Open
- Sélectionne le dossier `android/`

### 2. Attends la synchronisation Gradle
- Android Studio va télécharger les dépendances
- Cela peut prendre 5-10 minutes la première fois
- Vérifie la barre de progression en bas

### 3. Accepte les licences SDK
Si demandé :
```bash
cd %ANDROID_HOME%\tools\bin
sdkmanager --licenses
# Tape 'y' pour accepter toutes les licences
```

### 4. Installe les SDK manquants
Si Android Studio demande d'installer des SDK :
- Clique sur "Install missing SDK"
- Attends la fin du téléchargement

## Créer un Émulateur

### 1. Ouvre AVD Manager
- Dans Android Studio : Tools → Device Manager
- Ou clique sur l'icône 📱 en haut à droite

### 2. Crée un nouveau device
- Clique sur "Create Device"
- Choisis "Phone" → "Pixel 6" (recommandé)
- Clique "Next"

### 3. Télécharge une image système
- Choisis "Tiramisu" (API 33) ou "UpsideDownCake" (API 34)
- Clique sur l'icône téléchargement ⬇️
- Attends la fin du téléchargement
- Clique "Next" puis "Finish"

## Lancer l'App

### 1. Sélectionne l'émulateur
- En haut : sélectionne ton émulateur dans la liste déroulante
- Exemple : "Pixel 6 API 33"

### 2. Clique sur Run ▶️
- Bouton vert "Run" en haut à droite
- Ou Shift+F10

### 3. Attends le démarrage
- L'émulateur va démarrer (1-2 minutes la première fois)
- L'app va s'installer et se lancer automatiquement

## Tester sur un Device Réel

### 1. Active le mode développeur
Sur ton téléphone Android :
- Paramètres → À propos du téléphone
- Tape 7 fois sur "Numéro de build"
- Message : "Vous êtes développeur"

### 2. Active le débogage USB
- Paramètres → Options pour les développeurs
- Active "Débogage USB"

### 3. Connecte le téléphone
- Branche le câble USB
- Sur le téléphone : autorise le débogage USB
- Coche "Toujours autoriser depuis cet ordinateur"

### 4. Vérifie la connexion
```bash
adb devices
# Doit afficher ton device
```

### 5. Lance l'app
- Dans Android Studio, sélectionne ton device dans la liste
- Clique sur Run ▶️

## Problèmes Courants

### "SDK location not found"
Crée `android/local.properties` :
```properties
sdk.dir=C:\\Users\\TON_USER\\AppData\\Local\\Android\\Sdk
```

### "Gradle sync failed"
```bash
cd android
./gradlew clean
./gradlew build
```

### "Unable to locate adb"
Ajoute au PATH :
```
%ANDROID_HOME%\platform-tools
```

### L'émulateur est lent
- Vérifie que la virtualisation est activée dans le BIOS
- Intel : VT-x
- AMD : AMD-V
- Ou utilise un device réel (plus rapide)

### "App not installed"
```bash
# Désinstalle l'ancienne version
adb uninstall ga.perfectmodels.app

# Réinstalle
npm run mobile:android
```

## Live Reload (Développement)

### 1. Trouve ton IP locale
```bash
ipconfig
# Cherche "IPv4 Address" (ex: 192.168.1.10)
```

### 2. Édite `capacitor.config.ts`
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
npm run mobile:android
```

Maintenant chaque modification se reflète instantanément dans l'app !

## Build APK de Production

### 1. Génère une clé de signature
```bash
keytool -genkey -v -keystore perfect-models.keystore -alias perfect-models -keyalg RSA -keysize 2048 -validity 10000
```

Remplis les infos demandées et note le mot de passe.

### 2. Configure la signature
Crée `android/keystore.properties` :
```properties
storePassword=TON_MOT_DE_PASSE
keyPassword=TON_MOT_DE_PASSE
keyAlias=perfect-models
storeFile=../perfect-models.keystore
```

### 3. Édite `android/app/build.gradle`
Ajoute avant `android {` :
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dans `android {`, ajoute :
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 4. Build l'APK
```bash
cd android
./gradlew assembleRelease
```

APK dans : `android/app/build/outputs/apk/release/app-release.apk`

### 5. Installe l'APK
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Publier sur Google Play Store

### 1. Build AAB (Android App Bundle)
```bash
cd android
./gradlew bundleRelease
```

AAB dans : `android/app/build/outputs/bundle/release/app-release.aab`

### 2. Crée un compte Google Play Console
https://play.google.com/console

### 3. Crée une nouvelle app
- Clique "Créer une application"
- Remplis les infos (nom, langue, type)

### 4. Upload l'AAB
- Production → Créer une version
- Upload `app-release.aab`
- Remplis les notes de version
- Envoie pour examen

### 5. Attends la validation
- Google examine l'app (1-7 jours)
- Tu recevras un email quand c'est publié

## Ressources

- [Android Studio](https://developer.android.com/studio)
- [Capacitor Android](https://capacitorjs.com/docs/android)
- [Google Play Console](https://play.google.com/console)
- [Android Developers](https://developer.android.com/)

---

🎉 Ton app Android est prête !
