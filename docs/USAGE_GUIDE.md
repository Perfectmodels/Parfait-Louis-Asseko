# 📚 Guide d'Utilisation - Images ImgBB

## 🎯 Vue d'Ensemble

Après la migration, vous disposez de **deux sources** pour les images:

1. **Constantes locales** (recommandé pour performance)
2. **Firebase Realtime Database** (pour contenu dynamique)

---

## 💻 Utilisation des Constantes Locales

### 1. Site Images

```typescript
import { siteImages } from '../constants/siteImages';

// Utilisation
<img src={siteImages.hero} alt="Hero" />
<div style={{ backgroundImage: `url(${siteImages.fashionDayBg})` }} />
```

**Images disponibles:**

- `siteImages.hero` - Image principale homepage
- `siteImages.about` - Page à propos
- `siteImages.agencyHistory` - Historique agence
- `siteImages.castingBg` - Background casting
- `siteImages.classroomBg` - Background classroom
- `siteImages.fashionDayBg` - Background Fashion Day

### 2. Fashion Day - Galeries Stylistes

```typescript
import { 
  titoStyleImages, 
  agStyleImages,
  ventexImages,
  stylistGalleries 
} from '../constants/fashionDayImages';

// Utilisation individuelle
const gallery = titoStyleImages; // Array de 13 images

// Utilisation groupée
const allGalleries = stylistGalleries;
// {
//   agStyle: [...],
//   farelMd: [...],
//   ventex: [...],
//   miguel: [...],
//   faran: [...],
//   madameLuc: [...],
//   brando: [...],
//   titoStyle: [...],
//   edeleA: [...]
// }

// Affichage
{titoStyleImages.map((img, i) => (
  <img key={i} src={img} alt={`Tito Style ${i + 1}`} />
))}
```

**Galeries disponibles:**

- `agStyleImages` - 12 images
- `farelMdImages` - 10 images
- `ventexImages` - 10 images
- `miguelImages` - 9 images
- `faranImages` - 7 images
- `madameLucImages` - 7 images
- `brandoImages` - 13 images
- `titoStyleImages` - 13 images
- `edeleAImages` - 7 images

### 3. Partner Logos

```typescript
import { partnerLogos } from '../constants/partnerLogos';

// Utilisation
{partnerLogos.map((logo, i) => (
  <img key={i} src={logo} alt={`Partner ${i + 1}`} />
))}
```

### 4. Toutes les URLs (référence complète)

```typescript
import allImgBBUrls from '../constants/imgbbUrls';

// Accès structuré
const heroImage = allImgBBUrls.siteImages.hero;
const titoGallery = allImgBBUrls.fashionDay.edition1.stylists.titoStyle;
```

---

## 🔥 Utilisation avec Firebase (Dynamique)

### Avec DataContext (méthode actuelle)

```typescript
import { useData } from '../contexts/DataContext';

function MyComponent() {
  const { data } = useData();
  
  // Images du site
  const heroImage = data?.siteImages?.hero;
  
  // Articles (dynamique)
  const articles = data?.articles;
  
  // Fashion Day Events
  const fashionDayEvents = data?.fashionDayEvents;
  
  return (
    <div>
      <img src={heroImage} alt="Hero" />
      {articles?.map(article => (
        <img key={article.slug} src={article.imageUrl} alt={article.title} />
      ))}
    </div>
  );
}
```

---

## 🎨 Exemples Pratiques

### Exemple 1: Hero Section

```typescript
import { siteImages } from '../constants/siteImages';

function Hero() {
  return (
    <div 
      className="hero"
      style={{ backgroundImage: `url(${siteImages.hero})` }}
    >
      <h1>Perfect Models Management</h1>
    </div>
  );
}
```

### Exemple 2: Galerie Fashion Day

```typescript
import { titoStyleImages } from '../constants/fashionDayImages';

function TitoStyleGallery() {
  return (
    <div className="gallery">
      <h2>Tito Style Collection</h2>
      <div className="grid">
        {titoStyleImages.map((image, index) => (
          <div key={index} className="gallery-item">
            <img 
              src={image} 
              alt={`Tito Style ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Exemple 3: Toutes les Galeries Stylistes

```typescript
import { stylistGalleries } from '../constants/fashionDayImages';

function AllStylistGalleries() {
  return (
    <div>
      {Object.entries(stylistGalleries).map(([stylistName, images]) => (
        <section key={stylistName}>
          <h2>{stylistName}</h2>
          <div className="grid">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`${stylistName} ${i + 1}`} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

### Exemple 4: Fallback Firebase + Local

```typescript
import { siteImages } from '../constants/siteImages';
import { useData } from '../contexts/DataContext';

function SmartImage({ imageKey }: { imageKey: keyof typeof siteImages }) {
  const { data } = useData();
  
  // Essayer Firebase d'abord, fallback sur local
  const imageUrl = data?.siteImages?.[imageKey] || siteImages[imageKey];
  
  return <img src={imageUrl} alt={imageKey} />;
}

// Utilisation
<SmartImage imageKey="hero" />
```

---

## ⚡ Optimisations

### Lazy Loading

```typescript
import { titoStyleImages } from '../constants/fashionDayImages';

function LazyGallery() {
  return (
    <div className="gallery">
      {titoStyleImages.map((img, i) => (
        <img 
          key={i}
          src={img}
          loading="lazy" // ← Lazy loading natif
          alt={`Image ${i + 1}`}
        />
      ))}
    </div>
  );
}
```

### Preload Images Critiques

```typescript
// Dans le <head> ou useEffect
import { siteImages } from '../constants/siteImages';

useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = siteImages.hero;
  document.head.appendChild(link);
}, []);
```

### Image avec Placeholder

```typescript
import { useState } from 'react';
import { siteImages } from '../constants/siteImages';

function ImageWithPlaceholder({ imageKey }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="image-container">
      {!loaded && <div className="placeholder">Loading...</div>}
      <img 
        src={siteImages[imageKey]}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
```

---

## 🔄 Migration depuis DataContext

### Avant

```typescript
import { useData } from '../contexts/DataContext';

function Component() {
  const { data } = useData();
  const heroImage = data?.siteImages?.hero;
  
  return <img src={heroImage} alt="Hero" />;
}
```

### Après (Recommandé)

```typescript
import { siteImages } from '../constants/siteImages';

function Component() {
  return <img src={siteImages.hero} alt="Hero" />;
}
```

### Avantages

✅ **Performance**: Pas de fetch Firebase  
✅ **Type Safety**: Autocomplete TypeScript  
✅ **Offline**: Fonctionne sans connexion  
✅ **Simplicité**: Import direct  
✅ **Build Time**: Optimisation Vite

---

## 📊 Quand Utiliser Quoi?

### Constantes Locales ✅ (Recommandé)

Utilisez pour:

- ✅ Images du site (hero, backgrounds)
- ✅ Galeries stylistes Fashion Day
- ✅ Logos partenaires
- ✅ Images qui ne changent pas souvent

**Avantages:**

- Performance maximale
- Pas de dépendance réseau
- Type safety
- Build optimization

### Firebase 🔥 (Dynamique)

Utilisez pour:

- 🔥 Articles de blog
- 🔥 News items
- 🔥 Casting applications
- 🔥 Contenu géré par admin

**Avantages:**

- Mise à jour en temps réel
- Gestion admin
- Synchronisation multi-utilisateurs

---

## 🛠️ Maintenance

### Ajouter une Nouvelle Image

1. **Uploader sur ImgBB**

```bash
# Utiliser l'API ImgBB ou le site web
```

1. **Ajouter à la constante**

```typescript
// src/constants/siteImages.ts
export const siteImages = {
  // ... existant
  newImage: 'https://i.ibb.co/xxx/new-image.jpg',
};
```

1. **Utiliser dans le code**

```typescript
import { siteImages } from '../constants/siteImages';
<img src={siteImages.newImage} alt="New" />
```

### Mettre à Jour une Image

1. **Uploader la nouvelle version sur ImgBB**
2. **Remplacer l'URL dans la constante**
3. **Rebuild**: `npm run build`

---

## 🐛 Dépannage

### Image ne se charge pas

```typescript
// Vérifier l'URL
console.log(siteImages.hero);

// Fallback
const imageUrl = siteImages.hero || '/fallback.jpg';
```

### TypeScript Errors

```typescript
// Typage explicite
import { siteImages } from '../constants/siteImages';

type SiteImageKey = keyof typeof siteImages;
const key: SiteImageKey = 'hero'; // ✅ Autocomplete
```

---

## 📚 Référence Complète

### Fichiers Disponibles

1. **`src/constants/siteImages.ts`**
   - 6 images principales du site

2. **`src/constants/fashionDayImages.ts`**
   - 108 images (9 galeries stylistes)
   - Edition 1 & 2

3. **`src/constants/partnerLogos.ts`**
   - 7 logos partenaires

4. **`src/constants/imgbbUrls.ts`**
   - Toutes les 147 URLs organisées

### Type Definitions

```typescript
// siteImages
type SiteImages = {
  hero: string;
  about: string;
  agencyHistory: string;
  castingBg: string;
  classroomBg: string;
  fashionDayBg: string;
};

// Galeries
type StylistGallery = string[];

type StylistGalleries = {
  agStyle: StylistGallery;
  farelMd: StylistGallery;
  ventex: StylistGallery;
  miguel: StylistGallery;
  faran: StylistGallery;
  madameLuc: StylistGallery;
  brando: StylistGallery;
  titoStyle: StylistGallery;
  edeleA: StylistGallery;
};
```

---

## 🎯 Bonnes Pratiques

1. ✅ **Utilisez les constantes locales** pour les images statiques
2. ✅ **Ajoutez `loading="lazy"`** pour les galeries
3. ✅ **Preload les images critiques** (hero, above the fold)
4. ✅ **Utilisez des placeholders** pendant le chargement
5. ✅ **Optimisez les images** avant upload sur ImgBB
6. ✅ **Gardez Firebase** pour le contenu dynamique
7. ✅ **Documentez** les nouvelles images ajoutées

---

**Dernière mise à jour**: 24 janvier 2026  
**Version**: 1.0.0  
**Statut**: ✅ Production Ready
