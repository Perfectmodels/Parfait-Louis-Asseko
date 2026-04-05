# Système de Notation Miss 5ème

## Vue d'ensemble

Système complet de notation pour le concours Miss 5ème avec :
- 4 jurés identifiés (Juré 1, 2, 3, 4)
- Authentification par PIN unique (0000) pour tous
- Maximum 10 candidates
- 3 passages par candidate
- Notation sur 20 points par passage
- Fiches individuelles détaillées par candidate
- Classement automatique

## Critères de notation

Chaque critère est noté sur 4 points :

1. **Sourire** (0-4 points)
2. **Gestuelle** (0-4 points)
3. **Performance Technique** (0-4 points)
4. **Prestance et Élégance** (0-4 points)

**Total par passage** : 20 points maximum (4 critères × 5 points)

## Calcul des scores

### Score par passage
- Chaque juré note chaque candidate pour chaque passage
- Le score du passage = moyenne des notes de tous les jurés pour ce passage

### Score final
- Score final = moyenne des 3 passages
- Classement automatique par score final décroissant

## Accès

### Pour les jurés
**URL** : `/jury/miss-5eme`
- Sélectionner son numéro de juré (1, 2, 3 ou 4)
- Entrer le PIN : `0000`
- Connexion directe sans compte admin

### Pour l'administration
**URL** : `/admin/miss-5eme`
- Accès via le menu Admin > Recrutement > Miss 5ème
- Gestion des candidates
- Fiches individuelles détaillées
- Visualisation des résultats et classement
- Réinitialisation des notes

## Fonctionnalités Admin

### Gestion des candidates
- Ajouter une candidate (nom, numéro 1-10, photo optionnelle)
- Supprimer une candidate (supprime aussi toutes ses notes)
- Voir le nombre de notes reçues par candidate
- Lien de partage pour les jurés avec copie rapide

### Fiches individuelles
- Vue détaillée par candidate
- Tableau des notes par juré et par passage
- Affichage des 4 critères pour chaque notation
- Moyennes par passage
- Note finale calculée automatiquement
- Navigation facile entre les candidates

### Résultats et classement
- Tableau complet avec :
  - Rang (médailles pour top 3)
  - Numéro de candidate
  - Nom
  - Score passage 1, 2, 3
  - Note finale sur 20
- Tri automatique par score décroissant
- Médailles : 🥇 Or, 🥈 Argent, 🥉 Bronze

### Réinitialisation
- Bouton pour supprimer toutes les notes
- Supprime aussi les sessions des jurés
- Permet de recommencer le concours

## Fonctionnalités Jury

### Connexion
1. Sélectionner son numéro de juré (1, 2, 3 ou 4)
2. Entrer le PIN 0000
3. Connexion automatique (réutilise la session si déjà connecté)

### Notation
1. Sélectionner le passage (1, 2 ou 3)
2. Sélectionner une candidate
3. Noter chaque critère (0-4 points)
4. Vérifier le total (max 20)
5. Enregistrer la note

### Indicateurs visuels
- ✓ Vert : Candidate déjà notée pour ce passage
- Rose : Candidate sélectionnée
- Gris : Candidate non encore notée

### Sécurité
- Impossible de noter deux fois la même candidate pour le même passage
- Vérification du total (ne peut pas dépasser 20)
- Sauvegarde immédiate dans Firebase
- Chaque juré a son propre numéro identifiant

## Structure de données Firebase

### `miss5emeCandidates`
```json
{
  "candidateId": {
    "id": "candidateId",
    "name": "Nom de la candidate",
    "number": 1,
    "photoUrl": "https://..."
  }
}
```

### `miss5emeJury`
```json
{
  "juryId": {
    "id": "juryId",
    "name": "aj",
    "juryNumber": 1,
    "pin": "0000"
  }
}
```

### `miss5emeScores`
```json
{
  "scoreId": {
    "juryId": "juryId",
    "juryNumber": 1,
    "candidateId": "candidateId",
    "passage": 1,
    "sourire": 4,
    "gestuelle": 3,
    "performanceTechnique": 4,
    "prestanceElegance": 4,
    "totalPassage": 15,
    "timestamp": "2026-04-05T..."
  }
}
```

## Workflow typique

1. **Préparation** (Admin)
   - Ajouter les 10 candidates avec leurs numéros
   - Partager le lien avec les 4 jurés
   - Vérifier que tout est prêt

2. **Passage 1** (Jurés)
   - Les 4 jurés se connectent avec leur numéro et le PIN 0000
   - Chaque juré sélectionne "Passage 1"
   - Chaque juré note les 10 candidates

3. **Passage 2** (Jurés)
   - Les jurés sélectionnent "Passage 2"
   - Notation des 10 candidates

4. **Passage 3** (Jurés)
   - Les jurés sélectionnent "Passage 3"
   - Notation finale des 10 candidates

5. **Consultation** (Admin)
   - Consulter les fiches individuelles pour voir les notes croisées
   - Vérifier le classement en temps réel
   - Annoncer les résultats

## Fiches individuelles - Détails

Les fiches individuelles permettent de voir pour chaque candidate :
- Toutes les notes données par les 4 jurés
- Pour chaque passage (1, 2, 3)
- Avec le détail des 4 critères
- Les moyennes par passage
- La note finale

Exemple de fiche :
```
Candidate #5 - Marie Dupont
Note Finale: 16.75/20

Passage 1 (Moyenne: 17.00/20)
┌──────────┬─────────┬───────────┬──────────────┬───────────┬───────┐
│ Juré     │ Sourire │ Gestuelle │ Perf. Tech.  │ Prestance │ Total │
├──────────┼─────────┼───────────┼──────────────┼───────────┼───────┤
│ Juré 1   │    4    │     4     │      4       │     4     │  16   │
│ Juré 2   │    4    │     4     │      4       │     4     │  16   │
│ Juré 3   │    4    │     4     │      4       │     5     │  17   │
│ Juré 4   │    5    │     4     │      4       │     4     │  17   │
└──────────┴─────────┴───────────┴──────────────┴───────────┴───────┘
```

## Notes techniques

- Temps réel : Les scores sont synchronisés instantanément via Firebase Realtime Database
- Responsive : Interface adaptée mobile et desktop
- Validation : Contrôles pour éviter les erreurs de saisie
- Persistance : Toutes les données sont sauvegardées automatiquement
- Identification : Chaque juré a un numéro unique (1-4) pour traçabilité
- Notes croisées : Possibilité de comparer les notes entre jurés
