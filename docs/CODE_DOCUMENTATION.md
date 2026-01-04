# Documentation du Code - Panel Admin

## 📁 Architecture du Code

### Structure des Composants

```text
src/
├── components/
│   └── admin/
│       ├── GlobalSearch.tsx          # Recherche globale (⌘K)
│       ├── NotificationCenter.tsx    # Centre de notifications (⌘N)
│       ├── QuickActionsMenu.tsx      # Menu d'actions rapides (⌘P)
│       ├── AnalyticsDashboard.tsx    # Dashboard analytics
│       └── AdminLayout.tsx           # Layout principal du panel admin
├── pages/
│   └── Admin.tsx                     # Page dashboard principale
└── contexts/
    └── DataContext.tsx               # Contexte global des données Firebase
```

## 🔧 Composants Principaux

### 1. GlobalSearch.tsx

**Responsabilité**: Recherche globale dans le panel admin

**Props**:

- `isOpen: boolean` - Contrôle l'affichage du modal
- `onClose: () => void` - Callback pour fermer le modal

**État Local**:

- `query: string` - Requête de recherche
- `results: SearchResult[]` - Résultats filtrés
- `selectedIndex: number` - Index de l'élément sélectionné

**Fonctionnalités**:

- Recherche fuzzy dans titres, descriptions et catégories
- Navigation au clavier (↑↓ pour naviguer, Enter pour sélectionner)
- Auto-focus sur l'input à l'ouverture
- Affichage des 8 pages les plus populaires par défaut

**Hooks Utilisés**:

- `useState` - Gestion de l'état local
- `useEffect` - Auto-focus et filtrage des résultats
- `useRef` - Référence à l'input pour le focus
- `useNavigate` - Navigation React Router

---

### 2. NotificationCenter.tsx

**Responsabilité**: Affichage des notifications en temps réel

**Props**:

- `isOpen: boolean` - Contrôle l'affichage du panneau
- `onClose: () => void` - Callback pour fermer le panneau

**État Local**:

- `readNotifications: Set<string>` - IDs des notifications lues

**Données Calculées** (useMemo):

- Notifications de casting (status === 'Nouveau')
- Notifications de booking (status === 'Nouveau')
- Notifications de messages (status === 'Nouveau')
- Notifications PFD (status === 'En attente')

**Fonctionnalités**:

- Calcul automatique du nombre de notifications non lues
- Marquer comme lu (individuellement ou en masse)
- Tri par date (plus récentes en premier)
- Icônes et couleurs différentes par type

**Hooks Utilisés**:

- `useState` - Gestion des notifications lues
- `useMemo` - Calcul optimisé des notifications
- `useData` - Accès aux données Firebase

---

### 3. QuickActionsMenu.tsx

**Responsabilité**: Menu d'accès rapide aux actions courantes

**Props**:

- `isOpen: boolean` - Contrôle l'affichage du menu
- `onClose: () => void` - Callback pour fermer le menu

**Actions Disponibles**:

1. Ajouter un mannequin → `/admin/models`
2. Créer un article → `/admin/magazine`
3. Créer un événement PFD → `/admin/fashion-day-events`
4. Générer une image IA → `/admin/generer-image`
5. Envoyer un email → `/admin/mailing`
6. Enregistrer un paiement → `/admin/payments`

**Fonctionnalités**:

- Cartes avec gradients colorés
- Animations séquentielles (delay: index * 0.05s)
- Navigation directe vers les pages

**Hooks Utilisés**:

- Aucun hook personnalisé (composant stateless)

---

### 4. AnalyticsDashboard.tsx

**Responsabilité**: Affichage des statistiques et analytics

**Props**:

- `className?: string` - Classes CSS additionnelles

**Métriques Calculées** (useMemo):

- Total mannequins (avec tendance)
- Mannequins Pro vs Débutants
- Candidatures casting (nouvelles/total)
- Demandes booking (nouvelles/total)
- Messages (nouveaux/total)
- Revenus mensuels (mois en cours)

**Composants Internes**:

- `AnalyticsStatCard` - Carte de statistique avec tendance
- `ActivityBar` - Barre de progression animée

**Fonctionnalités**:

- Calcul automatique des tendances
- Graphiques d'activité avec animations
- Widget de revenus mensuels
- Design avec gradients colorés

**Hooks Utilisés**:

- `useMemo` - Calcul optimisé des analytics
- `useData` - Accès aux données Firebase

---

### 5. AdminLayout.tsx

**Responsabilité**: Layout principal avec navigation et header

**Props**:

- `children: React.ReactNode` - Contenu de la page

**État Local**:

- `sidebarOpen: boolean` - État de la sidebar mobile
- `searchOpen: boolean` - État du modal de recherche
- `notificationsOpen: boolean` - État du panneau de notifications
- `quickActionsOpen: boolean` - État du menu d'actions rapides

**Fonctionnalités**:

- Sidebar responsive (desktop fixe, mobile overlay)
- Header avec barre de recherche (desktop)
- Boutons de notifications et actions rapides
- Badge de compteur de notifications non lues
- Raccourcis clavier globaux

**Raccourcis Clavier**:

- `⌘K` / `Ctrl+K` → Ouvrir la recherche
- `⌘N` / `Ctrl+N` → Ouvrir les notifications
- `⌘P` / `Ctrl+P` → Ouvrir les actions rapides
- `Esc` → Fermer tous les modals

**Hooks Utilisés**:

- `useState` - Gestion de l'état des modals
- `useEffect` - Écoute des raccourcis clavier
- `useLocation` - Détection de la page active
- `useData` - Calcul du compteur de notifications

---

### 6. Admin.tsx

**Responsabilité**: Page dashboard principale

**État Local**:

- `activeUsers: ActiveUser[]` - Utilisateurs actifs (15 dernières minutes)

**Données Calculées** (useMemo):

- Statistiques rapides (candidatures, bookings, messages, mannequins)
- Activités récentes (5 dernières)

**Sections**:

1. **Header** - Titre et bouton de déconnexion
2. **Cartes de stats** - 4 métriques clés
3. **Analytics Dashboard** - Graphiques et tendances
4. **Accès Rapides** - Liens vers fonctionnalités principales
5. **Gestion du Site** - Contenu, événements, paramètres
6. **Activité en Direct** - Utilisateurs connectés
7. **Notifications Récentes** - Dernières activités

**Fonctionnalités**:

- Suivi des utilisateurs actifs (localStorage)
- Rafraîchissement automatique (5 secondes)
- Calcul des statistiques en temps réel
- Navigation rapide vers toutes les sections

**Hooks Utilisés**:

- `useState` - Gestion des utilisateurs actifs
- `useEffect` - Polling des utilisateurs actifs
- `useMemo` - Calcul optimisé des statistiques
- `useNavigate` - Navigation pour la déconnexion
- `useData` - Accès aux données Firebase

---

## 🎨 Conventions de Code

### Nommage

**Composants**:

- PascalCase pour les noms de composants
- Suffixe descriptif (ex: `GlobalSearch`, `NotificationCenter`)

**Fonctions**:

- camelCase pour les fonctions
- Préfixes descriptifs (ex: `handleKeyDown`, `getRoleColor`)

**Interfaces**:

- PascalCase avec suffixe `Props` pour les props
- Noms descriptifs pour les types de données

**Constantes**:

- camelCase pour les constantes locales
- UPPER_SNAKE_CASE pour les constantes globales

### Structure des Fichiers

Chaque fichier suit cette structure:

```tsx
/**
 * JSDoc header avec description du composant
 */

// Imports
import React from 'react';
import { ... } from '...';

// Interfaces et Types
interface ComponentProps {
    // ...
}

// Constantes
const CONSTANT_VALUE = ...;

// Composant Principal
const Component: React.FC<ComponentProps> = ({ props }) => {
    // État local
    const [state, setState] = useState(...);
    
    // Hooks
    useEffect(() => {
        // ...
    }, []);
    
    // Fonctions utilitaires
    const handleAction = () => {
        // ...
    };
    
    // Rendu
    return (
        // JSX
    );
};

// Export
export default Component;
```

### Commentaires

**JSDoc pour les composants**:

```tsx
/**
 * Description du composant
 * 
 * Fonctionnalités:
 * - Liste des fonctionnalités
 * 
 * @author Perfect Models Management
 * @version 2.0
 */
```

**JSDoc pour les fonctions**:

```tsx
/**
 * Description de la fonction
 * @param param1 - Description du paramètre
 * @returns Description du retour
 */
```

**Commentaires inline**:

```tsx
// Description courte de l'action
const value = calculation();
```

---

## 🔄 Flux de Données

### 1. Données Firebase → DataContext

```text
Firebase Realtime Database
    ↓
DataContext (useData hook)
    ↓
Composants (useData())
```

### 2. Notifications

```text
Nouvelles données Firebase
    ↓
DataContext met à jour
    ↓
NotificationCenter calcule (useMemo)
    ↓
Badge de compteur mis à jour
    ↓
Affichage dans le panneau
```

### 3. Recherche

```text
Utilisateur tape dans l'input
    ↓
useEffect filtre les résultats
    ↓
Affichage des résultats filtrés
    ↓
Navigation au clavier
    ↓
Sélection → Navigation React Router
```

### 4. Analytics

```text
Données Firebase
    ↓
useMemo calcule les métriques
    ↓
Affichage des cartes de stats
    ↓
Animations Framer Motion
```

---

## 🎯 Optimisations

### Performance

1. **useMemo** pour les calculs coûteux
   - Calcul des notifications
   - Calcul des statistiques
   - Filtrage des résultats de recherche

2. **useCallback** pour les fonctions
   - Handlers d'événements
   - Callbacks de fermeture

3. **Lazy Loading**
   - Composants chargés à la demande
   - Images optimisées

### UX

1. **Auto-focus**
   - Input de recherche au focus automatique
   - Améliore la rapidité d'utilisation

2. **Animations**
   - Transitions fluides avec Framer Motion
   - Feedback visuel immédiat

3. **Raccourcis Clavier**
   - Navigation rapide sans souris
   - Productivité améliorée

---

## 🐛 Gestion des Erreurs

### Vérifications

1. **Données nulles**

   ```tsx
   if (!data) return null;
   ```

2. **Tableaux vides**

   ```tsx
   (data.items || []).map(...)
   ```

3. **Propriétés optionnelles**

   ```tsx
   data?.property?.subProperty
   ```

### États de chargement

1. **Composants**
   - Affichage de messages "Aucun résultat"
   - Skeletons pour le chargement

2. **Données**
   - Vérification de l'existence avant utilisation
   - Valeurs par défaut

---

## 📚 Dépendances

### Production

- `react` - Bibliothèque UI
- `react-router-dom` - Navigation
- `framer-motion` - Animations
- `@heroicons/react` - Icônes
- `firebase` - Base de données

### Développement

- `typescript` - Typage statique
- `vite` - Build tool
- `tailwindcss` - Styling

---

## 🚀 Bonnes Pratiques

### 1. Typage TypeScript

- Toujours typer les props
- Utiliser des interfaces pour les objets complexes
- Éviter `any`

### 2. Hooks

- Respecter les règles des hooks
- Utiliser `useMemo` pour les calculs coûteux
- Utiliser `useCallback` pour les fonctions

### 3. Composants

- Un composant = une responsabilité
- Props claires et documentées
- Composants réutilisables

### 4. Performance

- Éviter les re-renders inutiles
- Optimiser les listes avec `key`
- Lazy loading quand possible

### 5. Accessibilité

- Utiliser les balises sémantiques
- Ajouter les attributs ARIA
- Support du clavier

---

**Date de mise à jour**: 17 décembre 2025
**Version**: 2.0
**Auteur**: Perfect Models Management
