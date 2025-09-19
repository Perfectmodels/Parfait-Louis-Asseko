# Guide d'Upload de Photos - Perfect Models

## 🎯 Fonctionnalités Ajoutées

### 1. **Upload de Photos pour les Mannequins**
- **URL** : `/model-photo-upload`
- **Accès** : Depuis le tableau de bord mannequin → "Mes Photos"
- **Fonctionnalités** :
  - Upload drag & drop de photos
  - Validation automatique (types, taille)
  - Galerie de photos existantes
  - Suppression de photos
  - Interface responsive

### 2. **Gestion des Photos côté Admin**
- **URL** : `/admin/photo-upload`
- **Accès** : Panel Admin → "Gestion des Photos"
- **Fonctionnalités** :
  - Sélection de mannequin avec recherche
  - Upload en masse pour un mannequin
  - Visualisation de toutes les photos
  - Gestion centralisée

### 3. **Accès Direction Artistique**
- **URL** : `/artistic-direction`
- **Utilisateurs** :
  - **AJ Caramela** (DA Adjointe) : Briefings + Gestion mannequins
  - **Fave GLOA** (DA Principale) : Tout + Analytics + Gestion équipe

## 🔧 Configuration Technique

### Service ImgBB
Le système utilise votre clé API ImgBB existante : `59f0176178bae04b1f2cbd7f5bc03614`

### Types de fichiers supportés
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Limites
- **Taille maximale** : 32MB par image
- **Nombre de photos** : 20 pour les mannequins, 50 pour l'admin
- **Organisation** : Photos stockées dans le dossier `perfect_models/models/`

## 📱 Utilisation

### Pour les Mannequins
1. Se connecter au tableau de bord
2. Cliquer sur "Mes Photos" dans le menu
3. Glisser-déposer les photos ou cliquer pour sélectionner
4. Les photos sont automatiquement uploadées et ajoutées au profil

### Pour les Administrateurs
1. Aller dans le panel admin
2. Cliquer sur "Gestion des Photos"
3. Sélectionner un mannequin dans la liste
4. Uploader les photos pour ce mannequin
5. Gérer la galerie de photos

### Pour les Directrices Artistiques
1. Accéder à `/artistic-direction`
2. Utiliser les outils selon les permissions :
   - **AJ Caramela** : Briefings, photos, mannequins
   - **Fave GLOA** : Tout + analytics + équipe

## 🎨 Interface Utilisateur

### Composant PhotoUpload
- **Drag & Drop** : Glisser-déposer les fichiers
- **Validation** : Messages d'erreur clairs
- **Progrès** : Barre de progression pour chaque upload
- **Galerie** : Affichage des photos existantes avec options de suppression

### Responsive Design
- **Mobile** : Interface adaptée aux écrans tactiles
- **Tablet** : Grille optimisée pour les tablettes
- **Desktop** : Interface complète avec toutes les fonctionnalités

## 🔒 Sécurité et Permissions

### Permissions par Rôle
- **Mannequins** : Upload de leurs propres photos
- **Admin** : Gestion de toutes les photos
- **DA Adjointe** : Briefings + photos + mannequins
- **DA Principale** : Accès complet + analytics

### Validation des Fichiers
- Vérification du type MIME
- Contrôle de la taille
- Validation des extensions
- Messages d'erreur explicites

## 🚀 Intégration

### Routes Ajoutées
```typescript
// Mannequins
<Route path="/model-photo-upload" element={<ModelPhotoUpload />} />

// Admin
<Route path="/admin/photo-upload" element={<AdminPhotoUpload />} />

// Direction Artistique
<Route path="/artistic-direction" element={<ArtisticDirectionAccess />} />
```

### Services
- `imgbbService.ts` : Service d'upload ImgBB
- `imgbb.ts` : Configuration et validation
- `PhotoUpload.tsx` : Composant réutilisable

## 📊 Monitoring

### Logs d'Upload
- Succès/échecs d'upload
- Taille des fichiers uploadés
- Types de fichiers
- Erreurs de validation

### Métriques
- Nombre de photos par mannequin
- Taille totale des uploads
- Types de fichiers les plus utilisés

## 🛠️ Maintenance

### Nettoyage
- Les photos supprimées sont retirées de la base de données locale
- Les URLs ImgBB restent actives (pas de suppression côté serveur)

### Sauvegarde
- Les URLs des photos sont stockées dans le contexte de données
- Synchronisation automatique avec la base de données locale

## 📞 Support

En cas de problème :
1. Vérifier la connexion internet
2. Vérifier la taille des fichiers (max 32MB)
3. Vérifier le type de fichier (JPEG, PNG, GIF, WebP)
4. Contacter l'administrateur si le problème persiste

---

**Note** : Toutes les fonctionnalités sont maintenant opérationnelles et intégrées dans le système existant ! 🎉
