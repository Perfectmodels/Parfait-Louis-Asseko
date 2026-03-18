## 2025-03-18 - Admin Layout Mobile Accessibility
**Learning:** Icon-only buttons used for navigation toggles and global actions (like the notification bell) in the admin panel lacked necessary `aria-label`, `aria-expanded`, and `aria-controls` properties, and did not support visible focus outlines for keyboard users.
**Action:** Consistently apply `focus-visible:ring-2 focus-visible:ring-pm-gold` alongside descriptive ARIA properties to all icon-only buttons across administrative components to ensure they meet screen reader and keyboard navigation requirements.
