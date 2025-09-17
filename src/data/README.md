# Gestion Centralisée des Accès Mannequins

## 📁 Fichier : `modelAccess.ts`

Ce fichier centralise tous les accès mannequins (professionnels et débutants) en un seul endroit pour simplifier la gestion et la connexion.

## 🔑 Structure des Accès

### Interface `ModelAccess`
```typescript
interface ModelAccess {
  id: string;           // ID unique du mannequin
  name: string;         // Nom complet
  type: 'pro' | 'beginner'; // Type de mannequin
  username: string;     // Identifiant de connexion (nom, matricule, ou username)
  password: string;     // Mot de passe
  matricule?: string;   // Matricule (pour les débutants)
  email?: string;       // Email
  phone?: string;       // Téléphone
  city?: string;        // Ville
  instagram?: string;   // Instagram
}
```

## 🚀 Utilisation

### Connexion Simplifiée
```typescript
import { findModelAccess } from '../data/modelAccess';

// Recherche un accès par identifiant et mot de passe
const modelAccess = findModelAccess(username, password);

if (modelAccess) {
  // Connexion réussie
  console.log(`Connexion de ${modelAccess.name} (${modelAccess.type})`);
}
```

### Obtenir les Accès par Type
```typescript
import { getAccessByType } from '../data/modelAccess';

const proModels = getAccessByType('pro');
const beginnerModels = getAccessByType('beginner');
```

## 📝 Identifiants de Connexion

### Mannequins Professionnels
- **Identifiant** : Username (ex: `Man-PMMN01`) ou nom complet (ex: `noemi kim`)
- **Mot de passe** : Mot de passe défini

### Mannequins Débutants
- **Identifiant** : Nom complet (ex: `alicia dubois`) ou matricule (ex: `DEB-2025-001`)
- **Mot de passe** : Mot de passe défini

## 🔧 Ajout d'un Nouveau Mannequin

1. **Mannequin Pro** : Ajouter dans `proModelAccess[]`
2. **Mannequin Débutant** : Ajouter dans `beginnerModelAccess[]`

### Exemple d'ajout :
```typescript
{
  id: 'nouveau-mannequin',
  name: 'Nouveau Mannequin',
  type: 'beginner',
  username: 'nouveau mannequin',
  password: 'motdepasse2025',
  matricule: 'DEB-2025-005',
  email: 'nouveau@email.com',
  phone: '+241 05 67 89 01',
  city: 'Libreville',
  instagram: '@nouveau_mannequin'
}
```

## ✅ Avantages

- ✅ **Centralisation** : Tous les accès en un seul fichier
- ✅ **Simplicité** : Logique de connexion unifiée
- ✅ **Maintenance** : Facile d'ajouter/modifier des accès
- ✅ **Sécurité** : Contrôle centralisé des identifiants
- ✅ **Debugging** : Plus facile de diagnostiquer les problèmes de connexion

## 🐛 Résolution des Problèmes

### Problème : "Identifiant ou mot de passe incorrect"
1. Vérifier que l'identifiant existe dans `modelAccess.ts`
2. Vérifier que le mot de passe correspond
3. Vérifier la casse (majuscules/minuscules)
4. Vérifier les espaces dans l'identifiant

### Problème : "Accès refusé au panel"
1. Vérifier que l'ID du mannequin correspond dans les données
2. Vérifier que le type de mannequin est correct
3. Vérifier que la session est bien créée
