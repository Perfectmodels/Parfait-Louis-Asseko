## 2026-03-25 - Improve Accessibility of Mobile Menus
**Learning:** Found that icon-only buttons like the mobile hamburger and close buttons lacked ARIA labels and focus indicators, making them difficult for screen readers to interpret and keyboard users to navigate.
**Action:** Always add `aria-label` along with `focus-visible:ring-2 focus-visible:ring-[theme-color]` to icon-only buttons to ensure full accessibility support. Additionally use `aria-expanded` to communicate toggle state.
