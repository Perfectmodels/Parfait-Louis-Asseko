# Perfect Models Management (PMM)

> L'agence de mannequins de référence à Libreville, Gabon, redéfinissant l'élégance africaine.

![Badge Version](https://img.shields.io/badge/version-1.0.0-blue)
![Badge React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Badge TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Badge Firebase](https://img.shields.io/badge/Firebase-Enabled-FFCA28?logo=firebase)
![Badge Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)

## 🌟 Présentation

**Perfect Models Management** est une plateforme web moderne dédiée à la gestion et la promotion de l'agence PMM. Elle sert de vitrine pour les talents (mannequins), d'outil de gestion pour l'équipe (inscriptions, casting) et de plateforme événementielle pour le **Perfect Fashion Day**.

Le projet vise une expérience utilisateur premium, fluide et performante, avec une esthétique "Gabon Premium" (Vert, Jaune, Bleu, Blanc).

## 🚀 Fonctionnalités Clés

### Côté Public

* **Vitrine Agence** : Présentation de l'histoire, des valeurs et de l'équipe.
* **Portfolio Mannequins** : Galerie interactive des talents avec profils détaillés.
* **Perfect Fashion Day** : Page événementielle dédiée (éditions, réservations, galeries photos).
* **Magazine / Blog** : Actualités mode et lifestyle.
* **Casting en ligne** : Formulaire de candidature direct.

### Côté Admin & Technique

* **Dashboard Admin** : Gestion complète (CMS) des mannequins, castings, et contenus.
* **Firebase Backend** :
  * **Auth** : Authentification sécurisée (Admin, Staff).
  * **Realtime Database** : Stockage des données en temps réel.
  * **Cloud Messaging** : Notifications Push web.
  * **Analytics & Performance** : Suivi d'audience et métriques techniques.
* **PWA (Progressive Web App)** : Installable sur mobile, fonctionnement hors-ligne.
* **Gestion Images Hybride** : Optimisation avec doubles sources (Firebase + Constantes locales).

## 🛠️ Stack Technique

* **Frontend** : [React](https://react.dev/) (v19), [Vite](https://vitejs.dev/)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **Styling** : [Tailwind CSS](https://tailwindcss.com/)
* **Animations** : [Framer Motion](https://www.framer.com/motion/)
* **Backend / Cloud** : [Firebase](https://firebase.google.com/) (Google)
* **Icônes** : [Heroicons](https://heroicons.com/)

## 📦 Installation & Démarrage

### Prérequis

* Node.js (v18+)
* npm ou yarn

### 1. Cloner le projet

```bash
git clone https://github.com/Perfectmodels/Parfait-Louis-Asseko.git
cd Parfait-Louis-Asseko
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Créez un fichier `.env` à la racine (voir `.env.example`) avec vos clés API :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
# ... autres variables Firebase
VITE_IMGBB_API_KEY=votre_cle_imgbb
```

### 4. Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### 5. Build pour production

```bash
npm run build
```

## 📂 Architecture du Projet

```
src/
├── components/     # Composants React réutilisables (UI, Layouts)
├── constants/      # Données statiques & Images (source de vérité locale)
├── contexts/       # Gestion d'état global (Auth, Data)
├── docs/           # Documentation technique interne
├── hooks/          # Hooks React personnalisés (useNotifications, etc.)
├── pages/          # Pages principales (routes)
├── scripts/        # Scripts utilitaires (Node.js)
├── types/          # Définitions TypeScript
├── firebaseConfig.ts # Configuration Firebase
└── main.tsx        # Point d'entrée
public/             # Assets statiques (Service Worker, logos)
```

## 📚 Documentation Technique

Des guides détaillés sont disponibles dans le dossier `docs/` :

* [**GUIDE UTILISATION CODE**](docs/USAGE_GUIDE.md) : Comment utiliser les constantes, gérer les images et développer.
* [**FONCTIONNALITES FIREBASE**](docs/FIREBASE_FEATURES.md) : Documentation sur Analytics, Performance et Push Notifications.
* [**MISE A JOUR DONNEES**](docs/MISE_A_JOUR_DONNEES.md) : Procédures pour mettre à jour le contenu du site.

## 🤝 Contribution

1. Assurez-vous de bien comprendre l'architecture (voir `USAGE_GUIDE.md`).
2. Priorisez l'utilisation des **constantes locales** pour les assets statiques.
3. Testez vos changements avec `npm run build` avant de pousser.

---

**© 2026 Perfect Models Management.** Tous droits réservés.
