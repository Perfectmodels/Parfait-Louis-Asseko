## 2025-05-18 - Optimize AdminGallery lookups to O(1)
**Learning:** Found O(N*M) operations inside render loops in `AdminGallery.tsx` where `.filter()` and `.find()` were called inside `.map()` for calculating album statistics. This is a common React anti-pattern when rendering large collections from Firebase.
**Action:** Use `useMemo` to precompute lookups (e.g., `stats`, `albumMap`) before the render loop, reducing inner logic to O(1) hash map lookups.
