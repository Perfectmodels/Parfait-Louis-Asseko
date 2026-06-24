## 2023-10-27 - Keyboard Navigation for Hover-Revealed Elements
**Learning:** Elements relying on `group-hover:opacity-100` are invisible during keyboard navigation unless `focus-visible:opacity-100` or `focus-within:opacity-100` are also applied, making them inaccessible.
**Action:** Always add `focus-visible:opacity-100` (or `focus-within`) alongside focus ring styles (e.g., `focus-visible:ring-2`) directly to hover-reveal elements to ensure they are visible and identifiable via keyboard navigation.
