## 2025-02-27 - Framer Motion List Item Re-renders
**Learning:** Wrapping child list item components containing expensive render operations (like `framer-motion` animations) in `React.memo()` is critical in this codebase to prevent input lag and thread blocking when parent components (e.g., `Models.tsx`) manage rapid state changes like search or filtering.
**Action:** Always wrap list item components with animations in `React.memo()` if they are rendered within a list controlled by frequent state updates.
