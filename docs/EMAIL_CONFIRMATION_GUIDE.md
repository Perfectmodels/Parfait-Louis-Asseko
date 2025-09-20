# Guide du Système d'Emails Automatiques

## 📧 Vue d'ensemble

Le système d'emails automatiques de Perfect Models Management envoie des confirmations personnalisées à chaque utilisateur après soumission d'un formulaire sur le site.

## 🎯 Formulaires couverts

### 1. **Formulaire de Contact** (`/contact`)
- **Déclencheur** : Soumission du formulaire de contact
- **Email envoyé** : Confirmation de réception du message
- **Contenu** : Détails du message, informations de contact, prochaines étapes

### 2. **Demande de Réservation** (`/contact?type=booking`)
- **Déclencheur** : Soumission d'une demande de réservation
- **Email envoyé** : Confirmation de demande de réservation
- **Contenu** : Détails de la réservation, contact commercial, délais de réponse

### 3. **Candidature Perfect Fashion Day** (`/fashion-day-application`)
- **Déclencheur** : Soumission d'une candidature Fashion Day
- **Email envoyé** : Confirmation de candidature
- **Contenu** : Détails de la candidature, processus de sélection, contact casting

### 4. **Candidature de Casting** (`/casting`)
- **Déclencheur** : Soumission d'une candidature de casting
- **Email envoyé** : Confirmation de candidature de casting
- **Contenu** : Détails de la candidature, processus de sélection, contact casting

### 5. **Soumission de Paiement** (Dashboard mannequin)
- **Déclencheur** : Soumission d'un justificatif de paiement
- **Email envoyé** : Confirmation de soumission de paiement
- **Contenu** : Détails du paiement, contact comptable, délais de traitement

## 🔧 Configuration technique

### Service d'emails : `src/services/emailConfirmationService.ts`
```typescript
// Configuration
const emailConfirmationService = new EmailConfirmationService(
  import.meta.env.VITE_BREVO_API_KEY
);

// Utilisation
await emailConfirmationService.sendContactConfirmation({
  recipientEmail: 'user@example.com',
  recipientName: 'John Doe',
  formType: 'contact',
  submissionData: contactMessage,
  submissionId: 'contact-123'
});
```

### Variables d'environnement requises
```env
VITE_BREVO_API_KEY=your_brevo_api_key
```

## 📋 Templates d'emails

### Structure des templates
- **Design** : Thème Perfect Models (couleurs or/noir)
- **Responsive** : Compatible mobile et desktop
- **Branding** : Logo et identité visuelle cohérente
- **Contenu** : Informations personnalisées selon le formulaire

### Éléments communs
- Header avec logo PMM
- Message de confirmation personnalisé
- Détails de la soumission
- Informations de contact
- Footer avec liens et coordonnées

## 🚀 Intégration dans les formulaires

### Exemple d'intégration
```typescript
// Dans le handleSubmit du formulaire
try {
  // Sauvegarder les données
  await saveData({ ...data, newSubmission });
  
  // Envoyer notification admin (existant)
  await sendAdminNotification(submission);
  
  // Envoyer confirmation utilisateur (nouveau)
  await emailConfirmationService.sendFormConfirmation({
    recipientEmail: formData.email,
    recipientName: formData.name,
    formType: 'contact',
    submissionData: submission,
    submissionId: submission.id
  });
  
  setStatus('success');
} catch (error) {
  console.warn('Erreur lors de l\'envoi de la confirmation:', error);
}
```

## 📊 Monitoring et logs

### Logs de confirmation
- Succès : Email envoyé avec succès
- Erreurs : Logs d'erreur détaillés
- Warnings : Problèmes non bloquants

### Gestion des erreurs
- Les erreurs d'email n'interrompent pas le processus principal
- Logs détaillés pour le debugging
- Fallback gracieux en cas d'échec

## 🔒 Sécurité et confidentialité

### Protection des données
- Emails chiffrés en transit
- Pas de stockage des contenus d'emails
- Respect du RGPD

### Validation des données
- Vérification des adresses email
- Sanitisation du contenu
- Protection contre l'injection

## 📈 Optimisations futures

### Améliorations possibles
1. **Templates personnalisables** : Interface admin pour modifier les templates
2. **Statistiques d'envoi** : Dashboard de monitoring des emails
3. **Templates multilingues** : Support français/anglais
4. **Scheduling** : Envoi différé d'emails
5. **A/B Testing** : Tests de différents templates

### Intégrations avancées
- **Webhooks** : Notifications en temps réel
- **Analytics** : Suivi des taux d'ouverture
- **Segmentation** : Emails ciblés par profil utilisateur

## 🛠️ Maintenance

### Vérifications régulières
- Test des templates d'emails
- Vérification des clés API
- Monitoring des taux de délivrabilité

### Mises à jour
- Mise à jour des templates selon les besoins
- Ajout de nouveaux formulaires
- Optimisation des performances

## 📞 Support

Pour toute question concernant le système d'emails :
- **Email technique** : dev@perfectmodels.ga
- **Documentation** : Voir ce guide
- **Logs** : Console du navigateur et logs serveur
