## 2025-03-05 - Added ARIA label to Toast dismiss button
**Learning:** Found an icon-only dismiss button in `src/components/ui/Toast.tsx` that lacked an `aria-label`, making it inaccessible to screen readers.
**Action:** Always verify icon-only buttons have an `aria-label` attribute describing their action (e.g., "Fermer" or "Close"). Since the application is mostly localized in French (e.g. `aria-label="Retour en haut"` and `aria-label="Fermer"` in other components), "Fermer" is appropriate here.
