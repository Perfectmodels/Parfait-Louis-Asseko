# Panel Admin - Perfect Models Management

## Structure Réorganisée

Cette nouvelle structure admin offre une meilleure organisation, des composants réutilisables et une expérience utilisateur améliorée.

### Architecture

```
src/admin/
├── components/          # Composants réutilisables
│   ├── AdminButton.tsx
│   ├── AdminCard.tsx
│   ├── AdminHeader.tsx
│   ├── AdminInput.tsx
│   ├── AdminModal.tsx
│   ├── AdminPageHeader.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminTable.tsx
│   └── index.ts
├── hooks/              # Hooks personnalisés
│   └── useAdminNotifications.ts
├── layouts/            # Layouts
│   └── AdminLayout.tsx
├── pages/              # Pages admin modernisées
│   ├── AdminDashboard.tsx
│   ├── AdminMessagesModern.tsx
│   └── index.ts
├── utils/              # Utilitaires
│   └── formatters.ts
└── README.md
```

## Composants Disponibles

### AdminLayout
Layout principal avec sidebar et header intégrés.

### AdminCard
Carte cliquable pour les actions rapides du dashboard.

```tsx
<AdminCard
    title="Titre"
    description="Description"
    icon={IconComponent}
    link="/admin/page"
    notificationCount={5}
/>
```

### AdminTable
Table avec tri, filtrage et actions.

```tsx
<AdminTable
    data={data}
    columns={columns}
    onRowClick={handleRowClick}
    emptyMessage="Aucune donnée"
/>
```

### AdminButton
Bouton avec variantes et états.

```tsx
<AdminButton
    variant="primary" // primary, secondary, danger, success, outline
    size="md" // sm, md, lg
    icon={IconComponent}
    loading={isLoading}
>
    Texte
</AdminButton>
```

### AdminModal
Modal réutilisable avec actions.

```tsx
<AdminModal
    isOpen={isOpen}
    onClose={onClose}
    title="Titre"
    size="lg"
    actions={<AdminButton>Action</AdminButton>}
>
    Contenu
</AdminModal>
```

### AdminInput, AdminTextarea, AdminSelect
Champs de formulaire stylisés.

```tsx
<AdminInput
    label="Label"
    error="Message d'erreur"
    helpText="Texte d'aide"
    icon={IconComponent}
/>
```

## Hooks

### useAdminNotifications
Hook pour récupérer les notifications admin.

```tsx
const notifications = useAdminNotifications();
// { casting: 5, messages: 2, total: 7, ... }
```

## Utilitaires

### Formatters
Fonctions de formatage pour dates, statuts, devises, etc.

```tsx
import { formatDate, formatStatus, formatCurrency } from '../utils/formatters';

const formattedDate = formatDate(new Date());
const { text, color } = formatStatus('Nouveau');
const price = formatCurrency(1500, 'XAF');
```

## Migration des Pages

Pour migrer une page admin existante :

1. Utiliser `AdminPageHeader` pour l'en-tête
2. Remplacer les tables par `AdminTable`
3. Utiliser `AdminButton` pour les actions
4. Implémenter `AdminModal` pour les détails
5. Appliquer les utilitaires de formatage

### Exemple de Migration

**Avant :**
```tsx
// Page avec header manuel et table HTML
<div className="bg-pm-dark">
    <h1>Titre</h1>
    <table>...</table>
</div>
```

**Après :**
```tsx
// Page avec composants réutilisables
<div className="space-y-6">
    <AdminPageHeader title="Titre" subtitle="Description" />
    <AdminTable data={data} columns={columns} />
</div>
```

## Styles

Les styles admin sont centralisés dans `index.html` avec les classes :
- `.admin-input`, `.admin-textarea` : Champs de formulaire
- `.admin-section-wrapper` : Conteneurs de section
- `.admin-table` : Tables

## Navigation

La navigation est gérée par `AdminSidebar` avec :
- Groupement logique des pages
- Badges de notification
- Navigation responsive
- États actifs automatiques

## Notifications

Le système de notifications affiche :
- Badges sur les éléments de menu
- Compteur global dans le header
- Mise à jour en temps réel

## Responsive Design

Tous les composants sont responsive avec :
- Sidebar collapsible sur mobile
- Tables avec scroll horizontal
- Grilles adaptatives
- Modals responsive