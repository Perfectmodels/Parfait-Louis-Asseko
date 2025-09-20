# Guide Neon Database - Perfect Models

## 🚀 Configuration Neon Database

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Neon Database Configuration
VITE_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 2. Initialisation de la base de données

Exécutez le script SQL d'initialisation :

```sql
-- Voir database/init.sql pour le script complet
-- Ce script crée les tables : users, posts, analytics, user_sessions, activity_logs
```

### 3. Structure des tables

#### Table `users`
- `id` : Identifiant unique
- `username` : Nom d'utilisateur unique
- `email` : Email unique
- `name` : Nom complet
- `role` : Rôle (admin, staff, user)
- `is_active` : Statut actif
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

#### Table `posts`
- `id` : Identifiant unique
- `title` : Titre du post
- `content` : Contenu du post
- `author_id` : ID de l'auteur
- `status` : Statut (draft, published, archived)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

## 🔧 Utilisation dans le code

### Service Neon Database

```typescript
import { neonDatabase } from '../services/neonDatabase';

// Récupérer tous les posts
const posts = await neonDatabase.getPosts();

// Créer un nouveau post
const newPost = await neonDatabase.createPost({
    title: 'Mon titre',
    content: 'Mon contenu',
    status: 'published'
});

// Mettre à jour un post
await neonDatabase.updatePost(1, {
    title: 'Nouveau titre',
    status: 'published'
});

// Supprimer un post
await neonDatabase.deletePost(1);
```

### Composant de test

Le composant `NeonDatabaseTest` est intégré au panel admin pour :
- Tester la connexion à la base de données
- Afficher les statistiques en temps réel
- Vérifier la configuration

## 📊 Analytics en temps réel

Le service fournit des analytics automatiques :
- Nombre total d'utilisateurs
- Nombre total de posts
- Utilisateurs actifs
- Dernière activité

## 🛡️ Sécurité

### Configuration sécurisée
- Validation des variables d'environnement
- Gestion des erreurs de connexion
- Timeout des requêtes
- Validation des données

### Gestion des erreurs
```typescript
try {
    const result = await neonDatabase.getPosts();
} catch (error) {
    console.error('Erreur:', error.message);
    // Gestion de l'erreur
}
```

## 🚀 Déploiement

### Variables d'environnement en production

1. **Vercel** : Ajoutez `VITE_DATABASE_URL` dans les variables d'environnement
2. **Netlify** : Configurez les variables d'environnement
3. **Autres plateformes** : Configurez selon la documentation

### Script d'initialisation

Exécutez le script `database/init.sql` sur votre base de données Neon pour créer les tables nécessaires.

## 📈 Monitoring

### Logs d'activité
- Toutes les actions sont loggées dans `activity_logs`
- Suivi des connexions utilisateurs
- Analytics des performances

### Métriques disponibles
- Temps de réponse des requêtes
- Nombre de connexions actives
- Statistiques d'utilisation

## 🔄 Migration

### Mise à jour des données
```typescript
// Exemple de migration
const migrateData = async () => {
    // Logique de migration
    await neonDatabase.updatePost(1, { status: 'published' });
};
```

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de connexion**
   - Vérifiez `VITE_DATABASE_URL`
   - Vérifiez les credentials Neon
   - Vérifiez la connectivité réseau

2. **Erreur de requête**
   - Vérifiez la syntaxe SQL
   - Vérifiez les permissions
   - Vérifiez les types de données

3. **Performance lente**
   - Vérifiez les index
   - Optimisez les requêtes
   - Vérifiez la taille de la base

### Logs de débogage

```typescript
// Activer les logs détaillés
console.log('Connexion Neon:', await neonDatabase.testConnection());
console.log('Analytics:', await neonDatabase.getAnalytics());
```

## 📚 Ressources

- [Documentation Neon](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless)

## 🎯 Prochaines étapes

1. Configurer les variables d'environnement
2. Exécuter le script d'initialisation
3. Tester la connexion via le panel admin
4. Commencer à utiliser les fonctionnalités
