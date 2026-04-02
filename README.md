<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Perfect Models Management (PMM)

Bienvenue sur le dépôt officiel du site web et de l'application de gestion de **Perfect Models Management (PMM)**.

Perfect Models Management est une agence de mannequins professionnelle, spécialisée dans le développement de talents, l'organisation de défilés, les campagnes publicitaires, les éditoriaux magazines, et bien plus encore. Ce projet regroupe à la fois la vitrine publique de l'agence et les espaces privés d'administration et de gestion de carrière pour les mannequins.

---

## 📑 Pages et Fonctionnalités Publiques

La partie publique de l'application permet de présenter l'agence au monde entier.

### 🏠 Accueil
La page d'accueil offre une vue d'ensemble de l'agence, mettant en avant les mannequins phares, les dernières actualités, et un accès rapide aux différentes sections du site.

### 🏢 L'Agence
Présentation détaillée de Perfect Models Management, de son histoire, de ses valeurs, de ses réalisations majeures (Libreville Fashion Week, Black Fashion Week Paris, etc.) et de ses partenaires (G Store, NR Picture, Tito Style, etc.).

### 💃 Nos Mannequins
Une galerie (`Gallery`) présentant les différents talents de l'agence.
*   **Profils détaillés :** Chaque mannequin possède une page dédiée affichant ses mensurations (taille, poids, couleur des cheveux, couleur des yeux, etc.), son portfolio, et un lien vers ses réseaux sociaux (Instagram).

### 🌟 Perfect Fashion Day
Section dédiée à l'événement phare organisé par l'agence. On y retrouve les informations sur l'événement et les formulaires d'inscription pour les mannequins et les créateurs.

### 📖 Magazine
Un espace blog/magazine proposant des articles de fond sur la mode, des actualités de l'agence, et les tendances du moment. Les articles supportent les vues et les réactions (likes).

### 💼 Services
Présentation des différents services offerts par l'agence :
*   Booking de mannequins
*   Styling & Conseil Mode
*   Organisation de Défilés de Mode
*   Conseil en Image et Style
*   Création de Tenues Sur-Mesure
*   Location de Tenues de Mode
*   Conseil Créatif et Branding
*   Shooting Mode Professionnel
*   Animation de Shows / Défilés
*   Promotion et Communication

### 🎤 Casting
Informations sur les critères de recrutement et le processus pour devenir mannequin chez PMM, accompagnées d'un formulaire de candidature en ligne.

### 📞 Contact
Page permettant de joindre l'agence, avec formulaire de contact, informations de localisation, et liens vers les réseaux sociaux.

---

## 🔒 Espaces Privés & Dashboards

Le projet inclut des tableaux de bord sophistiqués pour différents types d'utilisateurs.

### 👩‍🎤 Espace Mannequin (Model Dashboard)
Un espace de développement (`ModelDashboard`) dédié à chaque mannequin.
*   **Profil :** Gestion complète de ses informations, mensurations, et expériences professionnelles.
*   **Outils :** Génération automatique de QR Code (`ModelQRCode`) menant vers son profil public.

### 🛠️ Espace d'Administration
Un tableau de bord complet pour la direction de l'agence.
*   **Analytics Dashboard :** Suivi en temps réel des statistiques du site.
*   **Casting Kanban :** Un outil de gestion de projet (basé sur le glisser-déposer avec `@hello-pangea/dnd`) permettant de suivre le statut des candidatures de casting (`CastingKanban`).
*   **Dashboard Calendar :** Un calendrier interactif (utilisant `react-big-calendar`) pour gérer les événements, les bookings et les sessions de formation (`DashboardCalendar`).
*   **Gestion des Mannequins et Candidatures :** Administration des profils publics et traitement des formulaires (Casting, Fashion Day).
*   **Gestion du Magazine :** Création et publication d'articles.

---

## 💻 Stack Technique & Architecture

Le projet est développé avec des technologies modernes et performantes.

*   **Frontend :** React 18, Vite (bundler très rapide), TypeScript.
*   **Routage :** `react-router-dom` (HashRouter).
*   **Styling :** Tailwind CSS, avec une palette de couleurs personnalisée et premium orientée autour du doré (`pm-gold`, `pm-gold-light`, `pm-gold-dark`) et du sombre (`pm-dark`). Le design utilise des effets de glassmorphism (transparence et flou).
*   **Backend & Données :** Firebase (Realtime Database pour le stockage des données structurées). Le système utilise une architecture de règles de sécurité strictes, interdisant la lecture/écriture globale et favorisant des opérations granulaires via un contexte centralisé (`DataContext`).
*   **PWA (Progressive Web App) :** L'application est installable via `vite-plugin-pwa` avec gestion du cache hors ligne.

---

## 🚀 Installation et Lancement en Local

Ce projet utilise **pnpm** comme gestionnaire de paquets exclusif.

**Prérequis :**
*   Node.js (version 18+ recommandée)
*   [pnpm](https://pnpm.io/installation)

### 1. Cloner le dépôt et installer les dépendances

```bash
pnpm install
```

### 2. Configuration de l'environnement

Vous devez créer un fichier `.env` à la racine du projet, qui contiendra vos clés d'API Firebase. L'application ne démarrera pas correctement sans ces variables.

Exemple de `.env` :
```env
VITE_FIREBASE_API_KEY=votre_cle
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine
VITE_FIREBASE_DATABASE_URL=votre_url_db
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_ADMIN_PASSWORD=mot_de_passe_admin_local
```

### 3. Lancer le serveur de développement

```bash
pnpm dev
```

L'application sera accessible (généralement sur `http://localhost:5173`).

### 4. Build de production

*(Note : le build peut nécessiter la résolution préalable d'imports manquants dans le code de développement, voir la documentation interne)*

```bash
pnpm build
```
