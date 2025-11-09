# Guide d'Installation

## Prérequis

- Node.js (version 16 ou supérieure)
- npm (version 8 ou supérieure) ou Yarn
- Git
- Compte Supabase (pour la base de données)

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/perfect-models-management.git
   cd perfect-models-management
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configuration de l'environnement**
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
   VITE_API_URL=http://localhost:3000/api
   NODE_ENV=development
   ```

4. **Lancer l'application en mode développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   L'application sera disponible à l'adresse : http://localhost:3000

## Configuration de la base de données

1. **Créer une base de données Supabase**
   - Allez sur https://app.supabase.com
   - Créez un nouveau projet
   - Récupérez l'URL et la clé anonyme dans les paramètres du projet

2. **Exécuter les migrations**
   ```bash
   npx supabase migration up
   ```

3. **Remplir la base de données avec des données de test (optionnel)**
   ```bash
   npm run seed
   # ou
   yarn seed
   ```

## Démarrage rapide

1. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Ouvrir dans le navigateur**
   - Accédez à http://localhost:3000

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile l'application pour la production |
| `npm run preview` | Prévoyez l'application en production localement |
| `npm run test` | Exécute les tests |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |

## Configuration recommandée pour VSCode

1. **Extensions recommandées**
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

2. **Paramètres recommandés**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "eslint.validate": ["javascript", "typescript", "vue"]
   }
   ```

## Dépannage

### Problèmes courants

1. **Erreurs de dépendances**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Problèmes de connexion à Supabase**
   - Vérifiez que les variables d'environnement sont correctement définies
   - Vérifiez votre connexion Internet
   - Vérifiez que votre projet Supabase est actif

### Obtenir de l'aide

Si vous rencontrez des problèmes, n'hésitez pas à :
1. Vérifier les [issues GitHub](https://github.com/votre-utilisateur/perfect-models-management/issues)
2. Créer une nouvelle issue si le problème n'a pas déjà été signalé
3. Nous contacter à contact@perfectmodels.ga
