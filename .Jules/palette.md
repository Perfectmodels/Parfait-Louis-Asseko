## 2026-03-29 - Add ARIA labels and focus states to mobile Admin layout sidebar buttons
**Learning:** Interactive icon-only elements such as mobile navigation toggles require explicit ARIA attributes (e.g. `aria-label`, `aria-expanded`, `aria-controls`) and `focus-visible` states for correct keyboard accessibility and screen reader interpretation.
**Action:** Add `aria-label` attributes and `focus-visible:ring-2` tailwind classes consistently to icon-only buttons like navigation/menu toggles to ensure they are fully accessible.
