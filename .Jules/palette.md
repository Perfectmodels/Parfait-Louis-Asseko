## 2026-03-13 - Accessible Icon-Only Toggles
**Learning:** Icon-only interactive elements like mobile navigation toggles in this app require explicit ARIA attributes (`aria-label`, `aria-expanded`, `aria-controls`) and `focus-visible` styling (`focus-visible:ring-2`, `focus-visible:ring-pm-gold`) to adhere to accessibility and keyboard navigation standards, preventing 'invisible' keyboard focus.
**Action:** Always verify that buttons containing only icons (like hamburger menus or close buttons) have semantic ARIA labels and visible focus rings rather than just `focus:outline-none`.
