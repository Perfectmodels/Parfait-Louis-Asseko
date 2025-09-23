# 🚀 Guide de Développement - Perfect Models Management

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Git

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd perfect-models-management

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🧹 Scripts de Nettoyage

### Nettoyage Complet
```bash
npm run clean
```
Supprime tous les caches, dossiers de build et fichiers temporaires.

### Nettoyage Rapide
```bash
npm run clean:quick
```
Supprime uniquement les dossiers de build Vite.

### Désactivation du Service Worker
```bash
npm run dev:clear-sw
```
Désactive le Service Worker et démarre le serveur de développement.

## 🔧 Configuration

### Service Worker
- **Développement** : Désactivé automatiquement
- **Production** : Activé automatiquement

### Content Security Policy (CSP)
- **Développement** : Permissive pour Vite et les outils de dev
- **Production** : Stricte pour la sécurité

### Tailwind CSS
- Configuration locale (plus de CDN)
- Styles personnalisés dans `src/index.css`
- Configuration dans `tailwind.config.js`

## 🐛 Résolution de Problèmes

### Erreurs de CSP
Si vous voyez des erreurs de Content Security Policy :
```bash
npm run dev:clear-sw
```

### Erreurs de Service Worker
Le SW est automatiquement désactivé en développement. Si vous voyez encore des erreurs :
```bash
npm run clean
npm install
npm run dev
```

### Erreurs de Build
```bash
npm run clean
npm install
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
├── config/             # Configuration (SW, CSP)
├── services/           # Services externes
├── utils/              # Utilitaires
└── index.css           # Styles Tailwind

scripts/
├── clean-all.js        # Nettoyage complet
├── clear-sw.js         # Désactivation SW
├── dev-cleanup.js      # Nettoyage dev
└── test-setup.js       # Test configuration
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Preview de Production
```bash
npm run preview
```

### Analyse du Build
```bash
npm run build:analyze
```

## 🔍 Vérification

### Test de Configuration
```bash
npm run test:setup
```

### Vérification TypeScript
```bash
npm run type-check
```

## 📝 Notes Importantes

1. **Service Worker** : Désactivé en développement pour éviter les conflits
2. **CSP** : Appliquée dynamiquement selon l'environnement
3. **Tailwind** : Configuration locale, plus de CDN
4. **Vite** : Configuration optimisée pour le développement et la production

## 🆘 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Lancez `npm run test:setup`
3. Essayez `npm run clean` puis `npm install`
4. Vérifiez que tous les ports sont libres