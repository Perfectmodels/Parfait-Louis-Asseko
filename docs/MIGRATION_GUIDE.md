# Guide de Migration Firebase vers Neon Database

## 🚀 Vue d'ensemble

Ce guide vous accompagne dans la migration de vos données Firebase vers Neon Database (PostgreSQL).

## 📋 Prérequis

- Node.js 18+ installé
- Compte Neon Database configuré
- Accès aux données Firebase
- Variables d'environnement configurées

## 🔧 Configuration

### 1. Installation des dépendances

```bash
cd scripts
npm install
```

### 2. Configuration des variables d'environnement

```bash
npm run setup
```

Cela vous guidera à travers la configuration de :
- Firebase (API Key, Auth Domain, etc.)
- Neon Database (URL de connexion)
- ImgBB (API Key)
- Google Analytics (Tracking ID)

### 3. Test des connexions

```bash
npm run test
```

## 🚀 Migration

### Migration spécifique Perfect Models

```bash
npm run migrate
```

Cette commande migre :
- ✅ Mannequins professionnels
- ✅ Étudiants débutants  
- ✅ Posts et articles
- ✅ Analytics et métriques

### Migration complète

```bash
npm run migrate-all
```

Cette commande migre toutes les données Firebase disponibles.

## 📊 Structure de la base de données

### Tables créées

```sql
-- Utilisateurs (mannequins, étudiants, admin)
users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- Posts et articles
posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- Analytics et métriques
analytics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL,
    metric_value INTEGER NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## 🔍 Vérification

### Vérifier les données migrées

```sql
-- Compter les utilisateurs
SELECT COUNT(*) as total_users FROM users;

-- Compter les posts
SELECT COUNT(*) as total_posts FROM posts;

-- Voir les analytics
SELECT * FROM analytics ORDER BY recorded_at DESC;
```

### Vérifier la structure

```sql
-- Lister les tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Voir les colonnes d'une table
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
```

## 🛠️ Dépannage

### Erreurs courantes

1. **Erreur de connexion Neon**
   - Vérifiez l'URL de connexion
   - Vérifiez les permissions

2. **Erreur de connexion Firebase**
   - Vérifiez les clés API
   - Vérifiez les règles de sécurité

3. **Erreur de migration**
   - Vérifiez les logs détaillés
   - Vérifiez la structure des données

### Logs détaillés

Les scripts affichent des logs détaillés :
- ✅ Succès
- ⚠️ Avertissements
- ❌ Erreurs

## 📈 Optimisations

### Index pour les performances

```sql
-- Index sur les colonnes fréquemment utilisées
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

### Nettoyage des données

```sql
-- Supprimer les doublons
DELETE FROM users WHERE id NOT IN (
    SELECT MIN(id) FROM users GROUP BY username
);

-- Nettoyer les posts orphelins
DELETE FROM posts WHERE author_id NOT IN (SELECT id FROM users);
```

## 🔄 Rollback

En cas de problème, vous pouvez :

1. **Sauvegarder avant migration**
   ```sql
   CREATE TABLE users_backup AS SELECT * FROM users;
   CREATE TABLE posts_backup AS SELECT * FROM posts;
   ```

2. **Restaurer après migration**
   ```sql
   DROP TABLE users;
   DROP TABLE posts;
   ALTER TABLE users_backup RENAME TO users;
   ALTER TABLE posts_backup RENAME TO posts;
   ```

## 📞 Support

Pour toute question ou problème :

1. Vérifiez les logs d'erreur
2. Consultez la documentation Neon
3. Vérifiez la configuration Firebase

## 🎯 Prochaines étapes

Après la migration :

1. ✅ Tester l'application avec Neon Database
2. ✅ Configurer les backups automatiques
3. ✅ Optimiser les requêtes
4. ✅ Surveiller les performances

---

**Note** : Cette migration est irréversible. Assurez-vous de tester en environnement de développement avant de migrer en production.
