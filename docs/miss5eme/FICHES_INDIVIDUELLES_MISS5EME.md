# Fiches Individuelles Miss 5ème - Guide Détaillé

## 🎯 Vue d'Ensemble

Les fiches individuelles permettent de voir en détail toutes les notes données par les 4 jurés pour chaque candidate, avec le détail complet des 4 critères pour chaque passage.

---

## 📍 Accès

**Admin** : `/admin/miss-5eme` → Onglet "Fiches Individuelles"

---

## 🎨 Interface

### Vue Liste
Grille de toutes les candidates avec :
- Numéro de candidate
- Nom
- Note finale sur 20

### Vue Détaillée (Fiche Candidate)

#### En-tête
```
┌─────────────────────────────────────────────────┐
│ ← Retour à la liste                             │
│                                                  │
│ Candidate #5                    Note Finale     │
│ Marie Dupont                    16.75/20        │
└─────────────────────────────────────────────────┘
```

#### Passage 1, 2, 3 (pour chaque)
```
┌─────────────────────────────────────────────────┐
│ Passage 1                       Moyenne: 17.00/20│
│                                                  │
│ ┌──────────┬────────┬──────────┬─────────┬──────┬───────┐
│ │ Juré     │ 😊     │ 🤸       │ ⭐      │ 👗   │ Total │
│ │          │Sourire │Gestuelle │Perf.Tech│Prest.│  /20  │
│ ├──────────┼────────┼──────────┼─────────┼──────┼───────┤
│ │ Juré 1   │   4    │    4     │    4    │   4  │  16   │
│ │ Juré 2   │   4    │    4     │    4    │   4  │  16   │
│ │ Juré 3   │   4    │    4     │    4    │   5  │  17   │
│ │ Juré 4   │   5    │    4     │    4    │   4  │  17   │
│ ├──────────┼────────┼──────────┼─────────┼──────┼───────┤
│ │ MOYENNE  │  4.3   │   4.0    │   4.0   │  4.3 │ 16.50 │
│ └──────────┴────────┴──────────┴─────────┴──────┴───────┘
└─────────────────────────────────────────────────┘
```

#### Résumé Final
```
┌─────────────────────────────────────────────────┐
│ Résumé des Passages                             │
│                                                  │
│ ┌──────────┬──────────┬──────────┬─────────────┐│
│ │Passage 1 │Passage 2 │Passage 3 │Note Finale  ││
│ │  17.00   │  16.50   │  16.75   │   16.75     ││
│ └──────────┴──────────┴──────────┴─────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 🎨 Design Visuel

### Codes Couleurs par Critère

**Sourire** 😊
- Badge bleu : `bg-blue-100 text-blue-800`
- Représente la chaleur et l'accueil

**Gestuelle** 🤸
- Badge vert : `bg-green-100 text-green-800`
- Représente le mouvement et la fluidité

**Performance Technique** ⭐
- Badge violet : `bg-purple-100 text-purple-800`
- Représente l'excellence technique

**Prestance et Élégance** 👗
- Badge orange : `bg-orange-100 text-orange-800`
- Représente le style et la classe

**Total**
- Badge rose : `bg-pink-600 text-white`
- Note globale du passage

### Mise en Page

**Badges Circulaires**
- Chaque note est dans un cercle coloré
- Taille : 40x40px (w-10 h-10)
- Police : Bold
- Facilite la lecture rapide

**Ligne de Moyenne**
- Fond rose clair : `bg-pink-100`
- Police : Bold
- Calcul automatique des moyennes par critère

**Sections de Passage**
- Bordure grise : `border-2 border-gray-200`
- Fond gris clair : `bg-gray-50`
- Espacement généreux pour la lisibilité

---

## 📊 Informations Affichées

### Pour Chaque Passage

**Notes Individuelles (4 jurés)**
- Sourire (0-4)
- Gestuelle (0-4)
- Performance Technique (0-4)
- Prestance et Élégance (0-4)
- Total du juré (/20)

**Moyennes**
- Moyenne par critère
- Moyenne totale du passage

**Indicateurs**
- Notes manquantes : `-` (gris)
- Notes présentes : Badge coloré avec valeur

---

## 🔍 Détails Techniques

### Calcul des Moyennes par Critère

Pour chaque critère (ex: Sourire) :
```javascript
const scores = [Juré1, Juré2, Juré3, Juré4]
  .filter(score => score !== undefined);
const moyenne = scores.reduce((a, b) => a + b) / scores.length;
```

### Calcul de la Moyenne du Passage

```javascript
const totalScores = [Juré1Total, Juré2Total, Juré3Total, Juré4Total]
  .filter(score => score !== undefined);
const moyennePassage = totalScores.reduce((a, b) => a + b) / totalScores.length;
```

### Calcul de la Note Finale

```javascript
const passages = [Passage1Avg, Passage2Avg, Passage3Avg]
  .filter(avg => avg > 0);
const noteFinal = passages.reduce((a, b) => a + b) / passages.length;
```

---

## 📱 Responsive Design

### Desktop (>1024px)
- Tableau complet visible
- 3 colonnes pour la liste des candidates
- Tous les critères visibles

### Tablette (768-1024px)
- Tableau avec scroll horizontal si nécessaire
- 2 colonnes pour la liste
- Badges légèrement plus petits

### Mobile (<768px)
- Scroll horizontal pour les tableaux
- 1 colonne pour la liste
- Interface optimisée tactile

---

## 🎯 Cas d'Usage

### Analyse Détaillée
**Objectif** : Comprendre les forces/faiblesses d'une candidate

**Utilisation** :
1. Ouvrir la fiche de la candidate
2. Regarder les notes par critère
3. Identifier les critères forts/faibles
4. Comparer entre les passages

**Exemple** :
```
Candidate #5 - Marie
Passage 1 : Sourire 4.3, Gestuelle 4.0, Perf.Tech 4.0, Prestance 4.3
Passage 2 : Sourire 4.0, Gestuelle 3.8, Perf.Tech 4.2, Prestance 4.0
Passage 3 : Sourire 4.5, Gestuelle 4.0, Perf.Tech 4.0, Prestance 4.5

→ Points forts : Sourire et Prestance
→ À améliorer : Gestuelle (légère baisse au P2)
```

### Comparaison entre Jurés
**Objectif** : Voir si les jurés sont alignés

**Utilisation** :
1. Ouvrir une fiche
2. Regarder les notes d'un passage
3. Comparer les totaux des 4 jurés

**Exemple** :
```
Passage 1 :
Juré 1 : 16/20
Juré 2 : 16/20
Juré 3 : 17/20
Juré 4 : 17/20

→ Jurés alignés (écart max : 1 point)
```

### Évolution par Passage
**Objectif** : Voir la progression de la candidate

**Utilisation** :
1. Regarder le résumé final
2. Comparer les moyennes des 3 passages

**Exemple** :
```
Passage 1 : 17.00
Passage 2 : 16.50 (↓ -0.50)
Passage 3 : 16.75 (↑ +0.25)

→ Légère baisse au P2, récupération au P3
```

---

## 💡 Avantages

### Transparence
✅ Toutes les notes visibles
✅ Détail par critère
✅ Moyennes calculées automatiquement

### Analyse
✅ Comparaison facile entre jurés
✅ Identification des forces/faiblesses
✅ Suivi de l'évolution

### Équité
✅ Notes croisées visibles
✅ Calculs vérifiables
✅ Traçabilité complète

### Professionnalisme
✅ Présentation claire
✅ Design soigné
✅ Facile à imprimer/exporter

---

## 🖨️ Impression

Les fiches sont optimisées pour l'impression :
- Fond blanc pour économiser l'encre
- Bordures claires
- Police lisible
- Mise en page structurée

**Conseil** : Imprimer en mode paysage pour les tableaux

---

## 📊 Exemple Complet

### Candidate #3 - Sophie Martin

**Note Finale : 18.25/20**

#### Passage 1 (Moyenne : 18.50/20)
| Juré   | 😊 | 🤸 | ⭐ | 👗 | Total |
|--------|----|----|----|----|-------|
| Juré 1 | 4  | 4  | 4  | 4  | 16    |
| Juré 2 | 4  | 4  | 4  | 4  | 16    |
| Juré 3 | 5  | 5  | 5  | 5  | 20    |
| Juré 4 | 5  | 4  | 5  | 5  | 19    |
| **MOY**| **4.5** | **4.3** | **4.5** | **4.5** | **17.75** |

#### Passage 2 (Moyenne : 18.00/20)
| Juré   | 😊 | 🤸 | ⭐ | 👗 | Total |
|--------|----|----|----|----|-------|
| Juré 1 | 4  | 4  | 4  | 4  | 16    |
| Juré 2 | 4  | 4  | 5  | 4  | 17    |
| Juré 3 | 5  | 5  | 5  | 5  | 20    |
| Juré 4 | 5  | 4  | 5  | 4  | 18    |
| **MOY**| **4.5** | **4.3** | **4.8** | **4.3** | **17.75** |

#### Passage 3 (Moyenne : 18.25/20)
| Juré   | 😊 | 🤸 | ⭐ | 👗 | Total |
|--------|----|----|----|----|-------|
| Juré 1 | 4  | 4  | 5  | 4  | 17    |
| Juré 2 | 4  | 5  | 5  | 4  | 18    |
| Juré 3 | 5  | 5  | 5  | 5  | 20    |
| Juré 4 | 5  | 4  | 5  | 5  | 19    |
| **MOY**| **4.5** | **4.5** | **5.0** | **4.5** | **18.50** |

#### Résumé
- Passage 1 : 17.75/20
- Passage 2 : 17.75/20
- Passage 3 : 18.50/20
- **Note Finale : 18.00/20**

#### Analyse
- **Points forts** : Performance Technique (5.0 au P3), Sourire constant (4.5)
- **Évolution** : Progression constante, excellent P3
- **Cohérence jurés** : Juré 3 très généreux, Juré 1 plus strict

---

## 🎉 Conclusion

Les fiches individuelles offrent une vue complète et détaillée de chaque candidate avec :
- ✅ Toutes les notes des 4 jurés
- ✅ Détail des 4 critères
- ✅ Moyennes par critère et par passage
- ✅ Design coloré et lisible
- ✅ Analyse facile

C'est l'outil parfait pour l'analyse post-concours et la transparence des résultats !
