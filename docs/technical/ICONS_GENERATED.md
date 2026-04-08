# ✅ Icônes et Splash Screens Générés

## Ce qui a été fait

### 1. Logo Source
- ✅ Logo copié depuis `public/logopmm.jpg` vers `resources/icon.png`
- ✅ Utilisé comme source pour toutes les générations

### 2. Icônes Android Générées
Toutes les tailles d'icônes Android ont été créées avec le fond noir (#080808) :

**Icônes Adaptatives (Android 8+)**
- `ic_launcher_foreground.png` - Logo au premier plan
- `ic_launcher_background.png` - Fond noir
- Toutes les densités : ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi

**Icônes Classiques**
- `ic_launcher.png` - Icône carrée
- `ic_launcher_round.png` - Icône ronde
- Toutes les densités : ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi

**Total Android : 74 fichiers générés (1.23 MB)**

### 3. Splash Screens Android
Écrans de démarrage pour toutes les orientations et densités :

**Portrait**
- drawable-port-ldpi à drawable-port-xxxhdpi
- Mode clair et mode sombre

**Paysage**
- drawable-land-ldpi à drawable-land-xxxhdpi
- Mode clair et mode sombre

**Total : 26 splash screens**

### 4. Icônes PWA
7 tailles d'icônes WebP pour la Progressive Web App :
- icon-48.webp (2.69 KB)
- icon-72.webp (4.44 KB)
- icon-96.webp (6.24 KB)
- icon-128.webp (8.95 KB)
- icon-192.webp (15.46 KB)
- icon-256.webp (23.95 KB)
- icon-512.webp (75.81 KB)

**Total PWA : 7 fichiers (137.53 KB)**

### 5. Manifest.json Mis à Jour
Le fichier `manifest.json` a été mis à jour pour référencer les nouvelles icônes PWA.

## Résultat

### Android
L'app Android affiche maintenant :
- ✅ Ton logo comme icône d'app
- ✅ Fond noir (#080808) pour correspondre au thème PMM
- ✅ Splash screen avec le logo au démarrage
- ✅ Icônes adaptatives pour Android 8+
- ✅ Support mode clair et mode sombre

### PWA (Web)
L'app web affiche :
- ✅ Icônes optimisées en WebP
- ✅ Tailles multiples pour tous les devices
- ✅ Icônes maskable pour Android

## Vérifier les Icônes

### Android
1. Lance l'app : `npm run mobile:android`
2. Regarde l'icône dans le launcher Android
3. Vérifie le splash screen au démarrage

### PWA
1. Ouvre l'app web : `npm run dev`
2. Ouvre les DevTools → Application → Manifest
3. Vérifie que les icônes sont chargées

## Fichiers Générés

### Android
```
android/app/src/main/res/
├── mipmap-ldpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_background.png
├── mipmap-mdpi/
│   └── ... (mêmes fichiers)
├── mipmap-hdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
├── mipmap-xxxhdpi/
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
├── drawable/
│   └── splash.png
├── drawable-land-*/
│   └── splash.png
├── drawable-port-*/
│   └── splash.png
├── drawable-night/
│   └── splash.png
└── drawable-*-night-*/
    └── splash.png
```

### PWA
```
public/icons/
├── icon-48.webp
├── icon-72.webp
├── icon-96.webp
├── icon-128.webp
├── icon-192.webp
├── icon-256.webp
└── icon-512.webp
```

## Personnalisation

### Changer le Logo
1. Remplace `resources/icon.png` par ton nouveau logo (1024x1024 recommandé)
2. Régénère :
```bash
npx @capacitor/assets generate --iconBackgroundColor '#080808'
```
3. Sync :
```bash
npm run mobile:sync
```

### Changer la Couleur de Fond
```bash
npx @capacitor/assets generate --iconBackgroundColor '#COULEUR' --splashBackgroundColor '#COULEUR'
```

Exemples :
- Noir : `#080808` (actuel)
- Blanc : `#FFFFFF`
- Or PMM : `#C9A84C`
- Transparent : `#00000000`

### Splash Screen Personnalisé
Pour un splash screen complètement custom :

1. Crée `resources/splash.png` (2732x2732)
2. Régénère :
```bash
npx @capacitor/assets generate
```

## Commandes Utiles

```bash
# Régénérer toutes les icônes
npx @capacitor/assets generate --iconBackgroundColor '#080808' --splashBackgroundColor '#080808'

# Régénérer Android uniquement
npx @capacitor/assets generate --android

# Régénérer PWA uniquement
npx @capacitor/assets generate --pwa

# Sync après génération
npm run mobile:sync
```

## Troubleshooting

### Les icônes ne changent pas
```bash
# Clean et rebuild
npm run build
npm run mobile:sync

# Dans Android Studio
Build → Clean Project
Build → Rebuild Project
```

### Icône floue ou pixelisée
- Utilise une image source haute résolution (1024x1024 minimum)
- Format PNG ou JPG
- Évite les SVG complexes

### Splash screen ne s'affiche pas
- Vérifie `capacitor.config.ts` :
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#080808',
    showSpinner: false,
  }
}
```

## iOS (Quand disponible)

Quand tu ajouteras iOS, les icônes seront générées automatiquement :

```bash
npx cap add ios
npx @capacitor/assets generate
```

Cela créera :
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- `ios/App/App/Assets.xcassets/Splash.imageset/`

## Ressources

- [Capacitor Assets](https://github.com/ionic-team/capacitor-assets)
- [Android Icon Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [PWA Icon Guidelines](https://web.dev/add-manifest/#icons)

---

🎨 Tes icônes sont maintenant configurées avec le logo PMM !

Pour tester : `npm run mobile:android`
