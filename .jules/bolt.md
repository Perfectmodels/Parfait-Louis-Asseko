## 2025-03-01 - O(N*M) list render optimization in AdminGallery
**Learning:** Calling `.filter()` or `.find()` on related collections inside `.map()` render loops causes significant performance degradation as collections grow, leading to O(N*M) complexity.
**Action:** Always precompute lookup maps (e.g., `itemCounts`, `itemMaps`) using `useMemo` outside the render loop for O(1) lookups.