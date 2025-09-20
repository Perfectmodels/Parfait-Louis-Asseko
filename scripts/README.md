# Scripts de Migration Perfect Models

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement de la migration guidée
npm start
```

## 📋 Scripts disponibles

### Configuration
- `npm run setup` - Configuration des variables d'environnement
- `npm run test` - Test des connexions Firebase et Neon

### Migration
- `npm run migrate` - Migration spécifique Perfect Models
- `npm run migrate-all` - Migration complète Firebase

## 🔧 Configuration requise

### Variables d'environnement

Créez un fichier `.env` avec :

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Neon Database
DATABASE_URL=postgresql://user:password@host/database
VITE_DATABASE_URL=postgresql://user:password@host/database

# ImgBB
VITE_IMGBB_API_KEY=your_imgbb_key

# Google Analytics
VITE_GA_TRACKING_ID=your_ga_id
```

## 📊 Données migrées

### Mannequins
- ✅ Profils des mannequins professionnels
- ✅ Informations personnelles
- ✅ Statuts et permissions

### Étudiants
- ✅ Étudiants débutants
- ✅ Matricules et informations
- ✅ Progression et notes

### Contenu
- ✅ Posts et articles
- ✅ Métadonnées et statuts
- ✅ Relations auteurs

### Analytics
- ✅ Métriques utilisateurs
- ✅ Statistiques de contenu
- ✅ Données de performance

## 🛠️ Dépannage

### Erreurs courantes

1. **Erreur de connexion Neon**
   ```
   ❌ Erreur de connexion Neon Database: connection refused
   ```
   - Vérifiez l'URL de connexion
   - Vérifiez les permissions

2. **Erreur de connexion Firebase**
   ```
   ❌ Erreur de connexion Firebase: permission denied
   ```
   - Vérifiez les clés API
   - Vérifiez les règles de sécurité

3. **Erreur de migration**
   ```
   ❌ Erreur lors de la migration: duplicate key
   ```
   - Vérifiez les doublons
   - Nettoyez les données

### Logs détaillés

Les scripts affichent des logs détaillés :
- ✅ Succès
- ⚠️ Avertissements  
- ❌ Erreurs

## 📈 Optimisations

### Index de performance

```sql
-- Index sur les colonnes fréquemment utilisées
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
```

### Nettoyage des données

```sql
-- Supprimer les doublons
DELETE FROM users WHERE id NOT IN (
    SELECT MIN(id) FROM users GROUP BY username
);
```

## 🔄 Rollback

En cas de problème :

1. **Sauvegarder avant migration**
   ```sql
   CREATE TABLE users_backup AS SELECT * FROM users;
   ```

2. **Restaurer après migration**
   ```sql
   DROP TABLE users;
   ALTER TABLE users_backup RENAME TO users;
   ```

## 📞 Support

Pour toute question :
1. Vérifiez les logs d'erreur
2. Consultez la documentation
3. Vérifiez la configuration

## 🎯 Prochaines étapes

Après la migration :
1. ✅ Tester l'application
2. ✅ Configurer les backups
3. ✅ Optimiser les requêtes
4. ✅ Surveiller les performances
