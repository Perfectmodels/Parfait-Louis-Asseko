# Guide de Contrôle des Votes - Miss One Light 2026

## 📋 Vue d'ensemble

Un système complet de contrôle des votes a été ajouté à l'application Miss One Light. Il permet de :
- ✅ Activer/désactiver les votes manuellement
- ⏰ Configurer une date limite pour une désactivation automatique
- 🔒 Bloquer automatiquement les votes une fois le compte à rebours terminé

## 🎯 Fonctionnalités

### 1. Activation/Désactivation Manuelle
- **Bouton toggle** dans l'onglet "Contrôle des votes" de l'admin
- Désactive immédiatement tous les boutons de vote sur la page publique
- Les utilisateurs voient "🔒 Votes fermés" à la place des boutons "Voter"

### 2. Date Limite Automatique
- Configurez une date et heure précises pour la fin des votes
- Le système vérifie automatiquement toutes les minutes
- Les votes se désactivent automatiquement à la date limite

### 3. Compte à Rebours Synchronisé
- Le compte à rebours sur la page publique utilise la même date limite
- Affiche "🎉 La finale a commencé !" quand le temps est écoulé
- Les boutons de vote disparaissent automatiquement

## 🚀 Comment utiliser

### Accéder au panneau de contrôle
1. Connectez-vous à l'admin : `/admin-miss-one-light`
2. Cliquez sur l'onglet **"Contrôle des votes"**

### Désactiver les votes immédiatement
1. Dans la section "Activation manuelle"
2. Cliquez sur le **toggle** pour désactiver
3. Cliquez sur **"Enregistrer la configuration"**
4. ✅ Les votes sont immédiatement fermés sur la page publique

### Configurer une date limite
1. Dans la section "Date limite des votes"
2. Sélectionnez la **date et l'heure** souhaitées
3. Cliquez sur **"Enregistrer la configuration"**
4. ⏰ Les votes se fermeront automatiquement à cette date

### Réactiver les votes
1. Activez le toggle dans "Activation manuelle"
2. Vérifiez que la date limite n'est pas dépassée
3. Cliquez sur **"Enregistrer la configuration"**
4. ✅ Les votes sont à nouveau ouverts

## 📊 Indicateurs de statut

### Dans l'admin
- **Carte de statut** : Affiche "Votes ACTIVÉS" (vert) ou "Votes DÉSACTIVÉS" (rouge)
- **Temps restant** : Affiche le nombre de jours et heures avant la date limite
- **Total votes validés** : Nombre total de votes crédités
- **Candidates actives** : Nombre de candidates en compétition

### Sur la page publique
- **Boutons "Voter"** : Visibles uniquement si les votes sont ouverts
- **"🔒 Votes fermés"** : Affiché quand les votes sont désactivés
- **Compte à rebours** : Affiche le temps restant jusqu'à la date limite

## 🔧 Configuration technique

### Base de données (Firebase Realtime Database)
```
missOneLight/
  ├── config/
  │   ├── votingEnabled: boolean
  │   ├── votingDeadline: string (ISO 8601)
  │   └── updatedAt: string (ISO 8601)
  ├── candidates/
  └── pendingVotes/
```

### Date limite par défaut
- **Date** : 17 avril 2026
- **Heure** : 20h00 (heure du Gabon, UTC+1)
- **Format** : `2026-04-17T20:00:00`

## ⚠️ Points importants

1. **Synchronisation automatique** : Les modifications sont appliquées en temps réel sur toutes les pages
2. **Vérification côté client** : Le système vérifie la date limite toutes les minutes
3. **Double protection** : Même si le toggle est activé, les votes se ferment automatiquement à la date limite
4. **Alertes utilisateur** : Les utilisateurs reçoivent un message clair si les votes sont fermés

## 🎨 Interface utilisateur

### Boutons de vote (ouverts)
- Fond jaune doré (#FCD116)
- Icône cœur rempli
- Texte "Voter"
- Effet hover et animation

### Boutons de vote (fermés)
- Fond rouge transparent
- Bordure rouge
- Texte "🔒 Votes fermés"
- Pas d'interaction possible

## 📝 Exemple de workflow

### Scénario : Fermeture des votes pour la finale

1. **Avant la finale** (ex: 16 avril 2026)
   - Les votes sont ouverts
   - Le compte à rebours affiche "1j 20h"
   - Les utilisateurs peuvent voter normalement

2. **Jour de la finale** (17 avril 2026 à 19h00)
   - Les votes sont toujours ouverts
   - Le compte à rebours affiche "1h 0m"
   - Dernière chance pour voter

3. **Début de la finale** (17 avril 2026 à 20h00)
   - ⏰ Les votes se ferment automatiquement
   - Le compte à rebours affiche "🎉 La finale a commencé !"
   - Tous les boutons "Voter" deviennent "🔒 Votes fermés"

4. **Après la finale**
   - Les votes restent fermés
   - Le classement final est figé
   - Les statistiques sont disponibles dans l'onglet "Comptabilité"

## 🆘 Dépannage

### Les votes ne se ferment pas automatiquement
- Vérifiez que la date limite est correctement configurée
- Assurez-vous que le format de date est valide (ISO 8601)
- Rechargez la page pour forcer la synchronisation

### Les boutons de vote sont toujours visibles
- Vérifiez le statut dans l'admin (onglet "Contrôle des votes")
- Videz le cache du navigateur
- Vérifiez la connexion à Firebase

### La date limite ne se met pas à jour
- Cliquez bien sur "Enregistrer la configuration"
- Vérifiez les permissions Firebase
- Consultez la console du navigateur pour les erreurs

## 📞 Support

Pour toute question ou problème :
- Consultez la console du navigateur (F12)
- Vérifiez les logs Firebase
- Contactez l'équipe technique

---

**Dernière mise à jour** : Avril 2026  
**Version** : 1.0.0  
**Auteur** : Perfect Models Management
