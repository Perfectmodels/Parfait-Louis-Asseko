# Structure de la Base de Données - Perfect Models Management

## 📊 Vue d'ensemble

Cette documentation décrit la structure complète de la base de données pour le système de gestion de Perfect Models Management, incluant tous les modules : talents, contenu, formation, et finances.

---

## 🎭 Module Talents

### Table: `models`
Mannequins professionnels de l'agence

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| name | STRING | Nom complet | REQUIRED |
| email | STRING | Email | REQUIRED, UNIQUE |
| phone | STRING | Téléphone | |
| username | STRING | Nom d'utilisateur | UNIQUE |
| password | STRING | Mot de passe (hashé) | |
| age | NUMBER | Âge | |
| birthDate | DATE | Date de naissance | |
| height | NUMBER | Taille (cm) | |
| weight | NUMBER | Poids (kg) | |
| bust | NUMBER | Tour de poitrine (cm) | |
| waist | NUMBER | Tour de taille (cm) | |
| hips | NUMBER | Tour de hanches (cm) | |
| shoeSize | NUMBER | Pointure | |
| category | STRING | Catégorie (Fashion/Commercial/Editorial) | |
| isPublic | BOOLEAN | Profil public | DEFAULT: true |
| photos | ARRAY[STRING] | URLs des photos | |
| portfolio | ARRAY[STRING] | URLs du portfolio | |
| experience | TEXT | Expérience professionnelle | |
| createdAt | TIMESTAMP | Date de création | AUTO |
| updatedAt | TIMESTAMP | Dernière mise à jour | AUTO |

### Table: `beginner_students`
Mannequins débutants en formation

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| name | STRING | Nom complet | REQUIRED |
| email | STRING | Email | REQUIRED, UNIQUE |
| username | STRING | Nom d'utilisateur | UNIQUE |
| password | STRING | Mot de passe (hashé) | |
| phone | STRING | Téléphone | |
| age | NUMBER | Âge | |
| city | STRING | Ville | |
| status | STRING | Statut (Active/Inactive/Promoted) | DEFAULT: 'Active' |
| registrationDate | DATE | Date d'inscription | AUTO |
| promotionDate | DATE | Date de promotion (si promu) | |
| completedModules | ARRAY[STRING] | IDs des modules complétés | |
| progress | NUMBER | Pourcentage de progression (0-100) | DEFAULT: 0 |

### Table: `casting_applications`
Candidatures pour les castings

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| firstName | STRING | Prénom | REQUIRED |
| lastName | STRING | Nom | REQUIRED |
| email | STRING | Email | REQUIRED |
| phone | STRING | Téléphone | REQUIRED |
| birthDate | DATE | Date de naissance | REQUIRED |
| age | NUMBER | Âge | REQUIRED |
| city | STRING | Ville | REQUIRED |
| height | NUMBER | Taille (cm) | REQUIRED |
| weight | NUMBER | Poids (kg) | REQUIRED |
| bust | NUMBER | Tour de poitrine (cm) | |
| waist | NUMBER | Tour de taille (cm) | |
| hips | NUMBER | Tour de hanches (cm) | |
| shoeSize | NUMBER | Pointure | |
| experience | TEXT | Expérience | |
| motivation | TEXT | Motivation | |
| photos | ARRAY[STRING] | URLs des photos | |
| status | STRING | Statut (Nouveau/Présélectionné/Accepté/Refusé) | DEFAULT: 'Nouveau' |
| submissionDate | TIMESTAMP | Date de soumission | AUTO |
| notes | TEXT | Notes du jury | |

### Table: `artistic_projects`
Projets de direction artistique

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| title | STRING | Titre du projet | REQUIRED |
| description | TEXT | Description | REQUIRED |
| image | STRING | URL de l'image | |
| date | DATE | Date du projet | REQUIRED |
| category | STRING | Catégorie | REQUIRED |
| assignedModels | ARRAY[STRING] | IDs des mannequins assignés | |
| status | STRING | Statut (Planifié/En cours/Terminé) | DEFAULT: 'Planifié' |
| createdAt | TIMESTAMP | Date de création | AUTO |

---

## 📰 Module Contenu

### Table: `articles`
Articles du magazine

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| slug | STRING | Slug pour URL | REQUIRED, UNIQUE |
| title | STRING | Titre | REQUIRED |
| excerpt | TEXT | Extrait | REQUIRED |
| content | TEXT | Contenu complet (HTML/Markdown) | REQUIRED |
| author | STRING | Auteur | REQUIRED |
| category | STRING | Catégorie | REQUIRED |
| tags | ARRAY[STRING] | Tags | |
| coverImage | STRING | URL de l'image de couverture | REQUIRED |
| images | ARRAY[STRING] | URLs des images supplémentaires | |
| publishedAt | TIMESTAMP | Date de publication | REQUIRED |
| updatedAt | TIMESTAMP | Dernière mise à jour | AUTO |
| status | STRING | Statut (Brouillon/Publié/Archivé) | DEFAULT: 'Brouillon' |
| views | NUMBER | Nombre de vues | DEFAULT: 0 |
| likes | NUMBER | Nombre de likes | DEFAULT: 0 |
| featured | BOOLEAN | Article en vedette | DEFAULT: false |
| seoTitle | STRING | Titre SEO | |
| seoDescription | TEXT | Description SEO | |
| seoKeywords | ARRAY[STRING] | Mots-clés SEO | |

### Table: `comments`
Commentaires sur les articles

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| articleId | STRING | ID de l'article | FOREIGN KEY -> articles.id |
| author | STRING | Nom de l'auteur | REQUIRED |
| email | STRING | Email de l'auteur | REQUIRED |
| content | TEXT | Contenu du commentaire | REQUIRED |
| approved | BOOLEAN | Approuvé | DEFAULT: false |
| createdAt | TIMESTAMP | Date de création | AUTO |

### Table: `news_items`
Actualités de la page d'accueil

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| title | STRING | Titre | REQUIRED |
| description | TEXT | Description | REQUIRED |
| image | STRING | URL de l'image | |
| link | STRING | Lien externe | |
| date | DATE | Date de l'actualité | REQUIRED |
| status | STRING | Statut (Active/Inactive) | DEFAULT: 'Active' |
| createdAt | TIMESTAMP | Date de création | AUTO |

### Table: `fashion_day_events`
Événements Perfect Fashion Day

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| edition | STRING | Édition (ex: "PFD 2024") | REQUIRED |
| title | STRING | Titre | REQUIRED |
| description | TEXT | Description | REQUIRED |
| date | DATE | Date de l'événement | REQUIRED |
| location | STRING | Lieu | REQUIRED |
| poster | STRING | URL de l'affiche | |
| registrationOpen | BOOLEAN | Inscriptions ouvertes | DEFAULT: false |
| maxParticipants | NUMBER | Nombre max de participants | |
| currentParticipants | NUMBER | Participants actuels | DEFAULT: 0 |
| status | STRING | Statut (À venir/En cours/Terminé) | DEFAULT: 'À venir' |

### Table: `fashion_day_applications`
Candidatures pour le Fashion Day

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| eventId | STRING | ID de l'événement | FOREIGN KEY -> fashion_day_events.id |
| name | STRING | Nom complet | REQUIRED |
| email | STRING | Email | REQUIRED |
| phone | STRING | Téléphone | REQUIRED |
| role | STRING | Rôle (Mannequin/Staff/Bénévole) | REQUIRED |
| motivation | TEXT | Lettre de motivation | |
| status | STRING | Statut (Nouveau/Accepté/Refusé) | DEFAULT: 'Nouveau' |
| submittedAt | TIMESTAMP | Date de soumission | AUTO |

---

## 🎓 Module Formation (Classroom)

### Table: `course_modules`
Modules de formation professionnelle

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| slug | STRING | Slug pour URL | REQUIRED, UNIQUE |
| title | STRING | Titre du module | REQUIRED |
| description | TEXT | Description | |
| order | NUMBER | Ordre d'affichage | REQUIRED |
| duration | STRING | Durée estimée | |
| level | STRING | Niveau (Débutant/Intermédiaire/Avancé) | |
| icon | STRING | Icône/emoji | |
| isPublished | BOOLEAN | Publié | DEFAULT: false |

### Table: `course_chapters`
Chapitres des modules

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| moduleId | STRING | ID du module parent | FOREIGN KEY -> course_modules.id |
| slug | STRING | Slug pour URL | REQUIRED |
| title | STRING | Titre du chapitre | REQUIRED |
| content | TEXT | Contenu (HTML/Markdown) | REQUIRED |
| videoUrl | STRING | URL de la vidéo | |
| order | NUMBER | Ordre dans le module | REQUIRED |
| duration | STRING | Durée estimée | |
| resources | ARRAY[OBJECT] | Ressources téléchargeables | |
| quiz | ARRAY[OBJECT] | Questions du quiz | |

### Table: `classroom_progress`
Progression des étudiants

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| userId | STRING | ID de l'utilisateur | FOREIGN KEY -> models.id |
| moduleId | STRING | ID du module | FOREIGN KEY -> course_modules.id |
| chapterId | STRING | ID du chapitre | FOREIGN KEY -> course_chapters.id |
| completed | BOOLEAN | Complété | DEFAULT: false |
| score | NUMBER | Score du quiz (%) | |
| completedAt | TIMESTAMP | Date de complétion | |
| timeSpent | NUMBER | Temps passé (minutes) | |

---

## 💰 Module Finances

### Table: `monthly_payments`
Paiements mensuels des mannequins

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| modelId | STRING | ID du mannequin | FOREIGN KEY -> models.id |
| modelName | STRING | Nom du mannequin | REQUIRED |
| amount | NUMBER | Montant (XAF) | REQUIRED |
| date | DATE | Date du paiement | REQUIRED |
| month | STRING | Mois concerné | REQUIRED |
| year | NUMBER | Année | REQUIRED |
| status | STRING | Statut (En attente/Approuvé/Rejeté) | DEFAULT: 'En attente' |
| paymentMethod | STRING | Méthode (Espèces/Virement/Mobile Money) | |
| reference | STRING | Référence du paiement | |
| notes | TEXT | Notes | |
| submittedAt | TIMESTAMP | Date de soumission | AUTO |
| approvedAt | TIMESTAMP | Date d'approbation | |
| approvedBy | STRING | Approuvé par | |

### Table: `invoices`
Factures clients

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| invoiceNumber | STRING | Numéro de facture | REQUIRED, UNIQUE |
| clientName | STRING | Nom du client | REQUIRED |
| clientEmail | STRING | Email du client | |
| clientPhone | STRING | Téléphone du client | |
| clientAddress | TEXT | Adresse du client | |
| amount | NUMBER | Montant total (XAF) | REQUIRED |
| taxAmount | NUMBER | Montant TVA (XAF) | DEFAULT: 0 |
| date | DATE | Date d'émission | REQUIRED |
| dueDate | DATE | Date d'échéance | REQUIRED |
| status | STRING | Statut (Impayée/Payée/En retard/Annulée) | DEFAULT: 'Impayée' |
| paidAt | TIMESTAMP | Date de paiement | |
| items | ARRAY[OBJECT] | Lignes de facturation | REQUIRED |
| notes | TEXT | Notes | |
| createdAt | TIMESTAMP | Date de création | AUTO |

**Structure des items (lignes de facturation):**
```json
{
  "description": "Description du service",
  "quantity": 1,
  "unitPrice": 50000,
  "total": 50000
}
```

### Table: `expenses`
Dépenses de l'agence

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| category | STRING | Catégorie | REQUIRED |
| description | TEXT | Description | REQUIRED |
| amount | NUMBER | Montant (XAF) | REQUIRED |
| date | DATE | Date de la dépense | REQUIRED |
| paymentMethod | STRING | Méthode (Espèces/Carte/Virement/Mobile Money) | REQUIRED |
| status | STRING | Statut (Payée/En attente/Remboursée) | DEFAULT: 'Payée' |
| receipt | STRING | URL du reçu/facture | |
| supplier | STRING | Fournisseur | |
| notes | TEXT | Notes | |
| createdAt | TIMESTAMP | Date de création | AUTO |
| createdBy | STRING | Créé par | |

**Catégories de dépenses:**
- Loyer et Charges
- Salaires
- Transport
- Matériel
- Marketing
- Formation
- Événements
- Maintenance
- Fournitures
- Services Professionnels
- Assurances
- Taxes
- Autres

---

## 📞 Module Communication

### Table: `contact_messages`
Messages du formulaire de contact

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| name | STRING | Nom | REQUIRED |
| email | STRING | Email | REQUIRED |
| phone | STRING | Téléphone | |
| subject | STRING | Sujet | REQUIRED |
| message | TEXT | Message | REQUIRED |
| status | STRING | Statut (Nouveau/Lu/Archivé/Répondu) | DEFAULT: 'Nouveau' |
| createdAt | TIMESTAMP | Date de réception | AUTO |
| readAt | TIMESTAMP | Date de lecture | |
| respondedAt | TIMESTAMP | Date de réponse | |
| response | TEXT | Réponse | |

### Table: `booking_requests`
Demandes de réservation

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| name | STRING | Nom du client | REQUIRED |
| email | STRING | Email | REQUIRED |
| phone | STRING | Téléphone | REQUIRED |
| service | STRING | Service demandé | REQUIRED |
| preferredDate | DATE | Date souhaitée | REQUIRED |
| message | TEXT | Message/Détails | |
| status | STRING | Statut (Nouveau/Confirmé/Annulé/Terminé) | DEFAULT: 'Nouveau' |
| submittedAt | TIMESTAMP | Date de soumission | AUTO |
| confirmedAt | TIMESTAMP | Date de confirmation | |

### Table: `absence_requests`
Demandes d'absence des mannequins

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| modelId | STRING | ID du mannequin | FOREIGN KEY -> models.id |
| modelName | STRING | Nom du mannequin | REQUIRED |
| email | STRING | Email | REQUIRED |
| absenceDate | DATE | Date d'absence | REQUIRED |
| reason | STRING | Raison | REQUIRED |
| description | TEXT | Description détaillée | |
| status | STRING | Statut (En attente/Approuvé/Refusé) | DEFAULT: 'En attente' |
| submittedAt | TIMESTAMP | Date de soumission | AUTO |
| processedAt | TIMESTAMP | Date de traitement | |
| processedBy | STRING | Traité par | |

### Table: `recovery_requests`
Demandes de récupération de compte

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| email | STRING | Email | REQUIRED |
| accountType | STRING | Type de compte | REQUIRED |
| message | TEXT | Message | |
| status | STRING | Statut (Nouveau/Traité) | DEFAULT: 'Nouveau' |
| requestedAt | TIMESTAMP | Date de demande | AUTO |
| processedAt | TIMESTAMP | Date de traitement | |

---

## ⚙️ Module Configuration

### Table: `settings`
Paramètres du site

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| siteName | STRING | Nom du site | |
| siteDescription | TEXT | Description | |
| contactEmail | STRING | Email de contact | |
| contactPhone | STRING | Téléphone de contact | |
| address | TEXT | Adresse physique | |
| facebook | STRING | URL Facebook | |
| instagram | STRING | URL Instagram | |
| twitter | STRING | URL Twitter | |
| linkedin | STRING | URL LinkedIn | |
| youtube | STRING | URL YouTube | |
| apiKey | STRING | Clé API (cryptée) | |
| analyticsId | STRING | ID Google Analytics | |
| maintenanceMode | BOOLEAN | Mode maintenance | DEFAULT: false |
| updatedAt | TIMESTAMP | Dernière mise à jour | AUTO |

### Table: `agency_info`
Informations sur l'agence

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | STRING | Identifiant unique | PRIMARY KEY |
| mission | TEXT | Mission | |
| vision | TEXT | Vision | |
| values | ARRAY[STRING] | Valeurs | |
| history | TEXT | Historique | |
| timeline | ARRAY[OBJECT] | Chronologie | |
| partners | ARRAY[OBJECT] | Partenaires | |
| services | ARRAY[OBJECT] | Services offerts | |
| siteImages | OBJECT | Images du site (logo, hero, etc.) | |
| updatedAt | TIMESTAMP | Dernière mise à jour | AUTO |

---

## 📊 Relations et Index

### Relations Principales

1. **models** ↔ **monthly_payments**: Un mannequin a plusieurs paiements
2. **models** ↔ **absence_requests**: Un mannequin a plusieurs demandes d'absence
3. **models** ↔ **classroom_progress**: Un mannequin a plusieurs progressions
4. **articles** ↔ **comments**: Un article a plusieurs commentaires
5. **course_modules** ↔ **course_chapters**: Un module a plusieurs chapitres
6. **fashion_day_events** ↔ **fashion_day_applications**: Un événement a plusieurs candidatures

### Index Recommandés

Pour optimiser les performances, créez des index sur:

- `models.email`, `models.username`
- `articles.slug`, `articles.publishedAt`, `articles.category`
- `casting_applications.status`, `casting_applications.submissionDate`
- `monthly_payments.modelId`, `monthly_payments.date`, `monthly_payments.status`
- `invoices.invoiceNumber`, `invoices.status`, `invoices.date`
- `expenses.category`, `expenses.date`
- `contact_messages.status`, `contact_messages.createdAt`
- `course_modules.slug`, `course_chapters.moduleId`

---

## 🔐 Sécurité

### Champs Sensibles à Crypter
- `models.password`
- `beginner_students.password`
- `settings.apiKey`
- Toutes les informations de paiement

### Règles d'Accès
- **Admin**: Accès complet à toutes les tables
- **Models**: Accès en lecture/écriture limité à leurs propres données
- **Beginner Students**: Accès en lecture/écriture limité à leurs propres données et au contenu de formation
- **Jury**: Accès en lecture/écriture aux candidatures de casting uniquement
- **Registration Staff**: Accès en lecture/écriture aux candidatures de casting uniquement
- **Public**: Accès en lecture seule aux articles, mannequins publics, et événements

---

## 📝 Notes d'Implémentation

### Firebase Realtime Database
Pour Firebase, organisez la structure ainsi:
```
/
├── models/
├── beginnerStudents/
├── articles/
├── comments/
├── monthlyPayments/
├── invoices/
├── expenses/
├── castingApplications/
├── fashionDayEvents/
├── fashionDayApplications/
├── courseModules/
├── courseChapters/
├── classroomProgress/
├── contactMessages/
├── bookingRequests/
├── absenceRequests/
├── recoveryRequests/
├── newsItems/
├── artisticProjects/
├── settings/
└── agencyInfo/
```

### Données Initiales Recommandées
- Au moins 3 catégories de services
- Un module de formation de base
- Paramètres par défaut du site
- Informations de base de l'agence

---

**Version**: 1.0  
**Dernière mise à jour**: 2025  
**Auteur**: Perfect Models Management - Système de Gestion Complet

