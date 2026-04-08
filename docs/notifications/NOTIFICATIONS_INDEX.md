# 📱 Index - Documentation Notifications Push

## 🚀 Par où commencer?

### Nouveau sur le système?
👉 **[QUICK_START_NOTIFICATIONS.md](QUICK_START_NOTIFICATIONS.md)**
- Configuration en 3 étapes
- Test rapide
- Déploiement mobile

### Besoin de la clé FCM?
👉 **[GET_FCM_KEY.md](GET_FCM_KEY.md)**
- Guide pas à pas avec captures
- Comment activer l'API héritée
- Vérification de la configuration

### Configuration complète?
👉 **[NOTIFICATIONS_SETUP.md](NOTIFICATIONS_SETUP.md)**
- Architecture détaillée
- Configuration avancée
- Dépannage complet
- Tests et validation

### Vue d'ensemble du système?
👉 **[NOTIFICATIONS_README.md](NOTIFICATIONS_README.md)**
- Fonctionnalités complètes
- Structure du projet
- Architecture technique
- Monitoring et sécurité

### Historique des modifications?
👉 **[NOTIFICATIONS_CHANGELOG.md](NOTIFICATIONS_CHANGELOG.md)**
- Fichiers modifiés
- Événements couverts
- Statistiques
- Déploiement

## 📋 Checklist rapide

- [ ] Obtenir la clé serveur FCM
- [ ] Ajouter `VITE_FCM_SERVER_KEY` dans `.env.local`
- [ ] Redémarrer le serveur de dev
- [ ] Se connecter au tableau de bord admin
- [ ] Activer les notifications (icône 🔔)
- [ ] Tester avec `window.testNotifications.check()`
- [ ] Tester une notification avec `window.testNotifications.test('casting')`

## 🎯 Événements notifiés

| Événement | Fichier source | Documentation |
|-----------|----------------|---------------|
| Candidature casting | `src/pages/CastingForm.tsx` | NOTIFICATIONS_CHANGELOG.md |
| Message contact | `src/pages/Contact.tsx` | NOTIFICATIONS_SETUP.md |
| Demande booking | `src/components/BookingForm.tsx` | NOTIFICATIONS_README.md |
| Candidature PFD | `src/pages/FashionDayApplicationForm.tsx` | QUICK_START_NOTIFICATIONS.md |
| Connexion utilisateur | `src/pages/Login.tsx` | NOTIFICATIONS_CHANGELOG.md |
| Récupération accès | `src/pages/Login.tsx` | NOTIFICATIONS_SETUP.md |

## 🛠️ Utilitaires

### Tests en développement
```javascript
// Console navigateur (admin)
window.testNotifications.check()    // Vérifier config
window.testNotifications.debug()    // Infos détaillées
window.testNotifications.test(type) // Tester un type
window.testNotifications.testAll()  // Tester tous
```

### Fichier source
`src/utils/testNotifications.ts`

## 📞 Besoin d'aide?

1. **Configuration**: GET_FCM_KEY.md
2. **Problème technique**: NOTIFICATIONS_SETUP.md (section Dépannage)
3. **Architecture**: NOTIFICATIONS_README.md
4. **Modifications**: NOTIFICATIONS_CHANGELOG.md

---

**Dernière mise à jour**: 2026-04-01  
**Version**: 2.5.0
