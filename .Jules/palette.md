## 2026-03-17 - Missing ARIA attributes and Focus States on Mobile Navigation Toggles
**Learning:** Mobile navigation toggles and similar icon-only buttons often lack proper ARIA attributes and focus-visible styling, breaking keyboard navigation and screen reader support.
**Action:** Always ensure interactive elements, especially icon-only toggles, have an appropriate `aria-label`, `aria-expanded`, `aria-controls`, and `focus-visible` styling using existing theme tokens (e.g. `focus-visible:ring-2 focus-visible:ring-pm-gold`).
