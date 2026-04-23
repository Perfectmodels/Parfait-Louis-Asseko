## 2025-02-12 - Optimize Lookups in AdminGallery
**Learning:** In list-heavy management pages like Admin Gallery, O(N*M) complexity occurs when `.filter()` or `.find()` are called inside `.map()` render loops.
**Action:** Precompute lookup maps (e.g., item counts per album/category) using `useMemo` to avoid redundant filtering and optimize render performance.
