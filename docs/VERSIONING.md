# Guide de Versioning de l'Application

Ce document explique comment gérer la version de l'application, qui est automatiquement affichée dans le pied de page du site.

## Principes de Versioning

Nous utilisons le **versioning sémantique (SemVer)**. Les versions sont numérotées au format `MAJEUR.MINEUR.PATCH` :

- **MAJEUR :** Changements majeurs et non rétrocompatibles (ex: refonte complète).
- **MINEUR :** Ajout de nouvelles fonctionnalités importantes (ex: nouvelle section admin, système de messagerie).
- **PATCH :** Corrections de bugs, optimisations et petites améliorations.

## Comment Mettre à Jour la Version

Pour mettre à jour la version de l'application, utilisez les commandes `npm version` dans votre terminal. Ces commandes mettront automatiquement à jour le fichier `package.json` et créeront un commit et un tag Git associés.

### 1. Mise à Jour pour une Correction (Patch)

Pour les corrections de bugs ou les petites modifications.

```bash
npm version patch
```

*Exemple : `1.0.0` → `1.0.1`*

### 2. Mise à Jour pour une Nouvelle Fonctionnalité (Mineur)

Lorsque vous ajoutez une nouvelle fonctionnalité notable.

```bash
npm version minor
```

*Exemple : `1.0.1` → `1.1.0`*

### 3. Mise à Jour Majeure

Pour les changements qui cassent la compatibilité (à utiliser avec précaution).

```bash
npm version major
```

*Exemple : `1.1.0` → `2.0.0`*

## Déploiement

Après avoir mis à jour la version, n'oubliez pas de pousser vos changements et vos tags vers le dépôt distant :

```bash
git push && git push --tags
```

Ce processus garantit que chaque nouvelle fonctionnalité ou correction est accompagnée d'une mise à jour de version claire et traçable.
