## 2024-10-25 - React.memo for Framer Motion List Items
**Learning:** In parent components managing rapid state changes like search or filter inputs (e.g., Models.tsx), child list items with expensive render operations like framer-motion animations cause significant input lag and thread blocking if not memoized.
**Action:** Always wrap child list item components containing expensive render operations in React.memo() at the export statement (to avoid TypeScript React.FC assignability issues) to prevent unnecessary re-renders during parent state updates.
