# Migration vers Neon PostgreSQL

Ce projet a été configuré pour migrer de Firebase vers Neon (PostgreSQL).

## 1. Configuration

Les variables d'environnement pour Neon ont été ajoutées dans `.env.example`.
Copiez ce fichier vers `.env` et assurez-vous que `DATABASE_URL` est correct.

## 2. Infrastructure

- **api/db.ts**: Gestion de la connexion PostgreSQL.
- **api/data.ts**: Endpoint API (Serverless Function) pour lire/écrire les données.
- **scripts/schema.sql**: Définition des tables SQL correspondant aux types TypeScript.

## 3. Migration des Données

Pour initialiser la base de données avec les données par défaut (`src/constants/data.ts`) :

1.  Assurez-vous que les dépendances sont installées : `npm install`
2.  Exécutez le script de seeding (nécessite `tsx` ou `ts-node`) :

```bash
# Exemple avec npx tsx (si installé) ou en compilant le script
npm install -g tsx
npx tsx scripts/seed_neon.ts
```

Ce script va :
1.  Créer les tables (Schema).
2.  Insérer les données de `src/constants/data.ts` (Modèles, Articles, Config, etc.).

## 4. Utilisation dans l'App

Un hook `src/hooks/useNeon.tsx` a été créé comme alternative à `useFirestore.tsx`.
Pour basculer l'application sur Neon :

1.  Ouvrez `src/contexts/DataContext.tsx`.
2.  Remplacez l'import :
    ```typescript
    // import { useFirestore as useDataStore } from '../hooks/useFirestore';
    import { useNeon as useDataStore } from '../hooks/useNeon';
    ```

**Note :** L'API `api/data.ts` fournie est une implémentation de base. En production, ajoutez de l'authentification et une validation stricte des données.
