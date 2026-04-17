# Guide d'Export des Votes - Miss One Light 2026

## 📊 Format d'Export Simplifié

L'export CSV a été configuré pour afficher uniquement le **classement des votes par candidate**, sans les montants financiers.

## 📥 Comment exporter

### Depuis l'interface admin
1. Connectez-vous à `/admin-miss-one-light`
2. Allez dans l'onglet **"Votes en attente"** ou **"Comptabilité"**
3. Cliquez sur le bouton **"Exporter CSV"**
4. Le fichier est téléchargé automatiquement

## 📋 Contenu du fichier CSV

### En-tête
```
MISS ONE LIGHT - CLASSEMENT DES VOTES
Genere le,17/04/2026 a 14:30
```

### Résumé général
```
RESUME GENERAL
Total votes valides,1250
Total votes en attente,85
Total general,1335
Nombre de candidates,12
```

### Classement par candidate
```
CLASSEMENT PAR CANDIDATE
Position,Candidate,Votes Valides,Votes En Attente,Total Votes,Transactions

1,LÉONCIA,245,12,257,48
2,CELIA,198,8,206,39
3,LAÏCA,175,15,190,35
4,SARAH,142,5,147,28
5,ANNA,128,10,138,25
...
```

## 📊 Colonnes du classement

| Colonne | Description |
|---------|-------------|
| **Position** | Rang de la candidate (1er, 2e, 3e, etc.) |
| **Candidate** | Nom de la candidate |
| **Votes Validés** | Nombre de votes déjà validés et crédités |
| **Votes En Attente** | Nombre de votes en attente de validation |
| **Total Votes** | Total des votes (validés + en attente) |
| **Transactions** | Nombre de transactions validées |

## 🎯 Utilisation du fichier

### Ouvrir avec Excel
1. Double-cliquez sur le fichier `.csv`
2. Excel l'ouvre automatiquement avec le bon encodage (UTF-8)
3. Les colonnes sont correctement séparées

### Ouvrir avec Google Sheets
1. Allez sur Google Sheets
2. **Fichier** > **Importer**
3. Sélectionnez le fichier CSV
4. Choisissez **"Virgule"** comme séparateur
5. Cliquez sur **"Importer les données"**

### Ouvrir avec LibreOffice Calc
1. Ouvrez LibreOffice Calc
2. **Fichier** > **Ouvrir**
3. Sélectionnez le fichier CSV
4. Dans la fenêtre d'import :
   - Jeu de caractères : **UTF-8**
   - Séparateur : **Virgule**
5. Cliquez sur **OK**

## 📈 Analyses possibles

### Classement final
- Triez par **"Total Votes"** (colonne E) en ordre décroissant
- Identifiez facilement le Top 3

### Votes en attente
- Filtrez les candidates avec **"Votes En Attente" > 0**
- Priorisez la validation des votes

### Taux de participation
- Comparez **"Transactions"** entre les candidates
- Identifiez les candidates les plus populaires

### Graphiques
Créez des graphiques pour visualiser :
- Répartition des votes par candidate (camembert)
- Évolution du classement (barres)
- Comparaison validés vs en attente (barres empilées)

## 🔄 Fréquence d'export

### Recommandations
- **Quotidien** : Pendant la période de vote active
- **Hebdomadaire** : Pour les rapports de suivi
- **Final** : Après la clôture des votes

### Archivage
- Conservez chaque export avec la date dans le nom
- Format : `miss-one-light-classement-2026-04-17.csv`
- Stockez dans un dossier dédié

## 📝 Exemple de rapport

```csv
MISS ONE LIGHT - CLASSEMENT DES VOTES
Genere le,17/04/2026 a 20:00

RESUME GENERAL
Total votes valides,2450
Total votes en attente,0
Total general,2450
Nombre de candidates,12

CLASSEMENT PAR CANDIDATE
Position,Candidate,Votes Valides,Votes En Attente,Total Votes,Transactions

1,LÉONCIA,425,0,425,82
2,CELIA,368,0,368,71
3,LAÏCA,312,0,312,58
4,SARAH,245,0,245,47
5,ANNA,198,0,198,38
6,RÉUSSITE,175,0,175,32
7,JOHANNE,152,0,152,29
8,LEÏLA,138,0,138,26
9,DJENIFER,125,0,125,24
10,RENÉE,112,0,112,21
11,FANELLA,105,0,105,19
12,ARIANA,95,0,95,18

Fin du rapport
```

## 🎨 Personnalisation Excel

### Mise en forme conditionnelle
1. Sélectionnez la colonne **"Total Votes"**
2. **Accueil** > **Mise en forme conditionnelle** > **Barres de données**
3. Choisissez un dégradé vert

### Formules utiles
```excel
// Pourcentage du total
=E2/SOMME($E$2:$E$13)*100

// Écart avec le 1er
=E2-MAX($E$2:$E$13)

// Moyenne des votes
=MOYENNE(E2:E13)
```

## ⚠️ Notes importantes

### Données en temps réel
- L'export reflète l'état au moment du téléchargement
- Les votes validés après l'export n'apparaissent pas
- Exportez à nouveau pour obtenir les données actualisées

### Votes en attente
- Les **"Votes En Attente"** ne sont pas encore crédités
- Ils apparaissent dans le total mais peuvent être refusés
- Validez-les dans l'onglet **"Votes en attente"** de l'admin

### Confidentialité
- Ce fichier ne contient **aucune information financière**
- Aucune donnée personnelle des votants (emails, téléphones)
- Peut être partagé publiquement pour le classement

## 🆘 Problèmes courants

### Le fichier ne s'ouvre pas correctement
- Vérifiez que vous utilisez un logiciel compatible (Excel, Google Sheets, LibreOffice)
- Assurez-vous que l'encodage UTF-8 est sélectionné
- Essayez d'ouvrir avec un éditeur de texte pour vérifier le contenu

### Les accents sont mal affichés
- Le fichier utilise l'encodage UTF-8 avec BOM
- Dans Excel : **Données** > **Obtenir des données** > **À partir d'un fichier texte/CSV**
- Sélectionnez **"UTF-8"** comme encodage

### Les nombres sont mal formatés
- Excel peut interpréter les nombres comme du texte
- Sélectionnez la colonne > **Données** > **Convertir**
- Choisissez **"Nombre"** comme format

## 📞 Support

Pour toute question sur l'export :
- Consultez l'onglet **"Comptabilité"** pour les statistiques détaillées
- Vérifiez que tous les votes en attente sont validés
- Contactez l'équipe technique en cas de problème

---

**Dernière mise à jour** : Avril 2026  
**Version** : 2.0.0 (Format simplifié)  
**Auteur** : Perfect Models Management
