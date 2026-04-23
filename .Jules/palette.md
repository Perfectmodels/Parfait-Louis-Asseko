## 2024-05-24 - Accessible icon-only buttons in admin tables
**Learning:** Many admin tables in this codebase use icon-only action buttons (e.g. eye, trash, check) without `aria-label`s or focus indicators, making them invisible to screen readers and difficult to navigate via keyboard.
**Action:** Always add explicit `aria-label` attributes and `focus-visible:ring-2 focus-visible:ring-pm-gold focus-visible:outline-none rounded` classes to all icon-only interactive elements to ensure accessibility for all users.
