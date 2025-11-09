# Documentation Technique

## Architecture du Projet

```
src/
├── assets/          # Fichiers statiques (images, polices, etc.)
├── components/      # Composants réutilisables
├── constants/       # Constantes et données statiques
├── contexts/        # Contextes React
├── hooks/           # Hooks personnalisés
├── layouts/         # Mises en page principales
├── pages/           # Pages de l'application
├── services/        # Appels API et services
├── styles/          # Fichiers de style globaux
└── utils/           # Utilitaires et helpers
```

## Composants Principaux

### 1. Navigation
- `Navbar` : Barre de navigation principale
- `Footer` : Pied de page avec liens et informations de contact
- `MobileMenu` : Menu de navigation pour mobile

### 2. Pages
- `Home` : Page d'accueil avec présentation
- `Models` : Liste des mannequins
- `ModelDetail` : Profil détaillé d'un mannequin
- `Events` : Calendrier des événements
- `Blog` : Articles de blog
- `Contact` : Formulaire de contact

### 3. Formulaires
- `ContactForm` : Formulaire de contact
- `NewsletterForm` : Inscription à la newsletter
- `BookingForm` : Prise de rendez-vous

## Gestion d'État

- **Context API** pour la gestion de l'état global
- **useState/useReducer** pour l'état local des composants
- **React Query** pour la gestion des appels API et du cache

## Sécurité

- Authentification avec JWT
- Protection des routes
- Validation des formulaires côté client et serveur
- Protection CSRF
- Politique de sécurité du contenu (CSP)

## Tests

- Tests unitaires avec Jest et React Testing Library
- Tests d'intégration
- Tests E2E avec Cypress

## Performance

- Chargement paresseux des composants
- Optimisation des images
- Mise en cache avec Service Worker
- Code splitting avec React.lazy et Suspense

## Accessibilité

- Navigation au clavier
- Support des lecteurs d'écran
- Contraste des couleurs
- Attributs ARIA

## Internationalisation

- Support multilingue avec i18next
- Fichiers de traduction séparés
- Détection automatique de la langue

## Dépendances Principales

- React 18
- TypeScript
- React Router
- Framer Motion (animations)
- Tailwind CSS (styling)
- React Query (gestion des données)
- Formik + Yup (formulaires)
- i18next (internationalisation)
