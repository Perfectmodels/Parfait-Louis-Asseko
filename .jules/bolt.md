## 2024-05-22 - Framer Motion List Items Memoization
**Learning:** Child list components using heavy framer-motion animations can cause significant main thread blocking and input lag during parent search/filter state updates if not memoized.
**Action:** Always wrap child list components containing framer-motion in React.memo() when the parent manages frequent state updates like typing in a search bar.
