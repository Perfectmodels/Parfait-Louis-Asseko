# Guide du Classement Officiel - Miss One Light 2026

## 🏆 Classement Officiel

L'export PDF affiche maintenant le **classement officiel** basé sur les votes réels crédités aux candidates, et non plus sur les transactions.

## 📊 Source des données

### Avant (transactions)
❌ Calculé depuis `pendingVotes` (transactions validées)  
❌ Pouvait différer du classement réel  
❌ Nécessitait de recalculer les totaux  

### Maintenant (classement officiel)
✅ Basé sur `candidates.votes` (votes réels)  
✅ Correspond exactement au classement public  
✅ Source unique de vérité  
✅ Synchronisé avec la page publique  

## 🎯 Contenu du PDF

### En-tête
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                  MISS ONE LIGHT 2026                        ║
║                                                              ║
║               CLASSEMENT OFFICIEL                           ║
║                                                              ║
║            Généré le 17/04/2026 à 20:00                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Résumé général
```
RÉSUMÉ GÉNÉRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total des votes                                          2,450
Nombre de candidates                                        12
Transactions validées                                      485
Transactions en attente                                      8
```

### Tableau de classement
```
CLASSEMENT OFFICIEL DES CANDIDATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┬─────────────┬─────────┬──────────────┐
│ Position │  Candidate  │  Votes  │ Pourcentage  │
├──────────┼─────────────┼─────────┼──────────────┤
│  🥇 1    │ LÉONCIA     │   425   │    17.3%     │
├──────────┼─────────────┼─────────┼──────────────┤
│  🥈 2    │ CELIA       │   368   │    15.0%     │
├──────────┼─────────────┼─────────┼──────────────┤
│  🥉 3    │ LAÏCA       │   312   │    12.7%     │
├──────────┼─────────────┼─────────┼──────────────┤
│    4     │ SARAH       │   245   │    10.0%     │
├──────────┼─────────────┼─────────┼──────────────┤
│    5     │ ANNA        │   198   │     8.1%     │
├──────────┼─────────────┼─────────┼──────────────┤
│   ...    │    ...      │   ...   │     ...      │
└──────────┴─────────────┴─────────┴──────────────┘
```

### Annonce de la gagnante (si votes fermés)
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      🏆 GAGNANTE                            ║
║                                                              ║
║                       LÉONCIA                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 🎨 Mise en forme spéciale

### Médailles pour le Top 3
- **🥇 1ère place** : Fond doré clair (#FFFACD)
- **🥈 2ème place** : Fond argenté clair (#F5F5F5)
- **🥉 3ème place** : Fond bronze clair (#FFF3E0)

### Colonnes
1. **Position** : Centré, avec médailles pour le top 3
2. **Candidate** : Nom en gras
3. **Votes** : Aligné à droite, vert, gras
4. **Pourcentage** : Centré, doré, gras

## 📈 Calcul du pourcentage

```
Pourcentage = (Votes de la candidate / Total des votes) × 100
```

**Exemple** :
- LÉONCIA : 425 votes
- Total : 2,450 votes
- Pourcentage : (425 / 2,450) × 100 = 17.3%

## 🏆 Annonce de la gagnante

### Conditions d'affichage
L'encadré "🏆 GAGNANTE" s'affiche uniquement si :
1. Les votes sont fermés (`votingEnabled = false`)
2. OU la date limite est dépassée
3. ET il y a au moins une candidate

### Design
- Fond doré (#FCD116)
- Texte noir en gras
- Nom de la gagnante en majuscules
- Taille de police augmentée

## 📁 Nom du fichier

### Pendant la période de vote
```
miss-one-light-classement-2026-04-15.pdf
```

### Après clôture des votes
```
miss-one-light-classement-OFFICIEL-2026-04-17.pdf
```

Le mot "OFFICIEL" est ajouté automatiquement quand les votes sont fermés.

## 🔄 Synchronisation avec la page publique

### Garantie de cohérence
✅ Même source de données (`candidates`)  
✅ Même ordre de tri (votes décroissants)  
✅ Même filtrage (candidates actives uniquement)  
✅ Mise à jour en temps réel  

### Vérification
Pour vérifier la cohérence :
1. Consultez la page publique `/miss-one-light`
2. Exportez le PDF
3. Comparez les classements → Ils doivent être identiques

## 📊 Différences avec l'ancien format

| Aspect | Ancien (Transactions) | Nouveau (Officiel) |
|--------|----------------------|-------------------|
| **Source** | pendingVotes | candidates |
| **Colonnes** | 6 colonnes | 4 colonnes |
| **Données** | Validés, En attente, Trans. | Votes, Pourcentage |
| **Médailles** | Non | Oui (Top 3) |
| **Gagnante** | Non | Oui (si fermé) |
| **Pourcentage** | Non | Oui |
| **Cohérence** | Peut différer | Toujours exact |

## 🎯 Avantages du nouveau format

### Simplicité
✅ Moins de colonnes, plus lisible  
✅ Focus sur l'essentiel (votes et %)  
✅ Pas de confusion entre validés/en attente  

### Officialité
✅ Titre "CLASSEMENT OFFICIEL"  
✅ Mention "DOCUMENT OFFICIEL" en pied de page  
✅ Annonce de la gagnante si votes fermés  
✅ Nom de fichier avec "OFFICIEL"  

### Précision
✅ Source unique de vérité  
✅ Synchronisé avec la page publique  
✅ Pourcentages calculés automatiquement  

### Visuel
✅ Médailles pour le Top 3  
✅ Mise en forme différenciée  
✅ Encadré doré pour la gagnante  

## 📝 Cas d'usage

### 1. Suivi quotidien
- Exportez chaque jour pour suivre l'évolution
- Comparez les pourcentages
- Identifiez les tendances

### 2. Communication officielle
- Document officiel pour les médias
- Partage sur les réseaux sociaux
- Affichage lors des événements

### 3. Annonce des résultats
- Export final après clôture des votes
- Annonce automatique de la gagnante
- Document officiel du concours

### 4. Vérification
- Comparez avec la page publique
- Vérifiez la cohérence des données
- Auditez le classement

## 🔍 Vérification de l'intégrité

### Checklist
- [ ] Le total des votes correspond à la somme des votes individuels
- [ ] Les pourcentages totalisent ~100% (avec arrondis)
- [ ] Le classement est identique à la page publique
- [ ] Seules les candidates actives sont affichées
- [ ] La gagnante est bien la 1ère du classement

### Formule de vérification
```
Somme des votes = Vote₁ + Vote₂ + ... + Voteₙ
Somme des % ≈ 100% (±0.1% d'arrondi)
```

## 🎨 Personnalisation

### Couleurs officielles
Les couleurs sont fixes et correspondent à l'identité visuelle :
- **Doré** : #FCD116 (couleur principale)
- **Vert** : #009E60 (couleur secondaire)
- **Noir** : #1a1a1a (texte)

### Médailles
Les émojis de médailles sont automatiques :
- 🥇 pour la 1ère place
- 🥈 pour la 2ème place
- 🥉 pour la 3ème place

## 📞 Support

### Questions fréquentes

**Q : Pourquoi le classement diffère-t-il de l'onglet "Comptabilité" ?**  
R : L'onglet "Comptabilité" affiche les transactions, le PDF affiche le classement officiel basé sur les votes réels crédités.

**Q : Quand l'annonce de la gagnante apparaît-elle ?**  
R : Uniquement après la clôture des votes (date limite dépassée ou votes désactivés manuellement).

**Q : Les pourcentages sont-ils exacts ?**  
R : Oui, calculés avec 1 décimale. La somme peut légèrement différer de 100% à cause des arrondis.

**Q : Puis-je exporter pendant que les votes sont ouverts ?**  
R : Oui, mais le classement peut encore évoluer. L'export final doit être fait après clôture.

---

**Dernière mise à jour** : Avril 2026  
**Version** : 4.0.0 (Classement Officiel)  
**Auteur** : Perfect Models Management  
**Contact** : contact@perfectmodels.ga
