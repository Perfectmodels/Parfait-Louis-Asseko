# 🎭 Perfect Models Management - Fiche Technique

## 📋 Vue d'ensemble

**Perfect Models Management** est une plateforme web complète pour une agence de mannequins basée à Libreville, Gabon. Le site offre une solution intégrée pour la gestion des mannequins, la formation, les événements, et l'administration.

### 🌐 Informations Générales
- **URL de Production** : `https://www.perfectmodels.ga`
- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM (HashRouter)
- **État Global** : Context API + Local Storage
- **Animations** : Framer Motion
- **Icônes** : Heroicons

---

## 🏗️ Architecture Technique

### Structure des Dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── icons/          # Composants d'icônes et navigation
│   ├── SEO.tsx         # Gestion des métadonnées
│   ├── ImageUpload.tsx # Upload d'images (ImgBB)
│   └── ...
├── contexts/           # Contextes React
│   └── DataContext.tsx # Gestion de l'état global
├── hooks/              # Hooks personnalisés
│   └── useDataStore.tsx # Persistance des données
├── pages/              # Pages de l'application
├── types/              # Définitions TypeScript
├── constants/          # Données statiques
└── services/           # Services externes
```

### Technologies Utilisées
- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, Framer Motion
- **Routing** : React Router DOM
- **État** : Context API + Local Storage
- **APIs Externes** : ImgBB (images), Gemini AI (contenu), Replicate (IA avancée)
- **PDF** : jsPDF + html2canvas
- **PWA** : Service Worker

---

## 🎯 Fonctionnalités Principales

### 1. 🏠 Page d'Accueil (`/`)
**Fichier** : `src/pages/Home.tsx`

**Fonctionnalités** :
- Hero section avec animations
- Compteur de mannequins en temps réel
- Affichage des événements Perfect Fashion Day
- Section des services
- Témoignages avec carousel
- Compteur de visiteurs
- Call-to-action pour les candidatures

**Composants** :
- `CountdownTimer` : Compteur pour les événements
- `TestimonialCarousel` : Carousel de témoignages
- `Services` : Affichage des services

### 2. 👥 Gestion des Mannequins

#### Page Mannequins (`/mannequins`)
**Fichier** : `src/pages/Models.tsx`

**Fonctionnalités** :
- Grille responsive des mannequins
- Filtres par catégorie, genre, taille
- Recherche par nom
- Pagination
- Affichage des distinctions

#### Détail Mannequin (`/mannequins/:id`)
**Fichier** : `src/pages/ModelDetail.tsx`

**Fonctionnalités** :
- Portfolio complet avec galerie
- Informations détaillées (mensurations, expérience)
- Distinctions et palmarès
- Partage sur réseaux sociaux
- Fiche imprimable

#### Dashboard Mannequin (`/profil`)
**Fichier** : `src/pages/ModelDashboard.tsx`

**Fonctionnalités** :
- Profil personnel modifiable
- Statut de paiement
- Soumission de paiements
- Accès aux formations
- Historique d'activité

### 3. 🎓 Système de Formation Unifié

#### Classroom (`/formations`)
**Fichier** : `src/pages/Activity.tsx`

**Fonctionnalités** :
- Modules de formation pour tous les mannequins
- Progression individuelle
- Quiz interactifs
- Certificats de completion
- Forum de discussion

#### Détail Chapitre (`/formations/:moduleSlug/:chapterSlug`)
**Fichier** : `src/pages/ChapterDetail.tsx`

**Fonctionnalités** :
- Contenu pédagogique structuré
- Quiz de validation
- Navigation entre chapitres
- Suivi de progression

#### Forum (`/formations/forum`)
**Fichier** : `src/pages/ClassroomForum.tsx`

**Fonctionnalités** :
- Discussions par catégorie
- Création de nouveaux sujets
- Système de réponses
- Modération

### 4. 🎪 Événements Perfect Fashion Day

#### Page Événements (`/fashion-day`)
**Fichier** : `src/pages/FashionDay.tsx`

**Fonctionnalités** :
- Affichage des éditions (passées et futures)
- Galerie d'images
- Statistiques des événements
- Génération de pressbook PDF
- Call-to-action pour participation

#### Formulaire de Candidature (`/fashion-day-application`)
**Fichier** : `src/pages/FashionDayApplicationForm.tsx`

**Fonctionnalités** :
- Formulaire de candidature complet
- Upload de photos
- Validation des données
- Confirmation de soumission

### 5. 📰 Magazine (`/magazine`)
**Fichier** : `src/pages/Magazine.tsx`

**Fonctionnalités** :
- Articles de mode et actualités
- Filtres par catégorie
- Article vedette
- Pagination
- Recherche

#### Détail Article (`/magazine/:slug`)
**Fichier** : `src/pages/ArticleDetail.tsx`

**Fonctionnalités** :
- Lecture complète des articles
- Partage social
- Articles similaires
- Commentaires

### 6. 🎬 Casting (`/casting`)
**Fichier** : `src/pages/Casting.tsx`

**Fonctionnalités** :
- Informations sur les castings
- Formulaire de candidature
- Évaluation par jury
- Résultats

### 7. 🏢 Page Agence (`/agence`)
**Fichier** : `src/pages/Agency.tsx`

**Fonctionnalités** :
- Présentation de l'agence
- Équipe dirigeante
- Historique et valeurs
- Statistiques
- Témoignages
- FAQ

### 8. 📞 Contact (`/contact`)
**Fichier** : `src/pages/Contact.tsx`

**Fonctionnalités** :
- Formulaire de contact unifié
- Formulaire de réservation
- Informations de contact
- Carte interactive
- Réseaux sociaux

### 9. 🖼️ Galerie (`/galerie`)
**Fichier** : `src/pages/Gallery.tsx`

**Fonctionnalités** :
- Albums photos par thème
- Filtres par catégorie
- Visionneuse d'images
- Recherche

---

## 🔐 Système d'Authentification

### Types d'Utilisateurs
1. **Visiteurs** : Accès public
2. **Mannequins** : Accès aux formations et profil
3. **Débutants** : Accès aux formations (même classroom que les mannequins)
4. **Jury** : Évaluation des castings
5. **Enregistrement** : Gestion des candidatures
6. **Admin** : Accès complet au panel d'administration

### Authentification (`/login`)
**Fichier** : `src/pages/Login.tsx`

**Fonctionnalités** :
- Connexion multi-rôles
- Redirection automatique selon le rôle
- Gestion des sessions
- Déconnexion sécurisée

---

## ⚙️ Panel d'Administration

### Dashboard Principal (`/admin`)
**Fichier** : `src/pages/Admin.tsx`

**Fonctionnalités** :
- Vue d'ensemble des statistiques
- Notifications en temps réel
- Accès rapide aux modules
- Interface moderne avec sidebar

### Gestion des Mannequins (`/admin/models`)
**Fichier** : `src/pages/admin/models/ModelManagement.tsx`

**Fonctionnalités** :
- CRUD complet des mannequins
- Promotion/rétrogradation des statuts
- Gestion de la visibilité
- Impression des fiches
- Export CSV

### Gestion des Débutants (`/admin/beginner-students-access`)
**Fichier** : `src/pages/AdminBeginnerStudents.tsx`

**Fonctionnalités** :
- Gestion des étudiants débutants
- Promotion vers mannequin professionnel
- Export des accès
- Génération de matricules

### Système de Paiements (`/admin/payments`)
**Fichier** : `src/pages/AdminPayments.tsx`

**Fonctionnalités** :
- Gestion des cotisations (1500 FCFA)
- Gestion des inscriptions (15000 FCFA)
- Paiements en avance
- Statuts de paiement
- Tri et filtrage automatique

### Soumissions de Paiements (`/admin/payment-submissions`)
**Fichier** : `src/pages/AdminPaymentSubmissions.tsx`

**Fonctionnalités** :
- Validation des paiements soumis
- Approbation/rejet
- Intégration avec la comptabilité

### Comptabilité (`/admin/accounting`)
**Fichier** : `src/pages/AdminAccounting.tsx`

**Fonctionnalités** :
- Gestion des revenus et dépenses
- Génération de rapports PDF
- Bilan financier
- Export des données

### Gestion du Contenu

#### Magazine (`/admin/magazine`)
**Fichier** : `src/pages/AdminMagazine.tsx`

**Fonctionnalités** :
- CRUD des articles
- Upload d'images
- Assistant IA pour le contenu
- Gestion des catégories

#### Galerie (`/admin/gallery`)
**Fichier** : `src/pages/AdminGallery.tsx`

**Fonctionnalités** :
- Création d'albums
- Upload multiple d'images
- Gestion des thèmes
- Visibilité publique/privée

#### Équipe (`/admin/team`)
**Fichier** : `src/pages/AdminTeam.tsx`

**Fonctionnalités** :
- Gestion des membres d'équipe
- Upload de photos
- Informations de contact
- Ordre d'affichage

### Suivi des Mannequins (`/admin/model-tracking`)
**Fichier** : `src/pages/AdminModelTracking.tsx`

**Fonctionnalités** :
- Tableau de bord de performance
- Activités des mannequins
- Notes et évaluations
- Historique complet

### Gestion des Castings (`/admin/casting-applications`)
**Fichier** : `src/pages/AdminCasting.tsx`

**Fonctionnalités** :
- Gestion des candidatures
- Évaluation par jury
- Résultats et classements
- Export des données

### Gestion des Événements (`/admin/fashion-day-events`)
**Fichier** : `src/pages/AdminFashionDayEvents.tsx`

**Fonctionnalités** :
- Création d'événements
- Gestion des éditions
- Upload d'images
- Configuration des dates

---

## 🛠️ Composants Techniques

### Upload d'Images
**Fichier** : `src/components/ImageUpload.tsx`

**Fonctionnalités** :
- Intégration ImgBB API
- Drag & drop
- Prévisualisation
- Validation des formats
- Compression automatique

### Assistant IA
**Fichier** : `src/services/geminiService.ts`

**Fonctionnalités** :
- Génération de contenu avec Gemini AI
- Suggestions d'articles
- Optimisation SEO
- Création de descriptions

### Génération PDF
**Fichier** : `src/components/PressbookGenerator.tsx`

**Fonctionnalités** :
- Création de pressbooks
- Intégration du logo
- Mise en page professionnelle
- Export multi-pages

### SEO
**Fichier** : `src/components/SEO.tsx`

**Fonctionnalités** :
- Métadonnées dynamiques
- Open Graph
- Twitter Cards
- Schema.org
- Sitemap automatique

---

## 📊 Gestion des Données

### Structure des Données
**Fichier** : `src/types.ts`

**Types Principaux** :
- `Model` : Profils des mannequins
- `BeginnerStudent` : Étudiants débutants
- `Article` : Articles du magazine
- `Album` : Albums photos
- `TeamMember` : Membres d'équipe
- `PaymentSubmission` : Soumissions de paiement
- `AccountingTransaction` : Transactions comptables

### Persistance
**Fichier** : `src/hooks/useDataStore.tsx`

**Fonctionnalités** :
- Sauvegarde automatique en Local Storage
- Synchronisation des données
- Gestion des versions
- Migration des données

---

## 🎨 Design System

### Couleurs
- **Or Principal** : `#D4AF37` (pm-gold)
- **Fond Sombre** : `#0A0A0A` (pm-dark)
- **Texte Clair** : `#F5F5F5` (pm-off-white)
- **Accents** : Variations de l'or

### Typographie
- **Titres** : Playfair Display (serif élégant)
- **Corps** : Inter (sans-serif moderne)
- **Tailles** : Système responsive

### Animations
- **Framer Motion** : Transitions fluides
- **Hover Effects** : Interactions subtiles
- **Loading States** : Feedback visuel

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations
- Navigation mobile avec menu hamburger
- Grilles responsives
- Images adaptatives
- Typographie fluide

---

## 🔧 Configuration et Déploiement

### Variables d'Environnement
```env
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REPLICATE_API_KEY=your_replicate_api_key
```

### Scripts Disponibles
```bash
npm run dev      # Développement
npm run build    # Production
npm run preview  # Aperçu build
```

### Optimisations
- **Code Splitting** : Chargement paresseux
- **Tree Shaking** : Suppression du code inutilisé
- **Compression** : Gzip/Brotli
- **Cache** : Service Worker

---

## 🚀 Fonctionnalités Avancées

### PWA (Progressive Web App)
- Installation sur mobile
- Fonctionnement hors ligne
- Notifications push
- Cache intelligent

### SEO Optimisé
- Métadonnées dynamiques
- URLs propres
- Sitemap automatique
- Schema.org

### Accessibilité
- Navigation au clavier
- ARIA labels
- Contraste optimisé
- Screen readers

### Performance
- Lazy loading des images
- Code splitting
- Optimisation des bundles
- Cache stratégique

---

## 📈 Analytics et Monitoring

### Métriques Suivies
- Visiteurs uniques
- Pages vues
- Taux de conversion
- Performance des pages

### Outils Intégrés
- Google Analytics (préparé)
- Console de développement
- Monitoring des erreurs

---

## 🔒 Sécurité

### Mesures Implémentées
- Validation des données
- Sanitisation des entrées
- Protection XSS
- Gestion sécurisée des sessions

### Authentification
- Sessions temporaires
- Déconnexion automatique
- Rôles et permissions
- Protection des routes

---

## 📞 Support et Maintenance

### Structure du Code
- TypeScript pour la sécurité des types
- Composants modulaires
- Hooks personnalisés
- Services séparés

### Documentation
- Commentaires dans le code
- Types TypeScript explicites
- Structure claire des dossiers

### Évolutivité
- Architecture modulaire
- Composants réutilisables
- API extensible
- Base de données flexible

---

## 🎯 Roadmap Future

### Fonctionnalités Prévues
- [ ] Notifications push
- [ ] Chat en temps réel
- [ ] Système de réservation avancé
- [ ] Analytics avancés
- [ ] Application mobile native
- [ ] Intégration paiements en ligne
- [ ] Système de messagerie interne

### Améliorations Techniques
- [ ] Tests automatisés
- [ ] CI/CD pipeline
- [ ] Monitoring avancé
- [ ] Optimisations performance
- [ ] Internationalisation

---
## 📝 Journal des Modifications

- **v1.0.3 (05/08/2024)** : 
    - **Intégration** : Ajout de la clé API Replicate pour les fonctionnalités d'IA avancées.
    - **Sécurité** : Mise à jour du panel de sécurité pour surveiller la nouvelle clé.
    - **Documentation** : Création de `.env.example` et mise à jour de la fiche technique.
- **v1.0.2 (05/08/2024)** : 
    - **Refactorisation** : Fusion des composants `AdminModels` et `ModelList` en un seul composant `ModelManagement`.
    - **Nettoyage** : Suppression des fichiers et routes obsolètes.
    - **Documentation** : Mise à jour de la fiche technique pour refléter les changements.

---
*Dernière mise à jour : 5 Aout 2024*
*Version : 1.0.3*
*Développé par : Perfect Models Management / Graphik Studio*
