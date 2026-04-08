# Connexion Jury Miss 5ème - Guide

## 🎯 Nouvelle Fonctionnalité

Les jurés du concours Miss 5ème peuvent maintenant se connecter directement depuis la page de login principale du site.

---

## 📍 Accès

**URL** : `votre-site.com/login`

---

## 🔐 Processus de Connexion

### Étape 1 : Accéder à la page de login
- Aller sur `votre-site.com/login`
- Vous verrez deux options de connexion

### Étape 2 : Sélectionner le mode Jury
- Cliquer sur le bouton **"Jury Miss 5ème"** (bouton rose)
- L'interface change pour afficher les options de jury

### Étape 3 : Choisir votre numéro de juré
- Sélectionner votre numéro : **Juré 1**, **2**, **3** ou **4**
- Le bouton sélectionné devient rose

### Étape 4 : Entrer le code PIN
- Entrer le code PIN : **0000**
- Le champ est centré avec espacement pour faciliter la saisie

### Étape 5 : Se connecter
- Cliquer sur **"Connexion"**
- Vous êtes redirigé vers l'interface de notation

---

## 🎨 Interface de Login

### Mode Standard (par défaut)
```
┌─────────────────────────────────────┐
│  [Connexion Standard] [Jury Miss 5ème] │
│                                     │
│  👤 Identifiant ou Nom              │
│  🔒 Mot de passe                    │
│                                     │
│  [Connexion]                        │
│                                     │
│  Coordonnées oubliées ?             │
└─────────────────────────────────────┘
```

### Mode Jury Miss 5ème
```
┌─────────────────────────────────────┐
│  [Connexion Standard] [Jury Miss 5ème] │
│                                     │
│  Sélectionnez votre numéro de juré  │
│  [Juré 1] [Juré 2] [Juré 3] [Juré 4]│
│                                     │
│  🔒 Code PIN (0000)                 │
│                                     │
│  [Connexion]                        │
└─────────────────────────────────────┘
```

---

## ✨ Avantages

### Pour les Jurés
✅ **Accès simplifié** : Un seul point d'entrée pour tous les utilisateurs
✅ **Interface claire** : Distinction visuelle entre les modes de connexion
✅ **Pas de lien à retenir** : Utiliser la page de login habituelle
✅ **Session persistante** : Reste connecté même après fermeture du navigateur

### Pour l'Administration
✅ **Gestion centralisée** : Tous les accès depuis une seule page
✅ **Traçabilité** : Notifications admin lors des connexions jury
✅ **Simplicité** : Plus besoin de partager un lien spécifique

---

## 🔄 Flux Complet

```
1. Juré accède à /login
   ↓
2. Clique sur "Jury Miss 5ème"
   ↓
3. Sélectionne son numéro (1-4)
   ↓
4. Entre le PIN 0000
   ↓
5. Clique sur "Connexion"
   ↓
6. Redirigé vers /jury/miss-5eme
   ↓
7. Interface de notation s'affiche
   ↓
8. Commence à noter les candidates
```

---

## 🎯 Détails Techniques

### Session Storage
Lors de la connexion jury, les informations suivantes sont stockées :
```javascript
sessionStorage.setItem('classroom_access', 'granted');
sessionStorage.setItem('classroom_role', 'miss5eme_jury');
sessionStorage.setItem('juryNumber', '1'); // 1, 2, 3 ou 4
sessionStorage.setItem('userName', 'Juré 1');
```

### Reconnexion Automatique
- Si un juré ferme le navigateur et revient sur `/jury/miss-5eme`
- Le système vérifie la session
- Reconnecte automatiquement le juré avec son numéro

### Déconnexion
- Bouton "Déconnexion" dans l'interface de notation
- Efface la session
- Redirige vers `/login`

---

## 🎨 Design

### Couleurs
- **Mode Standard** : Or (#D4AF37) - Couleur principale du site
- **Mode Jury** : Rose (#EC4899) - Couleur distinctive pour Miss 5ème

### Responsive
- ✅ Desktop : Affichage complet
- ✅ Tablette : Adapté
- ✅ Mobile : Optimisé pour petits écrans

---

## 📱 Compatibilité

✅ Chrome / Edge
✅ Firefox
✅ Safari
✅ Mobile (iOS / Android)

---

## 🔐 Sécurité

### Validation
- ✅ PIN vérifié (doit être 0000)
- ✅ Numéro de juré obligatoire
- ✅ Session sécurisée
- ✅ Notification admin à chaque connexion

### Limitations
- Maximum 4 jurés (numéros 1-4)
- Un seul PIN pour tous (0000)
- Chaque juré a un numéro unique

---

## 💡 Conseils d'Utilisation

### Pour les Jurés
1. **Choisissez toujours le même numéro** : Cela permet de suivre vos notes
2. **Ne partagez pas votre numéro** : Chaque juré doit avoir son propre numéro
3. **Restez connecté** : Pas besoin de se reconnecter à chaque passage

### Pour l'Admin
1. **Informez les jurés** : Expliquez qu'ils doivent aller sur /login
2. **Attribuez les numéros** : Assignez un numéro (1-4) à chaque juré avant le concours
3. **Surveillez les connexions** : Vous recevez une notification à chaque connexion jury

---

## 🆘 Dépannage

**Q: Le bouton "Jury Miss 5ème" n'apparaît pas**
R: Vérifiez que vous êtes bien sur la page /login

**Q: Le PIN ne fonctionne pas**
R: Assurez-vous d'entrer exactement "0000" (quatre zéros)

**Q: Je ne peux pas sélectionner de numéro de juré**
R: Cliquez d'abord sur le bouton "Jury Miss 5ème" en haut

**Q: Je suis déconnecté automatiquement**
R: La session est maintenue. Si vous êtes déconnecté, reconnectez-vous avec le même numéro

---

## 📞 Support

Pour toute question, contactez l'administrateur du système.

---

## 🎉 Résumé

La connexion jury Miss 5ème est maintenant intégrée à la page de login principale, offrant :
- ✅ Accès simplifié
- ✅ Interface intuitive
- ✅ Session persistante
- ✅ Gestion centralisée

Les jurés peuvent se connecter en 3 clics : Mode Jury → Numéro → PIN → Connexion !
