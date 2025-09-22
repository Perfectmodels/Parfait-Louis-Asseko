# Guide de Gestion des Emails - Perfect Models

## Vue d'ensemble

Ce guide décrit les nouvelles fonctionnalités de gestion des emails implémentées dans le système Perfect Models, incluant la reconfiguration de l'API Brevo et les options de suppression avancées.

## 🚀 Nouvelles Fonctionnalités

### 1. Configuration Brevo Améliorée

#### Configuration Mise à Jour
- **URL API** : Mise à jour vers `https://api.brevo.com/v3/smtp/email`
- **Gestion des erreurs** : Amélioration de la gestion des erreurs avec retry automatique
- **Support des pièces jointes** : Ajout du support pour les pièces jointes
- **Programmation d'envoi** : Possibilité de programmer des emails
- **Tags et tracking** : Support des tags et du tracking des emails

#### Nouveaux Types d'Emails
- `contact` : Messages de contact
- `booking` : Confirmations de réservation
- `payment` : Confirmations de paiement
- `news` : Notifications d'actualités
- `custom` : Emails personnalisés

### 2. Panneau d'Administration des Emails

#### Accès
- **URL** : `/admin/email-management`
- **Navigation** : Accessible depuis le dashboard admin

#### Fonctionnalités Principales

##### Statistiques en Temps Réel
- Total des emails envoyés
- Emails envoyés avec succès
- Emails en échec
- Taux de réussite
- Statistiques par type d'email

##### Gestion des Logs
- **Filtrage** : Par statut, type d'email, destinataire
- **Recherche** : Par sujet ou destinataire
- **Tri** : Par date, statut, type
- **Pagination** : Gestion des grandes listes

##### Options de Suppression
- **Suppression individuelle** : Supprimer un email spécifique
- **Suppression en lot** : Sélectionner plusieurs emails à supprimer
- **Suppression totale** : Supprimer tous les logs d'emails
- **Confirmation** : Demandes de confirmation pour toutes les suppressions

##### Composition d'Emails
- **Interface intuitive** : Formulaire de composition intégré
- **Support HTML** : Édition du contenu HTML
- **Destinataires multiples** : Support des emails multiples
- **Aperçu** : Prévisualisation avant envoi

### 3. Gestion des Modèles d'Emails

#### Accès
- **URL** : `/admin/email-templates`
- **Navigation** : Accessible depuis le dashboard admin

#### Fonctionnalités

##### Templates Prédéfinis
- **Contact** : Confirmation de message de contact
- **Réservation** : Confirmation de réservation
- **Paiement** : Confirmation de paiement
- **Actualités** : Notifications d'actualités

##### Gestion des Templates
- **Création** : Créer de nouveaux templates
- **Modification** : Éditer les templates existants
- **Duplication** : Dupliquer des templates
- **Suppression** : Supprimer des templates
- **Activation/Désactivation** : Gérer l'état des templates

##### Variables Dynamiques
- **Variables communes** : `{{name}}`, `{{email}}`, `{{date}}`, etc.
- **Variables spécifiques** : Variables par type d'email
- **Validation** : Validation automatique des variables
- **Aperçu** : Prévisualisation avec données d'exemple

### 4. Amélioration du Panneau des Messages

#### Nouvelles Options de Suppression
- **Sélection multiple** : Cases à cocher pour chaque message
- **Sélection globale** : Tout sélectionner/désélectionner
- **Suppression en lot** : Supprimer plusieurs messages à la fois
- **Suppression totale** : Supprimer tous les messages
- **Confirmation** : Demandes de confirmation avec compteurs

#### Interface Améliorée
- **Actions groupées** : Barre d'actions pour les opérations en lot
- **Feedback visuel** : Indicateurs de sélection
- **Gestion d'erreurs** : Messages d'erreur améliorés

## 🔧 Configuration Technique

### Variables d'Environnement

```bash
# Clé API Brevo
VITE_BREVO_API_KEY=xkeysib-your-api-key-here
```

### Structure des Données

#### EmailLog
```typescript
interface EmailLog {
    id: string;
    timestamp: string;
    to: string | string[];
    subject: string;
    status: 'sent' | 'failed' | 'pending' | 'scheduled';
    messageId?: string;
    error?: string;
    retryCount: number;
    emailType: EmailType;
}
```

#### EmailTemplate
```typescript
interface EmailTemplate {
    id: string;
    name: string;
    type: EmailType;
    subject: string;
    htmlContent: string;
    textContent: string;
    variables: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
```

### Services Disponibles

#### EmailService
- `sendEmail()` : Envoi d'emails avec retry
- `sendTemplatedEmail()` : Envoi avec templates
- `sendBulkEmails()` : Envoi en masse
- `getEmailLogs()` : Récupération des logs
- `deleteEmailLogs()` : Suppression des logs
- `getEmailStats()` : Statistiques

#### EmailTemplateService
- `getEmailTemplates()` : Récupération des templates
- `createEmailTemplate()` : Création de templates
- `updateEmailTemplate()` : Mise à jour de templates
- `deleteEmailTemplate()` : Suppression de templates
- `duplicateEmailTemplate()` : Duplication de templates
- `getAvailableVariables()` : Variables disponibles
- `validateEmailTemplate()` : Validation de templates

## 📊 Monitoring et Logs

### Types de Statuts
- **sent** : Email envoyé avec succès
- **failed** : Échec d'envoi
- **pending** : En attente de retry
- **scheduled** : Programmée pour envoi futur

### Gestion des Erreurs
- **Retry automatique** : 3 tentatives maximum
- **Délai progressif** : Augmentation du délai entre les tentatives
- **Logging détaillé** : Enregistrement des erreurs
- **Notifications** : Alertes pour les échecs critiques

### Limites et Performance
- **Rate limiting** : 100 emails/heure par défaut
- **Batch processing** : Traitement par lots de 50 emails
- **Stockage local** : Limite de 1000 logs maximum
- **Nettoyage automatique** : Suppression des anciens logs

## 🚨 Sécurité

### Bonnes Pratiques
- **Clés API** : Stockage sécurisé des clés API
- **Validation** : Validation des données d'entrée
- **Sanitisation** : Nettoyage du contenu HTML
- **Confirmation** : Confirmations pour les actions destructives

### Permissions
- **Accès admin** : Restriction aux administrateurs
- **Audit trail** : Traçabilité des actions
- **Logs sécurisés** : Stockage local des logs

## 📝 Utilisation

### Envoi d'un Email Simple
```typescript
import { sendEmail } from '../services/emailService';

const result = await sendEmail({
    to: 'user@example.com',
    subject: 'Test Email',
    content: 'Hello World!',
    htmlContent: '<h1>Hello World!</h1>'
}, 'custom');
```

### Envoi avec Template
```typescript
import { sendTemplatedEmail } from '../services/emailService';

const result = await sendTemplatedEmail('contact', {
    to: 'user@example.com',
    content: 'Your message has been received.'
});
```

### Gestion des Logs
```typescript
import { getEmailLogs, deleteEmailLogs } from '../services/emailService';

// Récupérer les logs
const logs = getEmailLogs({ status: 'failed', limit: 10 });

// Supprimer des logs spécifiques
deleteEmailLogs(['log_id_1', 'log_id_2']);
```

## 🔄 Migration et Mise à Jour

### Étapes de Migration
1. **Sauvegarde** : Sauvegarder les données existantes
2. **Configuration** : Mettre à jour la clé API Brevo
3. **Test** : Tester l'envoi d'emails
4. **Déploiement** : Déployer les nouvelles fonctionnalités

### Compatibilité
- **API Brevo** : Compatible avec la version actuelle
- **Données existantes** : Préservation des données existantes
- **Templates** : Migration automatique des templates par défaut

## 🆘 Dépannage

### Problèmes Courants

#### Erreur de Configuration
```
Configuration Brevo manquante
```
**Solution** : Vérifier la variable `VITE_BREVO_API_KEY`

#### Échec d'Envoi
```
Erreur Brevo: Invalid API key
```
**Solution** : Vérifier la validité de la clé API

#### Templates Non Chargés
```
Aucun template trouvé
```
**Solution** : Les templates par défaut se créent automatiquement

### Logs de Débogage
- **Console** : Logs détaillés dans la console
- **Local Storage** : Vérification des données stockées
- **Network** : Inspection des requêtes API

## 📞 Support

Pour toute question ou problème :
- **Documentation** : Consulter ce guide
- **Logs** : Vérifier les logs d'erreur
- **Test** : Utiliser le diagnostic email dans l'admin
- **Contact** : Contacter l'équipe technique

---

*Dernière mise à jour : Janvier 2024*
