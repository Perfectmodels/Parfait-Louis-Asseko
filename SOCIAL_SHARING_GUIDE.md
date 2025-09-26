# Guide d'Optimisation des Aperçus de Partage Social

## 🎯 Vue d'ensemble

Ce guide explique comment optimiser les aperçus de partage de votre site Perfect Models Management sur les réseaux sociaux.

## 📱 Plateformes Supportées

### Facebook & LinkedIn
- **Dimensions recommandées** : 1200x630px
- **Format** : JPG, PNG
- **Ratio** : 1.91:1
- **Taille max** : 5MB

### Twitter
- **Dimensions recommandées** : 1200x630px
- **Format** : JPG, PNG, WebP
- **Ratio** : 1.91:1
- **Taille max** : 5MB

### Instagram
- **Dimensions recommandées** : 1080x1080px (carré)
- **Format** : JPG, PNG
- **Ratio** : 1:1

### YouTube
- **Dimensions recommandées** : 1280x720px
- **Format** : JPG, PNG
- **Ratio** : 16:9

## 🛠️ Configuration Actuelle

### Meta Tags Open Graph
```html
<meta property="og:title" content="Titre de la page" />
<meta property="og:description" content="Description de la page" />
<meta property="og:image" content="/assets/logo.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Description de l'image" />
<meta property="og:url" content="https://www.perfectmodels.ga/" />
<meta property="og:site_name" content="Perfect Models Management" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="fr_FR" />
```

### Meta Tags Twitter
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Titre de la page" />
<meta name="twitter:description" content="Description de la page" />
<meta name="twitter:image" content="/assets/logo.png" />
<meta name="twitter:image:alt" content="Description de l'image" />
```

## 🎨 Images Sociales Générées

### Pages Optimisées
- **Accueil** : "L'Élégance Redéfinie"
- **Mannequins** : "Le Visage de la Mode Gabonaise"
- **Magazine** : "Tendances & Actualités"
- **Agence** : "Excellence & Professionnalisme"
- **Fashion Day** : "L'Événement Mode de l'Année"

### Fichiers Générés
```
public/social-images/
├── home-facebook.html
├── home-twitter.html
├── home-linkedin.html
├── home-instagram.html
├── home-youtube.html
├── models-facebook.html
├── models-twitter.html
├── models-linkedin.html
├── models-instagram.html
├── models-youtube.html
└── ... (autres pages)
```

## 🔧 Utilisation du Composant SEO

### Exemple Basique
```tsx
<SEO 
  title="Titre de la Page"
  description="Description de la page"
  image="/assets/image.jpg"
/>
```

### Exemple Avancé avec Image Sociale
```tsx
<SEO 
  title="Nos Mannequins"
  description="Découvrez nos talents"
  keywords="mannequins, mode, gabon"
  socialImage={{
    title: "Nos Mannequins",
    subtitle: "Le Visage de la Mode Gabonaise",
    backgroundImage: "/assets/models-bg.jpg"
  }}
/>
```

## 🧪 Test des Aperçus

### 1. Outils de Test Officiels
- **Facebook** : [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter** : [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn** : [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 2. Test Local
1. Ouvrez `public/social-preview.html` dans votre navigateur
2. Utilisez le composant `SocialPreviewTester` dans l'admin
3. Testez avec différents paramètres

### 3. Test en Production
```bash
# Vérifier les meta tags
curl -s https://www.perfectmodels.ga/ | grep -E "(og:|twitter:)"
```

## 📊 Optimisations Appliquées

### Logo
- ✅ Utilisé comme image par défaut
- ✅ Dimensions optimisées (1200x630px)
- ✅ Alt text descriptif
- ✅ Format PNG pour transparence

### Images Dynamiques
- ✅ Génération automatique selon le contenu
- ✅ Adaptation aux dimensions des plateformes
- ✅ Overlay pour améliorer la lisibilité
- ✅ Typographie optimisée

### Meta Tags
- ✅ Open Graph complet
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD
- ✅ Canonical URLs
- ✅ Locale française

## 🚀 Bonnes Pratiques

### Images
1. **Qualité** : Utilisez des images haute résolution
2. **Cohérence** : Maintenez l'identité visuelle
3. **Lisibilité** : Évitez les textes trop petits
4. **Couleurs** : Respectez la charte graphique (#D4AF37)

### Textes
1. **Titre** : Maximum 60 caractères
2. **Description** : Maximum 160 caractères
3. **Clarté** : Messages clairs et engageants
4. **Call-to-action** : Incitez à l'action

### Technique
1. **HTTPS** : Utilisez toujours HTTPS pour les images
2. **Cache** : Configurez le cache des images
3. **Compression** : Optimisez la taille des fichiers
4. **Fallback** : Prévoyez des images de secours

## 🔍 Dépannage

### Problèmes Courants

#### Image non affichée
- Vérifiez l'URL de l'image
- Assurez-vous que l'image est accessible
- Vérifiez les dimensions (minimum 200x200px)

#### Texte tronqué
- Réduisez la longueur du titre/description
- Testez sur différentes plateformes
- Ajustez les dimensions de l'image

#### Cache non mis à jour
- Utilisez les outils de debug des plateformes
- Ajoutez un paramètre de version à l'URL
- Attendez 24h pour la propagation

### Commandes Utiles
```bash
# Générer les images sociales
node scripts/optimize-social-images.js

# Vérifier les meta tags
npm run build && npm run preview

# Tester l'aperçu
open public/social-preview.html
```

## 📈 Métriques de Succès

### Indicateurs à Surveiller
- **Taux de clic** sur les liens partagés
- **Engagement** sur les posts sociaux
- **Trafic** provenant des réseaux sociaux
- **Partages** organiques

### Outils de Mesure
- Google Analytics (Social Traffic)
- Facebook Insights
- Twitter Analytics
- LinkedIn Analytics

## 🎯 Prochaines Étapes

1. **Monitoring** : Surveillez les performances des aperçus
2. **A/B Testing** : Testez différents titres/descriptions
3. **Optimisation** : Améliorez selon les retours
4. **Expansion** : Ajoutez de nouvelles plateformes

---

**Note** : Ce guide est mis à jour régulièrement. Pour toute question, consultez la documentation officielle des plateformes ou contactez l'équipe de développement.
