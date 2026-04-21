## 2024-05-24 - O(1) Album Lookup in List-Heavy Management Pages
**Learning:** In list-heavy management pages like `AdminGallery.tsx`, using `.find()` inside a `.map()` render loop causes O(N*M) performance bottlenecks as datasets grow.
**Action:** Always precompute a lookup map (`Map<string, T>`) using `useMemo` to convert O(N*M) lookups into O(N) map generation + O(1) retrieval.
