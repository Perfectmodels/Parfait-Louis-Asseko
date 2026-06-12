## 2024-06-12 - Hover-Reveal Accessibility Pattern
**Learning:** The codebase heavily relies on `opacity-0 group-hover:opacity-100` to show contextual actions (like remove buttons on images). This breaks keyboard accessibility because the elements remain invisible when focused via tab.
**Action:** Always add `focus-visible:opacity-100` alongside visual focus rings (`focus-visible:ring-2`) directly to these elements or `focus-within:opacity-100` to their wrapper to ensure they become completely visible and identifiable during keyboard navigation.
