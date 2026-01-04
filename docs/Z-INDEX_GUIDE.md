# 🎯 Guide des Z-Index - Perfect Models Management

## 📊 Hiérarchie des Couches (Z-Index)

Pour éviter les superpositions d'éléments, voici la hiérarchie des z-index utilisée dans l'application.

---

## 🏗️ Structure des Z-Index

### **Niveau 1 - Contenu de Base** (z-0 à z-10)

```
z-0  : Contenu normal de la page
z-10 : Éléments légèrement élevés (cartes, overlays légers)
```

### **Niveau 2 - Navigation** (z-20 à z-39)

```
z-20 : Breadcrumbs, sous-menus
z-30 : Boutons flottants (ScrollToTop, WhatsApp)
```

### **Niveau 3 - Header & Menu** (z-40 à z-49)

```
z-40 : Header fixe
z-40 : Overlay du menu mobile (fond semi-transparent)
z-50 : Menu mobile (drawer)
z-50 : Bouton hamburger
```

### **Niveau 4 - Modals & Overlays** (z-50 à z-59)

```
z-50 : Cookie consent
z-50 : Modals génériques
z-50 : Notifications importantes
```

### **Niveau 5 - Tooltips & Popups** (z-60+)

```
z-60 : Tooltips
z-70 : Popups temporaires
z-999: Éléments de debug (si nécessaire)
```

---

## 📋 Composants et leurs Z-Index

### **Composants Publics**

| Composant | Z-Index | Fichier | Raison |
|-----------|---------|---------|--------|
| **ScrollToTop** | `z-30` | `src/components/ScrollToTop.tsx` | Bouton flottant, sous le menu |
| **WhatsAppButton** | `z-30` | `src/components/WhatsAppButton.tsx` | Bouton flottant, sous le menu |
| **CookieConsent** | `z-50` | `src/components/CookieConsent.tsx` | Important, au-dessus du menu |
| **Header** | `z-40` | `src/components/icons/Header.tsx` | Navigation fixe |
| **Menu Mobile Overlay** | `z-40` | `src/components/icons/Header.tsx` | Fond semi-transparent |
| **Menu Mobile Drawer** | `z-50` | `src/components/icons/Header.tsx` | Menu principal mobile |

### **Composants Admin**

| Composant | Z-Index | Fichier | Raison |
|-----------|---------|---------|--------|
| **AdminLayout Sidebar** | `z-30` | `src/components/admin/AdminLayout.tsx` | Sidebar fixe |
| **GlobalSearch** | `z-50` | `src/components/admin/GlobalSearch.tsx` | Modal de recherche |
| **NotificationCenter** | `z-50` | `src/components/admin/NotificationCenter.tsx` | Panneau de notifications |
| **QuickActionsMenu** | `z-50` | `src/components/admin/QuickActionsMenu.tsx` | Menu d'actions |

---

## ⚠️ Règles à Respecter

### **1. Boutons Flottants**

```tsx
// ✅ Bon - z-30
<button className="fixed bottom-8 right-8 z-30">

// ❌ Mauvais - z-40 ou plus (conflit avec menu)
<button className="fixed bottom-8 right-8 z-40">
```

### **2. Menus et Modals**

```tsx
// ✅ Bon - z-50 pour les modals
<div className="fixed inset-0 z-50">

// ❌ Mauvais - z-30 (sous le header)
<div className="fixed inset-0 z-30">
```

### **3. Header Fixe**

```tsx
// ✅ Bon - z-40
<header className="fixed top-0 z-40">

// ❌ Mauvais - z-50 (au-dessus des modals)
<header className="fixed top-0 z-50">
```

---

## 🔧 Corrections Effectuées

### **Problème Initial**

```
ScrollToTop (z-40) + WhatsApp (z-40) + Menu Mobile (z-40/z-50)
= Superpositions et conflits
```

### **Solution Appliquée**

```
ScrollToTop (z-30) + WhatsApp (z-30) + Menu Mobile (z-40/z-50)
= Hiérarchie claire, pas de conflits
```

---

## 📱 Cas Spécifiques Mobile

### **Menu Mobile**

```tsx
// Overlay (fond)
<div className="z-40 bg-black/60">

// Drawer (menu)
<div className="z-50 bg-black/95">
```

**Pourquoi ?**

- L'overlay doit être sous le drawer
- Le drawer doit être au-dessus de tout sauf les modals critiques

### **Boutons Flottants sur Mobile**

```tsx
// ScrollToTop et WhatsApp
<button className="z-30">
```

**Pourquoi ?**

- Doivent être visibles mais ne pas bloquer le menu
- Quand le menu s'ouvre, ils passent en dessous

---

## 🎯 Bonnes Pratiques

### **1. Utiliser des Valeurs Espacées**

```tsx
// ✅ Bon - Incréments de 10
z-10, z-20, z-30, z-40, z-50

// ❌ Mauvais - Valeurs trop proches
z-41, z-42, z-43, z-44, z-45
```

### **2. Documenter les Z-Index**

```tsx
// ✅ Bon - Commentaire explicatif
<div className="z-50"> {/* Au-dessus du menu mobile */}

// ❌ Mauvais - Pas de contexte
<div className="z-50">
```

### **3. Tester sur Mobile**

```bash
# Toujours tester les z-index sur mobile
# Ouvrir le menu mobile et vérifier :
- Les boutons flottants passent-ils en dessous ?
- Le menu est-il au-dessus de tout ?
- Les modals fonctionnent-ils correctement ?
```

---

## 🐛 Debugging des Z-Index

### **Problème : Élément Invisible**

```tsx
// Vérifier que le z-index n'est pas trop bas
// Augmenter progressivement : z-10 → z-20 → z-30
```

### **Problème : Élément Bloque Tout**

```tsx
// Vérifier que le z-index n'est pas trop haut
// Réduire progressivement : z-50 → z-40 → z-30
```

### **Problème : Superposition**

```tsx
// Vérifier les z-index des éléments qui se superposent
// S'assurer qu'ils ont au moins 10 points d'écart
```

---

## 📝 Checklist Avant Ajout d'un Nouveau Composant

- [ ] Déterminer le niveau de priorité (bouton, menu, modal, etc.)
- [ ] Choisir le z-index approprié selon la hiérarchie
- [ ] Tester sur desktop ET mobile
- [ ] Vérifier qu'il n'y a pas de conflit avec les composants existants
- [ ] Documenter le z-index dans ce fichier

---

## 🔄 Mise à Jour de ce Document

Quand vous ajoutez un nouveau composant avec un z-index :

1. Ajouter le composant dans le tableau approprié
2. Expliquer la raison du z-index choisi
3. Tester les interactions avec les autres composants
4. Mettre à jour la date ci-dessous

---

**Dernière mise à jour** : 17 décembre 2025  
**Version** : 1.0  
**Auteur** : Perfect Models Management

---

## 🎉 Résultat

Avec cette hiérarchie claire :

- ✅ Pas de superpositions
- ✅ Menu mobile fonctionne parfaitement
- ✅ Boutons flottants visibles mais non-intrusifs
- ✅ Modals au-dessus de tout quand nécessaire
- ✅ Expérience utilisateur fluide
