# Mise à jour des données depuis Firebase

**Date de mise à jour**: 24 janvier 2026, 11:27

## 📊 Résumé des mises à jour

Les données ont été synchronisées avec succès depuis le fichier Firebase `perfect-156b5-default-rtdb-export.json`.

### Fichiers créés/mis à jour :

1. **`src/constants/articlesData.ts`**
   - ✅ 11 articles synchronisés
   - Contient tous les articles du blog avec images, contenu, tags, etc.
   - Articles vedettes marqués avec `isFeatured: true`

2. **`src/constants/agencyData.ts`**
   - ✅ Informations de l'agence (about, values)
   - ✅ 4 catégories de réalisations (Défilés, Clips, Collaborations, Direction artistique)
   - ✅ 6 événements de la timeline (2021-2025)
   - ✅ 27 partenaires
   - ✅ 19 services proposés (Mannequinat, Mode & Stylisme, Événementiel)

3. **`src/constants/contactData.ts`**
   - ✅ Informations de contact (adresse, email, téléphone)

4. **`src/constants/courseData.ts`**
   - ✅ 5 modules de formation complets
   - Chaque module contient des chapitres détaillés et des quiz

## 📁 Structure des données

### Articles
Chaque article contient :
- Titre, auteur, catégorie, date
- Contenu structuré (paragraphes, images, citations, titres)
- Image principale et images dans le contenu
- Tags pour le référencement
- Statistiques (vues, likes, dislikes)
- Slug pour l'URL

### Services de l'agence
Les services sont organisés en 3 catégories :
1. **Services Mannequinat** (8 services)
2. **Services Mode et Stylisme** (7 services)
3. **Services Événementiels** (4 services)

### Partenaires
27 partenaires incluant :
- La Gare du Nord
- BADU Creations
- Fédération Gabonaise de Mode
- Et bien d'autres...

## 🔧 Script de mise à jour

Le script `src/scripts/updateFromFirebase.mjs` permet de :
- Lire automatiquement le fichier JSON Firebase
- Extraire et formater les données
- Générer les fichiers TypeScript correspondants
- Afficher un résumé des mises à jour

### Utilisation :
```bash
node src/scripts/updateFromFirebase.mjs
```

## ✅ Prochaines étapes

1. Vérifier que les imports dans les composants React pointent vers les nouveaux fichiers
2. Tester l'affichage des articles, services et partenaires
3. Vérifier que toutes les images sont accessibles
4. Mettre à jour le fichier `.gitignore` si nécessaire pour exclure les clés API

## 🔐 Note de sécurité

⚠️ **Important** : Les clés API sont présentes dans le fichier JSON Firebase. Assurez-vous de :
- Ne pas commiter les fichiers contenant des clés sensibles
- Utiliser des variables d'environnement (`.env`) pour les clés API
- Ajouter les fichiers sensibles au `.gitignore`
