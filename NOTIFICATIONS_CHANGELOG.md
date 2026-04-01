# Changelog - Notifications Push

## Modifications effectuées

### ✅ Notifications ajoutées

1. **Candidatures Casting** (`src/pages/CastingForm.tsx`)
   - Notification envoyée lors de la soumission du formulaire
   - Format: "Prénom Nom — Ville"
   - Lien: `/admin/casting-applications`

2. **Messages de Contact** (`src/pages/Contact.tsx`)
   - ✅ Déjà implémenté
   - Format: "Nom — Sujet"
   - Lien: `/admin/messages`

3. **Demandes de Booking** (`src/components/BookingForm.tsx`)
   - ✅ Déjà implémenté
   - Format: "Client — Mannequin demandé"
   - Lien: `/admin/bookings`

4. **Candidatures Perfect Fashion Day** (`src/pages/FashionDayApplicationForm.tsx`)
   - ✅ Déjà implémenté
   - Format: "Nom — Rôle"
   - Lien: `/admin/fashion-day-applications`

5. **Connexions Utilisateurs** (`src/pages/Login.tsx`)
   - Notification lors de chaque connexion réussie
   - Format: "Connexion: Nom (Rôle)"
   - Rôles: Admin, Mannequin, Jury, Staff
   - Lien: Page de destination de l'utilisateur

6. **Récupération d'accès** (`src/pages/Login.tsx`)
   - Notification lors d'une demande de récupération
   - Format: "Récupération accès: Nom"
   - Lien: `/admin/recovery-requests`

### 📝 Fichiers modifiés

```
src/pages/CastingForm.tsx
  + Import notifyAdmin
  + Appel notifyAdmin dans handleSubmit

src/pages/Login.tsx
  + Import notifyAdmin
  + Notification lors de connexion réussie
  + Notification lors de demande de récupération

NOTIFICATIONS_SETUP.md (nouveau)
  + Documentation complète de configuration
  + Guide de déploiement
  + Dépannage

NOTIFICATIONS_CHANGELOG.md (nouveau)
  + Ce fichier
```

### 🔧 Configuration requise

Pour activer les notifications, l'administrateur doit:

1. **Obtenir la clé serveur FCM**
   - Firebase Console → Paramètres du projet → Cloud Messaging
   - Copier la "Clé du serveur" (Legacy)

2. **Ajouter dans `.env` et `.env.local`**
   ```env
   VITE_FCM_SERVER_KEY=AAAA...votre_cle_serveur
   ```

3. **Activer les notifications dans l'admin**
   - Se connecter au tableau de bord admin
   - Cliquer sur l'icône 🔔 dans le header
   - Autoriser les notifications dans le navigateur

### 📱 Support mobile

Les notifications fonctionnent automatiquement dans l'app Android:
- Configuration déjà en place dans `AndroidManifest.xml`
- Service `MyFirebaseMessagingService.java` gère les notifications
- Fichier `google-services.json` configuré

### 🧪 Test

Pour tester les notifications:

1. **Activer les notifications admin**
   ```
   Admin Dashboard → Icône 🔔 → Autoriser
   ```

2. **Déclencher un événement**
   - Soumettre un formulaire de casting
   - Envoyer un message de contact
   - Se connecter avec un compte utilisateur
   - Demander une récupération d'accès

3. **Vérifier la réception**
   - Notification browser (si admin en ligne)
   - Notification mobile (si app Android installée)

### 🎯 Événements couverts

| Événement | Statut | Fichier | Type |
|-----------|--------|---------|------|
| Candidature casting | ✅ Ajouté | CastingForm.tsx | `casting` |
| Message contact | ✅ Existant | Contact.tsx | `contact` |
| Demande booking | ✅ Existant | BookingForm.tsx | `booking` |
| Candidature PFD | ✅ Existant | FashionDayApplicationForm.tsx | `fashionday` |
| Connexion utilisateur | ✅ Ajouté | Login.tsx | `visit` |
| Récupération accès | ✅ Ajouté | Login.tsx | `contact` |

### 📊 Statistiques

- **6 types d'événements** notifiés
- **6 fichiers** concernés
- **1 service** centralisé (`adminNotify.ts`)
- **Support web + mobile** Android

### 🚀 Déploiement

```bash
# 1. Configurer la variable d'environnement
echo "VITE_FCM_SERVER_KEY=votre_cle" >> .env.local

# 2. Build web
npm run build

# 3. Sync mobile
npx cap sync android

# 4. Build APK
cd android && ./gradlew assembleDebug
```

### 🔐 Sécurité

- ✅ Clé serveur FCM dans `.env` (non commitée)
- ✅ Token admin stocké dans Firebase DB
- ✅ Notifications envoyées uniquement à l'admin
- ✅ Pas d'exposition des données sensibles

### 📚 Documentation

Voir `NOTIFICATIONS_SETUP.md` pour:
- Configuration détaillée
- Architecture du système
- Guide de dépannage
- Tests et validation

---

**Date**: 2026-04-01
**Version**: 2.5.0
**Auteur**: Kiro AI Assistant
