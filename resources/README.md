# Ressources Mobile

## Générer les icônes et splash screens

1. Place ton logo en PNG 1024x1024 dans `resources/icon.png`
2. Place ton splash screen en PNG 2732x2732 dans `resources/splash.png`

3. Installe le générateur :
```bash
npm install -g @capacitor/assets
```

4. Génère toutes les tailles :
```bash
npx @capacitor/assets generate --iconBackgroundColor '#080808' --iconBackgroundColorDark '#080808' --splashBackgroundColor '#080808'
```

Cela créera automatiquement toutes les tailles nécessaires pour iOS et Android.

## Icônes requises

### Android
- `android/app/src/main/res/mipmap-*/ic_launcher.png` (48dp à 192dp)
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`

### iOS
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/*.png` (20pt à 1024pt)

## Splash Screens

### Android
- `android/app/src/main/res/drawable-*/splash.png`

### iOS
- `ios/App/App/Assets.xcassets/Splash.imageset/*.png`

## Conversion depuis SVG

Si tu as seulement un SVG :

```bash
# Installer ImageMagick ou utiliser un outil en ligne
# Convertir en PNG 1024x1024
convert logo.svg -resize 1024x1024 -background '#080808' icon.png
```

Ou utilise : https://cloudconvert.com/svg-to-png
