## 2025-01-23 - Memoizing framer-motion list items
**Learning:** Wrapping child list item components containing expensive render operations like framer-motion animations in React.memo() prevents input lag and thread blocking in parent components managing search/filter state.
**Action:** Always wrap these child components in React.memo().
