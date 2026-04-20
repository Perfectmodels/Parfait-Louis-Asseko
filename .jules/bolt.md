## 2026-04-20 - O(N*M) complexity in .map() render loops
**Learning:** In list-heavy management pages like `src/pages/AdminGallery.tsx`, using `.find()` or `.filter()` inside `.map()` render loops creates an O(N*M) performance bottleneck, as seen with album and category counts.
**Action:** Use `useMemo` to precompute O(1) lookups via Maps or object dictionaries before the rendering phase to transform the complexity from O(N*M) to O(N+M).
