## 2025-02-15 - Optimize Rendering in AdminGallery
**Learning:** Found an anti-pattern specific to this codebase where O(N*M) nested loops are used inside render blocks in management pages (like calling `gallery.filter()` over 10 categories + X albums for N items during each render).
**Action:** Use precomputed lookup maps (`useMemo` mapping counts by ID) to eliminate these nested array scans, changing complexity to O(N + M) and substantially improving frame rates on list-heavy management views.
