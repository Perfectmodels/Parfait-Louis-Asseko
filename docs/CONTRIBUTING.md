# Guide de Contribution - Panel Admin

## 🎯 Vue d'ensemble

Ce guide explique comment contribuer au développement du panel administratif de Perfect Models Management. Il couvre les standards de code, les processus de développement et les bonnes pratiques.

## 📋 Table des Matières

1. [Configuration de l'environnement](#configuration)
2. [Standards de code](#standards)
3. [Processus de développement](#processus)
4. [Tests](#tests)
5. [Documentation](#documentation)
6. [Déploiement](#deploiement)

---

## 🔧 Configuration de l'environnement {#configuration}

### Prérequis

- Node.js 18+
- npm 9+
- Git
- VS Code (recommandé)

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd Parfait-Louis-Asseko-1

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer le build de production
npm run build
```

### Extensions VS Code Recommandées

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## 📝 Standards de Code {#standards}

### TypeScript

#### Typage Strict

✅ **Bon**:

```tsx
interface UserProps {
    name: string;
    age: number;
    email?: string;
}

const User: React.FC<UserProps> = ({ name, age, email }) => {
    // ...
};
```

❌ **Mauvais**:

```tsx
const User = ({ name, age, email }: any) => {
    // ...
};
```

#### Interfaces vs Types

- Utiliser `interface` pour les objets et props
- Utiliser `type` pour les unions et intersections

✅ **Bon**:

```tsx
interface ButtonProps {
    label: string;
    onClick: () => void;
}

type Status = 'pending' | 'success' | 'error';
```

### React

#### Composants Fonctionnels

Toujours utiliser des composants fonctionnels avec hooks.

✅ **Bon**:

```tsx
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
    const [state, setState] = useState(initialValue);
    
    useEffect(() => {
        // Effect logic
    }, [dependencies]);
    
    return <div>...</div>;
};
```

#### Hooks

Respecter les règles des hooks:

1. Appeler les hooks au niveau supérieur
2. Appeler les hooks uniquement dans les composants React
3. Nommer les hooks personnalisés avec le préfixe `use`

✅ **Bon**:

```tsx
const useCustomHook = () => {
    const [value, setValue] = useState(0);
    
    useEffect(() => {
        // Logic
    }, []);
    
    return { value, setValue };
};
```

#### Props Destructuring

Toujours destructurer les props dans la signature de la fonction.

✅ **Bon**:

```tsx
const Component: React.FC<Props> = ({ title, description, onClose }) => {
    // ...
};
```

❌ **Mauvais**:

```tsx
const Component: React.FC<Props> = (props) => {
    return <div>{props.title}</div>;
};
```

### Styling

#### Tailwind CSS

Utiliser les classes Tailwind de manière cohérente.

✅ **Bon**:

```tsx
<div className="flex items-center gap-3 px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg">
    {/* Content */}
</div>
```

#### Classes Personnalisées

Définir les classes personnalisées dans `index.css` pour les styles réutilisables.

```css
.admin-section-title {
    @apply text-xl font-bold text-pm-off-white mb-4;
}
```

### Nommage

#### Fichiers

- Composants: `PascalCase.tsx` (ex: `GlobalSearch.tsx`)
- Hooks: `camelCase.ts` (ex: `useDataStore.ts`)
- Utilitaires: `camelCase.ts` (ex: `formatDate.ts`)
- Types: `PascalCase.ts` (ex: `types.ts`)

#### Variables et Fonctions

```tsx
// Variables: camelCase
const userName = 'John';
const isActive = true;

// Fonctions: camelCase avec verbe
const handleClick = () => {};
const getUserData = () => {};
const formatDate = (date: Date) => {};

// Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;
const API_ENDPOINT = '/api/data';

// Composants: PascalCase
const UserProfile = () => {};
const NavigationBar = () => {};
```

---

## 🔄 Processus de Développement {#processus}

### 1. Créer une Branche

```bash
# Feature
git checkout -b feature/nom-de-la-feature

# Bug fix
git checkout -b fix/nom-du-bug

# Amélioration
git checkout -b improvement/nom-amelioration
```

### 2. Développer

1. **Écrire le code**
   - Suivre les standards de code
   - Ajouter des commentaires JSDoc
   - Typer correctement avec TypeScript

2. **Tester localement**

   ```bash
   npm run dev
   ```

3. **Vérifier le build**

   ```bash
   npm run build
   ```

### 3. Commiter

Utiliser des messages de commit clairs et descriptifs:

```bash
# Format: type(scope): description

# Exemples
git commit -m "feat(search): add global search component"
git commit -m "fix(notifications): correct timestamp display"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(admin): improve dashboard layout"
git commit -m "refactor(analytics): optimize calculations"
```

**Types de commit**:

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Tâches de maintenance

### 4. Push et Pull Request

```bash
# Push vers la branche
git push origin feature/nom-de-la-feature

# Créer une Pull Request sur GitHub
# Décrire les changements
# Demander une review
```

---

## 🧪 Tests {#tests}

### Tests Manuels

Avant de commiter, vérifier:

1. ✅ Le composant s'affiche correctement
2. ✅ Les interactions fonctionnent (clics, saisie)
3. ✅ Les animations sont fluides
4. ✅ Le responsive fonctionne (mobile, tablette, desktop)
5. ✅ Les raccourcis clavier fonctionnent
6. ✅ Pas d'erreurs dans la console
7. ✅ Le build passe sans erreur

### Checklist de Test

#### Nouveau Composant

- [ ] Affichage correct sur tous les breakpoints
- [ ] Interactions fonctionnelles
- [ ] Animations fluides
- [ ] Accessibilité (navigation clavier)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs de console
- [ ] Build réussi

#### Modification Existante

- [ ] Fonctionnalité existante non cassée
- [ ] Nouvelle fonctionnalité testée
- [ ] Pas de régression visuelle
- [ ] Build réussi

---

## 📚 Documentation {#documentation}

### JSDoc pour les Composants

Chaque composant doit avoir un header JSDoc:

```tsx
/**
 * ComponentName
 * 
 * Description du composant et de son rôle.
 * 
 * Fonctionnalités:
 * - Liste des fonctionnalités principales
 * - Autre fonctionnalité
 * 
 * @author Perfect Models Management
 * @version 2.0
 */
```

### JSDoc pour les Fonctions

```tsx
/**
 * Description de la fonction
 * 
 * @param param1 - Description du paramètre 1
 * @param param2 - Description du paramètre 2
 * @returns Description de ce qui est retourné
 * 
 * @example
 * const result = functionName('value1', 'value2');
 */
const functionName = (param1: string, param2: string): string => {
    // Implementation
};
```

### Commentaires Inline

Utiliser des commentaires inline pour expliquer la logique complexe:

```tsx
// Calculer le nombre de jours entre deux dates
const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

// Filtrer les utilisateurs actifs dans les 15 dernières minutes
const activeUsers = allUsers.filter(user => 
    (now - user.loginTime) < fifteenMinutes
);
```

### README

Mettre à jour le README si:

- Ajout d'une nouvelle dépendance
- Changement dans le processus d'installation
- Nouvelle fonctionnalité majeure
- Changement dans les scripts npm

---

## 🚀 Déploiement {#deploiement}

### Avant le Déploiement

1. **Vérifier le build**

   ```bash
   npm run build
   ```

2. **Tester le build localement**

   ```bash
   npm run preview
   ```

3. **Vérifier les erreurs**
   - Pas d'erreurs TypeScript
   - Pas d'erreurs de console
   - Toutes les fonctionnalités testées

### Process de Déploiement

1. **Merge vers main**

   ```bash
   git checkout main
   git pull origin main
   git merge feature/nom-de-la-feature
   ```

2. **Build de production**

   ```bash
   npm run build
   ```

3. **Déployer**
   - Suivre le processus de déploiement de votre plateforme
   - Vérifier le déploiement en production

---

## 🎨 Bonnes Pratiques

### Performance

1. **Utiliser useMemo pour les calculs coûteux**

   ```tsx
   const expensiveValue = useMemo(() => {
       return complexCalculation(data);
   }, [data]);
   ```

2. **Utiliser useCallback pour les fonctions**

   ```tsx
   const handleClick = useCallback(() => {
       // Logic
   }, [dependencies]);
   ```

3. **Lazy loading des composants**

   ```tsx
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

### Accessibilité

1. **Utiliser les balises sémantiques**

   ```tsx
   <nav>...</nav>
   <main>...</main>
   <aside>...</aside>
   ```

2. **Ajouter les attributs ARIA**

   ```tsx
   <button aria-label="Fermer le modal">
       <XMarkIcon />
   </button>
   ```

3. **Support du clavier**

   ```tsx
   <div 
       role="button"
       tabIndex={0}
       onKeyDown={(e) => e.key === 'Enter' && handleAction()}
   >
   ```

### Sécurité

1. **Valider les entrées utilisateur**
2. **Échapper les données affichées**
3. **Utiliser HTTPS en production**
4. **Ne jamais exposer les clés API**

---

## 🐛 Debugging

### Console Logs

Utiliser des logs descriptifs:

```tsx
console.log('User data:', userData);
console.error('Failed to fetch:', error);
console.warn('Deprecated feature used');
```

### React DevTools

Utiliser React DevTools pour:

- Inspecter les props et state
- Profiler les performances
- Débugger les re-renders

### TypeScript

Vérifier les erreurs TypeScript:

```bash
npx tsc --noEmit
```

---

## 📞 Support

### Questions

- Consulter la documentation dans `CODE_DOCUMENTATION.md`
- Consulter les exemples de code existants
- Demander de l'aide à l'équipe

### Problèmes

- Vérifier les issues GitHub existantes
- Créer une nouvelle issue si nécessaire
- Fournir un maximum de détails (erreurs, screenshots, steps to reproduce)

---

## ✅ Checklist Finale

Avant de soumettre une Pull Request:

- [ ] Code suit les standards
- [ ] JSDoc ajouté pour les nouveaux composants
- [ ] Commentaires inline pour la logique complexe
- [ ] Tests manuels effectués
- [ ] Build réussi
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs de console
- [ ] Responsive testé
- [ ] Accessibilité vérifiée
- [ ] Documentation mise à jour si nécessaire

---

**Date de mise à jour**: 17 décembre 2025
**Version**: 2.0
**Auteur**: Perfect Models Management
