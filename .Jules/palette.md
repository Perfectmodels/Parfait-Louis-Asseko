## 2026-03-10 - Missing ARIA Labels on Mobile Nav Toggles
**Learning:** Icon-only interactive elements (like mobile navigation toggles) in this codebase often lack explicit ARIA attributes (`aria-label`, `aria-expanded`, `aria-controls`) and `focus-visible` styling, creating an accessibility issue for keyboard and screen reader users.
**Action:** Ensure that any future icon-only buttons added to the app include full ARIA metadata and clear `focus-visible:ring-2` styles.
