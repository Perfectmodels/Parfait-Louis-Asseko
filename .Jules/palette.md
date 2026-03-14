## 2026-03-14 - Added ARIA attributes and focus-visible styling to mobile toggle
**Learning:** Icon-only interactive elements require explicit ARIA attributes (, , ) and  styling (, ) to adhere to accessibility and keyboard navigation standards, as standard focus styling is often disabled ().
**Action:** When adding or reviewing icon-only buttons, especially toggles, ensure ,  (if stateful), and  are present and dynamically updated, and verify focus states are visible using  utilities.
## 2024-03-14 - Added ARIA attributes and focus-visible styling to mobile toggle
**Learning:** Icon-only interactive elements (like mobile toggles) require explicit ARIA attributes (`aria-label`, `aria-expanded`, `aria-controls`) and `focus-visible` styling (`focus-visible:ring-2`, `focus-visible:ring-pm-gold`) to adhere to accessibility and keyboard navigation standards.
**Action:** When adding or reviewing icon-only buttons, especially toggles, ensure `aria-label`, `aria-expanded` (if stateful), and `aria-controls` are present and dynamically updated, and verify focus states are visible using `focus-visible:ring-*` utilities.
