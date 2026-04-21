## 2026-04-21 - Keyboard Navigation for Hover-Reveal Buttons
**Learning:** Icon-only buttons that use `opacity-0 group-hover:opacity-100` to hide until hovered remain invisible when focused via keyboard (Tab), making them inaccessible to keyboard users.
**Action:** Always add `focus-visible:opacity-100` alongside focus rings (`focus-visible:ring-2`) for hover-reveal interactive elements to ensure they appear during keyboard navigation.
