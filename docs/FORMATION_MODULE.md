# Module de Formation Avancée - Perfect Models Management

## 📚 Vue d'ensemble

Le module de formation avancée est un système complet d'apprentissage interactif conçu pour former les mannequins professionnels. Il comprend :

- **4 modules de formation** couvrant tous les aspects du mannequinat
- **Chapitres détaillés** avec contenu pédagogique riche
- **Quiz interactifs** pour valider les connaissances
- **Système de progression** avec sauvegarde locale
- **Certificats de complétion** téléchargeables

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── types/
│   └── training.ts              # Types TypeScript pour la formation
├── data/
│   └── trainingModules.ts       # Données des modules (contenu)
├── pages/
│   ├── AdvancedTraining.tsx     # Page principale (liste des modules)
│   └── TrainingModuleView.tsx   # Vue détaillée d'un module
└── components/
    └── TrainingCertificate.tsx  # Composant certificat
```

### Types principaux

```typescript
interface TrainingModule {
  num: number;
  title: string;
  subtitle: string;
  objectifs: string[];
  chapters: TrainingChapter[];
}

interface TrainingChapter {
  title: string;
  content: string[];
  keyPoints: string[];
  quiz: QuizQuestion[];
}

interface UserProgress {
  moduleId: number;
  chapterIndex: number;
  completedChapters: number[];
  quizScores: { [chapterIndex: number]: QuizScore };
  startedAt: string;
  lastAccessedAt: string;
  certificateEarned?: boolean;
}
```

## 🎯 Fonctionnalités

### 1. Système de progression

- **Sauvegarde automatique** dans localStorage
- **Déblocage progressif** des modules (un module doit être complété pour débloquer le suivant)
- **Suivi détaillé** : chapitres complétés, scores de quiz, tentatives
- **Reprise automatique** au dernier chapitre non complété

### 2. Quiz interactifs

- **Questions à choix multiples** avec explications détaillées
- **Score minimum requis** : 70% pour valider un chapitre
- **Tentatives illimitées** avec historique des scores
- **Feedback immédiat** après soumission

### 3. Certificats

- **Génération automatique** après complétion d'un module
- **Design professionnel** avec bordures décoratives
- **Téléchargement PDF** (à implémenter)
- **Partage sur réseaux sociaux**

### 4. Statistiques

- Modules complétés / Total
- Chapitres terminés / Total
- Score moyen des quiz
- Certificats obtenus

## 📖 Modules de formation

### Module 1 : Fondamentaux du Mannequinat Professionnel
- Le métier de mannequin au Gabon
- Standards physiques et critères de sélection
- Préparation physique et mentale
- Écosystème de la mode gabonaise

### Module 2 : Techniques de Défilé et Présence Scénique
- Marche sur podium professionnelle
- Poses et expressions
- Backstage et organisation
- Présence scénique et charisme

### Module 3 : Photographie de Mode et Présence Digitale
- Techniques de pose photo
- Shooting professionnel
- Personal branding
- Instagram et réseaux sociaux

### Module 4 : Gestion de Carrière et Business
- Rémunération et tarification
- Négociation de contrats
- Cadre légal au Gabon
- Développement professionnel

## 🚀 Utilisation

### Intégration dans l'application

1. **Ajouter les routes** dans votre router :

```typescript
import AdvancedTraining from './pages/AdvancedTraining';
import TrainingModuleView from './pages/TrainingModuleView';

// Dans vos routes
<Route path="/formation" element={<AdvancedTraining />} />
<Route path="/formation/module/:moduleId" element={<TrainingModuleView />} />
```

2. **Ajouter un lien** dans votre navigation :

```typescript
<Link to="/formation">Formation Avancée</Link>
```

### Gestion de la progression

La progression est automatiquement sauvegardée dans `localStorage` sous la clé `trainingProgress`.

Structure de données :
```json
[
  {
    "moduleId": 1,
    "chapterIndex": 2,
    "completedChapters": [0, 1],
    "quizScores": {
      "0": {
        "score": 3,
        "total": 3,
        "attempts": 1,
        "lastAttempt": "2024-01-15T10:30:00Z",
        "passed": true
      }
    },
    "startedAt": "2024-01-15T09:00:00Z",
    "lastAccessedAt": "2024-01-15T10:35:00Z"
  }
]
```

## 🎨 Personnalisation

### Ajouter un nouveau module

1. Éditer `src/data/trainingModules.ts`
2. Ajouter un objet `TrainingModule` dans le tableau `TRAINING_MODULES`

```typescript
{
  num: 5,
  title: "Nouveau Module",
  subtitle: "Description courte",
  objectifs: [
    "Objectif 1",
    "Objectif 2"
  ],
  chapters: [
    {
      title: "Chapitre 1",
      content: [
        "Paragraphe 1",
        "Paragraphe 2"
      ],
      keyPoints: [
        "Point clé 1",
        "Point clé 2"
      ],
      quiz: [
        {
          question: "Question ?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct: 1, // Index de la bonne réponse (0-based)
          explanation: "Explication de la réponse"
        }
      ]
    }
  ]
}
```

### Modifier les couleurs

Les couleurs principales sont définies dans Tailwind :
- `pm-gold` : Couleur or principale
- `pm-dark` : Fond sombre
- Modifier dans `tailwind.config.js`

### Ajuster le score minimum

Dans `TrainingModuleView.tsx`, ligne ~150 :
```typescript
const passed = (correct / total) >= 0.7; // 70% pour réussir
```

## 📊 Métriques et analytics

### Événements à tracker

- `module_started` : Début d'un module
- `chapter_completed` : Chapitre terminé
- `quiz_submitted` : Quiz soumis
- `quiz_passed` : Quiz réussi
- `module_completed` : Module complété
- `certificate_downloaded` : Certificat téléchargé

### Exemple d'intégration

```typescript
// Dans TrainingModuleView.tsx
const handleSubmitQuiz = () => {
  // ... logique existante
  
  // Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quiz_submitted', {
      module_id: module.num,
      chapter_index: currentChapterIndex,
      score: correct,
      total: total
    });
  }
};
```

## 🔒 Sécurité et données

### Stockage local

- Les données sont stockées dans `localStorage`
- Aucune donnée sensible n'est stockée
- Les données peuvent être exportées/importées

### Synchronisation cloud (à implémenter)

Pour synchroniser la progression entre appareils :

1. Créer une collection Firebase `userProgress`
2. Sauvegarder lors de chaque mise à jour
3. Charger au démarrage de l'application

```typescript
// Exemple de sauvegarde Firebase
import { doc, setDoc } from 'firebase/firestore';

const saveProgressToCloud = async (userId: string, progress: UserProgress[]) => {
  await setDoc(doc(db, 'userProgress', userId), {
    progress,
    lastUpdated: new Date().toISOString()
  });
};
```

## 🐛 Dépannage

### La progression ne se sauvegarde pas

1. Vérifier que `localStorage` est disponible
2. Vérifier la console pour les erreurs
3. Vider le cache du navigateur

### Les modules ne se débloquent pas

1. Vérifier que tous les chapitres du module précédent sont complétés
2. Vérifier que les quiz ont été réussis (score ≥ 70%)
3. Rafraîchir la page

### Les quiz ne s'affichent pas

1. Vérifier que les données dans `trainingModules.ts` sont correctes
2. Vérifier que chaque chapitre a un tableau `quiz`
3. Vérifier la console pour les erreurs

## 🚀 Améliorations futures

### Court terme
- [ ] Export/import de la progression
- [ ] Mode hors ligne avec Service Worker
- [ ] Notifications de rappel
- [ ] Badges et récompenses

### Moyen terme
- [ ] Génération PDF des certificats
- [ ] Vidéos intégrées dans les chapitres
- [ ] Forum de discussion par module
- [ ] Exercices pratiques interactifs

### Long terme
- [ ] Système de mentorat
- [ ] Classes virtuelles en direct
- [ ] Évaluations par des professionnels
- [ ] Marketplace de formations additionnelles

## 📞 Support

Pour toute question ou problème :
- Email : formation@perfectmodels.ga
- Documentation : [docs.perfectmodels.ga](https://docs.perfectmodels.ga)
- GitHub Issues : [github.com/perfectmodels/issues](https://github.com/perfectmodels/issues)

---

**Perfect Models Management** - Formation Professionnelle d'Excellence
