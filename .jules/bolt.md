## 2024-05-24 - Precompute lookup maps for list-heavy pages
**Learning:** In list-heavy admin pages (e.g. `AdminGallery.tsx`), calling `.find()` or `.filter()` inside `.map()` render loops creates an O(N * M) performance bottleneck.
**Action:** Always precompute lookup maps (using `useMemo` for React components) such as `albumCounts`, `categoryCounts`, or `albumMap` to achieve O(1) lookups during rendering, effectively reducing complexity to O(N + M).
