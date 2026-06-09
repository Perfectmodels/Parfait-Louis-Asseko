## 2024-10-25 - React Memoization for Animated List Items
**Learning:** Components managing search/filter state with expensive child components (like framer-motion animations) cause input lag if children aren't memoized.
**Action:** Always wrap child list item components containing expensive render operations in React.memo() when their parent manages high-frequency state.