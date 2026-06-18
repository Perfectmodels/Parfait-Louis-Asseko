## 2024-05-18 - Framer Motion and Parent State Changes
**Learning:** In React, when a parent component (like `Models.tsx`) frequently updates its state (e.g., via a search input), child components containing expensive `framer-motion` animations (like `ModelCard.tsx`) can cause input lag and thread blocking if they re-render unnecessarily on every keystroke.
**Action:** Always wrap child list item components containing expensive render operations (like `framer-motion` animations) in `React.memo()` when their parent manages search/filter state.
