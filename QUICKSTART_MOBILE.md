# Démarrage Rapide - Version Mobile

## 1. Build l'app web
```bash
npm run build
```

## 2. Ajouter les plateformes

### Android
```bash
npx cap add android
npm run mobile:android
```

Dans Android Studio :
- Attends que Gradle finisse de sync
- Clique sur le bouton ▶️ Run
- Choisis un émulateur ou device connecté

### iOS (macOS uniquement)
```bash
npx cap add ios
npm run mobile:ios
```

Dans Xcode :
- Sélectionne un simulateur (iPhone 15 Pro par exemple)
- Clique sur le bouton ▶️ Play

## 3. Développement avec Live Reload

1. Trouve ton IP locale :
```bash
ipconfig
# Cherche "IPv4 Address" (ex: 192.168.1.10)
```

2. Édite `capacitor.config.ts` :
```typescript
server: {
  url: 'http://192.168.1.10:5174',  // TON IP ICI
  cleartext: true
}
```

3. Lance le dev server :
```bash
npm run dev
```

4. Sync et lance l'app :
```bash
npm run mobile:sync
npm run mobile:android  # ou mobile:ios
```

Maintenant chaque modification dans ton code se reflète instantanément dans l'app mobile !

## 4. Retour en mode production

Quand tu veux tester la version build (sans live reload) :

1. Supprime la section `server` de `capacitor.config.ts`
2. Build et sync :
```bash
npm run mobile:build
```

## Commandes Utiles

```bash
# Sync après modifications
npm run mobile:sync

# Ouvrir Android Studio
npx cap open android

# Ouvrir Xcode
npx cap open ios

# Voir les logs
npx cap run android --livereload
npx cap run ios --livereload
```

## Tester les Fonctionnalités Natives

### Caméra
- Va sur une page avec upload d'image
- Sur mobile, tu verras les boutons "Prendre une photo" et "Galerie"

### Notifications Push
- Les notifications sont automatiquement initialisées au démarrage
- Vérifie la console pour voir le token FCM

### Status Bar
- La barre de statut est automatiquement stylée en noir (#080808)

## Problèmes Courants

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
cd ../..
```

### L'app affiche une page blanche
Vérifie que `dist/` existe :
```bash
npm run build
npm run mobile:sync
```
