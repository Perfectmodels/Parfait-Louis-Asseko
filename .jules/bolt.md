## 2024-06-06 - Memoizing Framer Motion Components in Lists
**Learning:** In this codebase, wrapping child list item components that contain expensive render operations (like `framer-motion` animations) is critical to prevent input lag and thread blocking in parent components managing search/filter state (e.g., `Models.tsx`).
**Action:** Always wrap list item components using `framer-motion` in `React.memo()` when they are rendered inside a list whose parent frequently updates state based on user input.
