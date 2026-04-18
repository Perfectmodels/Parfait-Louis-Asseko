## 2024-05-20 - Initial entry\n**Learning:** Started keeping track of UX learnings.\n**Action:** Will document useful insights here.

## 2026-04-18 - Interactive Icon Accessibility
**Learning:** Icon-only buttons (like modals, sidebars, and toasts) in the app frequently lack both 'aria-label' attributes and explicit focus outlines. This breaks screen reader accessibility and keyboard navigation. Using rounded bounds directly on the button ensures the focus ring follows the shape.
**Action:** Always add a descriptive 'aria-label' and 'focus-visible' utility classes (e.g., 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold') to improve accessibility.
