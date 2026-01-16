# Sécurité des Logs en Production

## ⚠️ IMPORTANT : Protection des Données Sensibles

Ce projet utilise un système de logging sécurisé pour éviter l'exposition de données sensibles en production.

## 🛡️ Utilitaire de Logging Sécurisé

Utilisez **toujours** le logger sécurisé au lieu de `console.log` direct :

```typescript
import logger from '@/utils/logger';

// ✅ BON - Utilise le logger sécurisé
logger.log('User logged in');
logger.error('Error occurred', error);
logger.dev('Debug info'); // Seulement en développement

// ❌ MAUVAIS - N'utilisez PAS console.log directement
console.log('User data:', userData); // Peut exposer des données sensibles
```

## 📋 Fonctions Disponibles

### `logger.log(...args)`
- Logs uniquement en mode développement
- Sanitise automatiquement les données sensibles

### `logger.error(...args)`
- Logs en développement ET production
- Sanitise les données sensibles en production
- Affiche les détails complets en développement

### `logger.warn(...args)`
- Logs uniquement en mode développement

### `logger.dev(...args)`
- Logs uniquement en mode développement
- Préfixe avec `[DEV]` pour identification facile

### `logger.logError(context, error)`
- Logs les erreurs avec contexte
- Affiche le message d'erreur uniquement en production
- Affiche les détails complets en développement

## 🔒 Données Automatiquement Protégées

Le logger détecte et masque automatiquement :
- Mots de passe (`password`, `pwd`)
- Clés API (`api_key`, `apiKey`, `api-key`)
- Tokens (`token`, `auth_token`)
- Secrets (`secret`, `client_secret`)
- Credentials (`credential`, `auth`)

Exemple :
```typescript
const user = {
  name: 'John',
  email: 'john@example.com',
  password: 'secret123',
  apiKey: 'sk_live_abc123'
};

logger.log(user);
// En production affiche :
// { name: 'John', email: 'john@example.com', password: '[REDACTED]', apiKey: '[REDACTED]' }
```

## 🚀 Migration du Code Existant

Pour migrer du code existant :

1. Importez le logger :
```typescript
import logger from '@/utils/logger';
```

2. Remplacez les console.log :
```typescript
// Avant
console.log('Data loaded', data);
console.error('Error:', error);

// Après
logger.log('Data loaded', data);
logger.error('Error:', error);
```

## 🔍 Détection en Production

En production (`import.meta.env.PROD === true`) :
- `logger.log()` ne produit AUCUN output
- `logger.error()` affiche uniquement les messages sanitisés
- `logger.warn()` ne produit AUCUN output
- `logger.dev()` ne produit AUCUN output

## ⚡ Bonnes Pratiques

1. **Ne jamais logger de données utilisateur complètes**
```typescript
// ❌ MAUVAIS
logger.log('User:', user);

// ✅ BON
logger.log('User logged in:', user.id);
```

2. **Utiliser des contextes clairs pour les erreurs**
```typescript
// ✅ BON
logger.logError('UserAuth', error);
logger.logError('PaymentProcessing', error);
```

3. **Éviter de logger des objets de requête/réponse complets**
```typescript
// ❌ MAUVAIS
logger.log('API Response:', response);

// ✅ BON
logger.log('API Response status:', response.status);
```

4. **Utiliser logger.dev() pour le debugging temporaire**
```typescript
logger.dev('Temporary debug info:', someVariable);
// Sera automatiquement silencieux en production
```

## 📝 Checklist avant Déploiement

- [ ] Tous les `console.log` ont été remplacés par `logger.log`
- [ ] Tous les `console.error` ont été remplacés par `logger.error`
- [ ] Aucune clé API n'est loggée
- [ ] Aucun mot de passe n'est loggé
- [ ] Les données utilisateur sensibles ne sont pas loggées
- [ ] Les tokens d'authentification ne sont pas loggés

## 🔧 Configuration

Le logger détecte automatiquement l'environnement via `import.meta.env.DEV`.

Pour tester le comportement en production localement :
```bash
npm run build
npm run preview
```

## 📚 Ressources

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [GDPR Compliance](https://gdpr.eu/)
