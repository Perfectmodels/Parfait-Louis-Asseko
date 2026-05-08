## 2025-02-23 - Precompute lookup maps to fix O(N*M) rendering bottlenecks
**Learning:** In list-heavy management pages like AdminGallery, calling array methods like `.filter()` or `.find()` inside the `.map()` function used for rendering creates an $O(N \cdot M)$ complexity that re-calculates on every render pass.
**Action:** Always precompute subset counts and lookup maps (e.g., using `reduce` or a `for...of` loop) inside a `useMemo` block before the return statement to optimize rendering, resulting in $O(N)$ calculation and $O(1)$ lookup times.
