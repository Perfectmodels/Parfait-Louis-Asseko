## 2025-01-20 - React.memo on Framer Motion child components
**Learning:** In pages like Models.tsx with dynamic search/filter state, typing in search fields causes rapid re-renders of the parent component. Because each child ModelCard contains expensive framer-motion animations, this causes main thread blocking and noticeable input lag.
**Action:** Always wrap child list item components containing expensive render operations (like framer-motion animations) in React.memo() when their parent manages high-frequency state changes like search/filtering.
