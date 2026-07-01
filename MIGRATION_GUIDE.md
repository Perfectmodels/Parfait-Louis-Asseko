# 🔄 Guide de Migration - Module de Formation

Ce guide vous aide à intégrer le module de formation dans votre projet existant.

## 📋 Prérequis

- React 18+
- React Router DOM 6+
- TypeScript 5+
- Tailwind CSS 3+
- Lucide React (icons)

## 🚀 Installation en 5 Étapes

### Étape 1 : Vérifier les Fichiers

Tous les fichiers ont été créés automatiquement. Vérifiez leur présence :

```bash
# Types
ls src/types/training.ts

# Données
ls src/data/trainingModules.ts

# Pages
ls src/pages/AdvancedTraining.tsx
ls src/pages/TrainingModuleView.tsx

# Composants
ls src/components/TrainingCertificate.tsx
ls src/components/TrainingStatsWidget.tsx
ls src/components/TrainingBadge.tsx
ls src/components/ProgressRing.tsx
ls src/components/UserProgressDashboard.tsx

# Config
ls src/config/trainingConfig.ts

# Utils
ls src/utils/trainingHelpers.ts

# Hooks
ls src/hooks/useTrainingProgress.ts
```

### Étape 2 : Routes Déjà Ajoutées ✅

Les routes ont déjà été ajoutées dans `src/App.tsx` :

```typescript
// Formation Avancée - Accessible à tous
<Route path="/formation" element={<AdvancedTraining />} />
<Route path="/formation/module/:moduleId" element={<TrainingModuleView />} />
```

### Étape 3 : Ajouter un Lien dans la Navigation

Dans votre composant de navigation (Header, Navbar, etc.) :

```tsx
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// Dans votre menu
<Link 
  to="/formation" 
  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
>
  <BookOpen size={20} />
  <span>Formation</span>
</Link>
```

### Étape 4 : Intégrer dans le Dashboard Admin (Optionnel)

Si vous avez un dashboard admin, ajoutez le widget de statistiques :

```tsx
// Dans src/pages/Admin.tsx ou votre dashboard
import TrainingStatsWidget from '../components/TrainingStatsWidget';
import { loadProgressFromLocal } from '../utils/trainingHelpers';
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [trainingProgress, setTrainingProgress] = useState([]);

  useEffect(() => {
    const progress = loadProgressFromLocal();
    setTrainingProgress(progress);
  }, []);

  return (
    <div>
      {/* Vos autres composants */}
      
      {/* Widget de formation */}
      <TrainingStatsWidget allProgress={trainingProgress} />
    </div>
  );
}
```

### Étape 5 : Tester

```bash
# Lancer l'application
npm run dev

# Ouvrir dans le navigateur
http://localhost:5173/formation
```

## 🎨 Personnalisation

### Couleurs

Si vos couleurs de marque sont différentes, modifiez `tailwind.config.js` :

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'pm-gold': '#VotreCouleur',
        'pm-dark': '#VotreCouleur'
      }
    }
  }
}
```

### Configuration

Modifiez `src/config/trainingConfig.ts` :

```typescript
export const TRAINING_CONFIG = {
  PASSING_SCORE: 70,              // Score minimum requis
  PROGRESSIVE_UNLOCK: true,       // Déblocage progressif
  CERTIFICATES_ENABLED: true,     // Activer les certificats
  // ... autres options
};
```

### Messages

Personnalisez les messages dans `src/config/trainingConfig.ts` :

```typescript
MESSAGES: {
  quizPassed: 'Votre message personnalisé',
  quizFailed: 'Votre message personnalisé',
  moduleCompleted: 'Votre message personnalisé',
  // ...
}
```

## 📊 Ajouter du Contenu

### Méthode 1 : Utiliser les Données Fournies

Les données complètes des 4 modules vous ont été fournies. Pour les intégrer :

1. Ouvrez `src/data/trainingModules.ts`
2. Remplacez le contenu par les données complètes
3. Sauvegardez

### Méthode 2 : Ajouter Manuellement

Suivez la structure dans `src/data/trainingModulesExample.ts` :

```typescript
{
  num: 5,
  title: "Votre Nouveau Module",
  subtitle: "Description",
  objectifs: ["Objectif 1", "Objectif 2"],
  chapters: [
    {
      title: "Chapitre 1",
      content: ["Paragraphe 1", "Paragraphe 2"],
      keyPoints: ["Point 1", "Point 2"],
      quiz: [
        {
          question: "Question ?",
          options: ["A", "B", "C", "D"],
          correct: 0,
          explanation: "Explication"
        }
      ]
    }
  ]
}
```

## 🔌 Intégrations Avancées

### Firebase (Synchronisation Cloud)

```typescript
// Dans src/utils/trainingHelpers.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const saveProgressToCloud = async (userId: string, progress: UserProgress[]) => {
  await setDoc(doc(db, 'trainingProgress', userId), {
    progress,
    lastUpdated: new Date().toISOString()
  });
};

export const loadProgressFromCloud = async (userId: string) => {
  const docSnap = await getDoc(doc(db, 'trainingProgress', userId));
  return docSnap.exists() ? docSnap.data().progress : [];
};
```

### Analytics

```typescript
// Dans src/pages/TrainingModuleView.tsx
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

const trackQuizSubmit = (moduleId: number, score: number) => {
  logEvent(analytics, 'quiz_submitted', {
    module_id: moduleId,
    score: score,
    timestamp: new Date().toISOString()
  });
};
```

### Notifications Push

```typescript
// Notifier l'utilisateur après X jours d'inactivité
import { getDaysSinceLastActivity } from '../utils/trainingHelpers';

const checkInactivity = (progress: UserProgress) => {
  const days = getDaysSinceLastActivity(progress.lastAccessedAt);
  
  if (days >= 3) {
    // Envoyer une notification
    sendPushNotification({
      title: 'Continuez votre formation !',
      body: 'Vous n\'avez pas étudié depuis 3 jours.'
    });
  }
};
```

## 🎓 Certificats PDF

Pour activer le téléchargement PDF :

```bash
npm install jspdf html2canvas
```

Puis dans `src/components/TrainingCertificate.tsx` :

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const handleDownload = async () => {
  const element = document.getElementById('certificate');
  if (!element) return;
  
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const imgWidth = 297; // A4 landscape width
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`certificat-${Date.now()}.pdf`);
};
```

## 🔐 Authentification

Si vous voulez restreindre l'accès :

```tsx
// Dans src/App.tsx
<Route 
  path="/formation" 
  element={
    <ProtectedRoute role="student">
      <AdvancedTraining />
    </ProtectedRoute>
  } 
/>
```

## 📱 Progressive Web App (PWA)

Pour permettre l'accès hors ligne :

```javascript
// Dans votre service-worker.js
const CACHE_NAME = 'training-cache-v1';
const urlsToCache = [
  '/formation',
  '/formation/module/1',
  '/formation/module/2',
  // ... autres routes
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🧪 Tests

Pour exécuter les tests :

```bash
# Installer les dépendances
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Exécuter les tests
npm test

# Mode watch
npm test:watch
```

## 🐛 Résolution de Problèmes

### Erreur : Module not found

```bash
# Vérifier que tous les fichiers sont présents
ls -la src/types/training.ts
ls -la src/data/trainingModules.ts
```

### La progression ne se sauvegarde pas

```typescript
// Vérifier localStorage dans la console
console.log(localStorage.getItem('trainingProgress'));

// Vider et réinitialiser
localStorage.removeItem('trainingProgress');
```

### Les routes ne fonctionnent pas

Vérifiez que les imports sont corrects dans `App.tsx` :

```typescript
const AdvancedTraining = lazy(() => import('./pages/AdvancedTraining'));
const TrainingModuleView = lazy(() => import('./pages/TrainingModuleView'));
```

### Erreurs TypeScript

```bash
# Vérifier les types
npm run type-check

# Ou dans votre tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 📦 Build et Déploiement

### Build de Production

```bash
npm run build
```

### Vérifier la Taille du Bundle

```bash
npm run build -- --analyze
```

### Optimisations

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'training': [
            './src/pages/AdvancedTraining',
            './src/pages/TrainingModuleView'
          ]
        }
      }
    }
  }
}
```

## ✅ Checklist de Migration

- [ ] Tous les fichiers sont présents
- [ ] Routes ajoutées dans App.tsx
- [ ] Lien ajouté dans la navigation
- [ ] Contenu des modules ajouté
- [ ] Configuration personnalisée
- [ ] Couleurs adaptées à votre marque
- [ ] Tests effectués localement
- [ ] Widget admin intégré (optionnel)
- [ ] Certificats PDF configurés (optionnel)
- [ ] Synchronisation cloud configurée (optionnel)
- [ ] Build de production testé
- [ ] Déployé en production

## 🎉 Félicitations !

Votre module de formation est maintenant opérationnel !

Pour toute question :
- 📧 Email : support@perfectmodels.ga
- 📚 Documentation : `docs/FORMATION_MODULE.md`
- 🐛 Issues : GitHub Issues

---

**Perfect Models Management** - *Excellence en Formation Professionnelle*
