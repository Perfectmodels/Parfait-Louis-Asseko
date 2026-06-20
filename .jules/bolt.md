## 2024-06-20 - React.memo for Expensive List Items
**Learning:** To prevent input lag and thread blocking in parent components managing search/filter state (e.g., `Models.tsx`), child list item components containing expensive render operations (like `framer-motion` animations) must be wrapped in `React.memo()`.
**Action:** Always wrap child list item components containing expensive render operations in `React.memo()` when the parent component manages search or filter state that updates frequently.
