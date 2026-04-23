## 2024-05-23 - Precompute Lookups to Avoid O(N*M) Renders
**Learning:** Using `filter().length` inside a `.map()` block in React causes O(N*M) time complexity during rendering, which is a significant performance bottleneck for list-heavy views (e.g., `AdminGallery.tsx`). This happens because for every M albums, N gallery items are iterated.
**Action:** Always extract such counts or related objects into a single `useMemo` hook that iterates over the N items exactly once to build a lookup object (O(N) time), allowing O(1) lookups during the `.map()` loop (O(N + M) total time).
